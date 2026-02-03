/**
 * useTaskCompletion Hook
 *
 * Handles task completion during onboarding.
 *
 * @package
 */

import { useState, useCallback } from '@wordpress/element';
import { ajaxRequest } from '../../utils/ajaxRequest';

/**
 * Hook for completing tasks during onboarding.
 *
 * @param {Object} config         - Configuration object.
 * @param {string} config.ajaxUrl - AJAX URL for task completion.
 * @param {string} config.nonce   - Nonce for AJAX requests.
 * @return {Object} Task completion functions.
 */
export function useTaskCompletion( { ajaxUrl, nonce } ) {
	const [ isCompleting, setIsCompleting ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Complete a task.
	 *
	 * @param {string} taskId     - Task ID to complete.
	 * @param {Object} formValues - Form values for task completion.
	 * @return {Promise<Object>} Promise resolving to completion result.
	 */
	const completeTask = useCallback(
		async ( taskId, formValues = {} ) => {
			setIsCompleting( true );
			setError( null );

			try {
				const response = await ajaxRequest( {
					url: ajaxUrl,
					data: {
						action: 'progress_planner_onboarding_complete_task',
						nonce,
						task_id: taskId,
						form_values: JSON.stringify( formValues ),
					},
				} );

				if ( response.success ) {
					return response;
				}
				throw new Error(
					response.data?.message || 'Failed to complete task'
				);
			} catch ( err ) {
				setError( err.message || 'Failed to complete task' );
				throw err;
			} finally {
				setIsCompleting( false );
			}
		},
		[ ajaxUrl, nonce ]
	);

	return {
		completeTask,
		isCompleting,
		error,
	};
}
