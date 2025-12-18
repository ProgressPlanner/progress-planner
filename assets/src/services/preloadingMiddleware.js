/**
 * Preloading Middleware for apiFetch.
 *
 * Creates a middleware that intercepts apiFetch calls and returns
 * preloaded data instantly, bypassing network requests for matched paths.
 * Modeled after WordPress/Gutenberg's createPreloadingMiddleware.
 */

/**
 * Normalize a path for consistent comparison.
 * Sorts query parameters and removes trailing slashes.
 *
 * @param {string} path The path to normalize.
 * @return {string} The normalized path.
 */
function normalizePath( path ) {
	if ( ! path ) {
		return '';
	}

	try {
		const url = new URL( path, 'http://example.com' );
		url.searchParams.sort();
		let normalized = url.pathname + url.search;
		// Remove trailing slash unless it's the root
		if ( normalized.length > 1 && normalized.endsWith( '/' ) ) {
			normalized = normalized.slice( 0, -1 );
		}
		return normalized;
	} catch ( e ) {
		// If URL parsing fails, return the path as-is
		return path;
	}
}

/**
 * Creates a preloading middleware for apiFetch.
 * Returns preloaded data instantly, bypassing network for matched paths.
 *
 * @param {Object} preloadedData Object with paths as keys and { body, headers } as values.
 * @return {Function} Middleware function for apiFetch.use().
 */
export function createPreloadingMiddleware( preloadedData ) {
	const cache = new Map();

	// Normalize and populate cache from preloaded data
	if ( preloadedData && typeof preloadedData === 'object' ) {
		Object.entries( preloadedData ).forEach( ( [ path, data ] ) => {
			cache.set( normalizePath( path ), data );
		} );
	}

	return ( options, next ) => {
		// Only intercept GET requests (or requests with no method, which default to GET)
		if ( options.method && options.method.toUpperCase() !== 'GET' ) {
			return next( options );
		}

		// Don't intercept requests that use parse: false (need full Response object)
		if ( options.parse === false ) {
			return next( options );
		}

		const path = normalizePath( options.path || options.url );

		if ( cache.has( path ) ) {
			const data = cache.get( path );
			// Remove from cache (one-time use, like Gutenberg)
			cache.delete( path );
			// Return the body directly as a resolved promise
			return Promise.resolve( data.body );
		}

		// Fall through to next middleware / actual fetch
		return next( options );
	};
}

export { normalizePath };
