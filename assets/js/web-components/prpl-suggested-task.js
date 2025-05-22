/* global customElements, HTMLElement, prplSuggestedTask, prplL10n */
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
			id,
			title = { rendered: '' },
			content = { rendered: '' },
			meta = {},
			status,
			prpl_recommendations_provider,
			prpl_recommendations_category,
			menu_order = false,
			allowReorder = false,
			deletable = false,
			useCheckbox = true,
			taskList = '', // prplSuggestedTasks or progressPlannerTodo.
		} ) {
			// Get parent class properties
			super();

			const terms = {
				prpl_recommendations_provider,
				prpl_recommendations_category,
			};
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

			let taskHeading = title.rendered;
			if ( meta?.prpl_url ) {
				taskHeading = `<a href="${ meta?.prpl_url }" target="${ meta?.prpl_url_target }">${ title.rendered }</a>`;
			}

			const actionButtons = {
				move:
					false !== allowReorder
						? `<span class="prpl-move-buttons">
							<button
								type="button"
								class="prpl-suggested-task-button move-up"
								data-task-id="${ meta?.prpl_task_id }"
								data-task-title="${ title.rendered }"
								data-action="move-up"
								data-target="move-up"
								title="${ prplL10n( 'moveUp' ) }"
							>
								<span class="dashicons dashicons-arrow-up-alt2"></span>
								<span class="screen-reader-text">${ prplL10n( 'moveUp' ) }</span>
							</button>
							<button
								type="button"
								class="prpl-suggested-task-button move-down"
								data-task-id="${ meta?.prpl_task_id }"
								data-task-title="${ title.rendered }"
								data-action="move-down"
								data-target="move-down"
								title="${ prplL10n( 'moveDown' ) }"
							>
								<span class="dashicons dashicons-arrow-down-alt2"></span>
								<span class="screen-reader-text">${ prplL10n( 'moveDown' ) }</span>
							</button>
						</span>`
						: '',
				info:
					content.rendered !== ''
						? `<prpl-tooltip>
							<slot name="open-icon">
								<button
									type="button"
									class="prpl-suggested-task-button"
									data-task-id="${ meta?.prpl_task_id }"
									data-task-title="${ title.rendered }"
									data-action="info"
									data-target="info"
									title="${ prplL10n( 'info' ) }"
								>
									<img src="${ prplSuggestedTask.assets.infoIcon }" alt="${ prplL10n(
										'info'
									) }" class="icon">
									<span class="screen-reader-text">${ prplL10n( 'info' ) }</span>
								</button>
							</slot>
							<slot name="content">
								${ content.rendered }
							</slot>
						</prpl-tooltip>`
						: '',
				snooze: meta?.prpl_snoozable
					? `<prpl-tooltip class="prpl-suggested-task-snooze">
							<slot name="open-icon">
							<button
								type="button"
								class="prpl-suggested-task-button"
								data-task-id="${ meta?.prpl_task_id }"
								data-task-title="${ title.rendered }"
								data-action="snooze"
								data-target="snooze"
								title="${ prplL10n( 'snooze' ) }"
							>
								<img src="${ prplSuggestedTask.assets.snoozeIcon }" alt="${ prplL10n(
									'snooze'
								) }" class="icon">
								<span class="screen-reader-text">${ prplL10n( 'snooze' ) }</span>
							</button>

							</slot>
							<slot name="content">
								<fieldset>
									<legend>
										<span>
											${ prplL10n( 'snoozeThisTask' ) }
										</span>
										<button type="button" class="prpl-toggle-radio-group">
											<span class="prpl-toggle-radio-group-text">
												${ prplL10n( 'howLong' ) }
											</span>
											<span class="prpl-toggle-radio-group-arrow">
												&rsaquo;
											</span>
										</button>
									</legend>

									<div class="prpl-snooze-duration-radio-group">
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="1-week">
											${ prplL10n( 'snoozeDurationOneWeek' ) }
										</label>
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="1-month">
											${ prplL10n( 'snoozeDurationOneMonth' ) }
										</label>
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="3-months">
											${ prplL10n( 'snoozeDurationThreeMonths' ) }
										</label>
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="6-months">
											${ prplL10n( 'snoozeDurationSixMonths' ) }
										</label>
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="1-year">
											${ prplL10n( 'snoozeDurationOneYear' ) }
										</label>
										<label>
											<input type="radio" name="snooze-duration-${
												meta?.prpl_task_id
											}" value="forever">
											${ prplL10n( 'snoozeDurationForever' ) }
										</label>
									</div>
								</fieldset>
							</slot>
						</prpl-tooltip>`
					: '',
				complete:
					meta?.prpl_dismissable && ! useCheckbox
						? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ meta?.prpl_task_id }"
							data-task-title="${ title.rendered }"
							data-action="complete"
							data-target="complete"
							title="${ prplL10n( 'markAsComplete' ) }"
						>
							<span class="dashicons dashicons-saved"></span>
							<span class="screen-reader-text">${ prplL10n( 'markAsComplete' ) }</span>
						</button>`
						: '',
				delete: deletable
					? `<button
							type="button"
							class="prpl-suggested-task-button trash"
							data-task-id="${ meta?.prpl_task_id }"
							data-task-title="${ title.rendered }"
							data-action="delete"
							data-target="delete"
							title="${ prplL10n( 'delete' ) }"
						>
							<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9ca3af" d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"></path></svg>
							<span class="screen-reader-text">${ prplL10n( 'delete' ) }</span>
						</button>`
					: '',
				completeCheckbox: ( () => {
					if ( ! useCheckbox ) {
						return '';
					}
					let output = '';
					let checkboxStyle = 'margin-top: 2px;';

					// If the task is not dismissable, checkbox is disabled and we want to show a tooltip.
					if ( ! meta?.prpl_dismissable ) {
						checkboxStyle += 'pointer-events: none;';
						output += `<prpl-tooltip class="prpl-suggested-task-disabled-checkbox-tooltip">
							<slot name="open-icon">`;
					}

					output += `<input
						type="checkbox"
						class="prpl-suggested-task-checkbox"
						style="${ checkboxStyle }"
						${ ! meta?.prpl_dismissable ? 'disabled' : '' }
						${ 'trash' === status ? 'checked' : '' }
					>`;

					if ( ! meta?.prpl_dismissable ) {
						output += `
							</slot>
							<slot name="content">
								${ prplL10n( 'disabledRRCheckboxTooltip' ) }
							</slot>
						</prpl-tooltip>
						`;
					}

					return output;
				} )(),
			};

			const taskPointsElement = meta?.prpl_points
				? `<span class="prpl-suggested-task-points">
						+${ meta?.prpl_points }
					</span>`
				: '';

			this.innerHTML = `
			<li
				class="prpl-suggested-task"
				data-task-id="${ meta?.prpl_task_id ?? id }"
				data-post-id="${ id }"
				data-task-action="${ 'pending_celebration' === status ? 'celebrate' : '' }"
				data-task-url="${ meta?.prpl_url }"
				data-task-provider-id="${ terms?.prpl_recommendations_provider?.slug }"
				data-task-points="${ meta?.prpl_points }"
				data-task-category="${ terms?.prpl_recommendations_category?.slug }"
				data-task-order="${ menu_order }"
				data-task-list="${ taskList }"
			>
				${ actionButtons.completeCheckbox }
				<h3 style="width: 100%;"><span${
					'user' === terms?.prpl_recommendations_category?.slug
						? ` contenteditable="plaintext-only"`
						: ''
				}>${ taskHeading }</span></h3>
				<div class="prpl-suggested-task-actions">
					<div class="tooltip-actions">
						${ actionButtons.info }
						${ actionButtons.move }
						${ actionButtons.snooze }
						${ actionButtons.complete }
						${ actionButtons.delete }
					</div>
					${ taskPointsElement }
				</div>
			</li>`;

			this.taskListeners();
		}

		/**
		 * Add listeners to the item.
		 */
		taskListeners = () => {
			const thisObj = this;
			const item = thisObj.querySelector( 'li' );

			item.querySelector(
				'.prpl-suggested-task-checkbox'
			).addEventListener( 'change', function ( e ) {
				thisObj.runTaskAction(
					item.getAttribute( 'data-post-id' ),
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
									item.getAttribute( 'data-post-id' ),
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
						item.getAttribute( 'data-post-id' ),
						'snooze',
						this.value
					);
				} );
			} );

			// When an item's contenteditable element is edited,
			// save the new content to the database
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
					wp.api.loadPromise.done( () => {
						// Update an existing post.
						const post = new wp.api.models.Prpl_recommendations( {
							id: parseInt( item.getAttribute( 'data-post-id' ) ),
							title,
						} );
						post.save().then( () => {
							// Update the task title.
							document.dispatchEvent(
								new CustomEvent( 'prpl/suggestedTask/update', {
									detail: { node: thisObj },
								} )
							);
						} );
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
			const taskList =
				this.querySelector( 'li' ).getAttribute( 'data-task-list' );

			switch ( actionType ) {
				case 'snooze':
					wp.api.loadPromise.done( () => {
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
						const post = new wp.api.models.Prpl_recommendations( {
							id: post_id,
							status: 'future',
							date,
							date_gmt: date,
						} );
						post.save().then( () => {
							this.querySelector( 'li' ).remove();
							// Update the global var.
							window[ taskList ].tasks.forEach(
								( task, index ) => {
									if ( task.id === post_id ) {
										window[ taskList ].tasks[
											index
										].status = 'snoozed';
									}
								}
							);
						} );
					} );
					break;

				case 'complete':
					wp.api.loadPromise.done( () => {
						const post = new wp.api.models.Prpl_recommendations( {
							id: post_id,
							status: 'pending_celebration',
						} );
						post.save().then( () => {
							// Add the task to the pending celebration.
							window[ taskList ].tasks.forEach(
								( task, index ) => {
									if ( task.id === post_id ) {
										window[ taskList ].tasks[
											index
										].status = 'pending_celebration';
									}
								}
							);
							// Set the task action to celebrate.
							this.querySelector( 'li' ).setAttribute(
								'data-task-action',
								'celebrate'
							);

							document.dispatchEvent(
								new CustomEvent( 'prpl/updateRaviGauge', {
									detail: {
										pointsDiff: parseInt(
											this.querySelector(
												'li'
											).getAttribute( 'data-task-points' )
										),
									},
								} )
							);

							const eventDetail = {
								element: this.querySelector( 'li' ),
								taskList,
							};
							const eventPoints = parseInt(
								this.querySelector( 'li' ).getAttribute(
									'data-task-points'
								)
							);
							const celebrateEvents =
								0 < eventPoints
									? { 'prpl/celebrateTasks': eventDetail }
									: {
											'prpl/strikeCelebratedTasks':
												eventDetail,
											'prpl/markTasksAsCompleted':
												eventDetail,
											'prpl/suggestedTask/maybeInjectItem':
												{
													task_id:
														this.querySelector(
															'li'
														).getAttribute(
															'data-task-id'
														),
													providerID:
														this.querySelector(
															'li'
														).getAttribute(
															'data-task-provider'
														),
													category:
														this.querySelector(
															'li'
														).getAttribute(
															'data-task-category'
														),
												},
									  };

							// Trigger the celebration events.
							Object.keys( celebrateEvents ).forEach(
								( event ) => {
									document.dispatchEvent(
										new CustomEvent( event, {
											detail: celebrateEvents[ event ],
										} )
									);
								}
							);
						} );
					} );
					break;

				case 'pending':
					wp.api.loadPromise.done( () => {
						const post = new wp.api.models.Prpl_recommendations( {
							id: post_id,
							status: 'publish',
						} );
						post.save().then( () => {
							// Change the task status to pending.
							window[ taskList ].tasks.forEach(
								( task, index ) => {
									if ( task.id === post_id ) {
										window[ taskList ].tasks[
											index
										].status = 'publish';
									}
								}
							);
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
												this.querySelector(
													'li'
												).getAttribute(
													'data-task-points'
												)
											),
									},
								} )
							);
						} );
					} );
					break;

				case 'delete':
					wp.api.loadPromise.done( () => {
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
												this.querySelector(
													'li'
												).getAttribute(
													'data-task-points'
												)
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
					} );
					break;
			}

			const data = {
				id: post_id,
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
							task_id: document
								.querySelector(
									`.prpl-suggested-task[data-post-id="${ post_id }"]`
								)
								.getAttribute( 'data-task-id' ),
							actionType,
							category:
								this.querySelector( 'li' ).getAttribute(
									'data-task-category'
								),
						},
					} )
				);
			} );
		};
	}
);

/* eslint-enable camelcase */
