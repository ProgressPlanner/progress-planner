/**
 * API Fetch Cache Service
 *
 * Provides a caching proxy for @wordpress/api-fetch with:
 * - Request deduplication: Simultaneous identical requests share one network call
 * - Response caching: Stores responses with TTL, serves from cache when valid
 *
 * Only GET requests are cached. POST/PUT/DELETE always execute immediately.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * In-flight request tracking.
 * Maps cache key -> Promise (the pending request).
 * Used for request deduplication.
 */
const inFlightRequests = new Map();

/**
 * Response cache storage.
 * Maps cache key -> { data, timestamp }.
 */
const responseCache = new Map();

/**
 * Default cache TTL: 5 minutes (matches existing implementations).
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Generate a cache key from request options.
 *
 * Only GET requests are cacheable. Returns null for non-cacheable requests.
 *
 * @param {Object} options - The apiFetch options object.
 * @return {string|null} Cache key or null if not cacheable.
 */
function generateCacheKey( options ) {
	const method = ( options.method || 'GET' ).toUpperCase();

	// Only cache GET requests.
	if ( method !== 'GET' ) {
		return null;
	}

	// Handle both { path } and { url } options.
	let fullPath = options.path || options.url || '';

	// Append data as query params for GET requests if provided.
	if ( options.data && typeof options.data === 'object' ) {
		const params = new URLSearchParams( options.data ).toString();
		if ( params ) {
			fullPath += ( fullPath.includes( '?' ) ? '&' : '?' ) + params;
		}
	}

	return `GET:${ fullPath }`;
}

/**
 * Cached API fetch with request deduplication.
 *
 * @param {Object}  options                - Same options as @wordpress/api-fetch.
 * @param {Object}  cacheOptions           - Additional cache control options.
 * @param {boolean} cacheOptions.skipCache - Bypass cache, make fresh request.
 * @param {number}  cacheOptions.ttl       - Custom TTL for this request (ms).
 * @return {Promise} Response promise.
 */
export async function cachedApiFetch( options, cacheOptions = {} ) {
	const { skipCache = false, ttl = DEFAULT_CACHE_TTL } = cacheOptions;

	const cacheKey = generateCacheKey( options );

	// Non-cacheable request (POST, PUT, DELETE, etc.).
	if ( ! cacheKey ) {
		return apiFetch( options );
	}

	// Check in-flight requests first (deduplication).
	if ( ! skipCache && inFlightRequests.has( cacheKey ) ) {
		return inFlightRequests.get( cacheKey );
	}

	// Check response cache.
	if ( ! skipCache ) {
		const cached = responseCache.get( cacheKey );
		if ( cached && Date.now() - cached.timestamp < ttl ) {
			return Promise.resolve( cached.data );
		}
	}

	// Make the actual request.
	const requestPromise = apiFetch( options )
		.then( ( response ) => {
			// Store in cache.
			responseCache.set( cacheKey, {
				data: response,
				timestamp: Date.now(),
			} );

			// Remove from in-flight.
			inFlightRequests.delete( cacheKey );

			return response;
		} )
		.catch( ( error ) => {
			// Remove from in-flight on error.
			inFlightRequests.delete( cacheKey );
			throw error;
		} );

	// Track as in-flight.
	inFlightRequests.set( cacheKey, requestPromise );

	return requestPromise;
}

/**
 * Clear the entire response cache and in-flight requests.
 *
 * Clears both the response cache and any pending in-flight requests.
 * Useful for cache invalidation and test isolation.
 */
export function clearCache() {
	responseCache.clear();
	inFlightRequests.clear();
}

/**
 * Clear cache for a specific path or pattern.
 *
 * @param {string|RegExp} pathOrPattern - Path string or regex pattern.
 */
export function clearCacheFor( pathOrPattern ) {
	if ( typeof pathOrPattern === 'string' ) {
		// Clear exact match.
		const key = `GET:${ pathOrPattern }`;
		responseCache.delete( key );

		// Also try clearing with trailing variations.
		for ( const cacheKey of responseCache.keys() ) {
			if ( cacheKey.startsWith( `GET:${ pathOrPattern }` ) ) {
				responseCache.delete( cacheKey );
			}
		}
	} else if ( pathOrPattern instanceof RegExp ) {
		// Clear matching pattern.
		for ( const key of responseCache.keys() ) {
			if ( pathOrPattern.test( key ) ) {
				responseCache.delete( key );
			}
		}
	}
}

/**
 * Set cache entry for a specific path (write-through caching).
 *
 * Useful for updating cache after a POST/PUT operation returns
 * data that should be cached for subsequent GET requests.
 *
 * @param {string} path - The API path to cache.
 * @param {*}      data - The data to cache.
 */
export function setCacheFor( path, data ) {
	const key = `GET:${ path }`;
	responseCache.set( key, {
		data,
		timestamp: Date.now(),
	} );
}

/**
 * Get cache statistics (useful for debugging).
 *
 * @return {Object} Cache statistics.
 */
export function getCacheStats() {
	return {
		cachedResponses: responseCache.size,
		inFlightRequests: inFlightRequests.size,
	};
}
