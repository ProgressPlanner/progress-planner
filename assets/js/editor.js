/* global progressPlannerEditor, prplL10n */
/**
 * Editor script.
 *
 * Dependencies: wp-plugins, wp-editor, wp-element, wp-components, wp-data, progress-planner/l10n
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
		// Handle NaN from parseInt on invalid strings.
		if ( isNaN( id ) ) {
			id = 0;
		}
	} else if ( typeof id !== 'number' ) {
		id = 0;
	}

	if ( ! id || isNaN( id ) ) {
		// Check if progressPlannerEditor exists before accessing its properties.
		if (
			typeof progressPlannerEditor !== 'undefined' &&
			progressPlannerEditor.defaultPageType
		) {
			id = parseInt( progressPlannerEditor.defaultPageType ) || 0;
		} else {
			id = 0;
		}
	}

	// Check if progressPlannerEditor exists before accessing pageTypes.
	if (
		typeof progressPlannerEditor === 'undefined' ||
		! progressPlannerEditor.pageTypes
	) {
		return undefined;
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
	// Get the current term from the TAXONOMY using useSelect hook.
	const currentPageType = useSelect( ( select ) => {
		// Defensive check: ensure select and editor store exist.
		if ( ! select || typeof select !== 'function' ) {
			return 0;
		}
		const editor = select( 'core/editor' );
		if ( ! editor || typeof editor.getEditedPostAttribute !== 'function' ) {
			// Fallback to default if editor store is not available.
			if (
				typeof progressPlannerEditor !== 'undefined' &&
				progressPlannerEditor.defaultPageType
			) {
				return parseInt( progressPlannerEditor.defaultPageType ) || 0;
			}
			return 0;
		}
		const pageTypeArr = editor.getEditedPostAttribute( TAXONOMY );
		if ( pageTypeArr && 0 < pageTypeArr.length ) {
			return parseInt( pageTypeArr[ 0 ] );
		}
		// Check if progressPlannerEditor exists before accessing its properties.
		if (
			typeof progressPlannerEditor !== 'undefined' &&
			progressPlannerEditor.defaultPageType
		) {
			return parseInt( progressPlannerEditor.defaultPageType ) || 0;
		}
		return 0;
	}, [] );

	// Bail early if the page types are not set.
	// Check if progressPlannerEditor exists before accessing its properties.
	if (
		typeof progressPlannerEditor === 'undefined' ||
		! progressPlannerEditor.pageTypes ||
		0 === progressPlannerEditor.pageTypes.length
	) {
		return el( 'div', {}, '' );
	}

	// Build the page types array, to be used in the dropdown.
	const pageTypes = [];
	progressPlannerEditor.pageTypes.forEach( ( term ) => {
		pageTypes.push( {
			label: term.title || '',
			value: term.id || '',
		} );
	} );

	return el( SelectControl, {
		label: prplL10n( 'pageType' ),
		value: currentPageType,
		options: pageTypes,
		onChange: ( value ) => {
			// Update the TAXONOMY term value.
			const data = {};
			data[ TAXONOMY ] = value;
			// Defensive check: ensure wp.data and dispatch exist before calling.
			if ( wp.data && typeof wp.data.dispatch === 'function' ) {
				const editorDispatch = wp.data.dispatch( 'core/editor' );
				if (
					editorDispatch &&
					typeof editorDispatch.editPost === 'function'
				) {
					editorDispatch.editPost( data );
				}
			}
		},
	} );
};

/**
 * Render the video section.
 * This will display a button to open a modal with the video.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @return {Element} Element to render.
 */
