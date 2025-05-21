/* global confetti, prplCelebrate */
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
	console.log( event );
	wp.api.loadPromise.done( () => {
		const postsCollection = new wp.api.collections.Prpl_recommendations();
		postsCollection
			.fetch( {
				data: {
					status: [ 'pending_celebration' ],
					per_page: 100,
					_embed: true,
					exclude_provider: 'user',
				},
			} )
			.done( ( data ) => {
				data.forEach( ( task ) => {
					const post = new wp.api.models.Prpl_recommendations( {
						id: task.id,
						status: 'trash',
					} );
					post.save();
				} );
			} );
	} );

	/**
	 * Trigger the confetti on the container element.
	 */
	const containerElement = event.detail?.element
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

	/**
	 * Strike completed tasks.
	 */
	document.dispatchEvent( new CustomEvent( 'prpl/strikeCelebratedTasks' ) );

	// Remove celebrated tasks and add them to the completed tasks.
	setTimeout( () => {
		document.dispatchEvent(
			new CustomEvent( 'prpl/markTasksAsCompleted' )
		);
	}, 2000 );
} );

/**
 * Mark tasks as completed.
 */
document.addEventListener( 'prpl/markTasksAsCompleted', ( event ) => {
	const taskList = event.detail?.taskList || 'prplSuggestedTasks';
	document
		.querySelectorAll( '.prpl-suggested-task-celebrated' )
		.forEach( ( item ) => {
			const task_id = item.getAttribute( 'data-task-id' );
			const providerID = item.getAttribute( 'data-task-provider-id' );
			const category = item.getAttribute( 'data-task-category' );
			const el = document.querySelector(
				`.prpl-suggested-task[data-task-id="${ task_id }"]`
			);

			if ( el ) {
				el.parentElement.remove();
			}

			// Get the task index.
			let taskIndex = false;
			window[ taskList ].tasks.forEach( ( taskItem, index ) => {
				if ( taskItem.task_id === task_id ) {
					taskIndex = index;
				}
			} );

			// Mark the task as completed.
			if ( false !== taskIndex ) {
				window[ taskList ].tasks[ taskIndex ].status = 'completed';
			}

			// Refresh the list.
			document.dispatchEvent(
				new CustomEvent( 'prpl/suggestedTask/maybeInjectItem', {
					detail: {
						task_id,
						providerID,
						category,
					},
				} )
			);
		} );
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

/**
 * Remove the points (count) from the menu.
 */
document.addEventListener( 'prpl/celebrateTasks', () => {
	const points = document.querySelectorAll(
		'#adminmenu #toplevel_page_progress-planner .update-plugins'
	);
	if ( points ) {
		points.forEach( ( point ) => {
			point.remove();
		} );
	}
} );

/* eslint-enable camelcase */
