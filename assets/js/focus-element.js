/* global progressPlannerFocusElement */
console.log( progressPlannerFocusElement );
if ( progressPlannerFocusElement.tasks ) {
	progressPlannerFocusElement.tasks.forEach( ( task ) => {
		const element = document.querySelector( task.link_setting.el );
		const points = task.points || 0;
		console.log( element, points );
		if ( ! element || ! points ) {
			return;
		}

		element.classList.add( 'prpl-element-awards-points' );

		// Check if we want to focus on the element, based on the URL.
		const url = new URL( window.location.href );
		const focusOnElement = url.searchParams.get( 'pp-focus-el' );
		if ( focusOnElement === task.task_id ) {
			element.focus();
			element.scrollIntoView( { behavior: 'smooth' } );
			element.classList.add( 'prpl-element-focused' );
		}
	} );
}
