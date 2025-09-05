/* global confetti, prplCelebrate */
/*
 * Confetti.
 *
 * A script that triggers confetti on the container element.
 *
 * Dependencies: particles-confetti, progress-planner/suggested-task
 */
/* eslint-disable camelcase */

// Create a new custom event to trigger the celebration.
document.addEventListener( 'prpl/celebrateTasks', ( event ) => {
	/**
	 * Trigger the confetti on the container element.
	 */
	const containerEl = event.detail?.element
		? event.detail.element.closest( '.prpl-suggested-tasks-list' )
		: document.querySelector(
				'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list'
		  ); // If element is not provided, use the default container.
	const prplConfettiDefaults = {
		spread: 360,
		ticks: 50,
		gravity: 1,
		decay: 0.94,
		startVelocity: 30,
		shapes: [ 'star' ],
		colors: [ 'FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8' ],
	};

	const prplRenderAttemptshoot = () => {
		// Get the tasks list position
		const origin = containerEl
			? {
					x:
						( containerEl.getBoundingClientRect().left +
							containerEl.offsetWidth / 2 ) /
						window.innerWidth,
					y:
						( containerEl.getBoundingClientRect().top + 50 ) /
						window.innerHeight,
			  }
			: { x: 0.5, y: 0.3 }; // fallback if list not found

		let confettiOptions = [
			{
				particleCount: 30,
				scalar: 4,
				shapes: [ 'image' ],
				shapeOptions: {
					image: [
						{ src: prplCelebrate.raviIconUrl },
						{ src: prplCelebrate.raviIconUrl },
						{ src: prplCelebrate.raviIconUrl },
						{ src: prplCelebrate.monthIconUrl },
						{ src: prplCelebrate.contentIconUrl },
						{ src: prplCelebrate.maintenanceIconUrl },
					],
				},
			},
		];

		// Tripple check if the confetti options are an array and not undefined.
		if (
			'undefined' !== typeof prplCelebrate.confettiOptions &&
			true === Array.isArray( prplCelebrate.confettiOptions ) &&
			prplCelebrate.confettiOptions.length
		) {
			confettiOptions = prplCelebrate.confettiOptions;
		}

		for ( const value of confettiOptions ) {
			// Set confetti options, we do it here so it's applied even if we pass the options from the PHP side (ie hearts confetti).
			value.origin = origin;

			confetti( {
				...prplConfettiDefaults,
				...value,
			} );
		}
	};

	setTimeout( prplRenderAttemptshoot, 0 );
	setTimeout( prplRenderAttemptshoot, 100 );
	setTimeout( prplRenderAttemptshoot, 200 );
} );

/**
 * Remove tasks from the DOM.
 * The task will be striked through, before removed, if it has points.
 */
document.addEventListener( 'prpl/removeCelebratedTasks', () => {
	document
		.querySelectorAll(
			'.prpl-suggested-task[data-task-action="celebrate"]'
		)
		.forEach( ( item ) => {
			// Triggers the strikethrough animation.
			item.classList.add( 'prpl-suggested-task-celebrated' );

			// Remove the item from the DOM.
			setTimeout( () => {
				item.remove();
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}, 2000 );
		} );
} );

/**
 * Remove the points (count) from the menu.
 */
document.addEventListener( 'prpl/celebrateTasks', () => {
	const points = document.querySelectorAll(
		'#adminmenu #toplevel_page_progress-planner .update-plugins'
	);
	if ( points ) {
		points.forEach( ( point ) => point.remove() );
	}
} );

/* eslint-enable camelcase */
