/**
 * Task Provider Hook.
 *
 * React hook for working with task providers.
 * Provides helpers for data collection and task evaluation.
 */

import { useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Hook for task provider operations.
 *
 * @return {Object} Task provider helper functions.
 */
export function useTaskProvider() {
	/**
	 * Fetch data from a data collector.
	 *
	 * @param {string} collectorId The data collector ID (DATA_KEY).
	 * @return {Promise<*>} Promise resolving to the collected data.
	 */
	const fetchDataCollector = useCallback( async ( collectorId ) => {
		try {
			const response = await apiFetch( {
				path: `/progress-planner/v1/data-collectors/${ collectorId }`,
			} );
			return response.data;
		} catch ( error ) {
			console.error(
				`Error fetching data collector "${ collectorId }":`,
				error
			);
			throw error;
		}
	}, [] );

	/**
	 * Create a task post via REST API.
	 *
	 * @param {Object} taskDetails The task details object.
	 * @return {Promise<Object>} Promise resolving to the created task response.
	 */
	const createTaskPost = useCallback( async ( taskDetails ) => {
		try {
			const response = await apiFetch( {
				path: '/progress-planner/v1/tasks/evaluate',
				method: 'POST',
				data: {
					task_details: taskDetails,
				},
			} );
			return response;
		} catch ( error ) {
			console.error( 'Error creating task post:', error );
			throw error;
		}
	}, [] );

	return {
		fetchDataCollector,
		createTaskPost,
	};
}
