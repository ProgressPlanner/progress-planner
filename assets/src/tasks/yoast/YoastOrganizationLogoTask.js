/**
 * Yoast Organization Logo Task Provider.
 *
 * React implementation of the Yoast SEO set organization/person logo task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-organization-logo.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Organization Logo Task Provider class.
 */
class YoastOrganizationLogoTask extends InteractiveTaskProvider {
	static providerId = 'yoast-organization-logo';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/yoast-organization-logo';
	static popoverId = 'yoast-organization-logo';

	/**
	 * Whether the site is in person mode.
	 */
	isPersonMode = false;

	/**
	 * Check if the site is in person mode.
	 *
	 * @param {Object} yoastOptions The Yoast options.
	 * @return {boolean} True if in person mode.
	 */
	checkIsPersonMode( yoastOptions ) {
		return (
			yoastOptions?.wpseo_titles?.company_or_person === 'person' ||
			yoastOptions?.wpseo?.company_or_person === 'person'
		);
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
			const yoastOptions = await fetchDataCollector( 'yoast_options' );

			// If Yoast is not active, don't add the task.
			if ( ! yoastOptions ) {
				return false;
			}

			// Check if site logo is set (Yoast uses it as fallback).
			if ( yoastOptions.site_logo ) {
				return false;
			}

			// Store the mode for later use.
			this.isPersonMode = this.checkIsPersonMode( yoastOptions );

			// Check if Yoast-specific logo is already set.
			if ( this.isPersonMode && yoastOptions.wpseo_titles?.person_logo ) {
				// Person mode - logo is already set.
				return false;
			} else if (
				! this.isPersonMode &&
				yoastOptions.wpseo_titles?.company_logo
			) {
				// Company mode - logo is already set.
				return false;
			}

			return true;
		} catch ( error ) {
			console.error(
				'Error checking Yoast Organization Logo task condition:',
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
		// Refresh the mode check.
		const yoastOptions = await fetchDataCollector( 'yoast_options' );
		this.isPersonMode = this.checkIsPersonMode( yoastOptions );

		const title = this.isPersonMode
			? __( 'Yoast SEO: set your person logo', 'progress-planner' )
			: __( 'Yoast SEO: set your organization logo', 'progress-planner' );

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: title,
			url: this.buildAdminUrl(
				'admin.php?page=wpseo_page_settings#/site-representation'
			),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}

	/**
	 * Get external link URL.
	 *
	 * @return {string} The external link URL.
	 */
	getExternalLinkUrl() {
		return this.isPersonMode
			? 'https://prpl.fyi/yoast-person-logo'
			: 'https://prpl.fyi/yoast-organization-logo';
	}

	/**
	 * Get the label for the popover action.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		return __( 'Set logo', 'progress-planner' );
	}

	/**
	 * Get focus tasks configuration.
	 *
	 * @return {Array} Array of focus task configurations.
	 */
	getFocusTasks() {
		return [
			{
				iconElement: 'legend.yst-label',
				valueElement: {
					elementSelector: 'input[name="wpseo_titles.company_logo"]',
					attributeName: 'value',
					attributeValue: '',
					operator: '!=',
				},
			},
			{
				iconElement: 'legend.yst-label',
				valueElement: {
					elementSelector: 'input[name="wpseo_titles.person_logo"]',
					attributeName: 'value',
					attributeValue: '',
					operator: '!=',
				},
			},
		];
	}
}

// Self-register this task provider.
registerTask( YoastOrganizationLogoTask );

export default YoastOrganizationLogoTask;
