/* global prplSuggestedTask, prplTerms, prplTodoWidget, prplL10nStrings, history, prplDocumentReady */
/*
 * Widget: Suggested Tasks
 *
 * A widget that displays a list of suggested tasks.
 *
 * Dependencies: wp-api, progress-planner/document-ready, progress-planner/suggested-task, progress-planner/widgets/todo, progress-planner/celebrate, progress-planner/grid-masonry, progress-planner/web-components/prpl-tooltip, progress-planner/suggested-task-terms
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
					exclude_provider: 'user',
				} )
				.then( ( data ) => {
					if ( data.length ) {
						prplSuggestedTask.injectItems( data );
					}
				} );

			// We trigger celebration only on Progress Planner dashboard page.
			if ( ! prplSuggestedTask.delayCelebration ) {
				// Inject pending celebration tasks.
				prplSuggestedTask
					.fetchItems( {
						status: [ 'pending' ],
						per_page: tasksPerPage,
						exclude_provider: 'user',
					} )
					.then( ( data ) => {
						// If there were pending tasks.
						if ( data.length ) {
							prplSuggestedTask.injectItems( data );

							// Set post status to trash.
							data.forEach( ( task ) => {
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

/**
 * Handle the "Show all recommendations" / "Show fewer recommendations" toggle.
 */
prplDocumentReady( () => {
	const toggleButton = document.getElementById(
		'prpl-toggle-all-recommendations'
	);
	if ( ! toggleButton ) {
		return;
	}

	toggleButton.addEventListener( 'click', () => {
		const showAll = toggleButton.dataset.showAll === '1';
		const newPerPage = showAll ? 5 : 100;

		// Update button text and state.
		toggleButton.textContent = showAll
			? prplL10nStrings.showAllRecommendations
			: prplL10nStrings.showFewerRecommendations;
		toggleButton.dataset.showAll = showAll ? '0' : '1';
		toggleButton.disabled = true;

		// Clear existing tasks.
		const tasksList = document.getElementById(
			'prpl-suggested-tasks-list'
		);
		tasksList.innerHTML = '';

		// Clear the injected items tracking array so tasks can be fetched again.
		prplSuggestedTask.injectedItemIds = [];

		// Show loading message.
		const loadingMessage = document.createElement( 'p' );
		loadingMessage.className = 'prpl-suggested-tasks-loading';
		loadingMessage.textContent = prplL10nStrings.loadingTasks;
		tasksList.parentNode.insertBefore(
			loadingMessage,
			tasksList.nextSibling
		);

		// Fetch and inject new tasks.
		prplSuggestedTask
			.fetchItems( {
				status: [ 'publish' ],
				per_page: newPerPage,
				exclude_provider: 'user',
			} )
			.then( ( data ) => {
				if ( data.length ) {
					prplSuggestedTask.injectItems( data );
				}

				// Remove loading message.
				loadingMessage?.remove();

				// Re-enable button.
				toggleButton.disabled = false;

				// Trigger grid resize.
				setTimeout( () => {
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				}, 100 );
			} )
			.catch( () => {
				// On error, restore button state.
				toggleButton.textContent = showAll
					? prplL10nStrings.showFewerRecommendations
					: prplL10nStrings.showAllRecommendations;
				toggleButton.dataset.showAll = showAll ? '1' : '0';
				toggleButton.disabled = false;
				loadingMessage?.remove();
			} );

		// Update URL without reload.
		const url = new URL( window.location );
		if ( showAll ) {
			url.searchParams.delete( 'prpl_show_all_recommendations' );
		} else {
			url.searchParams.set( 'prpl_show_all_recommendations', '' );
		}
		history.pushState( {}, '', url );
	} );
} );

/* eslint-enable camelcase */
