/* global progressPlannerEditor, prplL10n */
/**
 * Editor script.
 *
 * Dependencies: wp-plugins, wp-edit-post, wp-element, progress-planner/l10n
 */
const { createElement: el, Fragment, useState } = wp.element;
const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginPostStatusInfo, PluginSidebarMoreMenuItem } =
	wp.editor;
const { Button, SelectControl, PanelBody, CheckboxControl, Modal } =
	wp.components;
const { useSelect } = wp.data;

const TAXONOMY = 'progress_planner_page_types';

/**
 * Get the page type slug from the page type ID.
 *
 * @param {number} id The page type ID.
 *
 * @return {string} The page type slug.
 */
const prplGetPageTypeSlugFromId = ( id ) => {
	// Check if `id` is an array.
	if ( Array.isArray( id ) ) {
		id = id.length > 0 ? id[ 0 ] : 0;
	} else if ( ! id ) {
		id = 0;
	} else if ( typeof id === 'string' ) {
		id = parseInt( id );
	} else if ( typeof id !== 'number' ) {
		id = 0;
	}

	if ( ! id ) {
		id = parseInt( progressPlannerEditor.defaultPageType );
	}

	return progressPlannerEditor.pageTypes.find(
		( pageTypeItem ) => parseInt( pageTypeItem.id ) === parseInt( id )
	)?.slug;
};

/**
 * Render a dropdown to select the page-type.
 *
 * @return {Element} Element to render.
 */
const PrplRenderPageTypeSelector = () => {
	// Bail early if the page types are not set.
	if (
		! progressPlannerEditor.pageTypes ||
		0 === progressPlannerEditor.pageTypes.length
	) {
		return el( 'div', {}, '' );
	}

	// Build the page types array, to be used in the dropdown.
	const pageTypes = [];
	progressPlannerEditor.pageTypes.forEach( ( term ) => {
		pageTypes.push( {
			label: term.title,
			value: term.id,
		} );
	} );

	return el( SelectControl, {
		label: prplL10n( 'pageType' ),
		// Get the current term from the TAXONOMY.
		value: wp.data.useSelect( ( select ) => {
			const pageTypeArr =
				select( 'core/editor' ).getEditedPostAttribute( TAXONOMY );
			return pageTypeArr && 0 < pageTypeArr.length
				? parseInt( pageTypeArr[ 0 ] )
				: parseInt( progressPlannerEditor.defaultPageType );
		}, [] ),
		options: pageTypes,
		onChange: ( value ) => {
			// Update the TAXONOMY term value.
			const data = {};
			data[ TAXONOMY ] = value;
			wp.data.dispatch( 'core/editor' ).editPost( data );
		},
	} );
};

/**
 * Render the video section.
 * This will display a button to open a modal with the video.
 *
 * @param {Object} lessonSection The lesson section.
 * @return {Element} Element to render.
 */
const PrplSectionVideo = ( lessonSection ) => {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return el(
		'div',
		{
			title: prplL10n( 'video' ),
			initialOpen: false,
		},
		el(
			'div',
			{},
			el(
				Button,
				{
					key: 'progress-planner-sidebar-video-button',
					onClick: openModal,
					icon: 'video-alt3',
					variant: 'secondary',
					style: {
						width: '100%',
						margin: '15px 0',
						color: '#38296D',
						boxShadow: 'inset 0 0 0 1px #38296D',
					},
				},
				lessonSection.video_button_label
					? lessonSection.video_button_text
					: prplL10n( 'watchVideo' )
			),
			isOpen &&
				el(
					Modal,
					{
						key: 'progress-planner-sidebar-video-modal',
						title: prplL10n( 'video' ),
						onRequestClose: closeModal,
						shouldCloseOnClickOutside: true,
						shouldCloseOnEsc: true,
						size: 'large',
					},
					el(
						'div',
						{
							key: 'progress-planner-sidebar-video-modal-content',
						},
						el( 'div', {
							key: 'progress-planner-sidebar-video-modal-content-inner',
							dangerouslySetInnerHTML: {
								__html: lessonSection.video,
							},
						} )
					)
				)
		)
	);
};

const PrplSectionHTML = ( lesson, sectionId, wrapperEl = 'div' ) => {
	return lesson && lesson[ sectionId ]
		? el(
				wrapperEl,
				{
					key: `progress-planner-sidebar-lesson-section-${ sectionId }`,
					title: lesson[ sectionId ].heading,
					initialOpen: false,
				},
				lesson[ sectionId ].video
					? PrplSectionVideo( lesson[ sectionId ] )
					: el( 'div', {}, '' ),
				lesson[ sectionId ].text
					? el( 'div', {
							key: `progress-planner-sidebar-lesson-section-${ sectionId }-content`,
							dangerouslySetInnerHTML: {
								__html: lesson[ sectionId ].text,
							},
					  } )
					: el( 'div', {}, '' )
		  )
		: el( 'div', {}, '' );
};

