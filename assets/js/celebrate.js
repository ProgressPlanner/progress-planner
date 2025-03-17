/* global prplSuggestedTasks, confetti */
/*
 * Confetti.
 *
 * A script that triggers confetti on the container element.
 *
 * Dependencies: particles-confetti
 */
/* eslint-disable camelcase */

// Create a new custom event to trigger the celebration.
document.addEventListener( 'prpl/celebrateTasks', ( event ) => {
	/**
	 * Trigger the confetti on the container element.
	 */
	const containerElement = event.detail.element.closest(
		'.prpl-suggested-tasks-list'
	);
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
		const origin = containerElement
			? {
					x:
						( containerElement.getBoundingClientRect().left +
							containerElement.offsetWidth / 2 ) /
						window.innerWidth,
					y:
						( containerElement.getBoundingClientRect().top + 50 ) /
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
						{ src: prplSuggestedTasks.raviIconUrl },
						{ src: prplSuggestedTasks.raviIconUrl },
						{ src: prplSuggestedTasks.raviIconUrl },
						{ src: prplSuggestedTasks.monthIconUrl },
						{ src: prplSuggestedTasks.contentIconUrl },
						{ src: prplSuggestedTasks.maintenanceIconUrl },
					],
				},
			},
		];

		// Tripple check if the confetti options are an array and not undefined.
		if (
			'undefined' !== typeof prplSuggestedTasks.confettiOptions &&
			true === Array.isArray( prplSuggestedTasks.confettiOptions ) &&
			prplSuggestedTasks.confettiOptions.length
		) {
			confettiOptions = prplSuggestedTasks.confettiOptions;
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

	/**
	 * Strike completed tasks.
	 */
	document.dispatchEvent( new CustomEvent( 'prpl/strikeCelebratedTasks' ) );

	// Remove celebrated tasks and add them to the completed tasks.
	setTimeout( () => {
		document
			.querySelectorAll( '.prpl-suggested-task-celebrated' )
			.forEach( ( item ) => {
				const task_id = item.getAttribute( 'data-task-id' );
				const providerID = item.getAttribute( 'data-task-provider-id' );
				const el = document.querySelector(
					`.prpl-suggested-task[data-task-id="${ task_id }"]`
				);

				if ( el ) {
					el.parentElement.remove();
				}

				// Get the task index.
				let taskIndex = false;
				window.prplSuggestedTasks.tasks.forEach(
					( taskItem, index ) => {
						if ( taskItem.task_id === task_id ) {
							taskIndex = index;
						}
					}
				);

				// Mark the task as completed.
				if ( false !== taskIndex ) {
					window.prplSuggestedTasks.tasks[ taskIndex ].status =
						'completed';
				}

				// Refresh the list.
				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/maybeInjectItem', {
						detail: {
							task_id,
							providerID,
						},
					} )
				);
			} );
	}, 2000 );
} );

/**
 * Strike completed tasks.
 */
document.addEventListener( 'prpl/strikeCelebratedTasks', () => {
	document
		.querySelectorAll(
			'.prpl-suggested-task[data-task-action="celebrate"]'
		)
		.forEach( ( item ) => {
			item.classList.add( 'prpl-suggested-task-celebrated' );
		} );
} );
