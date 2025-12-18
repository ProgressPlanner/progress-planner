/**
 * Tests for useApiData Hook
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';
import { useApiData, clearApiCache } from '../index';

// apiFetch is already mocked in setup.js

describe( 'useApiData', () => {
	beforeEach( () => {
		apiFetch.mockReset();
		clearApiCache(); // Clear cache between tests
	} );

	describe( 'initial state', () => {
		it( 'returns loading state initially', () => {
			apiFetch.mockImplementation( () => new Promise( () => {} ) ); // Never resolves

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			expect( result.current.isLoading ).toBe( true );
			expect( result.current.data ).toBeNull();
			expect( result.current.error ).toBeNull();
		} );

		it( 'sets isLoading to false when path is empty', async () => {
			const { result } = renderHook( () => useApiData( '' ) );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );

		it( 'sets isLoading to false when path is null', async () => {
			const { result } = renderHook( () => useApiData( null ) );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'successful fetch', () => {
		it( 'returns data on successful fetch', async () => {
			const mockData = { id: 1, name: 'Test' };
			apiFetch.mockResolvedValue( mockData );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.data ).toEqual( mockData );
			expect( result.current.error ).toBeNull();
		} );

		it( 'calls apiFetch with correct path', async () => {
			apiFetch.mockResolvedValue( {} );

			renderHook( () => useApiData( '/my/api/endpoint' ) );

			await waitFor( () => {
				expect( apiFetch ).toHaveBeenCalledWith( {
					path: '/my/api/endpoint',
				} );
			} );
		} );
	} );

	describe( 'error handling', () => {
		it( 'returns error on failed fetch', async () => {
			apiFetch.mockRejectedValue( new Error( 'Network error' ) );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Network error' );
			expect( result.current.data ).toBeNull();
		} );

		it( 'uses default error message when error has no message', async () => {
			apiFetch.mockRejectedValue( {} );

			const { result } = renderHook( () =>
				useApiData( '/test/path', [], 'Custom error message' )
			);

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Custom error message' );
		} );

		it( 'uses error message from object', async () => {
			apiFetch.mockRejectedValue( {} );

			const { result } = renderHook( () =>
				useApiData( '/test/path', [], {
					message: 'Object error message',
				} )
			);

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Object error message' );
		} );
	} );

	describe( 'caching', () => {
		it( 'uses cached data on subsequent calls', async () => {
			const mockData = { id: 1 };
			apiFetch.mockResolvedValue( mockData );

			// First render
			const { result, rerender } = renderHook( () =>
				useApiData( '/test/path' )
			);

			await waitFor( () => {
				expect( result.current.data ).toEqual( mockData );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Second render - should use cache
			rerender();

			// Still only one API call
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
			expect( result.current.data ).toEqual( mockData );
		} );

		it( 'does not cache when cache option is false', async () => {
			const mockData = { id: 1 };
			apiFetch.mockResolvedValue( mockData );

			const { result, unmount } = renderHook( () =>
				useApiData( '/test/path', [], 'Error', { cache: false } )
			);

			await waitFor( () => {
				expect( result.current.data ).toEqual( mockData );
			} );

			unmount();

			// Clear the mock call count
			apiFetch.mockClear();

			// New render should make a new API call
			const { result: result2 } = renderHook( () =>
				useApiData( '/test/path', [], 'Error', { cache: false } )
			);

			await waitFor( () => {
				expect( result2.current.data ).toEqual( mockData );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'skips cache when skipCache option is true', async () => {
			const mockData = { id: 1 };
			apiFetch.mockResolvedValue( mockData );

			// First call to populate cache
			const { result: result1 } = renderHook( () =>
				useApiData( '/test/path' )
			);

			await waitFor( () => {
				expect( result1.current.data ).toEqual( mockData );
			} );

			apiFetch.mockClear();

			// Second call with skipCache
			const { result: result2 } = renderHook( () =>
				useApiData( '/test/path', [], 'Error', { skipCache: true } )
			);

			await waitFor( () => {
				expect( result2.current.isLoading ).toBe( false );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'refetch', () => {
		it( 'provides refetch function', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( typeof result.current.refetch ).toBe( 'function' );
		} );

		it( 'refetch bypasses cache by default', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 1 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Update mock to return different data
			apiFetch.mockResolvedValue( { id: 2 } );

			// Refetch
			act( () => {
				result.current.refetch();
			} );

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 2 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'refetch can use cache when bypassCache is false', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 1 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Refetch without bypassing cache
			act( () => {
				result.current.refetch( false );
			} );

			// Should not make another API call (uses cache)
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'clearApiCache', () => {
		it( 'clears cache for specific path', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			const { result } = renderHook( () => useApiData( '/test/path' ) );

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 1 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Clear cache for this path
			clearApiCache( '/test/path' );

			// Refetch without bypass - should still call API because cache is cleared
			act( () => {
				result.current.refetch( false );
			} );

			await waitFor( () => {
				expect( apiFetch ).toHaveBeenCalledTimes( 2 );
			} );
		} );

		it( 'clears all cache when no path provided', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			// Populate cache for two paths
			const { result: result1 } = renderHook( () =>
				useApiData( '/path/one' )
			);
			const { result: result2 } = renderHook( () =>
				useApiData( '/path/two' )
			);

			await waitFor( () => {
				expect( result1.current.data ).toEqual( { id: 1 } );
				expect( result2.current.data ).toEqual( { id: 1 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );

			// Clear all cache
			clearApiCache();
			apiFetch.mockClear();

			// Both should refetch
			act( () => {
				result1.current.refetch( false );
				result2.current.refetch( false );
			} );

			await waitFor( () => {
				expect( apiFetch ).toHaveBeenCalledTimes( 2 );
			} );
		} );
	} );

	describe( 'dependencies', () => {
		it( 'refetches when path changes', async () => {
			apiFetch.mockResolvedValue( { id: 1 } );

			const { result, rerender } = renderHook(
				( { path } ) => useApiData( path ),
				{ initialProps: { path: '/path/one' } }
			);

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 1 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );

			// Change path
			apiFetch.mockResolvedValue( { id: 2 } );
			rerender( { path: '/path/two' } );

			await waitFor( () => {
				expect( result.current.data ).toEqual( { id: 2 } );
			} );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );
	} );
} );
