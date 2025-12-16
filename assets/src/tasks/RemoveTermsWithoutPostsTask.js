/**
 * Remove Terms Without Posts Task Provider.
 *
 * React implementation of the Remove Terms Without Posts task.
 * Migrated from classes/suggested-tasks/providers/class-remove-terms-without-posts.php
 *
 * Note: This is a multi-task provider that creates multiple tasks.
 * Basic implementation - can be refined with proper data collection.
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Remove Terms Without Posts Task Provider class.
 */
class RemoveTermsWithoutPostsTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'remove-terms-without-posts',
			capability: 'edit_others_posts',
			isOnboardingTask: false,
			priority: 60,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/remove-empty-taxonomy',
			popoverId: 'remove-terms-without-posts',
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
			// The PHP version creates multiple tasks for terms without posts.
			// This is complex multi-task logic.
			// For React, we'll check if there are terms without posts.
			const termsWithoutPosts = await fetchDataCollector(
				'terms_without_posts'
			);

			if ( termsWithoutPosts && termsWithoutPosts.length > 0 ) {
				return true;
			}

			return false;
		} catch ( error ) {
			console.error(
				'Error checking Remove Terms Without Posts task condition:',
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
		const taskId = this.getTaskId( taskData );
		const targetTermId = taskData?.target_term_id || null;
		const targetTaxonomy = taskData?.target_taxonomy || null;

		if ( ! targetTermId || ! targetTaxonomy ) {
			throw new Error(
				'RemoveTermsWithoutPostsTask requires target_term_id and target_taxonomy in taskData'
			);
		}

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }edit-tags.php?taxonomy=${ targetTaxonomy }`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: `Remove term #${ targetTermId }`,
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_blank',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			target_term_id: targetTermId,
			target_taxonomy: targetTaxonomy,
		};

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

const removeTermsWithoutPostsTask = new RemoveTermsWithoutPostsTask();

export default removeTermsWithoutPostsTask;
