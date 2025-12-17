/**
 * useOnboardingProgress Hook
 *
 * Handles saving and restoring onboarding wizard progress via AJAX.
 *
 * @package
 */

import { useState, useCallback } from '@wordpress/element';
import { ajaxRequest } from '../utils/ajaxRequest';

/**
 * Hook for managing onboarding progress persistence.
 *
 * @param {Object} config         - Configuration object.
 * @param {string} config.ajaxUrl - AJAX URL for saving progress.
 * @param {string} config.nonce   - Nonce for AJAX requests.
 * @return {Object} Progress management functions.
 */
export function useOnboardingProgress( { ajaxUrl, nonce } ) {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Save progress to server.
	 *
	 * @param {Object} state - Wizard state to save.
	 * @return {Promise<Object>} Promise resolving to save result.
	 */
	const saveProgress = useCallback(
		async ( state ) => {
			setIsSaving( true );
			setError( null );

			try {
				const response = await ajaxRequest( {
					url: ajaxUrl,
					data: {
						action: 'progress_planner_onboarding_save_progress',
						nonce,
						state: JSON.stringify( state ),
					},
				} );

				if ( response.success ) {
					return response;
				}
				throw new Error(
					response.data?.message || 'Failed to save progress'
				);
			} catch ( err ) {
				setError( err.message || 'Failed to save progress' );
				throw err;
			} finally {
				setIsSaving( false );
			}
		},
		[ ajaxUrl, nonce ]
	);

	return {
		saveProgress,
		isSaving,
		error,
	};
}

