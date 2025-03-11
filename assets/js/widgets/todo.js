/* global progressPlannerTodo, customElements, prplDocumentReady, prplSuggestedTasks */
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
 * @param {boolean} save       Whether to save the todo list to the database.
 */
const progressPlannerInjectTodoItem = ( details, addToStart, save ) => {
	// TODO: Inject the todo item into the DOM.
	const Item = customElements.get( 'prpl-suggested-task' );
	const todoItemElement = new Item( {
		taskId: details.task_id,
		taskTitle: details.title,
		taskDescription: details.description,
		taskPoints: details.points ?? 1,
		taskAction: details.action ?? '',
		taskUrl: details.url ?? '',
		taskDismissable: details.dismissable ?? false,
		taskProviderID: details.providerID ?? '',
		taskCategory: details.category ?? '',
		taskSnoozable: details.snoozable ?? true,
	} );

	if ( addToStart ) {
		document.getElementById( 'todo-list' ).prepend( todoItemElement );
	} else {
		document.getElementById( 'todo-list' ).appendChild( todoItemElement );
	}

	if ( save ) {
		// TODO: Save the todo item to the database.
	}
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
	};
};

const prplSubmitUserSuggestedTask = ( task ) => {
	wp.ajax.post( 'progress_planner_save_user_suggested_task', {
		task,
		nonce: prplSuggestedTasks.nonce,
	} );
};

// When the '#create-suggested-item' form is submitted,
// add a new todo item to the list
document
	.getElementById( 'create-suggested-item' )
	.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		const userTask = prplCreateUserSuggestedTask(
			document.getElementById( 'new-suggested-item-content' ).value
		);
		prplSubmitUserSuggestedTask( userTask );

		document.getElementById( 'new-suggested-item-content' ).value = '';

		// Focus the new task input element.
		document.getElementById( 'new-suggested-item-content' ).focus();
	} );

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
