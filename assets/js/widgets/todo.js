/* global progressPlannerTodo, customElements, prplDocumentReady */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: progress-planner/web-components/prpl-suggested-task, wp-util, wp-a11y, progress-planner/ajax-request, progress-planner/grid-masonry, progress-planner/document-ready, progress-planner/celebrate
 */

/**
 * Get a random UUID.
 *
 * @return {string} The random UUID.
 */
const prplGetRandomUUID = () => {
	if (
		typeof crypto !== 'undefined' &&
		typeof crypto.randomUUID === 'function'
	) {
		return crypto.randomUUID();
	}
	return (
		Math.random().toString( 36 ).substring( 2, 15 ) +
		Math.random().toString( 36 ).substring( 2, 15 )
	);
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
	const details = event.detail.item;
	const addToStart = event.detail.addToStart;
	const listId = event.detail.listId;

	const Item = customElements.get( 'prpl-suggested-task' );
	const todoItemElement = new Item( {
		...details,
		deletable: true,
		taskList: 'progressPlannerTodo',
	} );

	if ( addToStart ) {
		document.getElementById( listId ).prepend( todoItemElement );
	} else {
		document.getElementById( listId ).appendChild( todoItemElement );
	}
} );

prplDocumentReady( () => {
	// Inject the existing todo list items into the DOM
	progressPlannerTodo.tasks.forEach( ( todoItem, index, array ) => {
		document.dispatchEvent(
			new CustomEvent( 'prpl/todo/injectItem', {
				detail: {
					item: todoItem,
					addToStart: 1 === todoItem.points, // Add golden task to the start of the list.
					listId:
						todoItem.status === 'completed'
							? 'todo-list-completed'
							: 'todo-list',
				},
			} )
		);

		// If this is the last item in the array, resize the grid items.
		if ( index === array.length - 1 ) {
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		}
	} );

	// When the '#create-todo-item' form is submitted,
	// add a new todo item to the list
	document
		.getElementById( 'create-todo-item' )
		.addEventListener( 'submit', ( event ) => {
			event.preventDefault();
			const getUserTerm = ( taxonomy ) => {
				// Use `categories` or `providers`.
				return progressPlannerTodo[ taxonomy ].find(
					( term ) => 'user' === term.slug
				);
			};

			const newTask = {
				description: '',
				parent: 0,
				points: 0,
				task_id: 'user-task-' + prplGetRandomUUID(),
				post_title: document.getElementById( 'new-todo-content' ).value,
				provider: getUserTerm( 'providers' ),
				category: getUserTerm( 'categories' ),
				url: '',
				dismissable: true,
				snoozable: false,
				order: prplGetHighestTodoItemOrder() + 1,
			};

			// Save the new task.
			wp.ajax
				.post( 'progress_planner_save_user_suggested_task', {
					task: newTask,
					nonce: progressPlannerTodo.nonce,
				} )
				.then( ( response ) => {
					if ( 'undefined' !== typeof response.points ) {
						newTask.points = response.points;
					}

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

					// Add the new task to the tasks array.
					progressPlannerTodo.tasks.push( newTask );

					// Resize the grid items.
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				} );

			// Clear the new task input element.
			document.getElementById( 'new-todo-content' ).value = '';

			// Focus the new task input element.
			document.getElementById( 'new-todo-content' ).focus();
		} );
} );

// When the 'prpl/suggestedTask/move' event is triggered,
// update the order of the todo items.
document.addEventListener( 'prpl/suggestedTask/move', () => {
	const todoItemsIDs = [];
	// Get all the todo items.
	const todoItems = document.querySelectorAll(
		'#todo-list .prpl-suggested-task'
	);
	let order = 0;
	todoItems.forEach( ( todoItem ) => {
		todoItemsIDs.push( todoItem.getAttribute( 'data-task-id' ) );
		todoItem.setAttribute( 'data-task-order', order );
		progressPlannerTodo.tasks.find(
			( item ) => item.task_id === todoItem.getAttribute( 'data-task-id' )
		).order = order;
		order++;
	} );
	wp.ajax.post( 'progress_planner_save_suggested_user_tasks_order', {
		tasks: todoItemsIDs.toString(),
		nonce: progressPlannerTodo.nonce,
	} );
} );

// When the 'prpl/suggestedTask/update' event is triggered,
// update the task title in the tasks array.
document.addEventListener( 'prpl/suggestedTask/update', ( event ) => {
	const task = progressPlannerTodo.tasks.find(
		( item ) =>
			item.task_id ===
			event.detail.node
				.querySelector( 'li' )
				.getAttribute( 'data-task-id' )
	);

	if ( task ) {
		task.title = event.detail.node.querySelector( 'h3 span' ).textContent;
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
		progressPlannerTodo.tasks.forEach( ( todoItem, index ) => {
			if ( todoItem.task_id === event.detail.task_id ) {
				// Change the status.
				progressPlannerTodo.tasks[ index ].status =
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
						`#todo-list-completed .prpl-suggested-task[data-task-id="${ todoItem.task_id }"]`
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
