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
			// Inject the tasks.
			if ( Object.keys( prplSuggestedTask.tasks.pendingTasks ).length ) {
				Object.keys( prplSuggestedTask.tasks.pendingTasks ).forEach(
					( category ) => {
						prplSuggestedTask.injectItems(
							prplSuggestedTask.tasks.pendingTasks[ category ]
						);
					}
				);
			}

			// Inject the pending celebration tasks, but only on Progress Planner dashboard page.
			if (
				! prplSuggestedTask.delayCelebration &&
				Object.keys( prplSuggestedTask.tasks.pendingCelebrationTasks )
					.length
			) {
				Object.keys(
					prplSuggestedTask.tasks.pendingCelebrationTasks
				).forEach( ( category ) => {
					prplSuggestedTask.injectItems(
						prplSuggestedTask.tasks.pendingCelebrationTasks[
							category
						]
					);

					// Set post status to trash.
					prplSuggestedTask.tasks.pendingCelebrationTasks[
						category
					].forEach( ( task ) => {
						const post = new wp.api.models.Prpl_recommendations( {
							id: task.id,
						} );
						// Destroy the post, without the force parameter.
						post.destroy( { url: post.url() } );
					} );
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
			const celebrationPromises = [];

			// Loop through each provider and inject items.
			for ( const category in prplSuggestedTask.maxItemsPerCategory ) {
				if ( 'user' === category ) {
					continue;
				}

				// Inject published tasks.
				prplSuggestedTask.injectItemsFromCategory( {
					category,
					status: [ 'publish' ],
					per_page: prplSuggestedTask.maxItemsPerCategory[ category ],
				} );

				// We trigger celebration only on Progress Planner dashboard page.
				if ( ! prplSuggestedTask.delayCelebration ) {
					// Inject pending celebration tasks.
					celebrationPromises.push(
						prplSuggestedTask
							.injectItemsFromCategory( {
								category,
								status: [ 'pending' ],
								per_page: 100,
							} )
							.then( ( data ) => {
								// If there were pending tasks.
								if ( data.length ) {
									// Set post status to trash.
									data.forEach( ( task ) => {
										const post =
											new wp.api.models.Prpl_recommendations(
												{
													id: task.id,
												}
											);
										// Destroy the post, without the force parameter.
										post.destroy( { url: post.url() } );
									} );
								}
							} )
					);
				}
			}

			// Trigger celebration once, for all categories.
			Promise.all( celebrationPromises ).then( () => {
				if (
					0 <
					document.querySelectorAll(
						'.prpl-suggested-tasks-list [data-task-action="celebrate"]'
					).length
				) {
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
			} );
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
