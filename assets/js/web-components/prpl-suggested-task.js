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
			taskPopoverId,
		} ) {
			// Get parent class properties
			super();

			this.setAttribute( 'role', 'listitem' );

			let taskHeading = taskTitle;
			if ( taskUrl ) {
				taskHeading = `<a href="${ taskUrl }">${ taskTitle }</a>`;
			}

			if ( taskPopoverId ) {
				taskHeading = `<button popovertarget="${ taskPopoverId }">${ taskTitle }</button>`;
			}

			const isRemoteTask = taskId.startsWith( 'remote-task-' );
			const isDismissable = taskDismissable || isRemoteTask;

			const actionButtons = {
				info: `<button
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
						</button>`,
				snooze: `<button
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
						</button>`,
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
			};

			this.innerHTML = `
			<li class="prpl-suggested-task" data-task-id="${ taskId }" data-task-action="${ taskAction }" data-task-url="${ taskUrl }" data-task-provider-id="${ taskProviderID }" data-task-points="${ taskPoints }" data-task-category="${ taskCategory }">
				<h3><span>${ taskHeading }</span></h3>
				<div class="prpl-suggested-task-actions">
					<div class="tooltip-actions">
						${ actionButtons.info }
						${ actionButtons.snooze }
						${ actionButtons.complete }

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
					<span class="prpl-suggested-task-points">
						+${ taskPoints }
					</span>
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

							case 'complete':
								thisObj.runTaskAction(
									item.getAttribute( 'data-task-id' ),
									'complete'
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
