/**
 * Interactive Task Provider base class.
 *
 * Extends TaskProvider to provide functionality specific to interactive tasks.
 * Interactive tasks have popovers that allow users to complete tasks through forms.
 */

import { TaskProvider } from './TaskProvider';

/**
 * Interactive Task Provider class.
 *
 * Extends TaskProvider with interactive task-specific functionality.
 * Interactive tasks use popovers for user interaction.
 */
export class InteractiveTaskProvider extends TaskProvider {
	/**
	 * Constructor.
	 *
	 * @param {Object} config Task provider configuration.
	 */
	constructor( config ) {
		super( {
			...config,
			// Interactive tasks should have a popover ID.
			popoverId: config.popoverId || '',
		} );
	}

	/**
	 * Get the popover ID.
	 *
	 * @return {string} The popover ID (with prpl-popover- prefix).
	 */
	getPopoverId() {
		const popoverId = this.config.popoverId || '';
		return popoverId ? `prpl-popover-${ popoverId }` : '';
	}

	/**
	 * Get task details with popover ID included.
	 *
	 * Note: This method should be implemented by child classes to provide
	 * task-specific details. The popover_id should be added to the returned details.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		// Child classes must implement this method.
		// They should call super.getTaskDetails() if needed, but typically
		// they'll implement their own version that includes popover_id.
		throw new Error(
			'getTaskDetails() must be implemented by interactive task provider'
		);
	}

	/**
	 * Add popover ID to task details.
	 *
	 * Helper method for child classes to add popover_id to their task details.
	 *
	 * @param {Object} taskDetails The task details object.
	 * @return {Object} Task details with popover_id added.
	 */
	addPopoverIdToTaskDetails( taskDetails ) {
		if ( this.config.popoverId ) {
			taskDetails.popover_id = this.getPopoverId();
		}
		return taskDetails;
	}

	/**
	 * Get allowed interactive options.
	 *
	 * This should be implemented by child classes if they need to
	 * specify which WordPress options can be updated.
	 * The default list is handled server-side via the REST API.
	 *
	 * @return {Array<string>} Array of allowed option names.
	 */
	getAllowedInteractiveOptions() {
		// Default list is maintained server-side in class-popover-actions.php
		// Child classes can override to add more options.
		return [];
	}
}
