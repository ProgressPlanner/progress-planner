/**
 * useApiData Hook
 *
 * Shared hook for fetching data from the REST API with loading/error states
 * and optional caching to prevent redundant API calls.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Simple in-memory cache for API responses.
 * Keyed by API path with timestamp for TTL checking.
 */
const apiCache = new Map();

/**
 * Default cache TTL in milliseconds (5 minutes).
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Get cached data if valid.
 *
 * @param {string} path - The API endpoint path (cache key).
 * @param {number} ttl  - Time to live in milliseconds.
 * @return {Object|null} Cached data or null if expired/missing.
 */
function getCachedData( path, ttl ) {
	const cached = apiCache.get( path );
	if ( ! cached ) {
		return null;
	}

	const now = Date.now();
	if ( now - cached.timestamp > ttl ) {
		// Cache expired, remove it.
		apiCache.delete( path );
		return null;
	}

	return cached.data;
}

/**
 * Set cached data with timestamp.
 *
 * @param {string} path - The API endpoint path (cache key).
 * @param {Object} data - The data to cache.
 */
function setCachedData( path, data ) {
	apiCache.set( path, {
		data,
		timestamp: Date.now(),
	} );
}

/**
 * Clear cache for a specific path or all paths.
 *
 * @param {string|null} path - The API endpoint path to clear, or null for all.
 */
export function clearApiCache( path = null ) {
	if ( path ) {
		apiCache.delete( path );
	} else {
		apiCache.clear();
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

			// Check cache first (unless force refresh or cache disabled).
			if ( cache && ! forceRefresh && ! skipCache ) {
				const cachedData = getCachedData( path, cacheTtl );
				if ( cachedData !== null ) {
					setData( cachedData );
					setIsLoading( false );
					setError( null );
					return;
				}
			}

			setIsLoading( true );
			setError( null );

			try {
				const response = await apiFetch( { path } );
				setData( response );

				// Cache the response if caching is enabled.
				if ( cache ) {
					setCachedData( path, response );
				}
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
