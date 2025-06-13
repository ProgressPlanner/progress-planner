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
		setTimeout( () => {
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		}, 2000 );
	},

	/**
	 * Populate the suggested tasks list.
	 */
	populateList: () => {
		// Do nothing if the list does not exist.
		if ( ! document.querySelector( '.prpl-suggested-tasks-list' ) ) {
			return;
		}

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

			// Inject pending celebration tasks.
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
							const post = new wp.api.models.Prpl_recommendations(
								{
									id: task.id,
									status: 'trash',
								}
							);
							post.save();
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