/**
 * Render the lesson items.
 *
 * @return {Element} Element to render.
 */
const PrplLessonItemsHTML = () => {
	const pageTypeID = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditedPostAttribute( TAXONOMY ),
		[]
	);
	const pageType = prplGetPageTypeSlugFromId( pageTypeID );

	const pageTodosMeta = useSelect( ( select ) => {
		const meta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
		return meta ? meta.progress_planner_page_todos : '';
	}, [] );
	const pageTodos = pageTodosMeta || '';

	// Bail early if the page type or lessons are not set.
	if (
		! pageType ||
		! progressPlannerEditor.lessons ||
		0 === progressPlannerEditor.lessons.length
	) {
		return el( 'div', {}, '' );
	}

	const lesson = progressPlannerEditor.lessons.find(
		( lessonItem ) => lessonItem.settings.id === pageType
	);

	if ( lesson.content_update_cycle.text ) {
		lesson.content_update_cycle.text =
			lesson.content_update_cycle.text.replace(
				/\{page_type\}/g,
				lesson.name
			);
		lesson.content_update_cycle.text =
			lesson.content_update_cycle.text.replace(
				/\{update_cycle\}/g,
				lesson.content_update_cycle.update_cycle
			);
	}

	return el(
		Fragment,
		{
			key: 'progress-planner-sidebar-lesson-items',
		},
		// Update cycle content.
		PrplSectionHTML( lesson, 'content_update_cycle', 'div' ),

		// Intro video & content.
		PrplSectionHTML( lesson, 'intro', PanelBody ),

		// Checklist video & content.
		lesson.checklist
			? el(
					PanelBody,
					{
						key: `progress-planner-sidebar-lesson-section-checklist-content`,
						title: lesson.checklist.heading,
						initialOpen: false,
					},
					el(
						'div',
						{},
						lesson.checklist.video
							? PrplSectionVideo( lesson.checklist )
							: el( 'div', {}, '' ),
						PrplTodoProgress( lesson.checklist, pageTodos ),
						PrplCheckList( lesson.checklist, pageTodos )
					)
			  )
			: el( 'div', {}, '' ),

		// Writers block video & content.
		PrplSectionHTML( lesson, 'writers_block', PanelBody )
	);
};

/**
 * Render the Progress Planner sidebar.
 * This sidebar will display the lessons and videos for the current page.
 *
 * @return {Element} Element to render.
 */
const PrplProgressPlannerSidebar = () =>
	el(
		Fragment,
		{},
		el(
			PluginSidebarMoreMenuItem,
			{
				target: 'progress-planner-sidebar',
				key: 'progress-planner-sidebar-menu-item',
			},
			prplL10n( 'progressPlannerSidebar' )
		),
		el(
			PluginSidebar,
			{
				name: 'progress-planner-sidebar',
				key: 'progress-planner-sidebar-sidebar',
				title: prplL10n( 'progressPlannerSidebar' ),
				icon: PrplIcon(),
			},
			el(
				'div',
				{
					key: 'progress-planner-sidebar-page-type-selector-wrapper',
					style: {
						padding: '15px',
						borderBottom: '1px solid #ddd',
					},
				},
				PrplRenderPageTypeSelector(),
				PrplLessonItemsHTML()
			)
		)
	);

/**
 * Render the todo items progressbar.
 *
 * @param {Object} lessonSection The lesson section.
 * @param {string} pageTodos
 * @return {Element} Element to render.
 */
const PrplTodoProgress = ( lessonSection, pageTodos ) => {
	// Get an array of required todo items.
	const requiredToDos = [];
	if ( lessonSection.todos ) {
		lessonSection.todos.forEach( ( toDoGroup ) => {
			toDoGroup.group_todos.forEach( ( item ) => {
				if ( item.todo_required ) {
					requiredToDos.push( item.id );
				}
			} );
		} );
	}

	// Get an array of completed todo items.
	const completedToDos = pageTodos
		.split( ',' )
		.filter( ( item ) => requiredToDos.includes( item ) );

	// Get the percentage of completed todo items.
	const percentageComplete = Math.round(
		( completedToDos.length / requiredToDos.length ) * 100
	);

	return el(
		'div',
		{},
		el(
			'div',
			{
				style: {
					width: '100%',
					display: 'flex',
					alignItems: 'center',
				},
			},
			el(
				'div',
				{
					style: {
						width: '100%',
						backgroundColor: '#e1e3e7',
						height: '15px',
						borderRadius: '5px',
					},
				},
				el( 'div', {
					style: {
						width: `${ percentageComplete }%`,
						backgroundColor: '#14b8a6',
						height: '15px',
						borderRadius: '5px',
					},
				} )
			),
			el(
				'div',
				{
					style: {
						margin: '0 5px',
						fontSize: '12px',
						color: '#38296D',
					},
				},
				`${ percentageComplete }%`
			)
		),
		el( 'div', {
			dangerouslySetInnerHTML: {
				__html: prplL10n( 'checklistProgressDescription' ),
			},
		} )
	);
};

