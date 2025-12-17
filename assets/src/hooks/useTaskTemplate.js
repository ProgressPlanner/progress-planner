/**
 * useTaskTemplate Hook
 *
 * Fetches and renders task-specific templates from PHP.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { ajaxRequest } from '../utils/ajaxRequest';

/**
 * Hook for fetching task template HTML.
 *
 * @param {Object} config        - Configuration object.
 * @param {string} config.ajaxUrl - AJAX URL.
 * @param {string} config.nonce  - Nonce for AJAX requests.
 * @param {string} taskId        - Task ID to fetch template for.
 * @param {Object} taskData      - Task data to pass to template.
 * @return {Object} Template HTML and loading state.
 */
export function useTaskTemplate( { ajaxUrl, nonce }, taskId, taskData = {} ) {
	const [ templateHtml, setTemplateHtml ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		if ( ! taskId ) {
			return;
		}

		const fetchTemplate = async () => {
			setIsLoading( true );
			setError( null );

			try {
				const response = await ajaxRequest( {
					url: ajaxUrl,
					data: {
						action: 'progress_planner_get_task_template',
						nonce,
						task_id: taskId,
						task_data: JSON.stringify( taskData ),
					},
				} );

				if ( response.success && response.data?.html ) {
					setTemplateHtml( response.data.html );
				} else {
					throw new Error( response.data?.message || 'Failed to fetch template' );
				}
			} catch ( err ) {
				setError( err.message || 'Failed to fetch template' );
				console.error( 'Failed to fetch task template:', err );
			} finally {
				setIsLoading( false );
			}
		};

		fetchTemplate();
	}, [ ajaxUrl, nonce, taskId, JSON.stringify( taskData ) ] );

	return {
		templateHtml,
		isLoading,
		error,
	};
}

