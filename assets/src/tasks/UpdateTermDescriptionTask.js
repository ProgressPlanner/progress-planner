/**
 * Update Term Description Task Provider.
 *
 * React implementation of the Update Term Description task.
 * Migrated from classes/suggested-tasks/providers/class-update-term-description.php
 *
 * Note: This is a multi-task provider that creates multiple tasks.
 * Basic implementation - can be refined with proper data collection.
 */

import { __, sprintf } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Update Term Description Task Provider class.
 */
class UpdateTermDescriptionTask extends InteractiveTaskProvider {
	static providerId = 'update-term-description';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 80;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/taxonomy-terms-description';
	static popoverId = 'update-term-description';
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
				'Error checking Update Term Description task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get tasks to inject.
	 *
	 * Returns an array of taskData items, one for each term without a description.
	 *
	 * @return {Promise<Array>} Promise resolving to array of taskData objects.
	 */
	async getTasksToInject() {
		try {
			const termsWithoutDescription = await fetchDataCollector(
				'terms_without_description'
			);

			if ( ! termsWithoutDescription ) {
				return [];
			}

			// Normalize to array - data collector returns single object, not array
			const termsArray = Array.isArray( termsWithoutDescription )
				? termsWithoutDescription
				: [ termsWithoutDescription ];

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
				'Error getting tasks to inject for Update Term Description:',
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
				'UpdateTermDescriptionTask requires target_term_id and target_taxonomy in taskData'
			);
		}

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: sprintf(
				/* translators: %d: term ID */
				__( 'Write description for term #%d', 'progress-planner' ),
				targetTermId
			),
			url: this.buildAdminUrl( 'term.php', {
				taxonomy: targetTaxonomy,
				tag_ID: targetTermId,
			} ),
			url_target: '_blank',
			target_term_id: targetTermId,
			target_taxonomy: targetTaxonomy,
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}

	/**
	 * Add custom task actions for Update Term Description task.
	 *
	 * Adds a "Write description" action that opens the popover and dispatches
	 * a custom event with task context data.
	 * Note: Does not call super to avoid duplicate popover actions.
	 * Standard actions (complete, snooze) are already in the actions array.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array (already contains complete, snooze, etc.).
	 *
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData = [], actions = [] ) {
		const targetTermId =
			taskData.target_term_id || taskData.meta?.target_term_id || null;
		const targetTaxonomy =
			taskData.target_taxonomy || taskData.meta?.target_taxonomy || null;

		if ( ! targetTermId || ! targetTaxonomy ) {
			// If we don't have term data, use default popover action from parent.
			return super.addTaskActions( taskData, actions );
		}

		// Build task context data for the custom event.
		const taskContext = {
			post_title: taskData.title?.rendered || taskData.post_title || '',
			target_term_id: targetTermId,
			target_taxonomy: targetTaxonomy,
			target_term_name: taskData.meta?.target_term_name || '',
			target_taxonomy_name: taskData.meta?.target_taxonomy_name || '',
		};

		// Add custom "Write description" popover action with priority 10.
		// This replaces the default popover action from InteractiveTaskProvider.
		actions.push( {
			type: 'popover',
			priority: 10,
			popoverId: this.getPopoverId(),
			label: __( 'Write description', 'progress-planner' ),
			taskContext,
			eventName: 'prpl-interactive-task-action-update-term-description',
		} );

		// Return actions without calling super to avoid duplicate popover action.
		// Standard actions (complete, snooze, info) are already in the array.
		return actions;
	}

	/**
	 * Get the label for the popover action.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		return __( 'Write description', 'progress-planner' );
	}
}

// Self-register this task provider
registerTask( UpdateTermDescriptionTask );

export default UpdateTermDescriptionTask;
