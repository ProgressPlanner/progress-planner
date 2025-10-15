/* global prplSuggestedTask, progressPlannerAjaxRequest, progressPlanner */

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

				settings.save().then( () => {
					const postId = parseInt( taskEl.dataset.postId );
					if ( ! postId ) {
						return;
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

		const formSubmitHandler = ( event ) => {
			event.preventDefault();

			callback();

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

			// Remove the form listener once the callback is executed.
			formElement.removeEventListener( 'submit', formSubmitHandler );
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
			} ).then( () => {
				const taskEl = document.querySelector(
					`.prpl-suggested-task[data-task-id="${ taskId }"]`
				);

				if ( ! taskEl ) {
					return;
				}

				const postId = parseInt( taskEl.dataset.postId );
				if ( ! postId ) {
					return;
				}

				// This will trigger the celebration event (confetti) as well.
				prplSuggestedTask.maybeComplete( postId ).then( () => {
					// Close popover.
					document.getElementById( popoverId ).hidePopover();
				} );
			} );
		} );
	},
};
