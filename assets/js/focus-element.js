/* global progressPlannerFocusElement, prplL10n */
/**
 * focus-element script.
 *
 * Dependencies: progress-planner/l10n
 */

const prplGetIndicatorElement = ( content, taskId, points ) => {
	// Create an <img> element.
	const imgEl = document.createElement( 'img' );
	imgEl.src =
		progressPlannerFocusElement.base_url +
		'/assets/images/icon_progress_planner.svg';
	imgEl.alt = points
		? prplL10n( 'fixThisIssue' ).replace( '%d', points )
		: '';

	// Create a span element for the points.
	const spanEl = document.createElement( 'span' );
	spanEl.textContent = content;

	// Create a span element for the wrapper.
	const wrapperEl = document.createElement( 'span' );
	wrapperEl.classList.add( 'prpl-element-awards-points-icon-wrapper' );
	wrapperEl.setAttribute( 'data-prpl-task-id', taskId );

	// Add the image and span to the wrapper.
	wrapperEl.appendChild( imgEl );
	wrapperEl.appendChild( spanEl );

	return wrapperEl;
};

/**
 * Maybe focus on the element, based on the URL.
 *
 * @param {Object} task The task object.
 */
const prplMaybeFocusOnElement = ( task ) => {
	// Check if we want to focus on the element, based on the URL.
	const url = new URL( window.location.href );
	const focusOnElement = url.searchParams.get( 'pp-focus-el' );
	if ( focusOnElement === task.task_id ) {
		let focused = false;
		const iconEls = document.querySelectorAll(
			`[data-prpl-task-id="${ task.task_id }"]`
		);
		iconEls.forEach( ( el ) => {
			el.classList.add( 'focused' );
			if ( ! focused ) {
				el.focus();
				el.scrollIntoView( { behavior: 'smooth' } );
				focused = true;
			}
		} );
	}
};

/**
 * Add the points indicator to the element.
 *
 * @param {Object} task The task object.
 */
const prplAddPointsIndicatorToElement = ( task ) => {
	const points = task.points || 1;
	document.querySelectorAll( task.link_setting.iconEl ).forEach( ( el ) => {
		const iconEl = prplGetIndicatorElement(
			task.is_complete ? '✓' : '+' + points,
			task.task_id,
			points
		);
		if ( task.is_complete ) {
			iconEl.classList.add( 'complete' );
		}

		// Create a positioning wrapper.
		const wrapperEl = document.createElement( 'span' );
		wrapperEl.classList.add(
			'prpl-element-awards-points-icon-positioning-wrapper'
		);

		// Add the icon to the wrapper.
		wrapperEl.appendChild( iconEl );
		el.appendChild( wrapperEl );
	} );
};

if ( progressPlannerFocusElement.tasks ) {
	/**
	 * Add the points indicator to the element and maybe focus on it.
	 */
	progressPlannerFocusElement.tasks.forEach( ( task ) => {
		prplAddPointsIndicatorToElement( task );
		prplMaybeFocusOnElement( task );
	} );

	/**
	 * Add the points indicator to the page title.
	 */
	const prplPageTitle = document.querySelector( 'h1' );
	const prplPageTitleIndicator = prplGetIndicatorElement(
		progressPlannerFocusElement.completedPoints +
			'/' +
			progressPlannerFocusElement.totalPoints,
		'total'
	);
	prplPageTitle.appendChild( prplPageTitleIndicator );
}
