/* global prplSuggestedTask */
/*
 * Widget: Suggested Tasks
 *
 * A widget that displays a list of suggested tasks.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, progress-planner/widgets/todo, progress-planner/celebrate, progress-planner/grid-masonry, progress-planner/web-components/prpl-tooltip, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase */

const prplSuggestedTasksToggleUIitems = () => {
	const el = document.querySelector( '.prpl-suggested-tasks-loading' );
	if ( el ) {
		el.remove();
	}
	setTimeout( () => {
		const items = document.querySelectorAll(
			'.prpl-suggested-tasks-list .prpl-suggested-task'
		);

		if ( 0 === items.length ) {
			document.querySelector( '.prpl-no-suggested-tasks' ).style.display =
				'block';
		}
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	}, 2000 );
};

/**
 * Populate the suggested tasks list when the terms are loaded.
 */
window.prplGetTermsCollectionsPromises().then( () => {
	window.prplPopulateSuggestedTasksList();
	window.prplPopulateTodoList();
} );

/**
 * Populate the suggested tasks list.
 */
window.prplPopulateSuggestedTasksList = function () {
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
		prplSuggestedTask.injectItemsFromCategory(
			category,
			[ 'publish' ],
			prplSuggestedTask.maxItemsPerCategory[ category ]
		);

		// Inject pending tasks.
		prplSuggestedTask
			.fetchItems( {
				category,
				status: [ 'pending' ],
				per_page: 100, // Inject all pending tasks at once.
			} )
			.then( ( data ) => {
				if ( data.length ) {
					// Inject the items into the DOM.
					data.forEach( ( item ) => {
						document.dispatchEvent(
							new CustomEvent( 'prpl/suggestedTask/injectItem', {
								detail: {
									item,
									listId: 'prpl-suggested-tasks-list',
									insertPosition: 'beforeend',
								},
							} )
						);
						// prplSuggestedTask.injectedItemIds.push( item.id );
					} );
				}

				return data;
			} )
			.then( ( data ) => {
				// Toggle the "Loading..." text.
				prplSuggestedTasksToggleUIitems();

				// If there were pending tasks.
				if ( data.length ) {
					// Set post status to trash.
					data.forEach( ( task ) => {
						const post = new wp.api.models.Prpl_recommendations( {
							id: task.id,
							status: 'trash',
						} );
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
};

/* eslint-enable camelcase */
