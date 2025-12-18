/**
 * Task utility functions.
 */

import {
	getTaskProviderClass,
	getTaskProviderInstance,
} from '../../services/taskRegistry';

/**
 * Get points for a task.
 *
 * Points are retrieved in this order:
 * 1. From prpl_points in REST response (PHP providers set this)
 * 2. From provider instance's getPoints() method (for dynamic calculation)
 * 3. From static points property on React provider class
 * 4. Default to 1 point
 *
 * @param {Object} task The task object.
 * @return {number} The points value.
 */
export function getTaskPoints( task ) {
	// 1. Use prpl_points from REST if available (PHP provider)
	if ( task.prpl_points !== undefined && task.prpl_points !== null ) {
		return parseInt( task.prpl_points, 10 ) || 0;
	}

	// 2. Get from React provider class via registry
	const providerId = task.prpl_provider?.slug;
	if ( providerId ) {
		const TaskClass = getTaskProviderClass( providerId );
		if ( TaskClass ) {
			// Try provider instance's getPoints() method for dynamic calculation
			const instance = getTaskProviderInstance( providerId );
			if ( instance && typeof instance.getPoints === 'function' ) {
				return instance.getPoints( task );
			}

			// Fall back to static points property
			if ( TaskClass.points !== undefined ) {
				return TaskClass.points;
			}
		}
	}

	// 3. Default to 1 point for unknown tasks
	return 1;
}
