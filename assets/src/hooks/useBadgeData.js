/**
 * useBadgeData Hook
 *
 * Custom hook for fetching badge data from the REST API.
 * Used by badge widgets (ContentBadges, StreakBadges, etc.).
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook for fetching badge data.
 *
 * @param {string} endpoint - The REST API endpoint path.
 * @return {Object} { isLoading, error, data, refetch }
 */
export function useBadgeData( endpoint ) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ data, setData ] = useState( null );

	const fetchData = useCallback( async () => {
		try {
			setIsLoading( true );
			setError( null );

			const response = await apiFetch( { path: endpoint } );

			setData( {
				currentBadge: response.currentBadge,
				allBadges: response.allBadges || [],
				config: {
					brandingId: response.brandingId || 0,
					remoteServerUrl: response.remoteServerUrl || '',
					placeholderUrl: response.placeholderUrl || '',
				},
			} );
		} catch ( err ) {
			setError( err.message || 'Failed to load badge data' );
		} finally {
			setIsLoading( false );
		}
	}, [ endpoint ] );

	useEffect( () => {
		fetchData();
	}, [ fetchData ] );

	return { isLoading, error, data, refetch: fetchData };
}
