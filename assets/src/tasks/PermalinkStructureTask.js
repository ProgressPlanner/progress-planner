/**
 * Permalink Structure Task Provider.
 *
 * React implementation of the Permalink Structure task.
 * Migrated from classes/suggested-tasks/providers/class-permalink-structure.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { cachedApiFetch } from '../services/apiFetchCache';

/**
 * Permalink Structure Task Provider class.
 */
class PermalinkStructureTask extends InteractiveTaskProvider {
	static providerId = 'core-permalink-structure';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 3;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl =
		'https://prpl.fyi/change-default-permalink-structure';
	static popoverId = 'core-permalink-structure';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Fetch WordPress settings to check permalink structure.
			const settings = await cachedApiFetch( {
				path: '/wp/v2/settings',
			} );

			const permalinkStructure = settings?.permalink_structure || '';

			// Task should be added if permalink structure is the default day-based one.
			return (
				permalinkStructure === '/%year%/%monthnum%/%day%/%postname%/' ||
				permalinkStructure ===
					'/index.php/%year%/%monthnum%/%day%/%postname%/'
			);
		} catch ( error ) {
			console.error(
				'Error checking Permalink Structure task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get task details.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Set permalink structure',
			url: this.buildAdminUrl( 'options-permalink.php' ),
			link_setting: {
				hook: 'options-permalink.php',
				iconEl: 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]',
			},
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( PermalinkStructureTask );

export default PermalinkStructureTask;
