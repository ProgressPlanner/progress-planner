/* global prplSuggestedTask, prplDocumentReady */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, wp-util, wp-a11y, progress-planner/grid-masonry, progress-planner/document-ready, progress-planner/celebrate, progress-planner/suggested-task-terms
 */

/**
 * Get the highest `order` value from the todo items.
 *
 * @return {number} The highest `order` value.
 */
const prplGetHighestTodoItemOrder = () => {
	const todoItems = document.querySelectorAll(
		'#todo-list .prpl-suggested-task'
	);
	let highestOrder = 0;
	todoItems.forEach( ( todoItem ) => {
		const order = parseInt( todoItem.getAttribute( 'data-task-order' ) );
		if ( order > highestOrder ) {
			highestOrder = order;
		}
	} );
	return highestOrder;
};

prplDocumentReady( () => {
	prplSuggestedTask.injectItems( {
		category: 'user',
		status: 'publish',
		injectTrigger: 'prpl/suggestedTask/injectItem',
		injectTriggerArgsCallback: ( todoItem ) => {
			return {
				item: todoItem,
				insertPosition:
					1 === todoItem?.meta?.prpl_points
						? 'afterbegin' // Add golden task to the start of the list.
						: 'beforeend',
				listId:
					todoItem.status === 'completed'
						? 'todo-list-completed'
						: 'todo-list',
			};
		},
		afterInject: () => {
			const el = document.querySelector( '#prpl-todo-list-loading' );
			if ( el ) {
				el.remove();
			}
			// Resize the grid items.
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		},
	} );

	// When the '#create-todo-item' form is submitted,
	// add a new todo item to the list
	document
		.getElementById( 'create-todo-item' )
		.addEventListener( 'submit', ( event ) => {
			event.preventDefault();

			wp.api.loadPromise.done( () => {
				// Create a new post
				const post = new wp.api.models.Prpl_recommendations( {
					// Set the post title.
					title: document.getElementById( 'new-todo-content' ).value,
					status: 'publish',
					// Set the `prpl_recommendations_category` term.
					prpl_recommendations_category:
						window.prplSuggestedTasksTerms
							.prpl_recommendations_category.user.id,
					// Set the `prpl_recommendations_provider` term.
					prpl_recommendations_provider:
						window.prplSuggestedTasksTerms
							.prpl_recommendations_provider.user.id,
					menu_order: prplGetHighestTodoItemOrder() + 1,
					meta: {
						prpl_snoozable: false,
						prpl_dismissable: true,
					},
				} );
				post.save().then( ( response ) => {
					if ( ! response.id ) {
						return;
					}
					const newTask = {
						...response,
						meta: {
							...response.meta,
							prpl_points: 0,
							prpl_snoozable: false,
							prpl_dismissable: true,
							prpl_url: '',
							prpl_url_target: '_self',
						},
						provider: 'user',
						category: 'user',
						order: prplGetHighestTodoItemOrder() + 1,
					};

					// Inject the new task into the DOM.
					document.dispatchEvent(
						new CustomEvent( 'prpl/suggestedTask/injectItem', {
							detail: {
								item: newTask,
								insertPosition:
									1 === newTask.points
										? 'afterbegin'
										: 'beforeend', // Add golden task to the start of the list.
								listId: 'todo-list',
							},
						} )
					);

					// Resize the grid items.
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				} );
			} );

			// Clear the new task input element.
			document.getElementById( 'new-todo-content' ).value = '';

			// Focus the new task input element.
			document.getElementById( 'new-todo-content' ).focus();
		} );
} );

document
	.getElementById( 'todo-list-completed-details' )
	.addEventListener( 'toggle', () => {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );

document.addEventListener( 'prpl/suggestedTask/itemInjected', ( event ) => {
	if ( 'todo-list' !== event.detail.listId ) {
		return;
	}
	setTimeout( () => {
		// Get all items in the list.
		const items = document.querySelectorAll(
			`#${ event.detail.listId } .prpl-suggested-task`
		);

		// Reorder items based on their `data-task-order` attribute.
		const orderedItems = Array.from( items ).sort( ( a, b ) => {
			return (
				parseInt( a.getAttribute( 'data-task-order' ) ) -
				parseInt( b.getAttribute( 'data-task-order' ) )
			);
		} );

		// Remove all items from the list.
		items.forEach( ( item ) => {
			item.remove();
		} );

		// Inject the ordered items back into the list.
		orderedItems.forEach( ( item ) => {
			document.getElementById( event.detail.listId ).appendChild( item );
		} );

		// Resize the grid items.
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );
} );
