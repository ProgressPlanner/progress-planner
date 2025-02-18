/* global progressPlannerFocusElement */

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
		const iconEl = document.querySelector( task.link_setting.iconEl );

		iconEl.focus();
		iconEl.scrollIntoView( { behavior: 'smooth' } );
		iconEl.classList.add( 'prpl-element-focused' );
	}
};

/**
 * Add the points indicator to the element.
 *
 * @param {Object} task The task object.
 */
const prplAddPointsIndicatorToElement = ( task ) => {
	const iconEl = document.querySelector( task.link_setting.iconEl );
	const points = task.points || 0;

	iconEl.classList.add( 'prpl-element-awards-points-icon' );
	iconEl.setAttribute( 'data-prpl-points', points );
	if ( task.is_complete ) {
		iconEl.classList.add( 'prpl-element-awards-points-icon-complete' );
	}
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
	prplPageTitle.classList.add( 'prpl-element-awards-points-icon' );
	prplPageTitle.setAttribute(
		'data-prpl-points',
		progressPlannerFocusElement.completedPoints +
			'/' +
			progressPlannerFocusElement.totalPoints
	);
	prplPageTitle.style.width = 'max-content';
}