/**
 * Render a single todo item with its checkbox.
 *
 * @param {Object} item
 * @param {string} pageTodos
 * @return {Element} Element to render.
 */
const PrplCheckListItem = ( item, pageTodos ) =>
	el(
		'div',
		{
			key: item.id,
		},
		el( CheckboxControl, {
			checked: pageTodos.split( ',' ).includes( item.id ),
			label: item.todo_name,
			className: item.todo_required
				? 'progress-planner-todo-item required'
				: 'progress-planner-todo-item',
			help: el( 'div', {
				dangerouslySetInnerHTML: {
					__html: item.todo_description,
				},
			} ),
			onChange: ( checked ) => {
				const toDos = pageTodos.split( ',' );
				if ( checked ) {
					toDos.push( item.id );
				} else {
					toDos.splice( toDos.indexOf( item.id ), 1 );
				}
				// Update the `progress_planner_page_todos` meta value.
				wp.data.dispatch( 'core/editor' ).editPost( {
					meta: {
						progress_planner_page_todos: toDos.join( ',' ),
					},
				} );
			},
		} )
	);

/**
 * Render the todo items.
 *
 * @param {Object} lessonSection The lesson section.
 * @param {string} pageTodos
 * @return {Element} Element to render.
 */
const PrplCheckList = ( lessonSection, pageTodos ) =>
	lessonSection.todos.map( ( toDoGroup ) =>
		el(
			PanelBody,
			{
				key: `progress-planner-sidebar-lesson-section-${ toDoGroup.group_heading }`,
				title: toDoGroup.group_heading,
				initialOpen: false,
			},
			el(
				'div',
				{
					key: `progress-planner-sidebar-lesson-section-${ toDoGroup.group_heading }-todos`,
				},
				toDoGroup.group_todos.map( ( item ) =>
					PrplCheckListItem( item, pageTodos )
				)
			)
		)
	);

// Register the sidebar.
registerPlugin( 'progress-planner-sidebar', {
	render: PrplProgressPlannerSidebar,
} );

/**
 * SVG Icon Component.
 *
 * @return {Element} Element to render.
 */