const PrplSectionVideo = ( props ) => {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	// Handle both direct prop and nested prop for backward compatibility
	const lessonSection = props?.lessonSection || props;

	// If no video, return null (component always renders, but conditionally shows content)
	if ( ! lessonSection || ! lessonSection.video ) {
		return null;
	}

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
				lessonSection.video_button_text
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
								__html: lessonSection.video || '',
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
					title: lesson[ sectionId ].heading || '',
					initialOpen: false,
				},
				// Always render PrplSectionVideo as a component (not conditionally)
				// The component handles the conditional logic internally to avoid hook violations
				el( PrplSectionVideo, { lessonSection: lesson[ sectionId ] } ),
				lesson[ sectionId ].text
					? el( 'div', {
							key: `progress-planner-sidebar-lesson-section-${ sectionId }-content`,
							dangerouslySetInnerHTML: {
								__html: lesson[ sectionId ].text || '',
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
	const pageTypeID = useSelect( ( select ) => {
		// Defensive check: ensure select and editor store exist.
		if ( ! select || typeof select !== 'function' ) {
			return null;
		}
		const editor = select( 'core/editor' );
		if ( ! editor || typeof editor.getEditedPostAttribute !== 'function' ) {
			return null;
		}
		return editor.getEditedPostAttribute( TAXONOMY );
	}, [] );
	const pageType = prplGetPageTypeSlugFromId( pageTypeID );

	const pageTodosMeta = useSelect( ( select ) => {
		// Defensive check: ensure select and editor store exist.
		if ( ! select || typeof select !== 'function' ) {
			return '';
		}
		const editor = select( 'core/editor' );
		if ( ! editor || typeof editor.getEditedPostAttribute !== 'function' ) {
			return '';
		}
		const meta = editor.getEditedPostAttribute( 'meta' );
		return meta ? meta.progress_planner_page_todos : '';
	}, [] );
	const pageTodos = pageTodosMeta || '';

	// Bail early if the page type or lessons are not set.
	// Check if progressPlannerEditor exists before accessing its properties.
	if (
		! pageType ||
		typeof progressPlannerEditor === 'undefined' ||
		! progressPlannerEditor.lessons ||
		0 === progressPlannerEditor.lessons.length
	) {
		return el( 'div', {}, '' );
	}

	const lesson = progressPlannerEditor.lessons.find(
		( lessonItem ) => lessonItem.settings?.id === pageType
	);

	// Bail early if lesson not found.
	if ( ! lesson ) {
		return el( 'div', {}, '' );
	}

	// Create a processed copy of the lesson to avoid mutating the original.
	const processedLesson = { ...lesson };
	if (
		processedLesson.content_update_cycle &&
		processedLesson.content_update_cycle.text
	) {
		processedLesson.content_update_cycle = {
			...processedLesson.content_update_cycle,
			text: processedLesson.content_update_cycle.text
				.replace( /\{page_type\}/g, processedLesson.name || '' )
				.replace(
					/\{update_cycle\}/g,
					processedLesson.content_update_cycle.update_cycle || ''
				),
		};
	}

	return el(
		Fragment,
		{
			key: 'progress-planner-sidebar-lesson-items',
		},
		// Update cycle content.
		PrplSectionHTML( processedLesson, 'content_update_cycle', 'div' ),

		// Intro video & content.
		PrplSectionHTML( processedLesson, 'intro', PanelBody ),

		// Checklist video & content.
		processedLesson.checklist
			? el(
					PanelBody,
					{
						key: `progress-planner-sidebar-lesson-section-checklist-content`,
						title: processedLesson.checklist.heading || '',
						initialOpen: false,
					},
					el(
						'div',
						{},
						// Always render PrplSectionVideo as a component (not conditionally)
						// The component handles the conditional logic internally to avoid hook violations
						el( PrplSectionVideo, {
							lessonSection: processedLesson.checklist,
						} ),
						PrplTodoProgress(
							processedLesson.checklist,
							pageTodos
						),
						PrplCheckList( processedLesson.checklist, pageTodos )
					)
			  )
			: el( 'div', {}, '' ),

		// Writers block video & content.
		PrplSectionHTML( processedLesson, 'writers_block', PanelBody )
	);
};

/**
 * Render the Progress Planner sidebar.
 * This sidebar will display the lessons and videos for the current page.
 *
 * @return {Element} Element to render.
 */
const PrplProgressPlannerSidebar = () => {
	// Use useSelect to reactively detect what's being edited
	// Include both postType and postId so component re-renders when switching posts
	// postId and postType are destructured but intentionally unused - they're needed
	// for reactivity when switching between posts in the site editor.
	const { isEditingPost, postId, postType } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );

		// Make sure the editor store and methods exist.
		if (
			! editor ||
			typeof editor.getCurrentPostType !== 'function' ||
			typeof editor.getCurrentPostId !== 'function'
		) {
			return {
				isEditingPost: false,
				postId: null,
				postType: null,
			};
		}

		const currentPostType = editor.getCurrentPostType();
		const currentPostId = editor.getCurrentPostId();

		// Templates have post types 'wp_template' or 'wp_template_part'.
		const isTemplate =
			currentPostType === 'wp_template' ||
			currentPostType === 'wp_template_part';

		return {
			isEditingPost: ! isTemplate && !! currentPostType,
			postId: currentPostId,
			postType: currentPostType,
		};
	}, [] );
	// eslint-disable-next-line no-unused-vars
	const _unusedForReactivity = { postId, postType };

	// Always render the child components to ensure hooks are called consistently.
	// Render them in a hidden wrapper when not editing a post to maintain hook order.
	const sidebarContent = el(
		'div',
		{
			key: 'progress-planner-sidebar-page-type-selector-wrapper',
			style: {
				padding: '15px',
				borderBottom: '1px solid #ddd',
			},
		},
		// Always render these components so hooks are always called
		PrplRenderPageTypeSelector(),
		PrplLessonItemsHTML()
	);

	// Only render the PluginSidebar (and its icon) when editing a post
	return el(
		Fragment,
		{},
		// Render child components in a hidden wrapper when not editing to maintain hook order
		! isEditingPost &&
			el(
				'div',
				{
					key: 'progress-planner-sidebar-hidden-wrapper',
					style: { display: 'none' },
				},
				sidebarContent
			),
		// Only show sidebar icon and panel when editing a post
		isEditingPost &&
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
					sidebarContent
				)
			)
	);
};

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
			if ( toDoGroup.group_todos ) {
				toDoGroup.group_todos.forEach( ( item ) => {
					if ( item.todo_required && item.id ) {
						requiredToDos.push( item.id );
					}
				} );
			}
		} );
	}

	// Get an array of completed todo items.
	// Normalize empty strings to empty arrays to avoid [''] from ''.split(',')
	const todosArray = pageTodos
		? pageTodos.split( ',' ).filter( Boolean )
		: [];
	const completedToDos = todosArray.filter( ( item ) =>
		requiredToDos.includes( item )
	);

	// Get the percentage of completed todo items.
	// Guard against division by zero.
	const percentageComplete =
		requiredToDos.length > 0
			? Math.round(
					( completedToDos.length / requiredToDos.length ) * 100
			  )
			: 0;

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
			key: item.id || '',
		},
		el( CheckboxControl, {
			checked:
				pageTodos && item.id
					? pageTodos
							.split( ',' )
							.filter( Boolean )
							.includes( item.id )
					: false,
			label: item.todo_name || '',
			className: item.todo_required
				? 'progress-planner-todo-item required'
				: 'progress-planner-todo-item',
			help: el( 'div', {
				dangerouslySetInnerHTML: {
					__html: item.todo_description || '',
				},
			} ),
			onChange: ( checked ) => {
				// Normalize empty strings to empty arrays.
				const toDos = pageTodos
					? pageTodos.split( ',' ).filter( Boolean )
					: [];
				if ( checked && item.id ) {
					toDos.push( item.id );
				} else if ( item.id ) {
					const index = toDos.indexOf( item.id );
					if ( index > -1 ) {
						toDos.splice( index, 1 );
					}
				}
				// Update the `progress_planner_page_todos` meta value.
				// Defensive check: ensure wp.data and dispatch exist before calling.
				if ( wp.data && typeof wp.data.dispatch === 'function' ) {
					const editorDispatch = wp.data.dispatch( 'core/editor' );
					if (
						editorDispatch &&
						typeof editorDispatch.editPost === 'function'
					) {
						editorDispatch.editPost( {
							meta: {
								progress_planner_page_todos: toDos.join( ',' ),
							},
						} );
					}
				}
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
const PrplCheckList = ( lessonSection, pageTodos ) => {
	// Bail early if todos are not set.
	if ( ! lessonSection.todos || ! Array.isArray( lessonSection.todos ) ) {
		return [];
	}

	return lessonSection.todos.map( ( toDoGroup ) =>
		el(
			PanelBody,
			{
				key: `progress-planner-sidebar-lesson-section-${
					toDoGroup.group_heading || ''
				}`,
				title: toDoGroup.group_heading || '',
				initialOpen: false,
			},
			el(
				'div',
				{
					key: `progress-planner-sidebar-lesson-section-${
						toDoGroup.group_heading || ''
					}-todos`,
				},
				toDoGroup.group_todos && Array.isArray( toDoGroup.group_todos )
					? toDoGroup.group_todos.map( ( item ) =>
							PrplCheckListItem( item, pageTodos )
					  )
					: []
			)
		)
	);
};

// Register the sidebar.
registerPlugin( 'progress-planner-sidebar', {
	render: PrplProgressPlannerSidebar,
} );

/**
 * Icon Component using branding admin menu icon.
 *
 * Renders raw SVG inline so it can be styled with CSS (e.g., currentColor).
 *
 * @return {Element} Element to render.
 */
const PrplIcon = () =>
	el( 'span', {
		className: 'progress-planner-icon',
		style: {
			display: 'inline-flex',
			width: '20px',
			height: '20px',
		},
		dangerouslySetInnerHTML: {
			__html: progressPlannerEditor.adminMenuIconSvg,
		},
	} );

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
					onClick: () => {
						// openGeneralSidebar is in core/edit-post store, not core/editor.
						// Try core/edit-post first (where the method is defined),
						// then fallback to core/editor if available in future versions.
						const editPostDispatch =
							wp.data.dispatch( 'core/edit-post' );
						const editorDispatch =
							wp.data.dispatch( 'core/editor' );
						if (
							editPostDispatch &&
							typeof editPostDispatch.openGeneralSidebar ===
								'function'
						) {
							editPostDispatch.openGeneralSidebar(
								'progress-planner-sidebar/progress-planner-sidebar'
							);
						} else if (
							editorDispatch &&
							typeof editorDispatch.openGeneralSidebar ===
								'function'
						) {
							editorDispatch.openGeneralSidebar(
								'progress-planner-sidebar/progress-planner-sidebar'
							);
						}
					},
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
