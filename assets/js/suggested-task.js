/* global HTMLElement, prplSuggestedTask, prplL10n, prplUpdateRaviGauge, prplTerms, prplSuggestedTasksWidget */
/*
 * Suggested Task scripts & helpers.
 *
 * Dependencies: wp-api, progress-planner/l10n, progress-planner/suggested-task-terms, progress-planner/web-components/prpl-gauge, progress-planner/widgets/suggested-tasks
 */
/* eslint-disable camelcase, jsdoc/require-param-type, jsdoc/require-param, jsdoc/check-param-names */

prplSuggestedTask = {
	...prplSuggestedTask,
	injectedItemIds: [],
	l10n: {
		info: prplL10n( 'info' ),
		moveUp: prplL10n( 'moveUp' ),
		moveDown: prplL10n( 'moveDown' ),
		snooze: prplL10n( 'snooze' ),
		snoozeThisTask: prplL10n( 'snoozeThisTask' ),
		howLong: prplL10n( 'howLong' ),
		snoozeDurationOneWeek: prplL10n( 'snoozeDurationOneWeek' ),
		snoozeDurationOneMonth: prplL10n( 'snoozeDurationOneMonth' ),
		snoozeDurationThreeMonths: prplL10n( 'snoozeDurationThreeMonths' ),
		snoozeDurationSixMonths: prplL10n( 'snoozeDurationSixMonths' ),
		snoozeDurationOneYear: prplL10n( 'snoozeDurationOneYear' ),
		snoozeDurationForever: prplL10n( 'snoozeDurationForever' ),
		disabledRRCheckboxTooltip: prplL10n( 'disabledRRCheckboxTooltip' ),
		markAsComplete: prplL10n( 'markAsComplete' ),
	},

	/**
	 * Fetch items for arguments.
	 *
	 * @param {Object} args The arguments to pass to the injectItems method.
	 * @return {Promise} A promise that resolves with the collection of posts.
	 */
	fetchItems: ( args ) => {
		console.info(
			`Fetching recommendations with args: ${ JSON.stringify( args ) }...`
		);

		const fetchData = {
			status: args.status,
			per_page: args.per_page || 1,
			_embed: true,
			exclude: prplSuggestedTask.injectedItemIds,
			filter: {
				orderby: 'menu_order',
				order: 'ASC',
			},
		};
		if ( args.category ) {
			fetchData[ prplTerms.category ] =
				prplTerms.get( 'category' )[ args.category ].id;
		}

		return prplSuggestedTask
			.getPostsCollectionPromise( { data: fetchData } )
			.then( ( response ) => response.data );
	},

	/**
	 * Inject items from a category.
	 *
	 * @param {string}   taskCategorySlug The task category slug.
	 * @param {string[]} taskStatus       The task status.
	 */
	injectItemsFromCategory: ( args ) =>
		prplSuggestedTask
			.fetchItems( {
				category: args.category,
				status: args.status || [ 'publish' ],
				per_page: args.per_page || 1,
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
						prplSuggestedTask.injectedItemIds.push( item.id );
					} );
				}

				return data;
			} )
			.then( ( data ) => {
				// Toggle the "Loading..." text.
				prplSuggestedTasksWidget.removeLoadingItems();

				// Trigger the grid resize event.
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );

				return data;
			} ),

	/**
	 * Get a collection of posts.
	 *
	 * @param {Object} fetchArgs The arguments to pass to the fetch method.
	 * @return {Promise} A promise that resolves with the collection of posts.
	 */
	getPostsCollectionPromise: ( fetchArgs ) => {
		const collectionsPromise = new Promise( ( resolve ) => {
			const postsCollection =
				new wp.api.collections.Prpl_recommendations();
			postsCollection
				.fetch( fetchArgs )
				.done( ( data ) => resolve( { data, postsCollection } ) );
		} );

		return collectionsPromise;
	},

	/**
	 * Render a new item.
	 *
	 * @param {Object}  post        The post object.
	 * @param {boolean} useCheckbox Whether to use a checkbox.
	 */
	getNewItemTemplatePromise: ( {
		post = {},
		useCheckbox = true,
		listId = '',
	} ) =>
		new Promise( ( resolve ) => {
			const {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			} = post;
			const terms = {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			};

			Object.values( prplTerms.get( 'provider' ) ).forEach( ( term ) => {
				if ( term.id === terms[ prplTerms.provider ][ 0 ] ) {
					terms[ prplTerms.provider ] = term;
				}
			} );

			Object.values( prplTerms.get( 'category' ) ).forEach( ( term ) => {
				if ( term.id === terms[ prplTerms.category ][ 0 ] ) {
					terms[ prplTerms.category ] = term;
				}
			} );

			const template = wp.template( 'prpl-suggested-task' );
			const data = {
				post,
				terms,
				useCheckbox,
				listId,
				assets: prplSuggestedTask.assets,
				action: 'pending' === post.status ? 'celebrate' : '',
				l10n: prplSuggestedTask.l10n,
			};

			resolve( template( data ) );
		} ),

	/**
	 * Run a task action.
	 *
	 * @param {number} postId     The post ID.
	 * @param {string} actionType The action type.
	 * @return {Promise} A promise that resolves with the response from the server.
	 */
	runTaskAction: ( postId, actionType ) =>
		wp.ajax.post( 'progress_planner_suggested_task_action', {
			post_id: postId,
			nonce: prplSuggestedTask.nonce,
			action_type: actionType,
		} ),

	/**
	 * Trash (delete) a task.
	 * Only user tasks can be trashed.
	 *
	 * @param {number} postId The post ID.
	 */
	trash: ( postId ) => {
		const post = new wp.api.models.Prpl_recommendations( {
			id: postId,
		} );
		post.fetch().then( () => {
			post.destroy( { data: { force: true } } ).then( () => {
				// Remove the task from the todo list.
				prplSuggestedTask.removeTaskElement( postId );
				setTimeout(
					() =>
						window.dispatchEvent(
							new CustomEvent( 'prpl/grid/resize' )
						),
					500
				);

				prplSuggestedTask.runTaskAction( postId, 'delete' );
			} );
		} );
	},

	/**
	 * Maybe complete a task.
	 *
	 * @param {number} postId The post ID.
	 */
	maybeComplete: ( postId ) => {
		// Get the task.
		const post = new wp.api.models.Prpl_recommendations( { id: postId } );
		post.fetch().then( ( postData ) => {
			const taskProviderId = prplTerms.getTerm(
				postData?.[ prplTerms.provider ],
				prplTerms.provider
			).slug;
			const taskCategorySlug = prplTerms.getTerm(
				postData?.[ prplTerms.category ],
				prplTerms.category
			).slug;

			// Dismissable tasks don't have pending status, it's either publish or trash.
			const newStatus =
				'publish' === postData.status ? 'trash' : 'publish';

			post.set( 'status', newStatus )
				.save()
				.then( () => {
					prplSuggestedTask.runTaskAction(
						postId,
						'trash' === newStatus ? 'complete' : 'pending'
					);
					const el = prplSuggestedTask.getTaskElement( postId );
					const eventPoints = parseInt( postData?.meta?.prpl_points );

					// Task is trashed, check if we need to celebrate.
					if ( 'trash' === newStatus ) {
						el.setAttribute( 'data-task-action', 'celebrate' );

						if ( 'user' === taskProviderId ) {
							const delay = eventPoints ? 2000 : 0;

							// Set class to trigger strike through animation.
							if ( 0 < eventPoints ) {
								el.classList.add(
									'prpl-suggested-task-celebrated'
								);
							}

							setTimeout( () => {
								// Move task from published to trash.
								document
									.getElementById( 'todo-list-completed' )
									.insertAdjacentElement( 'beforeend', el );

								// Remove the class to trigger the strike through animation.
								el.classList.remove(
									'prpl-suggested-task-celebrated'
								);

								window.dispatchEvent(
									new CustomEvent( 'prpl/grid/resize' )
								);
							}, delay );
						} else {
							/**
							 * Strike completed tasks and remove them from the DOM.
							 */
							document.dispatchEvent(
								new CustomEvent( 'prpl/removeCelebratedTasks' )
							);

							// Inject more tasks from the same category.
							prplSuggestedTask.injectItemsFromCategory( {
								category: taskCategorySlug,
								status: [ 'publish' ],
							} );
						}

						// We trigger celebration only if the task has points.
						if ( 0 < eventPoints ) {
							prplUpdateRaviGauge( eventPoints );

							// Trigger the celebration event (confetti).
							document.dispatchEvent(
								new CustomEvent( 'prpl/celebrateTasks', {
									detail: { element: el },
								} )
							);
						}
					} else if ( 'publish' === newStatus ) {
						// This is only possible for user tasks.
						if ( 'user' === taskProviderId ) {
							// Set the task action to publish.
							el.setAttribute( 'data-task-action', 'publish' );

							// Update the Ravi gauge.
							prplUpdateRaviGauge( 0 - eventPoints );

							// Move task from trash to published.
							document
								.getElementById( 'todo-list' )
								.insertAdjacentElement( 'beforeend', el );

							window.dispatchEvent(
								new CustomEvent( 'prpl/grid/resize' )
							);
						}
					}
				} );
		} );
	},

	/**
	 * Snooze a task.
	 *
	 * @param {number} postId         The post ID.
	 * @param {string} snoozeDuration The snooze duration.
	 */
	snooze: ( postId, snoozeDuration ) => {
		const snoozeDurationMap = {
			'1-week': 7,
			'2-weeks': 14,
			'1-month': 30,
			'3-months': 90,
			'6-months': 180,
			'1-year': 365,
			forever: 3650,
		};

		const snoozeDurationDays = snoozeDurationMap[ snoozeDuration ];
		const date = new Date(
			Date.now() + snoozeDurationDays * 24 * 60 * 60 * 1000
		)
			.toISOString()
			.split( '.' )[ 0 ];
		const postModelToSave = new wp.api.models.Prpl_recommendations( {
			id: postId,
			status: 'future',
			date,
			date_gmt: date,
		} );
		postModelToSave.save().then( ( postData ) => {
			const taskCategorySlug = window.prplGetTermObject(
				postData?.[ prplTerms.category ],
				prplTerms.category
			).slug;

			prplSuggestedTask.removeTaskElement( postId );

			// Inject more tasks from the same category.
			prplSuggestedTask.injectItemsFromCategory( {
				category: taskCategorySlug,
				status: [ 'publish' ],
			} );
		} );
	},

	/**
	 * Run a tooltip action.
	 *
	 * @param {HTMLElement} button The button that was clicked.
	 */
	runButtonAction: ( button ) => {
		let action = button.getAttribute( 'data-action' );
		const target = button.getAttribute( 'data-target' );
		const item = button.closest( 'li.prpl-suggested-task' );
		const tooltipActions = item.querySelector( '.tooltip-actions' );
		const elClass = '.prpl-suggested-task-' + target;

		// If the tooltip was already open, close it.
		if (
			!! tooltipActions.querySelector(
				`${ elClass }[data-tooltip-visible]`
			)
		) {
			action = 'close-' + target;
		} else {
			const closestTaskListVisible = item
				.closest( '.prpl-suggested-tasks-list' )
				.querySelector( `[data-tooltip-visible]` );
			// Close the any opened radio group.
			closestTaskListVisible?.classList.remove(
				'prpl-toggle-radio-group-open'
			);
			// Remove any existing tooltip visible attribute, in the entire list.
			closestTaskListVisible?.removeAttribute( 'data-tooltip-visible' );
		}

		switch ( action ) {
			case 'snooze':
				tooltipActions
					.querySelector( elClass )
					?.setAttribute( 'data-tooltip-visible', 'true' );
				break;

			case 'close-snooze':
				// Close the radio group.
				tooltipActions
					.querySelector(
						`${ elClass }.prpl-toggle-radio-group-open`
					)
					?.classList.remove( 'prpl-toggle-radio-group-open' );
				// Close the tooltip.
				tooltipActions
					.querySelector( `${ elClass }[data-tooltip-visible]` )
					?.removeAttribute( 'data-tooltip-visible' );
				break;

			case 'info':
				tooltipActions
					.querySelector( elClass )
					?.setAttribute( 'data-tooltip-visible', 'true' );
				break;

			case 'close-info':
				tooltipActions
					.querySelector( elClass )
					.removeAttribute( 'data-tooltip-visible' );
				break;

			case 'move-up':
			case 'move-down':
				if ( 'move-up' === action && item.previousElementSibling ) {
					item.parentNode.insertBefore(
						item,
						item.previousElementSibling
					);
				} else if (
					'move-down' === action &&
					item.nextElementSibling
				) {
					item.parentNode.insertBefore(
						item.nextElementSibling,
						item
					);
				}
				// Trigger a custom event.
				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/move', {
						detail: { node: item },
					} )
				);
				break;
		}
	},

	/**
	 * Update the task title.
	 *
	 * @param {HTMLElement} el The element that was edited.
	 */
	updateTaskTitle: ( el ) => {
		// Add debounce to the input event.
		clearTimeout( this.debounceTimeout );
		this.debounceTimeout = setTimeout( () => {
			// Update an existing post.
			const title = el.textContent.replace( /\n/g, '' );
			const postModel = new wp.api.models.Prpl_recommendations( {
				id: parseInt( el.getAttribute( 'data-post-id' ) ),
				title,
			} );
			postModel.save().then( () =>
				// Update the task title.
				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/update', {
						detail: {
							node: el.closest( 'li.prpl-suggested-task' ),
						},
					} )
				)
			);
			el
				.closest( 'li.prpl-suggested-task' )
				.querySelector(
					'label:has(.prpl-suggested-task-checkbox) .screen-reader-text'
				).innerHTML = `${ title }: ${ prplL10n( 'markAsComplete' ) }`;
		}, 300 );
	},

	/**
	 * Get the task element.
	 *
	 * @param {number} postId The post ID.
	 * @return {HTMLElement} The task element.
	 */
	getTaskElement: ( postId ) =>
		document.querySelector(
			`.prpl-suggested-task[data-post-id="${ postId }"]`
		),

	/**
	 * Remove the task element.
	 *
	 * @param {number} postId The post ID.
	 */
	removeTaskElement: ( postId ) =>
		prplSuggestedTask.getTaskElement( postId )?.remove(),
};

