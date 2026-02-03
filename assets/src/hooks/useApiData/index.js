/**
 * useApiData Hook
 *
 * Shared hook for fetching data from the REST API with loading/error states.
 * Uses the centralized apiFetchCache service for caching and request deduplication.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	cachedApiFetch,
	clearCache,
	clearCacheFor,
} from '../../services/apiFetchCache';

/**
 * Default cache TTL in milliseconds (5 minutes).
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear cache for a specific path or all paths.
 * Delegates to the centralized cache service.
 *
 * @param {string|null} path - The API endpoint path to clear, or null for all.
 */
export function clearApiCache( path = null ) {
	if ( path ) {
		clearCacheFor( path );
	} else {
		clearCache();
	}
}

/**
 * Custom hook for fetching data from REST API.
 *
 * @param {string}        path              - The API endpoint path.
 * @param {Array}         dependencies      - Optional dependencies array for useEffect.
 * @param {string|Object} errorMessage      - Default error message or object with message property.
 * @param {Object}        options           - Additional options.
 * @param {boolean}       options.cache     - Whether to use caching (default: true).
 * @param {number}        options.cacheTtl  - Cache TTL in milliseconds (default: 5 minutes).
 * @param {boolean}       options.skipCache - Skip cache for this specific fetch.
 * @return {Object} Object containing isLoading, error, data, and refetch function.
 */
export function useApiData(
	path,
	dependencies = [],
	errorMessage = 'Failed to load data',
	options = {}
) {
	const {
		cache = true,
		cacheTtl = DEFAULT_CACHE_TTL,
		skipCache = false,
	} = options;

	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ data, setData ] = useState( null );

	/**
	 * Fetch data from API.
	 *
	 * @param {boolean} forceRefresh - Force refresh bypassing cache.
	 */
	const fetchData = useCallback(
		async ( forceRefresh = false ) => {
			// Skip fetch if path is empty.
			if ( ! path ) {
				setIsLoading( false );
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				const response = await cachedApiFetch(
					{ path },
					{
						skipCache: forceRefresh || skipCache || ! cache,
						ttl: cacheTtl,
					}
				);
				setData( response );
			} catch ( err ) {
				const message =
					err.message ||
					( typeof errorMessage === 'string'
						? errorMessage
						: errorMessage.message || 'Failed to load data' );
				setError( message );
			} finally {
				setIsLoading( false );
			}
		},
		[ path, cache, cacheTtl, skipCache, errorMessage ]
	);

	useEffect( () => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ path, ...dependencies ] );

	/**
	 * Refetch data, optionally bypassing cache.
	 *
	 * @param {boolean} bypassCache - Whether to bypass cache.
	 */
	const refetch = useCallback(
		( bypassCache = true ) => {
			fetchData( bypassCache );
		},
		[ fetchData ]
	);

	return { isLoading, error, data, refetch };
}

export default useApiData;
