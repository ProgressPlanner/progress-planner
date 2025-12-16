/**
 * Rename Uncategorized Category Task Provider.
 *
 * React implementation of the Rename Uncategorized Category task.
 * Migrated from classes/suggested-tasks/providers/class-rename-uncategorized-category.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Rename Uncategorized Category Task Provider class.
 */
class RenameUncategorizedCategoryTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'rename-uncategorized-category',
			capability: 'manage_categories',
			isOnboardingTask: true,
			priority: 60,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/rename-uncategorized-category',
			popoverId: 'rename-uncategorized-category',
		} );
	}

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
		const taskId = this.getTaskId( taskData );

		// Build URL to category edit page.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }term.php?taxonomy=category&tag_ID=${ uncategorizedCategoryId }`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Rename Uncategorized category',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const renameUncategorizedCategoryTask = new RenameUncategorizedCategoryTask();

export default renameUncategorizedCategoryTask;
