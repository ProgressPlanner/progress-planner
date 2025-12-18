/**
 * Tests for useBadgeData Hook
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useBadgeData } from '../index';
import {
	fetchActivities,
	fetchBadgeStats,
} from '../../../services/badgeService';

// Mock badgeService
jest.mock( '../../../services/badgeService', () => ( {
	fetchActivities: jest.fn(),
	fetchBadgeStats: jest.fn(),
} ) );

describe( 'useBadgeData', () => {
	const mockActivitiesResponse = {
		activities: [
			{ date: '2024-06-15', type: 'publish', category: 'post' },
			{ date: '2024-06-16', type: 'update', category: 'page' },
		],
		totalPostsCount: 42,
		activationDate: '2024-01-01',
		config: {
			brandingId: 123,
			remoteServerUrl: 'https://example.com',
			placeholderUrl: '/placeholder.svg',
		},
	};

	const mockStatsResponse = {
		'content-curator': { progress: 50, remaining: 5 },
		'progress-padawan': { progress: 30, remaining: 7 },
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'initial state', () => {
		it( 'returns loading state initially', () => {
			fetchActivities.mockImplementation( () => new Promise( () => {} ) );
			fetchBadgeStats.mockImplementation( () => new Promise( () => {} ) );

			const { result } = renderHook( () => useBadgeData() );

			expect( result.current.isLoading ).toBe( true );
			expect( result.current.data ).toBeNull();
			expect( result.current.error ).toBeNull();
		} );

		it( 'returns refetch function', () => {
			fetchActivities.mockImplementation( () => new Promise( () => {} ) );
			fetchBadgeStats.mockImplementation( () => new Promise( () => {} ) );

			const { result } = renderHook( () => useBadgeData() );

			expect( typeof result.current.refetch ).toBe( 'function' );
		} );
	} );

	describe( 'successful fetch', () => {
		it( 'fetches activities and stats in parallel', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( fetchActivities ).toHaveBeenCalledTimes( 1 );
				expect( fetchBadgeStats ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		it( 'sets data on successful fetch', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.data ).toEqual( {
				activities: mockActivitiesResponse.activities,
				totalPostsCount: mockActivitiesResponse.totalPostsCount,
				activationDate: mockActivitiesResponse.activationDate,
				savedStats: mockStatsResponse,
				config: mockActivitiesResponse.config,
			} );
		} );

		it( 'sets isLoading to false after fetch', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );
		} );

		it( 'error remains null on success', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBeNull();
		} );
	} );

	describe( 'default values', () => {
		it( 'uses empty array for missing activities', async () => {
			fetchActivities.mockResolvedValue( {} );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.data.activities ).toEqual( [] );
		} );

		it( 'uses 0 for missing totalPostsCount', async () => {
			fetchActivities.mockResolvedValue( {} );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.data.totalPostsCount ).toBe( 0 );
		} );

		it( 'uses default config for missing config', async () => {
			fetchActivities.mockResolvedValue( {} );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.data.config ).toEqual( {
				brandingId: 0,
				remoteServerUrl: '',
				placeholderUrl: '',
			} );
		} );
	} );

	describe( 'error handling', () => {
		it( 'sets error on fetchActivities failure', async () => {
			fetchActivities.mockRejectedValue(
				new Error( 'Failed to fetch activities' )
			);
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Failed to fetch activities' );
			expect( result.current.data ).toBeNull();
		} );

		it( 'sets error on fetchBadgeStats failure', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockRejectedValue(
				new Error( 'Failed to fetch stats' )
			);

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Failed to fetch stats' );
		} );

		it( 'uses default error message when error has no message', async () => {
			fetchActivities.mockRejectedValue( {} );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( result.current.error ).toBe( 'Failed to load badge data' );
		} );

		it( 'sets isLoading to false after error', async () => {
			fetchActivities.mockRejectedValue( new Error( 'Error' ) );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );
		} );
	} );

	describe( 'refetch', () => {
		it( 'refetches data when refetch is called', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			expect( fetchActivities ).toHaveBeenCalledTimes( 1 );
			expect( fetchBadgeStats ).toHaveBeenCalledTimes( 1 );

			// Call refetch
			await act( async () => {
				await result.current.refetch();
			} );

			expect( fetchActivities ).toHaveBeenCalledTimes( 2 );
			expect( fetchBadgeStats ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'clears error on refetch', async () => {
			// First fetch fails
			fetchActivities.mockRejectedValueOnce( new Error( 'First error' ) );
			fetchBadgeStats.mockResolvedValue( {} );

			const { result } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.error ).toBe( 'First error' );
			} );

			// Refetch succeeds
			fetchActivities.mockResolvedValueOnce( mockActivitiesResponse );

			await act( async () => {
				await result.current.refetch();
			} );

			expect( result.current.error ).toBeNull();
		} );

		it( 'sets isLoading during refetch', async () => {
			let resolveActivities;
			fetchActivities.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveActivities = resolve;
					} )
			);
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result } = renderHook( () => useBadgeData() );

			// Complete initial fetch
			await act( async () => {
				resolveActivities( mockActivitiesResponse );
			} );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			// Start refetch
			fetchActivities.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveActivities = resolve;
					} )
			);

			act( () => {
				result.current.refetch();
			} );

			expect( result.current.isLoading ).toBe( true );

			// Complete refetch
			await act( async () => {
				resolveActivities( mockActivitiesResponse );
			} );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );
		} );
	} );

	describe( 'refetch stability', () => {
		it( 'returns stable refetch function reference', async () => {
			fetchActivities.mockResolvedValue( mockActivitiesResponse );
			fetchBadgeStats.mockResolvedValue( mockStatsResponse );

			const { result, rerender } = renderHook( () => useBadgeData() );

			await waitFor( () => {
				expect( result.current.isLoading ).toBe( false );
			} );

			const firstRefetch = result.current.refetch;
			rerender();
			const secondRefetch = result.current.refetch;

			expect( firstRefetch ).toBe( secondRefetch );
		} );
	} );
} );
