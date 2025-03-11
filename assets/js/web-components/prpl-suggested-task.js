/* global customElements, prplSuggestedTask, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-suggested-task',
	class extends HTMLElement {
		constructor( {
			taskId,
			taskTitle,
			taskDescription,
			taskPoints,
			taskAction = '',
			taskUrl = '',
			taskDismissable = false,
			taskProviderID = '',
			taskCategory = '',
			taskSnoozable = true,
			taskOrder = false,
			taskDeletable = false,
		} ) {
			// Get parent class properties
			super();

			this.setAttribute( 'role', 'listitem' );

			let taskHeading = taskTitle;
			if ( taskUrl ) {
				taskHeading = `<a href="${ taskUrl }">${ taskTitle }</a>`;
			}

			const isRemoteTask = taskId.startsWith( 'remote-task-' );
			const isDismissable = taskDismissable || isRemoteTask;

			const actionButtons = {
				info: taskDescription
					? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ taskId }"
							data-task-title="${ taskTitle }"
							data-action="info"
							data-target="info"
							title="${ prplSuggestedTask.i18n.info }"
						>
							<img src="${ prplSuggestedTask.assets.infoIcon }" alt="${ prplSuggestedTask.i18n.info }" class="icon">
							<span class="screen-reader-text">${ prplSuggestedTask.i18n.info }</span>
						</button>`
					: '',
				snooze: taskSnoozable
					? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ taskId }"
							data-task-title="${ taskTitle }"
							data-action="snooze"
							data-target="snooze"
							title="${ prplSuggestedTask.i18n.snooze }"
						>
							<img src="${ prplSuggestedTask.assets.snoozeIcon }" alt="${ prplSuggestedTask.i18n.snooze }" class="icon">
							<span class="screen-reader-text">${ prplSuggestedTask.i18n.snooze }</span>
						</button>`
					: '',
				complete: isDismissable
					? `<button
							type="button"
							class="prpl-suggested-task-button"
							data-task-id="${ taskId }"
							data-task-title="${ taskTitle }"
							data-action="complete"
							data-target="complete"
							title="${ prplSuggestedTask.i18n.markAsComplete }"
						>
							<span class="dashicons dashicons-saved"></span>
							<span class="screen-reader-text">${ prplSuggestedTask.i18n.markAsComplete }</span>
						</button>`
					: '',
				delete: taskDeletable
					? `<button
							type="button"
							class="prpl-suggested-task-button trash"
							data-task-id="${ taskId }"
							data-task-title="${ taskTitle }"
							data-action="delete"
							data-target="delete"
							title="${ prplSuggestedTask.i18n.delete }"
						>
							<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9ca3af" d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"></path></svg>
							<span class="screen-reader-text">${ prplSuggestedTask.i18n.delete }</span>
						</button>`
					: '',
			};

			const taskPointsElement = taskPoints
				? `<span class="prpl-suggested-task-points">
						+${ taskPoints }
					</span>`
				: '';

			this.innerHTML = `
			<li
				class="prpl-suggested-task"
				data-task-id="${ taskId }"
				data-task-action="${ taskAction }"
				data-task-url="${ taskUrl }"
				data-task-provider-id="${ taskProviderID }"
				data-task-points="${ taskPoints }"
				data-task-category="${ taskCategory }"
				data-task-order="${ taskOrder }"
			>
				<h3><span${
					'user' === taskCategory
						? ` contenteditable="plaintext-only"`
						: ''
				}>${ taskHeading }</span></h3>
				<div class="prpl-suggested-task-actions">
					<div class="tooltip-actions">
						${ actionButtons.info }
						${ actionButtons.snooze }
						${ actionButtons.complete }
						${ actionButtons.delete }

						<div class="prpl-suggested-task-snooze prpl-tooltip">

							<fieldset>
								<legend>
									<span>
										${ prplSuggestedTask.i18n.snoozeThisTask }
									</span>
									<button type="button" class="prpl-toggle-radio-group">
										<span class="prpl-toggle-radio-group-text">
											${ prplSuggestedTask.i18n.howLong }
										</span>
										<span class="prpl-toggle-radio-group-arrow">
											&rsaquo;
										</span>
									</button>
								</legend>

								<div class="prpl-snooze-duration-radio-group">
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="1-week">
										${ prplSuggestedTask.i18n.snoozeDuration.oneWeek }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="1-month">
										${ prplSuggestedTask.i18n.snoozeDuration.oneMonth }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="3-months">
										${ prplSuggestedTask.i18n.snoozeDuration.threeMonths }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="6-months">
										${ prplSuggestedTask.i18n.snoozeDuration.sixMonths }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="1-year">
										${ prplSuggestedTask.i18n.snoozeDuration.oneYear }
									</label>
									<label>
										<input type="radio" name="snooze-duration-${ taskId }" value="forever">
										${ prplSuggestedTask.i18n.snoozeDuration.forever }
									</label>
								</div>
							</fieldset>

							<button type="button" class="prpl-suggested-task-button prpl-tooltip-close" data-action="close-snooze" data-target="snooze">
								<span class="dashicons dashicons-no-alt"></span>
								<span class="screen-reader-text">${ prplSuggestedTask.i18n.close }</span>
							</button>
						</div>
						<div class="prpl-suggested-task-info prpl-tooltip" data-target="info">
							${ taskDescription }
							<button type="button" class="prpl-suggested-task-button prpl-tooltip-close" data-action="close-info" data-target="info">
								<span class="dashicons dashicons-no-alt"></span>
								<span class="screen-reader-text">${ prplSuggestedTask.i18n.close }</span>
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
				wp.ajax.post( 'progress_planner_save_user_suggested_task', {
					task: {
						task_id: item.getAttribute( 'data-task-id' ),
						title: this.querySelector( 'h3 span' ).textContent,
						provider_id: 'user',
						category: 'user',
						dismissable: true,
					},
					nonce: prplSuggestedTask.nonce,
				} );
			} );
		};

		/**
		 * Snooze a task.
		 *
		 * @param {string} taskId         The task ID.
		 * @param {string} actionType     The action type.
		 * @param {string} snoozeDuration If the action is `snooze`,
		 *                                the duration to snooze the task for.
		 */
		runTaskAction = ( taskId, actionType, snoozeDuration ) => {
			taskId = taskId.toString();
			const providerID = this.querySelector( 'li' ).getAttribute(
				'data-task-provider-id'
			);

			const data = {
				task_id: taskId,
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
					`.prpl-suggested-task[data-task-id="${ taskId }"]`
				);

				switch ( actionType ) {
					case 'snooze':
						el.remove();
						// Update the global var.
						window.prplSuggestedTasks.tasks.forEach(
							( task, index ) => {
								if ( task.task_id === taskId ) {
									window.prplSuggestedTasks.tasks[
										index
									].status = 'snoozed';
								}
							}
						);
						break;

					case 'complete':
						// Add the task to the pending celebration.
						window.prplSuggestedTasks.tasks.forEach(
							( task, index ) => {
								if ( task.task_id === taskId ) {
									window.prplSuggestedTasks.tasks[
										index
									].status = 'pending_celebration';
								}
							}
						);
						// Set the task action to celebrate.
						el.setAttribute( 'data-task-action', 'celebrate' );

						const event = new CustomEvent(
							'prplUpdateRaviGaugeEvent',
							{
								detail: {
									pointsDiff: parseInt(
										this.querySelector( 'li' ).getAttribute(
											'data-task-points'
										)
									),
								},
							}
						);
						document.dispatchEvent( event );

						// Trigger the celebration event.
						document.dispatchEvent(
							new Event( 'prplCelebrateTasks' )
						);

						break;

					case 'delete':
						el.remove();
						break;
				}

				const event = new CustomEvent(
					'prplMaybeInjectSuggestedTaskEvent',
					{
						detail: {
							taskId,
							providerID,
						},
					}
				);
				document.dispatchEvent( event );
			} );
		};
	}
);
