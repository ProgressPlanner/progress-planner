/* global prplSuggestedTask, prplTerms, prplL10n */
/*
 * Widget: Todo
 *
 * A widget that displays a todo list.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, wp-util, wp-a11y, progress-planner/grid-masonry, progress-planner/celebrate, progress-planner/suggested-task-terms, progress-planner/l10n
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
			if (
				Array.isArray( prplSuggestedTask.tasks.userTasks ) &&
				prplSuggestedTask.tasks.userTasks.length
			) {
				prplSuggestedTask.tasks.userTasks.forEach( ( item ) => {
					// Inject the items into the DOM.
					document.dispatchEvent(
						new CustomEvent( 'prpl/suggestedTask/injectItem', {
							detail: {
								item,
								insertPosition:
									1 === item?.prpl_points
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
			}
			prplTodoWidget.removeLoadingItems();
		} else {
			// Otherwise, inject tasks from the API.
			prplSuggestedTask
				.fetchItems( {
					provider: 'user',
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
										1 === item?.prpl_points
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
			?.addEventListener( 'submit', ( event ) => {
				event.preventDefault();

				// Add the loader.
				prplTodoWidget.addLoader();

				// Create a new post
				const post = new wp.api.models.Prpl_recommendations( {
					// Set the post title.
					title: document.getElementById( 'new-todo-content' ).value,
					status: 'publish',
					// Set the `prpl_recommendations_provider` term.
					prpl_recommendations_provider:
						prplTerms.get( 'provider' ).user.id,
					menu_order: prplTodoWidget.getHighestItemOrder() + 1,
				} );
				post.save().then( ( response ) => {
					if ( ! response.id ) {
						return;
					}
					const newTask = {
						...response,
						meta: {
							prpl_url: '',
							...( response.meta || {} ),
						},
						provider: 'user',
						order: prplTodoWidget.getHighestItemOrder() + 1,
						prpl_points: 0,
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

					// Announce to screen readers.
					prplTodoWidget.announceToScreenReader(
						prplL10n( 'taskAddedSuccessfully' )
					);

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
	 * Announce to screen readers.
	 *
	 * @param {string} message  The message to announce.
	 * @param {string} priority The priority ('polite' or 'assertive').
	 */
	announceToScreenReader: ( message, priority = 'polite' ) => {
		// Use WordPress a11y speak if available.
		if ( 'undefined' !== typeof wp && wp.a11y && wp.a11y.speak ) {
			wp.a11y.speak( message, priority );
		} else {
			// Fallback to ARIA live region.
			const liveRegion = document.getElementById(
				'todo-aria-live-region'
			);
			if ( liveRegion ) {
				liveRegion.textContent = message;
				setTimeout( () => {
					liveRegion.textContent = '';
				}, 1000 );
			}
		}
	},

	/**
	 * Add the loader.
	 */
	addLoader: () => {
		const loader = document.createElement( 'span' );
		const loadingTasksText = prplL10n( 'loadingTasks' );
		loader.className = 'prpl-loader';
		loader.setAttribute( 'role', 'status' );
		loader.setAttribute( 'aria-live', 'polite' );
		loader.innerHTML = `<span class="screen-reader-text">${ loadingTasksText }</span>`;
		document.getElementById( 'todo-list' ).appendChild( loader );
	},

	/**
	 * Remove the loader.
	 */
	removeLoader: () => {
		document.querySelector( '#todo-list .prpl-loader' )?.remove();
	},

	/**
	 * Show the delete all popover.
	 */
	showDeleteAllPopover: () => {
		document
			.getElementById( 'todo-list-completed-delete-all-popover' )
			.showPopover();
	},

	/**
	 * Close the delete all popover.
	 */
	closeDeleteAllPopover: () => {
		document
			.getElementById( 'todo-list-completed-delete-all-popover' )
			.hidePopover();
	},

	/**
	 * Delete all completed tasks and close the popover.
	 */
	deleteAllCompletedTasksAndClosePopover: () => {
		prplTodoWidget.deleteAllCompletedTasks();
		prplTodoWidget.closeDeleteAllPopover();
	},

	/**
	 * Delete all completed tasks.
	 */
	deleteAllCompletedTasks: () => {
		const items = document.querySelectorAll(
			'#todo-list-completed .prpl-suggested-task'
		);
		const itemCount = items.length;

		items.forEach( ( item ) => {
			const postId = parseInt( item.getAttribute( 'data-post-id' ) );
			prplSuggestedTask.trash( postId );
		} );

		// Announce to screen readers.
		const tasksWord =
			itemCount === 1
				? prplL10n( 'taskDeleted' )
				: prplL10n( 'tasksDeleted' );
		prplTodoWidget.announceToScreenReader(
			`${ itemCount } ${ tasksWord }`,
			'assertive'
		);

		// Resize event will be triggered by the trash function.
	},
};

document
	.getElementById( 'todo-list-completed-details' )
	?.addEventListener( 'toggle', () => {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );

// Add event listener for delete all button.
document
	.getElementById( 'todo-list-completed-delete-all' )
	?.addEventListener( 'click', () => {
		prplTodoWidget.showDeleteAllPopover();
	} );

// Add event listener for cancel button in delete all popover.
document
	.getElementById( 'todo-list-completed-delete-all-cancel' )
	?.addEventListener( 'click', () => {
		prplTodoWidget.closeDeleteAllPopover();
	} );

// Add event listener for confirm button in delete all popover.
document
	.getElementById( 'todo-list-completed-delete-all-confirm' )
	?.addEventListener( 'click', () => {
		prplTodoWidget.deleteAllCompletedTasksAndClosePopover();
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
