/**
 * Rename Uncategorized Category Task Provider.
 *
 * React implementation of the Rename Uncategorized Category task.
 * Migrated from classes/suggested-tasks/providers/class-rename-uncategorized-category.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Rename Uncategorized Category Task Provider class.
 */
class RenameUncategorizedCategoryTask extends InteractiveTaskProvider {
	static providerId = 'rename-uncategorized-category';
	static capability = 'manage_categories';
	static isOnboardingTask = true;
	static priority = 60;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/rename-uncategorized-category';
	static popoverId = 'rename-uncategorized-category';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const uncategorizedCategoryId = await fetchDataCollector(
				'uncategorized_category_id'
			);
			return (
				uncategorizedCategoryId !== 0 &&
				uncategorizedCategoryId !== null
			);
		} catch ( error ) {
			console.error(
				'Error checking Rename Uncategorized Category task condition:',
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
		const uncategorizedCategoryId = await fetchDataCollector(
			'uncategorized_category_id'
		);

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Rename Uncategorized category',
			url: this.buildAdminUrl( 'term.php', {
				taxonomy: 'category',
				tag_ID: uncategorizedCategoryId,
			} ),
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( RenameUncategorizedCategoryTask );

export default RenameUncategorizedCategoryTask;
