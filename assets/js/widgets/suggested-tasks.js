/* global prplSuggestedTask, prplTerms*/
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
prplTerms.getCollectionsPromises().then( () => {
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
		prplSuggestedTask.injectItems( {
			category,
			status: [ 'publish' ],
			per_page: prplSuggestedTask.maxItemsPerCategory[ category ],
			injectTrigger: 'prpl/suggestedTask/injectItem',
			injectTriggerArgsCallback: ( todoItem ) => {
				return {
					item: todoItem,
					listId: 'prpl-suggested-tasks-list',
					insertPosition: 'beforeend',
				};
			},
			afterRequestComplete: prplSuggestedTasksToggleUIitems,
		} );

		// Inject pending tasks.
		prplSuggestedTask.injectItems( {
			category,
			status: [ 'pending' ],
			per_page: 100, // Inject all pending tasks at once.
			injectTrigger: 'prpl/suggestedTask/injectItem',
			injectTriggerArgsCallback: ( todoItem ) => {
				return {
					item: todoItem,
					listId: 'prpl-suggested-tasks-list',
					insertPosition: 'beforeend',
				};
			},
			afterRequestComplete: ( data ) => {
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
					}, 3000 );
				}
			},
		} );
	}
};

// Listen for the event.
document.addEventListener(
	'prpl/suggestedTask/maybeInjectItem',
	( e ) => {
		// TODO: Something seems off here, take a look at this.
		// TODO: This is called only for RR tasks.
		prplSuggestedTask.injectItems( {
			category: e.detail.category,
			status: e.detail.status,
			afterRequestComplete: prplSuggestedTasksToggleUIitems,
			injectTrigger: 'prpl/suggestedTask/injectItem',
			injectTriggerArgsCallback: ( todoItem ) => {
				return {
					item: todoItem,
					listId: 'prpl-suggested-tasks-list',
					insertPosition: 'beforeend',
				};
			},
		} );
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	},
	false
);

/* eslint-enable camelcase */
