/**
 * useBadgeData Hook
 *
 * Custom hook for fetching badge data (activities, stats, config).
 * Used by badge widgets (ContentBadges, StreakBadges, etc.).
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { fetchActivities, fetchBadgeStats } from '../../services/badgeService';

/**
 * Custom hook for fetching badge data.
 *
 * @return {Object} { isLoading, error, data, refetch }
 */
export function useBadgeData() {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ data, setData ] = useState( null );

	const fetchData = useCallback( async () => {
		try {
			setIsLoading( true );
			setError( null );

			// Fetch activities and badge stats in parallel.
			// Config is included in activities response.
			const [ activitiesResponse, statsResponse ] = await Promise.all( [
				fetchActivities(),
				fetchBadgeStats(),
			] );

			setData( {
				activities: activitiesResponse.activities || [],
				totalPostsCount: activitiesResponse.totalPostsCount || 0,
				activationDate: activitiesResponse.activationDate,
				savedStats: statsResponse,
				config: activitiesResponse.config || {
					brandingId: 0,
					remoteServerUrl: '',
					placeholderUrl: '',
				},
			} );
		} catch ( err ) {
			setError( err.message || 'Failed to load badge data' );
		} finally {
			setIsLoading( false );
		}
	}, [] );

	useEffect( () => {
		fetchData();
	}, [ fetchData ] );

	return { isLoading, error, data, refetch: fetchData };
}
