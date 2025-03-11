/* global progressPlannerTodo, customElements, prplDocumentReady */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: progress-planner-web-components-prpl-suggested-task, progress-planner-widgets-suggested-tasks
 */

/**
 * Inject a todo item into the DOM.
 *
 * @param {string}  details    The details of the todo item.
 * @param {boolean} addToStart Whether to add the todo item to the start of the list.
 */
const progressPlannerInjectTodoItem = ( details, addToStart ) => {
	// TODO: Inject the todo item into the DOM.
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
		document.getElementById( 'todo-list' ).prepend( todoItemElement );
	} else {
		document.getElementById( 'todo-list' ).appendChild( todoItemElement );
	}
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

const prplCreateUserSuggestedTask = ( content ) => {
	return {
		description: '',
		parent: 0,
		points: 0,
		priority: 'medium',
		task_id: 'user-task-' + crypto.randomUUID(),
		title: content,
		provider_id: 'user',
		category: 'user',
		url: '',
		dismissable: true,
		snoozable: false,
		order: prplGetHighestTodoItemOrder() + 1,
	};
};

const prplSubmitUserSuggestedTask = ( task ) => {
	wp.ajax.post( 'progress_planner_save_user_suggested_task', {
		task,
		nonce: progressPlannerTodo.nonce,
	} );
};

const prplSaveSuggestedUserTasksOrder = () => {
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
};

prplDocumentReady( () => {
	// Inject the existing todo list items into the DOM
	progressPlannerTodo.listItems.forEach( ( todoItem, index, array ) => {
		progressPlannerInjectTodoItem( todoItem );

		// If this is the last item in the array, resize the grid items.
		if ( index === array.length - 1 ) {
			const event = new Event( 'prplResizeAllGridItemsEvent' );
			document.dispatchEvent( event );
		}
	} );

	// When the '#create-todo-item' form is submitted,
	// add a new todo item to the list
	document
		.getElementById( 'create-todo-item' )
		.addEventListener( 'submit', ( event ) => {
			event.preventDefault();
			const newTask = prplCreateUserSuggestedTask(
				document.getElementById( 'new-todo-content' ).value
			);
			progressPlannerInjectTodoItem( newTask );
			prplSubmitUserSuggestedTask( newTask );

			document.getElementById( 'new-todo-content' ).value = '';

			// Focus the new task input element.
			document.getElementById( 'new-todo-content' ).focus();
		} );
} );

// When the 'prplMoveSuggestedTaskEvent' event is triggered,
// update the order of the todo items.
document.addEventListener( 'prplMoveSuggestedTaskEvent', () => {
	prplSaveSuggestedUserTasksOrder();
} );
