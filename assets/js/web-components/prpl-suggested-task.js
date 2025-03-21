/* global customElements, HTMLElement, prplSuggestedTask, prplL10n */
/*
 * Suggested Task
 *
 * A web component to display a suggested task.
 *
 * Dependencies: progress-planner/l10n
 */
/* eslint-disable camelcase */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-suggested-task',
	class extends HTMLElement {
		constructor( {
			task_id,
			title,
			description,
			points,
			action = '',
			url = '',
			dismissable = false,
			providerID = '',
			category = '',
			snoozable = true,
			order = false,
			deletable = false,
			useCheckbox = true,
			taskList = '', // prplSuggestedTasks or progressPlannerTodo.
		} ) {
			// Get parent class properties
			super();

			this.setAttribute( 'role', 'listitem' );

			let taskHeading = title;
			if ( url ) {
				taskHeading = `<a href="${ url }">${ title }</a>`;
			}

			const isRemoteTask = task_id.startsWith( 'remote-task-' );
			const isDismissable = dismissable || isRemoteTask;

			const getTaskStatus = () => {
				let status = 'pending';
				window[ taskList ].tasks.forEach( ( task ) => {
					if ( task.task_id === task_id ) {
						status = task.status;
					}
				} );
				return status;
			};

			const actionButtons = {
				move:
					false !== order
						? `<span class="prpl-move-buttons">
							<button
								type="button"
								class="prpl-suggested-task-button move-up"
								data-task-id="${ task_id }"
								data-task-title="${ title }"
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
								data-task-id="${ task_id }"
								data-task-title="${ title }"
								data-action="move-down"
								data-target="move-down"
								title="${ prplL10n( 'moveDown' ) }"
							>
								<span class="dashicons dashicons-arrow-down-alt2"></span>
								<span class="screen-reader-text">${ prplL10n( 'moveDown' ) }</span>
							</button>
						</span>`
						: '',
				info: description
					? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ task_id }"
							data-task-title="${ title }"
							data-action="info"
							data-target="info"
							title="${ prplL10n( 'info' ) }"
						>
							<img src="${ prplSuggestedTask.assets.infoIcon }" alt="${ prplL10n(
								'info'
							) }" class="icon">
							<span class="screen-reader-text">${ prplL10n( 'info' ) }</span>
						</button>`
					: '',
				snooze: snoozable
					? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ task_id }"
							data-task-title="${ title }"
							data-action="snooze"
							data-target="snooze"
							title="${ prplL10n( 'snooze' ) }"
						>
							<img src="${ prplSuggestedTask.assets.snoozeIcon }" alt="${ prplL10n(
								'snooze'
							) }" class="icon">
							<span class="screen-reader-text">${ prplL10n( 'snooze' ) }</span>
						</button>`
					: '',
				complete:
					isDismissable && ! useCheckbox
						? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ task_id }"
							data-task-title="${ title }"
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
							data-task-id="${ task_id }"
							data-task-title="${ title }"
							data-action="delete"
							data-target="delete"
							title="${ prplL10n( 'delete' ) }"
						>
							<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9ca3af" d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"></path></svg>
							<span class="screen-reader-text">${ prplL10n( 'delete' ) }</span>
						</button>`
					: '',
				completeCheckbox: useCheckbox
					? `<input
							type="checkbox"
							class="prpl-suggested-task-checkbox"
							${ isDismissable ? '' : ' disabled' }
							style="margin-top: 2px;"
							${ getTaskStatus() === 'completed' ? 'checked' : '' }
						>`
					: '',
			};

			const taskPointsElement = points
				? `<span class="prpl-suggested-task-points">
						+${ points }
					</span>`
				: '';

			this.innerHTML = `
			<li
				class="prpl-suggested-task"
				data-task-id="${ task_id }"
				data-task-action="${ action }"
				data-task-url="${ url }"
				data-task-provider-id="${ providerID }"
				data-task-points="${ points }"
				data-task-category="${ category }"
				data-task-order="${ order }"
				data-task-list="${ taskList }"
			>
				${ actionButtons.completeCheckbox }
				<h3 style="width: 100%;"><span${
					'user' === category
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

						<div class="prpl-suggested-task-snooze prpl-tooltip">

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
										<input type="radio" name="snooze-duration-${ task_id }" value="1-week">
										${ prplL10n( 'snoozeDurationOneWeek' ) }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ task_id }" value="1-month">
										${ prplL10n( 'snoozeDurationOneMonth' ) }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ task_id }" value="3-months">
										${ prplL10n( 'snoozeDurationThreeMonths' ) }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ task_id }" value="6-months">
										${ prplL10n( 'snoozeDurationSixMonths' ) }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ task_id }" value="1-year">
										${ prplL10n( 'snoozeDurationOneYear' ) }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ task_id }" value="forever">
										${ prplL10n( 'snoozeDurationForever' ) }
									</label>
								</div>
							</fieldset>

							<button type="button" class="prpl-suggested-task-button prpl-tooltip-close" data-action="close-snooze" data-target="snooze">
								<span class="dashicons dashicons-no-alt"></span>
								<span class="screen-reader-text">${ prplL10n( 'close' ) }</span>
							</button>
						</div>
						<div class="prpl-suggested-task-info prpl-tooltip" data-target="info">
							${ description }
							<button type="button" class="prpl-suggested-task-button prpl-tooltip-close" data-action="close-info" data-target="info">
								<span class="dashicons dashicons-no-alt"></span>
								<span class="screen-reader-text">${ prplL10n( 'close' ) }</span>
							</button>
						</div>
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
			const thisObj = this,
				item = thisObj.querySelector( 'li' );

			item.querySelector(
				'.prpl-suggested-task-checkbox'
			).addEventListener( 'change', function ( e ) {
				thisObj.runTaskAction(
					item.getAttribute( 'data-task-id' ),
					e.target.checked ? 'complete' : 'pending'
				);
			} );

			item.querySelectorAll( '.prpl-suggested-task-button' ).forEach(
				function ( button ) {
					button.addEventListener( 'click', function () {
						let action = button.getAttribute( 'data-action' );
						const target = button.getAttribute( 'data-target' ),
							tooltipActions =
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
							// Close the any opened radio group.
							item.closest( '.prpl-suggested-tasks-list' )
								.querySelector( `[data-tooltip-visible]` )
								?.classList.remove(
									'prpl-toggle-radio-group-open'
								);
							// Remove any existing tooltip visible attribute, in the entire list.
							item.closest( '.prpl-suggested-tasks-list' )
								.querySelector( `[data-tooltip-visible]` )
								?.removeAttribute( 'data-tooltip-visible' );
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
								const previousSibling =
									thisObj.previousElementSibling;
								const nextSibling = thisObj.nextElementSibling;
								if ( 'move-up' === action && previousSibling ) {
									thisObj.parentNode.insertBefore(
										thisObj,
										previousSibling
									);
								} else if (
									'move-down' === action &&
									nextSibling
								) {
									thisObj.parentNode.insertBefore(
										nextSibling,
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
									item.getAttribute( 'data-task-id' ),
									action
								);
								break;
						}
					} );
				}
			);

			// Toggle snooze duration radio group.
			item.querySelector( '.prpl-toggle-radio-group' ).addEventListener(
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
						item.getAttribute( 'data-task-id' ),
						'snooze',
						this.value
					);
				} );
			} );

			// When an item's contenteditable element is edited,
			// save the new content to the database
			this.querySelector( 'h3 span' ).addEventListener( 'input', () => {
				// Add debounce to the input event.
				clearTimeout( this.debounceTimeout );
				this.debounceTimeout = setTimeout( () => {
					const title = this.querySelector( 'h3 span' ).textContent;
					wp.ajax
						.post( 'progress_planner_save_user_suggested_task', {
							task: {
								task_id: item.getAttribute( 'data-task-id' ),
								title,
								provider_id: 'user',
								category: 'user',
								dismissable: true,
							},
							nonce: prplSuggestedTask.nonce,
						} )
						.done( () => {
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
		 * @param {string} task_id        The task ID.
		 * @param {string} actionType     The action type.
		 * @param {string} snoozeDuration If the action is `snooze`,
		 *                                the duration to snooze the task for.
		 */
		runTaskAction = ( task_id, actionType, snoozeDuration ) => {
			task_id = task_id.toString();
			const providerID = this.querySelector( 'li' ).getAttribute(
					'data-task-provider-id'
				),
				category =
					this.querySelector( 'li' ).getAttribute(
						'data-task-category'
					);
			const taskPoints = parseInt(
				this.querySelector( 'li' ).getAttribute( 'data-task-points' )
			);
			const taskList =
				this.querySelector( 'li' ).getAttribute( 'data-task-list' );

			const data = {
				task_id,
				nonce: prplSuggestedTask.nonce,
				action_type: actionType,
			};
			if ( 'snooze' === actionType ) {
				data.duration = snoozeDuration;
			}

			// Save the todo list to the database.
			const request = wp.ajax.post(
				'progress_planner_suggested_task_action',
				data
			);
			request.done( () => {
				const el = document.querySelector(
					`.prpl-suggested-task[data-task-id="${ task_id }"]`
				);

				switch ( actionType ) {
					case 'snooze':
						el.remove();
						// Update the global var.
						window[ taskList ].tasks.forEach( ( task, index ) => {
							if ( task.task_id === task_id ) {
								window[ taskList ].tasks[ index ].status =
									'snoozed';
							}
						} );
						break;

					case 'complete':
						// Add the task to the pending celebration.
						window[ taskList ].tasks.forEach( ( task, index ) => {
							if ( task.task_id === task_id ) {
								window[ taskList ].tasks[ index ].status =
									'pending_celebration';
							}
						} );
						// Set the task action to celebrate.
						el.setAttribute( 'data-task-action', 'celebrate' );

						document.dispatchEvent(
							new CustomEvent( 'prpl/updateRaviGauge', {
								detail: {
									pointsDiff: parseInt(
										this.querySelector( 'li' ).getAttribute(
											'data-task-points'
										)
									),
								},
							} )
						);

						const celebrateEvents =
							0 < taskPoints
								? [ 'prpl/celebrateTasks' ]
								: [
										'prpl/strikeCelebratedTasks',
										'prpl/markTasksAsCompleted',
								  ];

						// Trigger the celebration events.
						celebrateEvents.forEach( ( event ) => {
							document.dispatchEvent(
								new CustomEvent( event, {
									detail: {
										element: el,
										taskList,
									},
								} )
							);
						} );

						break;

					case 'pending':
						// Change the task status to pending.
						window[ taskList ].tasks.forEach( ( task, index ) => {
							if ( task.task_id === task_id ) {
								window[ taskList ].tasks[ index ].status =
									'pending';
							}
						} );
						// Set the task action to pending.
						el.setAttribute( 'data-task-action', 'pending' );

						// Update the Ravi gauge.
						document.dispatchEvent(
							new CustomEvent( 'prpl/updateRaviGauge', {
								detail: {
									pointsDiff:
										0 -
										parseInt(
											this.querySelector(
												'li'
											).getAttribute( 'data-task-points' )
										),
								},
							} )
						);

						break;

					case 'delete':
						// Remove the task from the todo list.
						el.closest( 'prpl-suggested-task' ).remove();
						document.dispatchEvent(
							new CustomEvent( 'prpl/grid/resize' )
						);
						break;
				}

				document.dispatchEvent(
					new CustomEvent( 'prpl/suggestedTask/maybeInjectItem', {
						detail: {
							task_id,
							providerID,
							actionType,
							category,
						},
					} )
				);
			} );
		};
	}
);

/* eslint-enable camelcase */