const PrplIcon = () =>
	el(
		'svg',
		{
			role: 'img',
			className: 'progress-planner-icon',
			xmlns: 'http://www.w3.org/2000/svg',
			viewBox: '0 0 500 500',
		},
		[
			el( 'path', {
				key: 'path1',
				id: 'path1',
				stroke: 'none',
				d: 'M 283.460022 172.899994 C 286.670013 173.02002 289.429993 174.640015 291.190002 177.049988 C 289.320007 166.809998 280.550018 158.880005 269.710022 158.48999 C 257.190002 158.039978 246.679993 167.820007 246.229996 180.339996 C 245.779999 192.859985 255.559998 203.369995 268.080017 203.820007 C 277.480011 204.160004 285.75 198.720001 289.480011 190.690002 C 287.649994 192.200012 285.300018 193.109985 282.740021 193.02002 C 277.190002 192.820007 272.850006 188.160004 273.050018 182.609985 C 273.25 177.059998 277.910004 172.720001 283.460022 172.919983 Z M 307.51001 305.839996 C 308.089996 307.76001 308.640015 309.700012 309.240021 311.609985 C 323.279999 356.579987 343.179993 400.359985 365.660004 435.880005 L 433.410004 305.839996 L 307.51001 305.839996 Z M 363.959991 205.970001 C 376.079987 201.470001 387.5 198.789978 397.600006 197.01001 C 375.089996 174.73999 336.359985 169.950012 336.130005 169.919983 C 337.399994 176.089996 336.709991 185.720001 333.690002 196.380005 C 330.390015 208.039978 324.309998 220.919983 314.990021 231.859985 C 311.540009 235.919983 307.630005 239.690002 303.26001 243.049988 L 303.330017 243.049988 L 303.330017 243.039978 C 303.490021 243.660004 303.710022 244.240005 303.910004 244.830002 C 306.649994 253.100006 312.52002 258.570007 318.839996 261.970001 C 325.320007 265.459991 332.209991 266.799988 336.519989 266.799988 C 342.920013 266.799988 348.399994 263.01001 350.950012 257.579987 C 351.920013 255.520004 352.5 253.25 352.5 250.820007 C 352.5 246.970001 351.079987 243.47998 348.809998 240.720001 C 346.890015 238.390015 344.350006 236.640015 341.420013 235.690002 L 386.23999 227.039978 C 379.609985 220.919983 371.519989 215.450012 363.51001 210.809998 C 361.540009 209.669983 361.820007 206.76001 363.959991 205.970001 Z',
			} ),
			el( 'path', {
				key: 'path2',
				id: 'path2',
				stroke: 'none',
				d: 'M 347.369995 458.369995 C 321.579987 419.529999 298.690002 370.329987 282.919983 319.829987 C 281.470001 315.200012 280.089996 310.519989 278.75 305.839996 C 277.630005 301.899994 276.529999 297.959991 275.5 294.040009 C 273.410004 286.119995 266.220001 280.579987 258.019989 280.579987 L 230.070007 280.579987 C 221.869995 280.579987 214.679993 286.109985 212.589996 294.029999 C 210.309998 302.679993 207.809998 311.350006 205.169998 319.820007 C 189.399994 370.320007 166.519989 419.519989 140.720001 458.359985 C 136.709991 464.390015 138.940002 469.98999 140.080002 472.119995 C 142.479996 476.589996 146.940002 479.26001 152.019989 479.26001 L 218.029999 479.26001 L 222 486.179993 C 226.539993 494.079987 234.990005 498.98999 244.050003 498.98999 C 253.110001 498.98999 261.559998 494.079987 266.109985 486.179993 L 270.089996 479.26001 L 336.089996 479.26001 C 339.309998 479.26001 342.279999 478.179993 344.640015 476.23999 C 345.98999 475.130005 347.149994 473.75 348.019989 472.109985 C 348.589996 471.040009 349.440002 469.089996 349.630005 466.649994 C 349.820007 464.23999 349.369995 461.339996 347.380005 458.339996 Z',
			} ),
			el( 'path', {
				key: 'path3',
				id: 'path3',
				stroke: 'none',
				d: 'M 361.700012 76.059998 C 354.160004 64.01001 329.320007 77.059998 302.160004 78.919983 C 287.119995 79.950012 265.110016 -31.710022 230.389999 21.929993 C 190.830002 83.029999 151.270004 -22.75 141.730011 6.100006 C 120.620003 49.369995 166.880005 90.709991 166.880005 90.709991 C 166.880005 90.709991 154.040009 98.630005 146.25 104.640015 C 140.779999 108.809998 135.430008 113.290009 130.220001 118.149994 C 109.770004 137.179993 94.18 158.470001 83.450005 182.01001 C 72.720001 205.549988 67.110001 229.589996 66.620003 254.149994 C 66.129997 278.709991 70.629997 303.25 80.160004 327.779999 C 89.68 352.309998 104.330002 375.200012 124.110001 396.459991 C 128.130005 400.779999 132.230011 404.869995 136.419998 408.76001 C 140.520004 402.450012 144.389999 396.019989 148.059998 389.5 C 152.449997 381.700012 156.559998 373.779999 160.309998 365.720001 C 159.980011 365.369995 159.650009 365.029999 159.320007 364.690002 C 159.150009 364.51001 158.980011 364.339996 158.809998 364.160004 C 143.279999 347.470001 131.639999 329.570007 123.880005 310.440002 C 116.110001 291.309998 112.380005 272.190002 112.68 253.080002 C 112.970001 233.97998 117.150002 215.399994 125.209999 197.359985 C 133.270004 179.309998 145.230011 162.910004 161.110001 148.140015 C 175.100006 135.119995 189.949997 125.309998 205.660004 118.730011 C 221.360001 112.140015 237.289993 108.75 253.419998 108.549988 C 262.470001 108.440002 272.529999 109.700012 282.929993 113.049988 C 293.25 117.320007 302.149994 122.48999 309.559998 128.399994 C 319.75 136.529999 327.170013 146.049988 331.779999 156.5 C 333.690002 160.820007 335.149994 165.299988 336.100006 169.910004 C 352.369995 141.640015 372.850006 93.950012 361.670013 76.080017 Z',
			} ),
		]
	);

/**
 * Render the Progress Planner post status.
 *
 * @return {Element} Element to render.
 */
const PrplPostStatus = () =>
	el(
		'div',
		{},
		el(
			PluginPostStatusInfo,
			{},
			el(
				Button,
				{
					icon: PrplIcon(),
					style: {
						width: '100%',
						margin: '15px 0',
						color: '#38296D',
						boxShadow: 'inset 0 0 0 1px #38296D',
						fontWeight: 'bold',
					},
					variant: 'secondary',
					href: '#',
					onClick: () =>
						wp.data
							.dispatch( 'core/edit-post' )
							.openGeneralSidebar(
								'progress-planner-sidebar/progress-planner-sidebar'
							),
				},
				'Progress Planner'
			)
		),
		el( PluginPostStatusInfo, {} )
	);

// Register the post status component.
registerPlugin( 'progress-planner-post-status', {
	render: PrplPostStatus,
} );
