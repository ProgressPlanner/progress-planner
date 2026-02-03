/**
 * Tests for apiFetchCache service
 */

import apiFetch from '@wordpress/api-fetch';
import {
	cachedApiFetch,
	clearCache,
	clearCacheFor,
	setCacheFor,
	getCacheStats,
} from '../apiFetchCache';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'apiFetchCache', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		clearCache();
	} );

	describe( 'cachedApiFetch', () => {
		it( 'makes network request on first call', async () => {
			apiFetch.mockResolvedValueOnce( { data: 'test' } );

			const result = await cachedApiFetch( { path: '/test' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
			expect( apiFetch ).toHaveBeenCalledWith( { path: '/test' } );
			expect( result ).toEqual( { data: 'test' } );
		} );

		it( 'returns cached response on subsequent calls', async () => {
			apiFetch.mockResolvedValueOnce( { data: 'test' } );

			await cachedApiFetch( { path: '/test' } );
			const result = await cachedApiFetch( { path: '/test' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
			expect( result ).toEqual( { data: 'test' } );
		} );

		it( 'deduplicates simultaneous requests', async () => {
			let resolveRequest;
			apiFetch.mockImplementationOnce(
				() =>
					new Promise( ( resolve ) => {
						resolveRequest = resolve;
					} )
			);

			const promise1 = cachedApiFetch( { path: '/test' } );
			const promise2 = cachedApiFetch( { path: '/test' } );
			const promise3 = cachedApiFetch( { path: '/test' } );

			// All three should be waiting on the same request.
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Resolve the request.
			resolveRequest( { data: 'test' } );

			const [ r1, r2, r3 ] = await Promise.all( [
				promise1,
				promise2,
				promise3,
			] );

			expect( r1 ).toEqual( { data: 'test' } );
			expect( r2 ).toEqual( { data: 'test' } );
			expect( r3 ).toEqual( { data: 'test' } );
		} );

		it( 'does not cache POST requests', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await cachedApiFetch( {
				path: '/test',
				method: 'POST',
				data: {},
			} );
			await cachedApiFetch( {
				path: '/test',
				method: 'POST',
				data: {},
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'does not cache PUT requests', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await cachedApiFetch( { path: '/test', method: 'PUT', data: {} } );
			await cachedApiFetch( { path: '/test', method: 'PUT', data: {} } );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'does not cache DELETE requests', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await cachedApiFetch( { path: '/test', method: 'DELETE' } );
			await cachedApiFetch( { path: '/test', method: 'DELETE' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'bypasses cache with skipCache option', async () => {
			apiFetch.mockResolvedValue( { data: 'fresh' } );

			await cachedApiFetch( { path: '/test' } );
			await cachedApiFetch( { path: '/test' }, { skipCache: true } );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'respects custom TTL option', async () => {
			jest.useFakeTimers();
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/test' }, { ttl: 1000 } );

			// Advance time by 500ms - should still use cache.
			jest.advanceTimersByTime( 500 );
			await cachedApiFetch( { path: '/test' }, { ttl: 1000 } );
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Advance time past TTL.
			jest.advanceTimersByTime( 600 );
			await cachedApiFetch( { path: '/test' }, { ttl: 1000 } );
			expect( apiFetch ).toHaveBeenCalledTimes( 2 );

			jest.useRealTimers();
		} );

		it( 'caches different paths separately', async () => {
			apiFetch.mockImplementation( ( opts ) => {
				return Promise.resolve( { path: opts.path } );
			} );

			const result1 = await cachedApiFetch( { path: '/path1' } );
			const result2 = await cachedApiFetch( { path: '/path2' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
			expect( result1 ).toEqual( { path: '/path1' } );
			expect( result2 ).toEqual( { path: '/path2' } );
		} );

		it( 'includes query params in cache key', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/test?foo=1' } );
			await cachedApiFetch( { path: '/test?foo=2' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'removes from in-flight on error', async () => {
			const error = new Error( 'Network error' );
			apiFetch.mockRejectedValueOnce( error );
			apiFetch.mockResolvedValueOnce( { data: 'success' } );

			await expect( cachedApiFetch( { path: '/test' } ) ).rejects.toThrow(
				'Network error'
			);

			// Should be able to retry after error.
			const result = await cachedApiFetch( { path: '/test' } );
			expect( result ).toEqual( { data: 'success' } );
			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'handles url option as well as path', async () => {
			apiFetch.mockResolvedValueOnce( { data: 'test' } );

			await cachedApiFetch( { url: '/test' } );
			await cachedApiFetch( { url: '/test' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'clearCache', () => {
		it( 'clears all cached responses', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/test1' } );
			await cachedApiFetch( { path: '/test2' } );

			clearCache();

			await cachedApiFetch( { path: '/test1' } );
			await cachedApiFetch( { path: '/test2' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 4 );
		} );
	} );

	describe( 'clearCacheFor', () => {
		it( 'clears specific path from cache', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/wp/v2/settings' } );
			await cachedApiFetch( { path: '/wp/v2/posts' } );

			clearCacheFor( '/wp/v2/settings' );

			await cachedApiFetch( { path: '/wp/v2/settings' } );
			await cachedApiFetch( { path: '/wp/v2/posts' } );

			// settings called 2x, posts called 1x (still cached)
			expect( apiFetch ).toHaveBeenCalledTimes( 3 );
		} );

		it( 'clears paths matching pattern', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/wp/v2/settings' } );
			await cachedApiFetch( { path: '/wp/v2/posts' } );
			await cachedApiFetch( { path: '/progress-planner/v1/test' } );

			clearCacheFor( /^GET:\/wp\/v2\// );

			await cachedApiFetch( { path: '/wp/v2/settings' } );
			await cachedApiFetch( { path: '/wp/v2/posts' } );
			await cachedApiFetch( { path: '/progress-planner/v1/test' } );

			// wp endpoints called 4x, progress-planner called 1x
			expect( apiFetch ).toHaveBeenCalledTimes( 5 );
		} );

		it( 'clears paths with query parameters', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			await cachedApiFetch( { path: '/test?foo=1' } );
			await cachedApiFetch( { path: '/test?foo=2' } );

			clearCacheFor( '/test' );

			await cachedApiFetch( { path: '/test?foo=1' } );
			await cachedApiFetch( { path: '/test?foo=2' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 4 );
		} );
	} );

	describe( 'setCacheFor', () => {
		it( 'allows subsequent GET to use cached data', async () => {
			// Pre-populate cache via setCacheFor (write-through).
			setCacheFor( '/test', { data: 'cached-value' } );

			// GET should return cached data without network call.
			const result = await cachedApiFetch( { path: '/test' } );

			expect( apiFetch ).not.toHaveBeenCalled();
			expect( result ).toEqual( { data: 'cached-value' } );
		} );

		it( 'respects TTL for manually cached data', async () => {
			jest.useFakeTimers();
			apiFetch.mockResolvedValue( { data: 'fresh' } );

			setCacheFor( '/test', { data: 'cached' } );

			// Should use cached data.
			const result1 = await cachedApiFetch( { path: '/test' } );
			expect( result1 ).toEqual( { data: 'cached' } );
			expect( apiFetch ).not.toHaveBeenCalled();

			// Advance past default TTL (5 minutes).
			jest.advanceTimersByTime( 6 * 60 * 1000 );

			// Should fetch fresh data.
			const result2 = await cachedApiFetch( { path: '/test' } );
			expect( result2 ).toEqual( { data: 'fresh' } );
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			jest.useRealTimers();
		} );

		it( 'can be cleared with clearCacheFor', async () => {
			apiFetch.mockResolvedValue( { data: 'fresh' } );

			setCacheFor( '/test', { data: 'cached' } );
			clearCacheFor( '/test' );

			const result = await cachedApiFetch( { path: '/test' } );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
			expect( result ).toEqual( { data: 'fresh' } );
		} );
	} );

	describe( 'getCacheStats', () => {
		it( 'returns correct cache statistics', async () => {
			apiFetch.mockResolvedValue( { data: 'test' } );

			expect( getCacheStats() ).toEqual( {
				cachedResponses: 0,
				inFlightRequests: 0,
			} );

			await cachedApiFetch( { path: '/test1' } );
			await cachedApiFetch( { path: '/test2' } );

			expect( getCacheStats() ).toEqual( {
				cachedResponses: 2,
				inFlightRequests: 0,
			} );
		} );

		it( 'includes manually cached entries in count', () => {
			setCacheFor( '/test1', { data: 1 } );
			setCacheFor( '/test2', { data: 2 } );

			expect( getCacheStats().cachedResponses ).toBe( 2 );
		} );
	} );
} );
