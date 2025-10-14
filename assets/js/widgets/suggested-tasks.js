/* global prplSuggestedTask, prplTerms, prplTodoWidget */
/*
 * Widget: Suggested Tasks
 *
 * A widget that displays a list of suggested tasks.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, progress-planner/widgets/todo, progress-planner/celebrate, progress-planner/grid-masonry, progress-planner/web-components/prpl-tooltip, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase */

const prplSuggestedTasksWidget = {
	/**
	 * Remove the "Loading..." text and resize the grid items.
	 */
	removeLoadingItems: () => {
		document.querySelector( '.prpl-suggested-tasks-loading' )?.remove();
		setTimeout(
			() => window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) ),
			2000
		);
	},

	/**
	 * Populate the suggested tasks list.
	 */
	populateList: () => {
		// Do nothing if the list does not exist.
		if ( ! document.querySelector( '.prpl-suggested-tasks-list' ) ) {
			return;
		}

		// If preloaded tasks are available, inject them.
		if ( 'undefined' !== typeof prplSuggestedTask.tasks ) {
			// Inject the pending tasks.
			if (
				Array.isArray( prplSuggestedTask.tasks.pendingTasks ) &&
				prplSuggestedTask.tasks.pendingTasks.length
			) {
				prplSuggestedTask.injectItems(
					prplSuggestedTask.tasks.pendingTasks
				);
			}

			// Inject the pending celebration tasks, but only on Progress Planner dashboard page.
			if (
				! prplSuggestedTask.delayCelebration &&
				Array.isArray(
					prplSuggestedTask.tasks.pendingCelebrationTasks
				) &&
				prplSuggestedTask.tasks.pendingCelebrationTasks.length
			) {
				prplSuggestedTask.injectItems(
					prplSuggestedTask.tasks.pendingCelebrationTasks
				);

				// Set post status to trash.
				prplSuggestedTask.tasks.pendingCelebrationTasks.forEach(
					( task ) => {
						const post = new wp.api.models.Prpl_recommendations( {
							id: task.id,
						} );
						// Destroy the post, without the force parameter.
						post.destroy( { url: post.url() } );
					}
				);

				// Trigger the celebration event (trigger confetti, strike through tasks, remove from DOM).
				setTimeout( () => {
					// Trigger the celebration event.
					document.dispatchEvent(
						new CustomEvent( 'prpl/celebrateTasks' )
					);

					/**
					 * Strike completed tasks and remove them from the DOM.
					 */
					document.dispatchEvent(
						new CustomEvent( 'prpl/removeCelebratedTasks' )
					);

					// Trigger the grid resize event.
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				}, 3000 );
			}

			// Toggle the "Loading..." text.
			prplSuggestedTasksWidget.removeLoadingItems();
		} else {
			// Otherwise, inject tasks from the API.
			// Inject published tasks (excluding user tasks).
			const tasksPerPage =
				'undefined' !== typeof prplSuggestedTask.tasksPerPage &&
				-1 === prplSuggestedTask.tasksPerPage
					? 100
					: prplSuggestedTask.tasksPerPage || 5;

			prplSuggestedTask
				.fetchItems( {
					status: [ 'publish' ],
					per_page: tasksPerPage,
				} )
				.then( ( data ) => {
					// Filter out user tasks.
					const nonUserTasks = data.filter(
						( task ) => task.prpl_provider.slug !== 'user'
					);
					if ( nonUserTasks.length ) {
						prplSuggestedTask.injectItems( nonUserTasks );
					}
				} );

			// We trigger celebration only on Progress Planner dashboard page.
			if ( ! prplSuggestedTask.delayCelebration ) {
				// Inject pending celebration tasks.
				prplSuggestedTask
					.fetchItems( {
						status: [ 'pending' ],
						per_page: tasksPerPage,
					} )
					.then( ( data ) => {
						// Filter out user tasks.
						const nonUserTasks = data.filter(
							( task ) => task.prpl_provider.slug !== 'user'
						);
						// If there were pending tasks.
						if ( nonUserTasks.length ) {
							prplSuggestedTask.injectItems( nonUserTasks );

							// Set post status to trash.
							nonUserTasks.forEach( ( task ) => {
								const post =
									new wp.api.models.Prpl_recommendations( {
										id: task.id,
									} );
								// Destroy the post, without the force parameter.
								post.destroy( { url: post.url() } );
							} );

							// Trigger the celebration event (trigger confetti, strike through tasks, remove from DOM).
							setTimeout( () => {
								// Trigger the celebration event.
								document.dispatchEvent(
									new CustomEvent( 'prpl/celebrateTasks' )
								);

								/**
								 * Strike completed tasks and remove them from the DOM.
								 */
								document.dispatchEvent(
									new CustomEvent(
										'prpl/removeCelebratedTasks'
									)
								);

								// Trigger the grid resize event.
								window.dispatchEvent(
									new CustomEvent( 'prpl/grid/resize' )
								);
							}, 3000 );
						}
					} );
			}
		}
	},
};

/**
 * Populate the suggested tasks list when the terms are loaded.
 */
prplTerms.getCollectionsPromises().then( () => {
	prplSuggestedTasksWidget.populateList();
	prplTodoWidget.populateList();
} );

/* eslint-enable camelcase */
