/**
 * AIOSEO Organization Logo Task Provider.
 *
 * React implementation of the AIOSEO set organization logo task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-organization-logo.php
 */

import { __ } from '@wordpress/i18n';
import { TaskProvider } from '../../services/TaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Organization Logo Task Provider class.
 */
class AIOSEOOrganizationLogoTask extends TaskProvider {
	static providerId = 'aioseo-organization-logo';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/aioseo-organization-logo';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const aioseoOptions = await fetchDataCollector( 'aioseo_options' );

			// If AIOSEO is not active, don't add the task.
			if ( ! aioseoOptions ) {
				return false;
			}

			// Only show task for organization sites, not person sites.
			if ( aioseoOptions.schema?.siteRepresents === 'person' ) {
				return false;
			}

			// Show task if organization logo is not set.
			return aioseoOptions.schema?.organizationLogo === '';
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Organization Logo task condition:',
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
		return this.buildTaskDetails( taskData, {
			post_title: __(
				'All in One SEO: set your organization logo',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=aioseo-search-appearance#/'
			),
		} );
	}

	/**
	 * Add custom task actions.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData, actions ) {
		actions.push( {
			type: 'link',
			priority: 10,
			label: __( 'Set logo', 'progress-planner' ),
			url: this.buildAdminUrl(
				'admin.php?page=aioseo-search-appearance#/'
			),
			target: '_self',
		} );

		return actions;
	}
}

// Self-register this task provider.
registerTask( AIOSEOOrganizationLogoTask );

export default AIOSEOOrganizationLogoTask;
