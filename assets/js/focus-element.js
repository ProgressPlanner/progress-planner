/* global progressPlannerFocusElement */
console.log( progressPlannerFocusElement );
if ( progressPlannerFocusElement.tasks ) {
	progressPlannerFocusElement.tasks.forEach( ( task ) => {
		const iconEl = document.querySelector( task.link_setting.iconEl );
		const wrapperEl = document.querySelector( task.link_setting.wrapperEl );
		const points = task.points || 0;
		if ( ! iconEl || ! wrapperEl || ! points ) {
			return;
		}

		iconEl.classList.add( 'prpl-element-awards-points-icon' );

		// Check if we want to focus on the element, based on the URL.
		const url = new URL( window.location.href );
		const focusOnElement = url.searchParams.get( 'pp-focus-el' );
		if ( focusOnElement === task.task_id ) {
			wrapperEl.focus();
			wrapperEl.scrollIntoView( { behavior: 'smooth' } );
			wrapperEl.classList.add( 'prpl-element-focused' );
		}
	} );
}
