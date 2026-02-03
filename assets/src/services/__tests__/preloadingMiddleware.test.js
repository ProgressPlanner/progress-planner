/**
 * Tests for preloadingMiddleware service
 */

import {
	createPreloadingMiddleware,
	normalizePath,
} from '../preloadingMiddleware';

describe( 'preloadingMiddleware', () => {
	describe( 'normalizePath', () => {
		it( 'returns empty string for null/undefined', () => {
			expect( normalizePath( null ) ).toBe( '' );
			expect( normalizePath( undefined ) ).toBe( '' );
			expect( normalizePath( '' ) ).toBe( '' );
		} );

		it( 'normalizes paths without query params', () => {
			expect( normalizePath( '/wp/v2/settings' ) ).toBe(
				'/wp/v2/settings'
			);
		} );

		it( 'removes trailing slashes', () => {
			expect( normalizePath( '/wp/v2/settings/' ) ).toBe(
				'/wp/v2/settings'
			);
		} );

		it( 'preserves root path', () => {
			expect( normalizePath( '/' ) ).toBe( '/' );
		} );

		it( 'sorts query parameters alphabetically', () => {
			expect( normalizePath( '/api?z=1&a=2&m=3' ) ).toBe(
				'/api?a=2&m=3&z=1'
			);
		} );

		it( 'preserves query params with same order', () => {
			expect( normalizePath( '/api?a=1&b=2' ) ).toBe( '/api?a=1&b=2' );
		} );

		it( 'handles encoded characters in query params', () => {
			const path = '/api?range=-6%20months';
			const normalized = normalizePath( path );
			expect( normalized ).toContain( '/api' );
			expect( normalized ).toContain( 'range=' );
		} );
	} );

	describe( 'createPreloadingMiddleware', () => {
		it( 'returns a function', () => {
			const middleware = createPreloadingMiddleware( {} );
			expect( typeof middleware ).toBe( 'function' );
		} );

		it( 'returns preloaded data for matching GET request', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			const result = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);

			expect( result ).toEqual( { blog_name: 'Test Site' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'removes data from cache after first use (one-time)', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn().mockResolvedValue( { fresh: true } );

			// First call should return preloaded data
			const result1 = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);
			expect( result1 ).toEqual( { blog_name: 'Test Site' } );
			expect( next ).not.toHaveBeenCalled();

			// Second call should fall through to next
			const result2 = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);
			expect( result2 ).toEqual( { fresh: true } );
			expect( next ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'falls through to next for non-matching paths', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn().mockResolvedValue( { other: 'data' } );

			const result = await middleware( { path: '/wp/v2/posts' }, next );

			expect( result ).toEqual( { other: 'data' } );
			expect( next ).toHaveBeenCalledWith( { path: '/wp/v2/posts' } );
		} );

		it( 'falls through to next for POST requests', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn().mockResolvedValue( { updated: true } );

			const result = await middleware(
				{ path: '/wp/v2/settings', method: 'POST', data: {} },
				next
			);

			expect( result ).toEqual( { updated: true } );
			expect( next ).toHaveBeenCalled();
		} );

		it( 'falls through to next for DELETE requests', async () => {
			const preloadedData = {
				'/wp/v2/posts/1': {
					body: { id: 1 },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn().mockResolvedValue( { deleted: true } );

			const result = await middleware(
				{ path: '/wp/v2/posts/1', method: 'DELETE' },
				next
			);

			expect( result ).toEqual( { deleted: true } );
			expect( next ).toHaveBeenCalled();
		} );

		it( 'falls through to next when parse: false is set', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const mockResponse = { json: () => ( {} ) };
			const next = jest.fn().mockResolvedValue( mockResponse );

			const result = await middleware(
				{ path: '/wp/v2/settings', parse: false },
				next
			);

			expect( result ).toBe( mockResponse );
			expect( next ).toHaveBeenCalled();
		} );

		it( 'handles requests without explicit method as GET', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			// Request without method should be treated as GET
			const result = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);

			expect( result ).toEqual( { blog_name: 'Test Site' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'matches paths with query parameters', async () => {
			const preloadedData = {
				'/api?a=1&b=2': {
					body: { data: 'with params' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			const result = await middleware( { path: '/api?a=1&b=2' }, next );

			expect( result ).toEqual( { data: 'with params' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'matches paths with reordered query parameters', async () => {
			const preloadedData = {
				'/api?a=1&b=2': {
					body: { data: 'with params' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			// Request with params in different order should still match
			const result = await middleware( { path: '/api?b=2&a=1' }, next );

			expect( result ).toEqual( { data: 'with params' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'handles null/undefined preloadedData gracefully', () => {
			expect( () => createPreloadingMiddleware( null ) ).not.toThrow();
			expect( () =>
				createPreloadingMiddleware( undefined )
			).not.toThrow();
		} );

		it( 'handles empty preloadedData object', async () => {
			const middleware = createPreloadingMiddleware( {} );
			const next = jest.fn().mockResolvedValue( { data: 'fresh' } );

			const result = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);

			expect( result ).toEqual( { data: 'fresh' } );
			expect( next ).toHaveBeenCalled();
		} );

		it( 'supports url option as alternative to path', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			const result = await middleware( { url: '/wp/v2/settings' }, next );

			expect( result ).toEqual( { blog_name: 'Test Site' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'handles method case insensitively', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { blog_name: 'Test Site' },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			// Lowercase 'get' should still match
			const result = await middleware(
				{ path: '/wp/v2/settings', method: 'get' },
				next
			);

			expect( result ).toEqual( { blog_name: 'Test Site' } );
			expect( next ).not.toHaveBeenCalled();
		} );

		it( 'handles multiple preloaded paths', async () => {
			const preloadedData = {
				'/wp/v2/settings': {
					body: { settings: true },
					headers: {},
				},
				'/wp/v2/posts': {
					body: { posts: [] },
					headers: {},
				},
				'/progress-planner/v1/activities': {
					body: { activities: [] },
					headers: {},
				},
			};

			const middleware = createPreloadingMiddleware( preloadedData );
			const next = jest.fn();

			const result1 = await middleware(
				{ path: '/wp/v2/settings' },
				next
			);
			const result2 = await middleware( { path: '/wp/v2/posts' }, next );
			const result3 = await middleware(
				{ path: '/progress-planner/v1/activities' },
				next
			);

			expect( result1 ).toEqual( { settings: true } );
			expect( result2 ).toEqual( { posts: [] } );
			expect( result3 ).toEqual( { activities: [] } );
			expect( next ).not.toHaveBeenCalled();
		} );
	} );
} );
