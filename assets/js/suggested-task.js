/* global HTMLElement, prplSuggestedTask, prplL10n */
/*
 * Suggested Task scripts & helpers.
 *
 * Dependencies: wp-api, progress-planner/l10n, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase, jsdoc/require-param-type, jsdoc/require-param, jsdoc/check-param-names */

prplSuggestedTask.injectedItemIds = [];

/**
 * Inject items from a category.
 */
prplSuggestedTask.injectCategoryItems = ( args ) => {
	window
		.prplGetTermsCollectionPromise( 'prpl_recommendations_category' )
		.then( ( terms ) => {
			console.info(
				`Attempting to fetch recommendations for category: ${ args.category }`
			);

			prplSuggestedTask
				.getPostsCollectionPromise( {
					data: {
						status: [ args.status ],
						per_page: 1,
						_embed: true,
						exclude: prplSuggestedTask.injectedItemIds,
						prpl_recommendations_category:
							terms[ args.category ].id,
						filter: {
							orderby: 'menu_order',
							order: 'ASC',
						},
					},
				} )
				.then( ( response ) => {
					const data = response.data;
					const postsCollection = response.postsCollection;
					if ( ! data.length ) {
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

					if ( args?.afterInject ) {
						args.afterInject( data );
					}

					// If we want to get more items and there are more, repeat the process.
					if (
						postsCollection.hasMore() &&
						prplSuggestedTask.maxItemsPerCategory[ args.category ] >
							prplSuggestedTask.injectedItemIds.length
					) {
						prplSuggestedTask.injectCategoryItems( args );
					}
				} );
		} );
};

/**
 * Get a collection of posts.
 *
 * @param {Object} fetchArgs The arguments to pass to the fetch method.
 * @return {Promise} A promise that resolves with the collection of posts.
 */
prplSuggestedTask.getPostsCollectionPromise = ( fetchArgs ) => {
	const api = wp.api;
	const collectionsPromise = new Promise( ( resolve ) => {
		api.loadPromise.done( () => {
			const postsCollection = new api.collections.Prpl_recommendations();
			postsCollection.fetch( fetchArgs ).done( ( data ) => {
				resolve( { data, postsCollection } );
			} );
		} );
	} );

	return collectionsPromise;
};

/**
 * Render a new item.
 *
 * @param {Object}  post         The post object.
 * @param {boolean} allowReorder Whether to allow reordering.
 * @param {boolean} deletable    Whether to allow deleting.
 * @param {boolean} useCheckbox  Whether to use a checkbox.
 */
prplSuggestedTask.getNewItemTemplatePromise = ( {
	post = {},
	allowReorder = false,
	deletable = false,
	useCheckbox = true,
} ) => {
	return new Promise( ( resolve ) => {
		const { prpl_recommendations_provider, prpl_recommendations_category } =
			post;
		const terms = {
			prpl_recommendations_provider,
			prpl_recommendations_category,
		};

		Promise.all( [
			window.prplGetTermsCollectionPromise(
				'prpl_recommendations_provider'
			),
			window.prplGetTermsCollectionPromise(
				'prpl_recommendations_category'
			),
		] ).then( ( [ providerTerms, categoryTerms ] ) => {
			terms.prpl_recommendations_provider = providerTerms;
			terms.prpl_recommendations_category = categoryTerms;

			Object.values( providerTerms ).forEach( ( term ) => {
				if ( term.id === terms.prpl_recommendations_provider[ 0 ] ) {
					terms.prpl_recommendations_provider = term;
				}
			} );

			Object.values( categoryTerms ).forEach( ( term ) => {
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
				assets: prplSuggestedTask.assets,
				action:
					'pending_celebration' === post.status ? 'celebrate' : '',
				l10n: {
					info: prplL10n( 'info' ),
					moveUp: prplL10n( 'moveUp' ),
					moveDown: prplL10n( 'moveDown' ),
					snooze: prplL10n( 'snooze' ),
					snoozeThisTask: prplL10n( 'snoozeThisTask' ),
					howLong: prplL10n( 'howLong' ),
					snoozeDurationOneWeek: prplL10n( 'snoozeDurationOneWeek' ),
					snoozeDurationOneMonth: prplL10n(
						'snoozeDurationOneMonth'
					),
					snoozeDurationThreeMonths: prplL10n(
						'snoozeDurationThreeMonths'
					),
					snoozeDurationSixMonths: prplL10n(
						'snoozeDurationSixMonths'
					),
					snoozeDurationOneYear: prplL10n( 'snoozeDurationOneYear' ),
					snoozeDurationForever: prplL10n( 'snoozeDurationForever' ),
					disabledRRCheckboxTooltip: prplL10n(
						'disabledRRCheckboxTooltip'
					),
					markAsComplete: prplL10n( 'markAsComplete' ),
				},
			};

			resolve( template( data ) );
		} );
	} );
};

/**
 * Run a task action.
 *
 * @param {number} postId       The post ID.
 * @param {string} actionType   The action type.
 * @param {string} categorySlug The category slug.
 */
prplSuggestedTask.runTaskAction = ( postId, actionType, categorySlug ) => {
	const request = wp.ajax.post( 'progress_planner_suggested_task_action', {
		post_id: postId,
		nonce: prplSuggestedTask.nonce,
		action_type: actionType,
	} );
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
};

/**
 * Trash a task.
 *
 * @param {number} postId The post ID.
 */
prplSuggestedTask.trash = ( postId ) => {
	window
		.prplGetTermsCollectionPromise( 'prpl_recommendations_category' )
		.then( () => {
			const post = new wp.api.models.Prpl_recommendations( {
				id: postId,
			} );
			post.fetch().then( ( postData ) => {
				post.destroy().then( () => {
					// Remove the task from the todo list.
					const el = document.querySelector(
						`.prpl-suggested-task[data-post-id="${ postId }"]`
					);
					el.remove();
					document.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);

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
		} );
};

/**
 * Maybe complete a task.
 *
 * @param {number} postId The post ID.
 */
prplSuggestedTask.maybeComplete = ( postId ) => {
	// Get the task.
	const post = new wp.api.models.Prpl_recommendations( { id: postId } );
	post.fetch().then( ( postData ) => {
		const newStatus =
			'publish' === postData.status ? 'pending_celebration' : 'publish';
		post.set( 'status', newStatus );
		post.save().then( () => {
			prplSuggestedTask.runTaskAction(
				postId,
				'pending_celebration' === newStatus ? 'complete' : 'pending',
				window.prplGetTermObject(
					postData?.prpl_recommendations_category,
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
							pointsDiff: parseInt( postData?.meta?.prpl_points ),
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
};

/**
 * Snooze a task.
 *
 * @param {number} postId         The post ID.
 * @param {string} snoozeDuration The snooze duration.
 */
prplSuggestedTask.snooze = ( postId, snoozeDuration ) => {
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
	const date = new Date( Date.now() + snoozeDuration * 24 * 60 * 60 * 1000 )
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
};

/**
 * Run a tooltip action.
 *
 * @param {HTMLElement} button The button that was clicked.
 */
prplSuggestedTask.runButtonAction = ( button ) => {
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
					'.prpl-suggested-task-' + target + '[data-tooltip-visible]'
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
			} else if ( 'move-down' === action && item.nextElementSibling ) {
				item.parentNode.insertBefore( item.nextElementSibling, item );
			}
			// Trigger a custom event.
			document.dispatchEvent(
				new CustomEvent( 'prpl/suggestedTask/move', {
					detail: { node: item },
				} )
			);
			break;
	}
};

/**
 * Update the task title.
 *
 * @param {HTMLElement} el The element that was edited.
 */
prplSuggestedTask.updateTaskTitle = ( el ) => {
	// Add debounce to the input event.
	clearTimeout( this.debounceTimeout );
	this.debounceTimeout = setTimeout( () => {
		// Update an existing post.
		const postModel = new wp.api.models.Prpl_recommendations( {
			id: parseInt( el.getAttribute( 'data-post-id' ) ),
			title: el.textContent.replace( /\n/g, '' ),
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
	}, 300 );
};
/* eslint-enable camelcase, jsdoc/require-param-type, jsdoc/require-param, jsdoc/check-param-names */
