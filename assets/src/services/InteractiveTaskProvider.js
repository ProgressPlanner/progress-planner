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
	 * @param {Object} config Optional task provider configuration (for backward compatibility).
	 */
	constructor( config = {} ) {
		super( config );
	}

	/**
	 * Get the popover ID.
	 *
	 * @return {string} The popover ID (with prpl-popover- prefix).
	 */
	getPopoverId() {
		const StaticClass = this.constructor;
		const popoverId = StaticClass.popoverId || this.config.popoverId || '';
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
		const StaticClass = this.constructor;
		const popoverId = StaticClass.popoverId || this.config.popoverId || '';
		if ( popoverId ) {
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

	/**
	 * Add custom task actions for interactive tasks.
	 *
	 * Interactive tasks add a popover trigger action (priority 10).
	 * Child classes can override this to add additional actions.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 *
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData = [], actions = [] ) {
		const StaticClass = this.constructor;
		const popoverId = StaticClass.popoverId || this.config.popoverId || '';

		if ( popoverId ) {
			// Add popover trigger action with high priority (10).
			// This matches the PHP implementation where interactive tasks
			// add popover actions with priority 10.
			const popoverActionLabel = this.getPopoverActionLabel();
			actions.push( {
				priority: 10,
				html: `<a class="prpl-tooltip-action-text" href="#" role="button" onclick="event.preventDefault(); document.getElementById('${ this.escapeHtml(
					this.getPopoverId()
				) }')?.showPopover(); return false;">${ this.escapeHtml(
					popoverActionLabel
				) }</a>`,
			} );
		}

		// Call parent implementation to allow further customization.
		return super.addTaskActions( taskData, actions );
	}

	/**
	 * Get the label for the popover action.
	 *
	 * Child classes can override this to customize the action label.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		// Default label - child classes can override for specific labels.
		// For example, UpdateTermDescriptionTask uses "Write description".
		return 'Complete';
	}

	/**
	 * Escape HTML to prevent XSS.
	 *
	 * @param {string} text The text to escape.
	 * @return {string} The escaped text.
	 */
	escapeHtml( text ) {
		if ( typeof text !== 'string' ) {
			return '';
		}
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}
}
