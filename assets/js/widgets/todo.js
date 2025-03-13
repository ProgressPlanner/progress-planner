/* global progressPlannerTodo, customElements, prplDocumentReady */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: progress-planner-web-components-prpl-suggested-task, progress-planner-widgets-suggested-tasks
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

document.addEventListener( 'progressPlannerInjectTodoItem', ( event ) => {
	const details = event.detail.item;
	const addToStart = event.detail.addToStart;
	const listId = event.detail.listId;

	const Item = customElements.get( 'prpl-suggested-task' );
	const todoItemElement = new Item( {
		taskId: details.task_id,
		taskTitle: details.title,
		taskDescription: details.description,
		taskPoints: details.points ?? 0,
		taskAction: details.action ?? '',
		taskUrl: details.url ?? '',
		taskDismissable: details.dismissable ?? false,
		taskProviderID: details.providerID ?? '',
		taskCategory: details.category ?? '',
		taskSnoozable: details.snoozable ?? true,
		taskOrder: details.order ?? false,
		taskDeletable: true,
	} );

	if ( addToStart ) {
		document.getElementById( listId ).prepend( todoItemElement );
	} else {
		document.getElementById( listId ).appendChild( todoItemElement );
	}
} );

prplDocumentReady( () => {
	// Inject the existing todo list items into the DOM
	progressPlannerTodo.listItems.forEach( ( todoItem, index, array ) => {
		document.dispatchEvent(
			new CustomEvent( 'progressPlannerInjectTodoItem', {
				detail: {
					item: todoItem,
					addToStart: false,
					listId:
						todoItem.status === 'completed'
							? 'todo-list-completed'
							: 'todo-list',
				},
			} )
		);

		// If this is the last item in the array, resize the grid items.
		if ( index === array.length - 1 ) {
			document.dispatchEvent(
				new CustomEvent( 'prplResizeAllGridItemsEvent' )
			);
		}
	} );

	// When the '#create-todo-item' form is submitted,
	// add a new todo item to the list
	document
		.getElementById( 'create-todo-item' )
		.addEventListener( 'submit', ( event ) => {
			event.preventDefault();
			const newTask = {
				description: '',
				parent: 0,
				points: 0,
				priority: 'medium',
				task_id: 'user-task-' + prplGetRandomUUID(),
				title: document.getElementById( 'new-todo-content' ).value,
				provider_id: 'user',
				category: 'user',
				url: '',
				dismissable: true,
				snoozable: false,
				order: prplGetHighestTodoItemOrder() + 1,
			};

			// Inject the new task into the DOM.
			document.dispatchEvent(
				new CustomEvent( 'progressPlannerInjectTodoItem', {
					detail: {
						item: newTask,
						addToStart: false,
						listId: 'todo-list',
					},
				} )
			);

			// Save the new task.
			wp.ajax.post( 'progress_planner_save_user_suggested_task', {
				task: newTask,
				nonce: progressPlannerTodo.nonce,
			} );

			// Resize the grid items.
			document.dispatchEvent(
				new CustomEvent( 'prplResizeAllGridItemsEvent' )
			);

			// Clear the new task input element.
			document.getElementById( 'new-todo-content' ).value = '';

			// Focus the new task input element.
			document.getElementById( 'new-todo-content' ).focus();
		} );
} );

// When the 'prplMoveSuggestedTaskEvent' event is triggered,
// update the order of the todo items.
document.addEventListener( 'prplMoveSuggestedTaskEvent', () => {
	const todoItemsIDs = [];
	// Get all the todo items.
	const todoItems = document.querySelectorAll(
		'#todo-list .prpl-suggested-task'
	);
	todoItems.forEach( ( todoItem ) => {
		todoItemsIDs.push( todoItem.getAttribute( 'data-task-id' ) );
	} );
	wp.ajax.post( 'progress_planner_save_suggested_user_tasks_order', {
		tasks: todoItemsIDs.toString(),
		nonce: progressPlannerTodo.nonce,
	} );
} );

document.addEventListener( 'prplMaybeInjectSuggestedTaskEvent', ( event ) => {
	setTimeout( () => {
		// Get the todo item.
		progressPlannerTodo.listItems.forEach( ( todoItem, index ) => {
			if (
				todoItem.task_id === event.detail.taskId &&
				'complete' === event.detail.actionType
			) {
				progressPlannerTodo.listItems[ index ].status = 'completed';
				document.dispatchEvent(
					new CustomEvent( 'progressPlannerInjectTodoItem', {
						detail: {
							item: todoItem,
							addToStart: false,
							listId: 'todo-list-completed',
						},
					} )
				);
				document.dispatchEvent(
					new CustomEvent( 'prplResizeAllGridItemsEvent' )
				);
			}
		} );
	}, 2010 );
} );

document
	.getElementById( 'todo-list-completed-details' )
	.addEventListener( 'toggle', () => {
		document.dispatchEvent(
			new CustomEvent( 'prplResizeAllGridItemsEvent' )
		);
	} );
