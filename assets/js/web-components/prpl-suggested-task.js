/* global customElements, HTMLElement, prplSuggestedTask, prplL10n, _, Backbone, MutationObserver */
/*
 * Suggested Task
 *
 * A web component to display a suggested task.
 *
 * Dependencies: wp-api, progress-planner/l10n, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-suggested-task',
	class extends HTMLElement {
		constructor( {
			post,
			allowReorder = false,
			deletable = false,
			useCheckbox = true,
		} ) {
			// Get parent class properties
			super();

			const {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			} = post;

			// Expose the post object to the instance, and extend it with Backbone.Events.
			this.post = post;
			_.extend( this.post, Backbone.Events );

			const terms = {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			};
			this.terms = terms;

			// Modify provider and category to be an object.
			Object.keys( window.progressPlannerSuggestedTasksTerms ).forEach(
				( type ) => {
					if (
						typeof terms[ type ] === 'object' &&
						typeof terms[ type ][ 0 ] !== 'undefined'
					) {
						Object.values(
							window.progressPlannerSuggestedTasksTerms[ type ]
						).forEach( ( term ) => {
							if ( term.id === terms[ type ][ 0 ] ) {
								terms[ type ] = term;
							}
						} );
					}
				}
			);

			this.setAttribute( 'role', 'listitem' );

			const template = wp.template( 'prpl-suggested-task' );
			const data = {
				post: this.post,
				terms: this.terms,
				allowReorder,
				deletable,
				useCheckbox,
				assets: prplSuggestedTask.assets,
				action:
					'pending_celebration' === this.post.status
						? 'celebrate'
						: '',
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
				},
			};

			this.innerHTML = template( data );

			setTimeout( () => {
				this.taskListeners();
			}, 2000 );
		}

		/**
		 * Add listeners to the item.
		 */
		taskListeners = () => {
			const observer = new MutationObserver( function ( mutationsList ) {
				for ( const mutation of mutationsList ) {
					if ( mutation.type === 'attributes' ) {
						const attributeName = mutation.attributeName;
						const attributeValue =
							mutation.target.getAttribute( attributeName );
						console.log(
							`The ${ attributeName } attribute was modified. New value: ${ attributeValue }`
						);
					}
				}
			} );
			observer.observe( this.querySelector( 'li' ), {
				attributes: true,
			} );

			const thisObj = this;
			const item = thisObj.querySelector( 'li' );

			item.querySelector(
				'.prpl-suggested-task-checkbox'
			).addEventListener( 'change', function ( e ) {
				thisObj.runTaskAction(
					thisObj.post.id,
					e.target.checked ? 'complete' : 'pending'
				);
			} );

			item.querySelectorAll( '.prpl-suggested-task-button' ).forEach(
				( button ) => {
					button.addEventListener( 'click', function () {
						let action = button.getAttribute( 'data-action' );
						const target = button.getAttribute( 'data-target' );
						const tooltipActions =
							item.querySelector( '.tooltip-actions' );

						// If the tooltip was already open, close it.
						if (
							!! tooltipActions.querySelector(
								'.prpl-suggested-task-' +
									target +
									'[data-tooltip-visible]'
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
							closestTaskListVisible?.removeAttribute(
								'data-tooltip-visible'
							);
						}

						switch ( action ) {
							case 'snooze':
								tooltipActions
									.querySelector(
										'.prpl-suggested-task-' + target
									)
									.setAttribute(
										'data-tooltip-visible',
										'true'
									);
								break;

							case 'close-snooze':
								// Close the radio group.
								tooltipActions
									.querySelector(
										'.prpl-suggested-task-' +
											target +
											'.prpl-toggle-radio-group-open'
									)
									?.classList.remove(
										'prpl-toggle-radio-group-open'
									);
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
									.querySelector(
										'.prpl-suggested-task-' + target
									)
									.setAttribute(
										'data-tooltip-visible',
										'true'
									);
								break;

							case 'close-info':
								tooltipActions
									.querySelector(
										'.prpl-suggested-task-' + target
									)
									.removeAttribute( 'data-tooltip-visible' );
								break;

							case 'move-up':
							case 'move-down':
								// Move `thisObj` before or after the previous or next sibling.
								if (
									'move-up' === action &&
									thisObj.previousElementSibling
								) {
									thisObj.parentNode.insertBefore(
										thisObj,
										thisObj.previousElementSibling
									);
								} else if (
									'move-down' === action &&
									thisObj.nextElementSibling
								) {
									thisObj.parentNode.insertBefore(
										thisObj.nextElementSibling,
										thisObj
									);
								}
								// Trigger a custom event.
								document.dispatchEvent(
									new CustomEvent(
										'prpl/suggestedTask/move',
										{
											detail: { node: thisObj },
										}
									)
								);
								break;

							default:
								thisObj.runTaskAction(
									thisObj.post.id,
									action
								);
								break;
						}
					} );
				}
			);

			// Toggle snooze duration radio group.
			item.querySelector( '.prpl-toggle-radio-group' )?.addEventListener(
				'click',
				function () {
					this.closest(
						'.prpl-suggested-task-snooze'
					).classList.toggle( 'prpl-toggle-radio-group-open' );
				}
			);

			// Handle snooze duration radio group change.
			item.querySelectorAll(
				'.prpl-snooze-duration-radio-group input[type="radio"]'
			).forEach( ( radioElement ) => {
				radioElement.addEventListener( 'change', function () {
					thisObj.runTaskAction(
						thisObj.post.id,
						'snooze',
						this.value
					);
				} );
			} );
			// When an item's contenteditable element is edited,
			// save the new content to the database
			thisObj.post.on( 'change:title', ( model, value ) => {
				console.log( 'title changed', value );
			} );
			const h3Span = this.querySelector( 'h3 span' );
			h3Span.addEventListener( 'keydown', ( event ) => {
				// Prevent insering newlines (this catches both Enter and Return).
				if ( event.key === 'Enter' ) {
					event.preventDefault();
				}
				// Add debounce to the input event.
				clearTimeout( this.debounceTimeout );
				this.debounceTimeout = setTimeout( () => {
					const title = h3Span.textContent;
					thisObj.post.title.rendered = title;
					// Update an existing post.
					const postModel = new wp.api.models.Prpl_recommendations( {
						id: thisObj.post.id,
						title,
					} );
					postModel.save().then( () => {
						// Update the task title.
						document.dispatchEvent(
							new CustomEvent( 'prpl/suggestedTask/update', {
								detail: { node: thisObj },
							} )
						);
					} );
				}, 300 );
			} );
		};

		/**
		 * Snooze a task.
		 *
		 * @param {number} post_id        The post ID.
		 * @param {string} actionType     The action type.
		 * @param {string} snoozeDuration If the action is `snooze`,
		 *                                the duration to snooze the task for.
		 */
		runTaskAction = ( post_id, actionType, snoozeDuration ) => {
			const thisObj = this;
			switch ( actionType ) {
				case 'snooze':
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
					const postModelToSave =
						new wp.api.models.Prpl_recommendations( {
							id: post_id,
							status: 'future',
							date,
							date_gmt: date,
						} );
					postModelToSave.save().then( () => {
						this.querySelector( 'li' ).remove();
					} );
					break;

				case 'complete':
					const postModelPendingCelebration =
						new wp.api.models.Prpl_recommendations( {
							id: post_id,
							status: 'pending_celebration',
						} );
					postModelPendingCelebration.save().then( () => {
						// Set the task action to celebrate.
						this.querySelector( 'li' ).setAttribute(
							'data-task-action',
							'celebrate'
						);

						document.dispatchEvent(
							new CustomEvent( 'prpl/updateRaviGauge', {
								detail: {
									pointsDiff: parseInt(
										thisObj?.post?.meta?.prpl_points
									),
								},
							} )
						);

						const eventDetail = {
							element: this.querySelector( 'li' ),
						};
						const eventPoints = parseInt(
							thisObj?.post?.meta?.prpl_points
						);
						const celebrateEvents =
							0 < eventPoints
								? { 'prpl/celebrateTasks': eventDetail }
								: {
										'prpl/strikeCelebratedTasks':
											eventDetail,
										'prpl/markTasksAsCompleted':
											eventDetail,
										'prpl/suggestedTask/maybeInjectItem': {
											task_id: thisObj?.post?.id,
											providerID:
												thisObj?.terms
													?.prpl_recommendations_provider
													?.slug,
											category:
												thisObj?.terms
													?.prpl_recommendations_category
													?.slug,
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
					} );
					break;

				case 'pending':
					const postModel = new wp.api.models.Prpl_recommendations( {
						id: post_id,
						status: 'publish',
					} );
					postModel.save().then( () => {
						// Set the task action to pending.
						this.querySelector( 'li' ).setAttribute(
							'data-task-action',
							'pending'
						);

						// Update the Ravi gauge.
						document.dispatchEvent(
							new CustomEvent( 'prpl/updateRaviGauge', {
								detail: {
									pointsDiff:
										0 -
										parseInt(
											thisObj?.post?.meta?.prpl_points
										),
								},
							} )
						);
					} );
					break;

				case 'delete':
					const post = new wp.api.models.Prpl_recommendations( {
						id: post_id,
						status: 'trash',
					} );
					post.destroy().then( () => {
						// Update the Ravi gauge.
						document.dispatchEvent(
							new CustomEvent( 'prpl/updateRaviGauge', {
								detail: {
									pointsDiff:
										0 -
										parseInt(
											thisObj?.post?.meta?.prpl_points
										),
								},
							} )
						);

						// Remove the task from the todo list.
						document
							.querySelector(
								`.prpl-suggested-task[data-post-id="${ post_id }"]`
							)
							.remove();
						document.dispatchEvent(
							new CustomEvent( 'prpl/grid/resize' )
						);
					} );
					break;
			}

			const data = {
				post_id,
				nonce: prplSuggestedTask.nonce,
				action_type: actionType,
			};

			// Save the todo list to the database.
			const request = wp.ajax.post(
				'progress_planner_suggested_task_action',
				data
			);
			request.done( () => {
				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/maybeInjectItem', {
						detail: {
							task_id: thisObj?.post?.id,
							actionType,
							category:
								thisObj?.terms?.prpl_recommendations_category
									?.slug,
						},
					} )
				);
			} );
		};
	}
);

/* eslint-enable camelcase */
