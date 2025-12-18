/**
 * User Task Provider.
 *
 * Handles user-created todo items. Unlike other providers,
 * this does NOT inject tasks - users create them manually via the TodoWidget.
 *
 * Points calculation:
 * - Golden tasks (first task, marked with 'GOLDEN' in excerpt) get 1 point
 * - Regular user tasks get 0 points
 */

import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { TaskProvider } from '../services/TaskProvider';

/**
 * User Task Provider class.
 */
class UserTask extends TaskProvider {
	// Static configuration
	static providerId = 'user';
	static capability = 'edit_posts';
	static isOnboardingTask = false;
	static priority = 999; // Low priority (user tasks come last)
	static points = 0; // Default points; golden tasks override via getPoints()
	static isDismissable = true;
	static isSnoozable = false; // User tasks cannot be snoozed
	static isRepetitive = false;
	static externalLinkUrl = '';

	/**
	 * User tasks are never auto-injected.
	 * Users create them manually via the TodoWidget form.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Always returns false.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		return false;
	}

	/**
	 * Get task details from REST API response data.
	 *
	 * @param {Object} taskData Task data from REST API.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		return this.buildTaskDetails( taskData, {
			post_title: taskData.title?.rendered || taskData.title || '',
			description: taskData.content?.rendered || '',
			points: this.getPoints( taskData ),
		} );
	}

	/**
	 * Get points for this task.
	 *
	 * Golden tasks (marked with 'GOLDEN' in excerpt) get 1 point.
	 * Regular user tasks get 0 points.
	 *
	 * @param {Object} taskData Task data containing excerpt.
	 * @return {number} Points value (0 or 1).
	 */
	getPoints( taskData = {} ) {
		// Check for GOLDEN marker in excerpt
		const excerpt = taskData.excerpt?.rendered || taskData.excerpt || '';
		return excerpt.includes( 'GOLDEN' ) ? 1 : 0;
	}

	/**
	 * Add Edit action for inline title editing.
	 *
	 * @param {Object} taskData Task data.
	 * @param {Array}  actions  Existing actions array.
	 * @return {Array} Actions array with Edit action added.
	 */
	// eslint-disable-next-line no-unused-vars
	addTaskActions( taskData = {}, actions = [] ) {
		actions.push( {
			priority: 10,
			html: `<a class="prpl-tooltip-action-text" href="#" onclick="event.preventDefault();this.closest('li.prpl-suggested-task').querySelector('.prpl-task-title span').focus();">${ __(
				'Edit',
				'progress-planner'
			) }</a>`,
		} );
		return actions;
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', UserTask, UserTask.priority );

export default UserTask;