/**
 * Inject an item.
 */
document.addEventListener( 'prpl/suggestedTask/injectItem', ( event ) => {
	prplSuggestedTask
		.getNewItemTemplatePromise( {
			post: event.detail.item,
			listId: event.detail.listId,
		} )
		.then( ( itemHTML ) => {
			/**
			 * @todo Implement the parent task functionality.
			 * Use this code: `const parent = event.detail.item.parent && '' !== event.detail.item.parent ? event.detail.item.parent : null;
			 */
			const parent = false;

			if ( ! parent ) {
				// Inject the item into the list.
				document
					.getElementById( event.detail.listId )
					.insertAdjacentHTML(
						event.detail.insertPosition,
						itemHTML
					);

				return;
			}

			// If we could not find the parent item, try again after 500ms.
			window.prplRenderAttempts = window.prplRenderAttempts || 0;
			if ( window.prplRenderAttempts > 20 ) {
				return;
			}
			const parentItem = document.querySelector(
				`.prpl-suggested-task[data-task-id="${ parent }"]`
			);
			if ( ! parentItem ) {
				setTimeout( () => {
					document.dispatchEvent(
						new CustomEvent( 'prpl/suggestedTask/injectItem', {
							detail: {
								item: event.detail.item,
								listId: event.detail.listId,
								insertPosition: event.detail.insertPosition,
							},
						} )
					);
					window.prplRenderAttempts++;
				}, 100 );
				return;
			}

			// If the child list does not exist, create it.
			if (
				! parentItem.querySelector( '.prpl-suggested-task-children' )
			) {
				const childListElement = document.createElement( 'ul' );
				childListElement.classList.add(
					'prpl-suggested-task-children'
				);
				parentItem.appendChild( childListElement );
			}

			// Inject the item into the child list.
			parentItem
				.querySelector( '.prpl-suggested-task-children' )
				.insertAdjacentHTML( 'beforeend', itemHTML );
		} );
} );

// When the 'prpl/suggestedTask/move' event is triggered,
// update the menu_order of the todo items.
document.addEventListener( 'prpl/suggestedTask/move', ( event ) => {
	const listUl = event.detail.node.closest( 'ul' );
	const todoItemsIDs = [];
	// Get all the todo items.
	const todoItems = listUl.querySelectorAll( '.prpl-suggested-task' );
	let menuOrder = 0;
	todoItems.forEach( ( todoItem ) => {
		const itemID = parseInt( todoItem.getAttribute( 'data-post-id' ) );
		todoItemsIDs.push( itemID );
		todoItem.setAttribute( 'data-task-order', menuOrder );

		listUl
			.querySelector( `.prpl-suggested-task[data-post-id="${ itemID }"]` )
			.setAttribute( 'data-task-order', menuOrder );

		// Update an existing post.
		const post = new wp.api.models.Prpl_recommendations( {
			id: itemID,
			menu_order: menuOrder,
		} );
		post.save();
		menuOrder++;
	} );
} );

/* eslint-enable camelcase, jsdoc/require-param-type, jsdoc/require-param, jsdoc/check-param-names */
