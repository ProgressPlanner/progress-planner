/**
 * Select Locale Task Provider.
 *
 * React implementation of the Select Locale task.
 * Migrated from classes/suggested-tasks/providers/class-select-locale.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Select Locale Task Provider class.
 */
class SelectLocaleTask extends InteractiveTaskProvider {
	static providerId = 'select-locale';
	static capability = 'install_languages';
	static isOnboardingTask = false;
	static priority = 8;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/set-locale';
	static popoverId = 'select-locale';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// The PHP version checks:
			// - get_browser_locale() (browser language)
			// - get_locale() (WordPress locale)
			// - If browser locale doesn't match WordPress locale
			// For React, we can get browser locale from navigator.language.
			// WordPress locale would need REST API endpoint or data collector.
			const browserLocale =
				typeof window !== 'undefined' && window.navigator?.language
					? window.navigator.language.split( '-' )[ 0 ]
					: null;
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			const wpLocale = settings?.language || 'en';
			return browserLocale && ! wpLocale.startsWith( browserLocale );
		} catch ( error ) {
			console.error(
				'Error checking Select Locale task condition:',
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

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-general.php`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Select your site locale',
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
			link_setting: {
				hook: 'options-general.php',
				iconEl: 'label[for="WPLANG"]',
			},
		};

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', SelectLocaleTask, SelectLocaleTask.priority );

export default SelectLocaleTask;
