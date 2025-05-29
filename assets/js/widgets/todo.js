/* global customElements, prplDocumentReady */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: wp-api, progress-planner/web-components/prpl-suggested-task, wp-util, wp-a11y, progress-planner/grid-masonry, progress-planner/document-ready, progress-planner/celebrate, progress-planner/suggested-task-terms
 */

/**
 * The user terms for the todo list.
 *
 * @type {Object}
 */
window.progressPlannerTodo = {
	tasks: [],
};

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

document.addEventListener( 'prpl/todo/injectItem', ( event ) => {
	const Item = customElements.get( 'prpl-suggested-task' );
	const todoItemElement = new Item( {
		post: {
			...event.detail.item,
			meta: {
				...event.detail.item.meta,
				prpl_snoozable: false,
				prpl_dismissable: true,
			},
		},
		deletable: true,
		allowReorder: true,
	} );

	if ( event.detail.addToStart ) {
		document
			.getElementById( event.detail.listId )
			.prepend( todoItemElement );
	} else {
		document
			.getElementById( event.detail.listId )
			.appendChild( todoItemElement );
	}
} );

prplDocumentReady( () => {
	document.dispatchEvent(
		new CustomEvent( 'prpl/suggestedTask/injectCategoryItems', {
			detail: {
				category: 'user',
				status: 'publish',
				injectTrigger: 'prpl/todo/injectItem',
				injectTriggerArgsCallback: ( todoItem ) => {
					return {
						item: todoItem,
						addToStart: 1 === todoItem?.meta?.prpl_points, // Add golden task to the start of the list.
						listId:
							todoItem.status === 'completed'
								? 'todo-list-completed'
								: 'todo-list',
					};
				},
				afterInject: () => {
					document
						.querySelector( '#prpl-todo-list-loading' )
						.remove();
					// Resize the grid items.
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				},
			},
		} )
	);

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
						window.progressPlannerSuggestedTasksTerms
							.prpl_recommendations_category.user.id,
					// Set the `prpl_recommendations_provider` term.
					prpl_recommendations_provider:
						window.progressPlannerSuggestedTasksTerms
							.prpl_recommendations_provider.user.id,
					menu_order: prplGetHighestTodoItemOrder() + 1,
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
						new CustomEvent( 'prpl/todo/injectItem', {
							detail: {
								item: newTask,
								addToStart: 1 === newTask.points, // Add golden task to the start of the list.
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

// When the 'prpl/suggestedTask/move' event is triggered,
// update the menu_order of the todo items.
document.addEventListener( 'prpl/suggestedTask/move', () => {
	const todoItemsIDs = [];
	// Get all the todo items.
	const todoItems = document.querySelectorAll(
		'#todo-list .prpl-suggested-task'
	);
	let menuOrder = 0;
	todoItems.forEach( ( todoItem ) => {
		const itemID = parseInt( todoItem.getAttribute( 'data-post-id' ) );
		todoItemsIDs.push( itemID );
		todoItem.setAttribute( 'data-task-order', menuOrder );
		window.progressPlannerTodo.tasks.find(
			( item ) => item.id === itemID
		).menu_order = menuOrder;

		document
			.querySelector(
				`#todo-list .prpl-suggested-task[data-post-id="${ itemID }"]`
			)
			.setAttribute( 'data-task-order', menuOrder );

		wp.api.loadPromise.done( () => {
			// Update an existing post.
			const post = new wp.api.models.Prpl_recommendations( {
				id: itemID,
				menu_order: menuOrder,
			} );
			post.save();
		} );
		menuOrder++;
	} );
} );

// When the 'prpl/suggestedTask/update' event is triggered,
// update the task title in the tasks array.
document.addEventListener( 'prpl/suggestedTask/update', ( event ) => {
	const task = window.progressPlannerTodo.tasks.find(
		( item ) =>
			item?.meta?.prpl_task_id ===
			event.detail.node
				.querySelector( 'li' )
				.getAttribute( 'data-task-id' )
	);

	if ( task ) {
		task.title = {
			rendered: event.detail.node.querySelector( 'h3 span' ).textContent,
		};
	}
} );

document.addEventListener( 'prpl/suggestedTask/maybeInjectItem', ( event ) => {
	if (
		'complete' !== event.detail.actionType &&
		'pending' !== event.detail.actionType
	) {
		return;
	}

	setTimeout( () => {
		window.progressPlannerTodo.tasks.forEach( ( todoItem, index ) => {
			if (
				todoItem?.meta?.prpl_task_id ===
				event.detail?.meta?.prpl_task_id
			) {
				// Change the status.
				window.progressPlannerTodo.tasks[ index ].status =
					'complete' === event.detail.actionType
						? 'completed'
						: 'pending';

				// Inject the todo item into the DOM.
				document.dispatchEvent(
					new CustomEvent( 'prpl/todo/injectItem', {
						detail: {
							item: todoItem,
							addToStart: 1 === todoItem.points, // Add golden task to the start of the list.
							listId:
								'complete' === event.detail.actionType
									? 'todo-list-completed'
									: 'todo-list',
						},
					} )
				);

				// Remove item from completed-todos list if necessary.
				if ( 'pending' === event.detail.actionType ) {
					const el = document.querySelector(
						`#todo-list-completed .prpl-suggested-task[data-task-id="${ todoItem?.meta?.prpl_task_id }"]`
					);
					if ( el ) {
						el.parentNode.remove();
					}
				}

				// Resize the grid items.
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}
		} );
	}, 10 );
} );

document
	.getElementById( 'todo-list-completed-details' )
	.addEventListener( 'toggle', () => {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );
