/* global HTMLElement, prplSuggestedTask, prplL10n */
/*
 * Suggested Task scripts & helpers.
 *
 * Dependencies: wp-api, progress-planner/l10n, progress-planner/suggested-task-terms
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
	 * Inject items from a category.
	 *
	 * @param {Object} args The arguments to pass to the injectItems method.
	 */
	injectItems: ( args ) => {
		console.info(
			`Fetching recommendations with args: ${ JSON.stringify( args ) }...`
		);

		const fetchData = {
			status: [ args.status ],
			per_page: 1,
			_embed: true,
			exclude: prplSuggestedTask.injectedItemIds,
			filter: {
				orderby: 'menu_order',
				order: 'ASC',
			},
		};
		if ( args.category ) {
			fetchData.prpl_recommendations_category =
				window.prplSuggestedTasksTerms.prpl_recommendations_category[
					args.category
				].id;
		}

		prplSuggestedTask
			.getPostsCollectionPromise( { data: fetchData } )
			.then( ( response ) => {
				const data = response.data;
				const postsCollection = response.postsCollection;
				if ( ! data.length ) {
					if ( args?.afterRequestComplete ) {
						args.afterRequestComplete( data );
					}
					return;
				}

				const injectTriggerArgsCallback =
					args?.injectTriggerArgsCallback || ( ( item ) => item );
				data.forEach( ( item ) => {
					document.dispatchEvent(
						new CustomEvent( args.injectTrigger, {
							detail: injectTriggerArgsCallback( item ),
						} )
					);
					prplSuggestedTask.injectedItemIds.push( item.id );
				} );

				if ( args?.afterRequestComplete ) {
					args.afterRequestComplete( data );
				}

				// If we want to get more items and there are more, repeat the process.
				if ( postsCollection.hasMore() ) {
					if (
						args.category &&
						prplSuggestedTask.maxItemsPerCategory[
							args.category
						] <= prplSuggestedTask.injectedItemIds.length
					) {
						return;
					}
					prplSuggestedTask.injectItems( args );
				}
			} );
	},

	/**
	 * Get a collection of posts.
	 *
	 * @param {Object} fetchArgs The arguments to pass to the fetch method.
	 * @return {Promise} A promise that resolves with the collection of posts.
	 */
	getPostsCollectionPromise: ( fetchArgs ) => {
		const api = wp.api;
		const collectionsPromise = new Promise( ( resolve ) => {
			api.loadPromise.done( () => {
				const postsCollection =
					new api.collections.Prpl_recommendations();
				postsCollection.fetch( fetchArgs ).done( ( data ) => {
					resolve( { data, postsCollection } );
				} );
			} );
		} );

		return collectionsPromise;
	},

	/**
	 * Render a new item.
	 *
	 * @param {Object}  post         The post object.
	 * @param {boolean} allowReorder Whether to allow reordering.
	 * @param {boolean} deletable    Whether to allow deleting.
	 * @param {boolean} useCheckbox  Whether to use a checkbox.
	 */
	getNewItemTemplatePromise: ( {
		post = {},
		allowReorder = false,
		deletable = false,
		useCheckbox = true,
		listId = '',
	} ) => {
		return new Promise( ( resolve ) => {
			const {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			} = post;
			const terms = {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			};

			Object.values(
				window.prplSuggestedTasksTerms.prpl_recommendations_provider
			).forEach( ( term ) => {
				if ( term.id === terms.prpl_recommendations_provider[ 0 ] ) {
					terms.prpl_recommendations_provider = term;
				}
			} );

			Object.values(
				window.prplSuggestedTasksTerms.prpl_recommendations_category
			).forEach( ( term ) => {
				if ( term.id === terms.prpl_recommendations_category[ 0 ] ) {
					terms.prpl_recommendations_category = term;
				}
			} );

			const template = wp.template( 'prpl-suggested-task' );
			const data = {
				post,
				terms,
				allowReorder,
				deletable,
				useCheckbox,
				listId,
				assets: prplSuggestedTask.assets,
				action:
					'pending_celebration' === post.status ? 'celebrate' : '',
				l10n: prplSuggestedTask.l10n,
			};

			resolve( template( data ) );
		} );
	},

	/**
	 * Run a task action.
	 *
	 * @param {number} postId       The post ID.
	 * @param {string} actionType   The action type.
	 * @param {string} categorySlug The category slug.
	 */
	runTaskAction: ( postId, actionType, categorySlug ) => {
		const request = wp.ajax.post(
			'progress_planner_suggested_task_action',
			{
				post_id: postId,
				nonce: prplSuggestedTask.nonce,
				action_type: actionType,
			}
		);
		request.done( () => {
			document.dispatchEvent(
				new CustomEvent( 'prpl/suggestedTask/maybeInjectItem', {
					detail: {
						task_id: postId,
						actionType,
						category: categorySlug,
					},
				} )
			);
		} );
	},

	/**
	 * Trash a task.
	 *
	 * @param {number} postId The post ID.
	 */
	trash: ( postId ) => {
		const post = new wp.api.models.Prpl_recommendations( {
			id: postId,
		} );
		post.fetch().then( ( postData ) => {
			post.set( 'status', 'trash' );
			post.save().then( () => {
				// Remove the task from the todo list.
				const el = document.querySelector(
					`.prpl-suggested-task[data-post-id="${ postId }"]`
				);
				el.remove();
				document.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );

				prplSuggestedTask.runTaskAction(
					postId,
					'delete',
					window.prplGetTermObject(
						postData?.prpl_recommendations_category,
						'prpl_recommendations_category'
					).slug
				);
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
			const newStatus =
				'publish' === postData.status
					? 'pending_celebration'
					: 'publish';
			post.set( 'status', newStatus );
			post.save().then( () => {
				prplSuggestedTask.runTaskAction(
					postId,
					'pending_celebration' === newStatus
						? 'complete'
						: 'pending',
					window.prplGetTermObject(
						postData?.prpl_recommendations_category?.[ 0 ],
						'prpl_recommendations_category'
					).slug
				);
				const el = document.querySelector(
					`.prpl-suggested-task[data-post-id="${ postId }"]`
				);
				if ( 'pending_celebration' === newStatus ) {
					el.setAttribute( 'data-task-action', 'celebrate' );

					document.dispatchEvent(
						new CustomEvent( 'prpl/updateRaviGauge', {
							detail: {
								pointsDiff: parseInt(
									postData?.meta?.prpl_points
								),
							},
						} )
					);

					const eventDetail = { element: el };
					const eventPoints = parseInt( postData?.meta?.prpl_points );
					const celebrateEvents =
						0 < eventPoints
							? { 'prpl/celebrateTasks': eventDetail }
							: {
									'prpl/strikeCelebratedTasks': eventDetail,
									'prpl/markTasksAsCompleted': eventDetail,
									'prpl/suggestedTask/maybeInjectItem': {
										task_id: postId,
										providerID: window.prplGetTermObject(
											postData?.prpl_recommendations_provider,
											'prpl_recommendations_provider'
										).slug,
										category: window.prplGetTermObject(
											postData?.prpl_recommendations_category,
											'prpl_recommendations_category'
										).slug,
									},
							  };

					// Trigger the celebration events.
					Object.keys( celebrateEvents ).forEach( ( event ) => {
						document.dispatchEvent(
							new CustomEvent( event, {
								detail: celebrateEvents[ event ],
							} )
						);
					} );
				} else {
					// Set the task action to pending.
					el.setAttribute( 'data-task-action', 'pending' );

					// Update the Ravi gauge.
					document.dispatchEvent(
						new CustomEvent( 'prpl/updateRaviGauge', {
							detail: {
								pointsDiff:
									0 - parseInt( postData?.meta?.prpl_points ),
							},
						} )
					);
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
		if ( '1-week' === snoozeDuration ) {
			snoozeDuration = 7;
		} else if ( '2-weeks' === snoozeDuration ) {
			snoozeDuration = 14;
		} else if ( '1-month' === snoozeDuration ) {
			snoozeDuration = 30;
		} else if ( '3-months' === snoozeDuration ) {
			snoozeDuration = 90;
		} else if ( '6-months' === snoozeDuration ) {
			snoozeDuration = 180;
		} else if ( '1-year' === snoozeDuration ) {
			snoozeDuration = 365;
		} else if ( 'forever' === snoozeDuration ) {
			snoozeDuration = 3650;
		}
		const date = new Date(
			Date.now() + snoozeDuration * 24 * 60 * 60 * 1000
		)
			.toISOString()
			.split( '.' )[ 0 ];
		const postModelToSave = new wp.api.models.Prpl_recommendations( {
			id: postId,
			status: 'future',
			date,
			date_gmt: date,
		} );
		postModelToSave.save().then( () => {
			const el = document.querySelector(
				`.prpl-suggested-task[data-post-id="${ postId }"]`
			);
			el.remove();
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

		// If the tooltip was already open, close it.
		if (
			!! tooltipActions.querySelector(
				'.prpl-suggested-task-' + target + '[data-tooltip-visible]'
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
					.querySelector( '.prpl-suggested-task-' + target )
					.setAttribute( 'data-tooltip-visible', 'true' );
				break;

			case 'close-snooze':
				// Close the radio group.
				tooltipActions
					.querySelector(
						'.prpl-suggested-task-' +
							target +
							'.prpl-toggle-radio-group-open'
					)
					?.classList.remove( 'prpl-toggle-radio-group-open' );
				// Close the tooltip.
				tooltipActions
					.querySelector(
						'.prpl-suggested-task-' +
							target +
							'[data-tooltip-visible]'
					)
					?.removeAttribute( 'data-tooltip-visible' );
				break;

			case 'info':
				tooltipActions
					.querySelector( '.prpl-suggested-task-' + target )
					.setAttribute( 'data-tooltip-visible', 'true' );
				break;

			case 'close-info':
				tooltipActions
					.querySelector( '.prpl-suggested-task-' + target )
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
			postModel.save().then( () => {
				// Update the task title.
				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/update', {
						detail: {
							node: el.closest( 'li.prpl-suggested-task' ),
						},
					} )
				);
			} );
			el
				.closest( 'li.prpl-suggested-task' )
				.querySelector(
					'label:has(.prpl-suggested-task-checkbox) .screen-reader-text'
				).innerHTML = `${ title }: ${ prplL10n( 'markAsComplete' ) }`;
		}, 300 );
	},
};

/**
 * Inject an item.
 */
document.addEventListener( 'prpl/suggestedTask/injectItem', ( event ) => {
	prplSuggestedTask
		.getNewItemTemplatePromise( {
			post: event.detail.item,
			allowReorder: false,
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
