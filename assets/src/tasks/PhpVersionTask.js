/**
 * PHP Version Task Provider.
 *
 * React implementation of the PHP Version task.
 * Migrated from classes/suggested-tasks/providers/class-php-version.php
 *
 * Checks if the PHP version is below 8.2 and suggests updating.
 */

import { TaskProvider } from '../services/TaskProvider';
import { doAction } from '@wordpress/hooks';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Recommended minimum PHP version.
 */
const RECOMMENDED_PHP_VERSION = '8.2';

/**
 * PHP Version Task Provider class.
 */
class PhpVersionTask extends TaskProvider {
	static providerId = 'php-version';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 25;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/update-php-version';

	/**
	 * Check if the task should be added.
	 *
	 * Task should be added if PHP version is below 8.2.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const phpVersion = await fetchDataCollector( 'php_version' );

			if ( ! phpVersion ) {
				return false;
			}

			// Compare versions: return true if current version is less than recommended.
			return this.versionCompare(
				phpVersion,
				RECOMMENDED_PHP_VERSION,
				'<'
			);
		} catch ( error ) {
			console.error(
				'Error checking PHP version task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Compare two version strings.
	 *
	 * @param {string} v1       First version.
	 * @param {string} v2       Second version.
	 * @param {string} operator Comparison operator ('<', '<=', '>', '>=', '==').
	 * @return {boolean} Result of comparison.
	 */
	versionCompare( v1, v2, operator ) {
		const v1Parts = v1.split( '.' ).map( Number );
		const v2Parts = v2.split( '.' ).map( Number );

		// Pad shorter array with zeros.
		while ( v1Parts.length < v2Parts.length ) {
			v1Parts.push( 0 );
		}
		while ( v2Parts.length < v1Parts.length ) {
			v2Parts.push( 0 );
		}

		let compare = 0;
		for ( let i = 0; i < v1Parts.length; i++ ) {
			if ( v1Parts[ i ] < v2Parts[ i ] ) {
				compare = -1;
				break;
			}
			if ( v1Parts[ i ] > v2Parts[ i ] ) {
				compare = 1;
				break;
			}
		}

		switch ( operator ) {
			case '<':
				return compare < 0;
			case '<=':
				return compare <= 0;
			case '>':
				return compare > 0;
			case '>=':
				return compare >= 0;
			case '==':
				return compare === 0;
			default:
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

		const StaticClass = this.constructor;
		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Update PHP version',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url: '',
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
		};
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', PhpVersionTask, PhpVersionTask.priority );

export default PhpVersionTask;
