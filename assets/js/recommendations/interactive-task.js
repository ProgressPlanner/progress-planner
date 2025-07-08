/* global prplSuggestedTask */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, progress-planner/web-components/prpl-interactive-task
 */

/**
 * Add a form listener to an interactive task form.
 *
 * @param {Object}      options               - The options for the interactive task form listener.
 * @param {HTMLElement} options.formElement   - The form element.
 * @param {string}      options.settingAPIKey - The API key for the setting.
 * @param {string}      options.setting       - The setting to update.
 * @param {string}      options.taskId        - The ID of the task.
 * @param {string}      options.popoverId     - The ID of the popover.
 */
// eslint-disable-next-line no-unused-vars
const prplInteractiveTaskFormListenerSiteSettings = ( {
	formElement,
	settingAPIKey,
	setting,
	taskId,
	popoverId,
	settingCallbackValue = ( value ) => value,
} = {} ) => {
	formElement.addEventListener( 'submit', ( event ) => {
		event.preventDefault();

		// Get the form data.
		const formData = new FormData( formElement );

		// Update the blog description.
		wp.api.loadPromise.done( () => {
			const settingsToPass = {};
			settingsToPass[ settingAPIKey ] = settingCallbackValue(
				formData.get( setting )
			);
			const settings = new wp.api.models.Settings( settingsToPass );

			settings.save().then( () => {
				const taskEl = document.querySelector(
					`#prpl-suggested-tasks-list .prpl-suggested-task[data-task-id="${ taskId }"]`
				);
				// Close popover.
				document.getElementById( popoverId ).hidePopover();
				const postId = parseInt( taskEl.dataset.postId );
				if ( postId ) {
					prplSuggestedTask.maybeComplete( postId );
					taskEl.setAttribute( 'data-task-action', 'celebrate' );
					document.dispatchEvent(
						new CustomEvent( 'prpl/celebrateTasks', {
							detail: {
								element: taskEl,
							},
						} )
					);
				}
			} );
		} );
	} );
};
