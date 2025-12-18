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
import { doAction } from '@wordpress/hooks';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Remove Terms Without Posts Task Provider class.
 */
class RemoveTermsWithoutPostsTask extends InteractiveTaskProvider {
	static providerId = 'remove-terms-without-posts';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 60;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/remove-empty-taxonomy';
	static popoverId = 'remove-terms-without-posts';
	static isMultiTask = true;

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const tasksToInject = await this.getTasksToInject();
			return tasksToInject && tasksToInject.length > 0;
		} catch ( error ) {
			console.error(
				'Error checking Remove Terms Without Posts task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get tasks to inject.
	 *
	 * Returns an array of taskData items, one for each term without posts.
	 *
	 * @return {Promise<Array>} Promise resolving to array of taskData objects.
	 */
	async getTasksToInject() {
		try {
			const termsWithoutPosts = await fetchDataCollector(
				'terms_without_posts'
			);

			if ( ! termsWithoutPosts ) {
				return [];
			}

			// Normalize to array - data collector returns single object, not array
			const termsArray = Array.isArray( termsWithoutPosts )
				? termsWithoutPosts
				: [ termsWithoutPosts ];

			if ( termsArray.length === 0 ) {
				return [];
			}

			// Return array of taskData objects, one per term
			return termsArray.map( ( term ) => ( {
				target_term_id: term.term_id,
				target_taxonomy: term.taxonomy,
			} ) );
		} catch ( error ) {
			console.error(
				'Error getting tasks to inject for Remove Terms Without Posts:',
				error
			);
			return [];
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
		const targetTermId = taskData?.target_term_id || null;
		const targetTaxonomy = taskData?.target_taxonomy || null;

		if ( ! targetTermId || ! targetTaxonomy ) {
			throw new Error(
				'RemoveTermsWithoutPostsTask requires target_term_id and target_taxonomy in taskData'
			);
		}

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: `Remove term #${ targetTermId }`,
			url: this.buildAdminUrl( 'edit-tags.php', {
				taxonomy: targetTaxonomy,
			} ),
			url_target: '_blank',
			target_term_id: targetTermId,
			target_taxonomy: targetTaxonomy,
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	RemoveTermsWithoutPostsTask,
	RemoveTermsWithoutPostsTask.priority
);

export default RemoveTermsWithoutPostsTask;
