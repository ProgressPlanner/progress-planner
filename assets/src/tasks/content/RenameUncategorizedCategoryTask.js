/**
 * Rename Uncategorized Category Task Provider.
 *
 * React implementation of the Rename Uncategorized Category task.
 * Migrated from classes/suggested-tasks/providers/class-rename-uncategorized-category.php
 */

import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Rename Uncategorized Category Task Provider class.
 */
class RenameUncategorizedCategoryTask extends InteractiveTaskProvider {
	static providerId = 'rename-uncategorized-category';
	static capability = 'manage_categories';
	static isOnboardingTask = true;
	static priority = 60;
	static points = 1;
	static isDismissable = true;
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
		const taskId = this.getTaskId( taskData );

		// Build URL to category edit page.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }term.php?taxonomy=category&tag_ID=${ uncategorizedCategoryId }`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Rename Uncategorized category',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url,
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	RenameUncategorizedCategoryTask,
	RenameUncategorizedCategoryTask.priority
);

export default RenameUncategorizedCategoryTask;
