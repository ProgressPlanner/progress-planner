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

			prplInteractiveTaskFormListener.showLoading( formElement );

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
					const postId = parseInt( taskEl.dataset.postId );
					if ( ! postId ) {
						return response;
					}

					prplInteractiveTaskFormListener.hideLoading( formElement );

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

		const formSubmitHandler = ( event ) => {
			event.preventDefault();

			prplInteractiveTaskFormListener.showLoading( formElement );

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
				} )
				.finally( () => {
					// Hide loading state.
					prplInteractiveTaskFormListener.hideLoading( formElement );

					// Remove the form listener once the callback is executed.
					formElement.removeEventListener(
						'submit',
						formSubmitHandler
					);
				} );
		};

		// Add a form listener to the form.
		formElement.addEventListener( 'submit', formSubmitHandler );
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

			prplInteractiveTaskFormListener.showLoading( formElement );

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
				} )
				.finally( () => {
					// Hide loading state.
					prplInteractiveTaskFormListener.hideLoading( formElement );
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

		// Check if there's already an error message <p> element right after the form
		const existingErrorElement = formElement.parentNode.querySelector(
			'p.prpl-interactive-task-error-message'
		);

		if ( ! existingErrorElement ) {
			// Add paragraph with error message.
			const errorParagraph = document.createElement( 'p' );
			errorParagraph.classList.add(
				'prpl-note',
				'prpl-note-error',
				'prpl-interactive-task-error-message'
			);
			errorParagraph.textContent = prplL10n( 'somethingWentWrong' );

			// Append after the form element.
			formElement.insertAdjacentElement( 'afterend', errorParagraph );
		}
	},

	/**
	 * Show loading state.
	 *
	 * @param {HTMLFormElement} formElement - The form element.
	 * @return {void}
	 */
	showLoading: ( formElement ) => {
		let submitButton = formElement.querySelector( 'button[type="submit"]' );

		if ( ! submitButton ) {
			submitButton = formElement.querySelector(
				'button[data-action="completeTask"]'
			);
		}

		submitButton.disabled = true;

		// Add spinner.
		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>'; // WP spinner.

		// Append spinner after submit button.
		submitButton.after( spinner );
	},

	/**
	 * Hide loading state.
	 *
	 * @param {HTMLFormElement} formElement - The form element.
	 * @return {void}
	 */
	hideLoading: ( formElement ) => {
		let submitButton = formElement.querySelector( 'button[type="submit"]' );

		if ( ! submitButton ) {
			submitButton = formElement.querySelector(
				'button[data-action="completeTask"]'
			);
		}

		submitButton.disabled = false;
		const spinner = formElement.querySelector( 'span.prpl-spinner' );
		if ( spinner ) {
			spinner.remove();
		}
	},
};
