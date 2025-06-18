/* global prplSuggestedTask, prplTerms */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, wp-util, wp-a11y, progress-planner/grid-masonry, progress-planner/celebrate, progress-planner/suggested-task-terms
 */

const prplTodoWidget = {
	/**
	 * Get the highest `order` value from the todo items.
	 *
	 * @return {number} The highest `order` value.
	 */
	getHighestItemOrder: () => {
		const items = document.querySelectorAll(
			'#todo-list .prpl-suggested-task'
		);
		let highestOrder = 0;
		items.forEach( ( item ) => {
			highestOrder = Math.max(
				parseInt( item.getAttribute( 'data-task-order' ) ),
				highestOrder
			);
		} );
		return highestOrder;
	},

	/**
	 * Remove the "Loading..." text and resize the grid items.
	 */
	removeLoadingItems: () => {
		// Remove the "Loading..." text.
		document.querySelector( '#prpl-todo-list-loading' )?.remove();

		// Resize the grid items.
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	},

	/**
	 * Populate the todo list.
	 */
	populateList: () => {
		// If preloaded tasks are available, inject them.
		if ( 'undefined' !== typeof prplSuggestedTask.tasks ) {
			// Inject the tasks.
			if ( Object.keys( prplSuggestedTask.tasks.userTasks ).length ) {
				Object.values( prplSuggestedTask.tasks.userTasks ).forEach(
					( item ) => {
						// Inject the items into the DOM.
						document.dispatchEvent(
							new CustomEvent( 'prpl/suggestedTask/injectItem', {
								detail: {
									item,
									insertPosition:
										1 === item?.meta?.prpl_points
											? 'afterbegin' // Add golden task to the start of the list.
											: 'beforeend',
									listId:
										item.status === 'publish'
											? 'todo-list'
											: 'todo-list-completed',
								},
							} )
						);
						prplSuggestedTask.injectedItemIds.push( item.id );
					}
				);
				prplTodoWidget.removeLoadingItems();
			}
		} else {
			// Otherwise, inject tasks from the API.
			prplSuggestedTask
				.fetchItems( {
					category: 'user',
					status: [ 'publish', 'trash' ],
					per_page: 100,
				} )
				.then( ( data ) => {
					if ( ! data.length ) {
						return data;
					}

					// Inject the items into the DOM.
					data.forEach( ( item ) => {
						document.dispatchEvent(
							new CustomEvent( 'prpl/suggestedTask/injectItem', {
								detail: {
									item,
									insertPosition:
										1 === item?.meta?.prpl_points
											? 'afterbegin' // Add golden task to the start of the list.
											: 'beforeend',
									listId:
										item.status === 'publish'
											? 'todo-list'
											: 'todo-list-completed',
								},
							} )
						);
						prplSuggestedTask.injectedItemIds.push( item.id );
					} );

					return data;
				} )
				.then( () => prplTodoWidget.removeLoadingItems() );
		}

		// When the '#create-todo-item' form is submitted,
		// add a new todo item to the list
		document
			.getElementById( 'create-todo-item' )
			.addEventListener( 'submit', ( event ) => {
				event.preventDefault();

				// Add the loader.
				prplTodoWidget.addLoader();

				// Create a new post
				const post = new wp.api.models.Prpl_recommendations( {
					// Set the post title.
					title: document.getElementById( 'new-todo-content' ).value,
					status: 'publish',
					// Set the `prpl_recommendations_category` term.
					prpl_recommendations_category:
						prplTerms.get( 'category' ).user.id,
					// Set the `prpl_recommendations_provider` term.
					prpl_recommendations_provider:
						prplTerms.get( 'provider' ).user.id,
					menu_order: prplTodoWidget.getHighestItemOrder() + 1,
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
							prpl_points: 0,
							prpl_snoozable: false,
							prpl_dismissable: true,
							prpl_url: '',
							prpl_url_target: '_self',
							...( response.meta || {} ),
						},
						provider: 'user',
						category: 'user',
						order: prplTodoWidget.getHighestItemOrder() + 1,
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

					// Remove the loader.
					prplTodoWidget.removeLoader();

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
	},

	/**
	 * Add the loader.
	 */
	addLoader: () => {
		const loader = document.createElement( 'span' );
		loader.className = 'prpl-loader';
		document.getElementById( 'todo-list' ).appendChild( loader );
	},

	/**
	 * Remove the loader.
	 */
	removeLoader: () => {
		document.querySelector( '#todo-list .prpl-loader' )?.remove();
	},
};

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
		items.forEach( ( item ) => item.remove() );

		// Inject the ordered items back into the list.
		orderedItems.forEach( ( item ) =>
			document.getElementById( event.detail.listId ).appendChild( item )
		);

		// Resize the grid items.
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );
} );
