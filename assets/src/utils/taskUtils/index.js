/**
 * Task utility functions.
 */

import { getTaskProviderClass } from '../../services/taskRegistry';

/**
 * Get points for a task.
 *
 * Points are retrieved in this order:
 * 1. From prpl_points in REST response (PHP providers)
 * 2. From static points property on React provider class
 * 3. Default to 1 point
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
		if ( TaskClass && TaskClass.points !== undefined ) {
			return TaskClass.points;
		}
	}

	// 3. Default to 1 point
	return 1;
}
