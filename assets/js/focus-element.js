/* global progressPlannerFocusElement */

const prplAddPointsToElement = ( task ) => {
	const iconEl = document.querySelector( task.link_setting.iconEl );
	const points = task.points || 0;

	iconEl.classList.add( 'prpl-element-awards-points-icon' );
	iconEl.setAttribute( 'data-prpl-points', points );
	if ( task.is_complete ) {
		iconEl.classList.add( 'prpl-element-awards-points-icon-complete' );
	}

	// Check if we want to focus on the element, based on the URL.
	const url = new URL( window.location.href );
	const focusOnElement = url.searchParams.get( 'pp-focus-el' );
	if ( focusOnElement === task.task_id ) {
		iconEl.focus();
		iconEl.scrollIntoView( { behavior: 'smooth' } );
		iconEl.classList.add( 'prpl-element-focused' );
	}
};

if ( progressPlannerFocusElement.tasks ) {
	progressPlannerFocusElement.tasks.forEach( ( task ) => {
		prplAddPointsToElement( task );
	} );

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
