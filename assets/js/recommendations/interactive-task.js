/* global prplSuggestedTask, progressPlannerAjaxRequest, progressPlanner, prplL10n */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, progress-planner/web-components/prpl-interactive-task, progress-planner/ajax-request
 */

// eslint-disable-next-line no-unused-vars
const prplInteractiveTaskFormListener = {
	/**
	 * Add a form listener to an interactive task form.
	 *
	 * @param {Object}   options                      - The options for the interactive task form listener.
	 * @param {string}   options.settingAPIKey        - The API key for the setting.
	 * @param {string}   options.setting              - The setting to update.
	 * @param {string}   options.taskId               - The ID of the task.
	 * @param {string}   options.popoverId            - The ID of the popover.
	 * @param {Function} options.settingCallbackValue - The callback function to get the value of the setting.
	 */
	siteSettings: ( {
		settingAPIKey,
		setting,
		taskId,
		popoverId,
		settingCallbackValue = ( value ) => value,
	} = {} ) => {
		const formElement = document.querySelector( `#${ popoverId } form` );

		if ( ! formElement ) {
			return;
		}

		// Add a form listener to the form.
		formElement.addEventListener( 'submit', ( event ) => {
			event.preventDefault();

			// Get the form data.
			const formData = new FormData( formElement );
			const settingsToPass = {};
			settingsToPass[ settingAPIKey ] = settingCallbackValue(
				formData.get( setting )
			);

			const taskEl = document.querySelector(
				`.prpl-suggested-task[data-task-id="${ taskId }"]`
			);

			// Update the blog description.
			wp.api.loadPromise.done( () => {
				const settings = new wp.api.models.Settings( settingsToPass );

				settings.save().then( ( response ) => {
					console.log( response );
					if ( true !== response.success ) {
						// TODO: Handle error.
						return response;
					}

					const postId = parseInt( taskEl.dataset.postId );
					if ( ! postId ) {
						return response;
					}

					// This will trigger the celebration event (confetti) as well.
					prplSuggestedTask.maybeComplete( postId ).then( () => {
						// Close popover.
						document.getElementById( popoverId ).hidePopover();
					} );
				} );
			} );
		} );
	},

	customSubmit: ( { taskId, popoverId, callback = () => {} } = {} ) => {
		const formElement = document.querySelector( `#${ popoverId } form` );

		if ( ! formElement ) {
			return;
		}

		// Add a form listener to the form.
		formElement.addEventListener( 'submit', ( event ) => {
			event.preventDefault();

			callback()
				.then( ( response ) => {
					if ( true !== response.success ) {
						// Show error to the user.
						prplInteractiveTaskFormListener.showError(
							response,
							popoverId
						);

						return response;
					}

					const taskEl = document.querySelector(
						`.prpl-suggested-task[data-task-id="${ taskId }"]`
					);

					const postId = parseInt( taskEl.dataset.postId );
					if ( ! postId ) {
						return;
					}

					// This will trigger the celebration event (confetti) as well.
					prplSuggestedTask.maybeComplete( postId ).then( () => {
						// Close popover.
						document.getElementById( popoverId ).hidePopover();
					} );
				} )
				.catch( ( error ) => {
					// Show error to the user.
					prplInteractiveTaskFormListener.showError(
						error,
						popoverId
					);
				} );
		} );
	},

	settings: ( {
		taskId,
		setting,
		settingPath = false,
		popoverId,
		settingCallbackValue = ( settingValue ) => settingValue,
		action = 'prpl_interactive_task_submit',
	} = {} ) => {
		const formElement = document.querySelector( `#${ popoverId } form` );

		if ( ! formElement ) {
			return;
		}

		formElement.addEventListener( 'submit', ( event ) => {
			event.preventDefault();

			const formData = new FormData( formElement );
			const settingsToPass = {};
			settingsToPass[ setting ] = settingCallbackValue(
				formData.get( setting )
			);

			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action,
					_ajax_nonce: progressPlanner.nonce,
					post_id: taskId,
					setting,
					value: settingsToPass[ setting ],
					setting_path: settingPath,
				},
			} )
				.then( ( response ) => {
					console.log( response );
					if ( true !== response.success ) {
						// Show error to the user.
						prplInteractiveTaskFormListener.showError(
							response,
							popoverId
						);

						return response;
					}

					const taskEl = document.querySelector(
						`.prpl-suggested-task[data-task-id="${ taskId }"]`
					);

					if ( ! taskEl ) {
						return response;
					}

					const postId = parseInt( taskEl.dataset.postId );
					if ( ! postId ) {
						return response;
					}

					// This will trigger the celebration event (confetti) as well.
					prplSuggestedTask.maybeComplete( postId ).then( () => {
						// Close popover.
						document.getElementById( popoverId ).hidePopover();
					} );
				} )
				.catch( ( error ) => {
					// Show error to the user.
					prplInteractiveTaskFormListener.showError(
						error,
						popoverId
					);
				} );
		} );
	},

	/**
	 * Helper which shows user an error message.
	 * For now the error message is generic.
	 *
	 * @param {Object} error     - The error object.
	 * @param {string} popoverId - The ID of the popover.
	 * @return {void}
	 */
	showError: ( error, popoverId ) => {
		const formElement = document.querySelector( `#${ popoverId } form` );

		if ( ! formElement ) {
			return;
		}

		console.error( 'Error in interactive task callback:', error );

		// Add error message.
		const submitButton = formElement.querySelector(
			'button[type="submit"]'
		);

		if (
			submitButton &&
			! formElement.querySelector(
				'.prpl-interactive-task-error-message'
			)
		) {
			// Add paragraph with error message.
			const errorParagraph = document.createElement( 'p' );
			errorParagraph.classList.add(
				'prpl-note',
				'prpl-note-error',
				'prpl-interactive-task-error-message'
			);
			errorParagraph.textContent = prplL10n( 'somethingWentWrong' );

			// Append before submit button.
			submitButton.parentNode.insertBefore(
				errorParagraph,
				submitButton
			);
		}
	},
};
