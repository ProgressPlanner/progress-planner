/**
 * Tests for badgeService
 */

import apiFetch from '@wordpress/api-fetch';
import {
	fetchActivities,
	fetchBadgeStats,
	saveBadgeStats,
	clearBadgeServiceCache,
} from '../badgeService';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'badgeService', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		clearBadgeServiceCache();
	} );

	describe( 'fetchActivities', () => {
		it( 'fetches activities from API', async () => {
			const mockResponse = {
				activities: [ { id: 1, type: 'publish' } ],
				totalPostsCount: 10,
				activationDate: '2024-01-01T00:00:00Z',
				config: {
					brandingId: 123,
					remoteServerUrl: 'https://api.example.com',
					placeholderUrl: '/placeholder.svg',
				},
			};
			apiFetch.mockResolvedValue( mockResponse );

			const result = await fetchActivities();

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/activities',
			} );
			expect( result.activities ).toEqual( [
				{ id: 1, type: 'publish' },
			] );
			expect( result.totalPostsCount ).toBe( 10 );
			expect( result.activationDate ).toBeInstanceOf( Date );
			expect( result.config.brandingId ).toBe( 123 );
		} );

		it( 'returns cached data on subsequent calls', async () => {
			apiFetch.mockResolvedValue( {
				activities: [ { id: 1 } ],
				totalPostsCount: 5,
			} );

			await fetchActivities();
			await fetchActivities();

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'bypasses cache when bypassCache is true', async () => {
			apiFetch.mockResolvedValue( {
				activities: [],
				totalPostsCount: 0,
			} );

			await fetchActivities();
			await fetchActivities( true );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'uses default values for missing response fields', async () => {
			apiFetch.mockResolvedValue( {} );

			const result = await fetchActivities();

			expect( result.activities ).toEqual( [] );
			expect( result.totalPostsCount ).toBe( 0 );
			expect( result.activationDate ).toBeInstanceOf( Date );
			expect( result.config ).toEqual( {
				brandingId: 0,
				remoteServerUrl: '',
				placeholderUrl: '',
			} );
		} );

		it( 'throws error on API failure', async () => {
			apiFetch.mockRejectedValue( new Error( 'Network error' ) );

			await expect( fetchActivities() ).rejects.toThrow(
				'Network error'
			);
		} );

		it( 'uses default error message when error has no message', async () => {
			apiFetch.mockRejectedValue( {} );

			await expect( fetchActivities() ).rejects.toThrow(
				'Failed to fetch activities'
			);
		} );
	} );

	describe( 'fetchBadgeStats', () => {
		it( 'fetches badge stats from API', async () => {
			const mockResponse = {
				badges: {
					'content-curator': { progress: 50, remaining: 5 },
				},
			};
			apiFetch.mockResolvedValue( mockResponse );

			const result = await fetchBadgeStats();

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/badge-stats',
			} );
			expect( result ).toEqual( {
				'content-curator': { progress: 50, remaining: 5 },
			} );
		} );

		it( 'returns cached data on subsequent calls', async () => {
			apiFetch.mockResolvedValue( { badges: {} } );

			await fetchBadgeStats();
			await fetchBadgeStats();

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'bypasses cache when bypassCache is true', async () => {
			apiFetch.mockResolvedValue( { badges: {} } );

			await fetchBadgeStats();
			await fetchBadgeStats( true );

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'returns empty object for missing badges field', async () => {
			apiFetch.mockResolvedValue( {} );

			const result = await fetchBadgeStats();

			expect( result ).toEqual( {} );
		} );

		it( 'throws error on API failure', async () => {
			apiFetch.mockRejectedValue( new Error( 'Server error' ) );

			await expect( fetchBadgeStats() ).rejects.toThrow( 'Server error' );
		} );

		it( 'uses default error message when error has no message', async () => {
			apiFetch.mockRejectedValue( {} );

			await expect( fetchBadgeStats() ).rejects.toThrow(
				'Failed to fetch badge stats'
			);
		} );
	} );

	describe( 'saveBadgeStats', () => {
		it( 'saves badge stats via API', async () => {
			const badgesToSave = {
				'content-curator': { progress: 100, remaining: 0 },
			};
			apiFetch.mockResolvedValue( { badges: badgesToSave } );

			const result = await saveBadgeStats( badgesToSave );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/badge-stats',
				method: 'POST',
				data: { badges: badgesToSave },
			} );
			expect( result ).toEqual( badgesToSave );
		} );

		it( 'updates cache after save', async () => {
			const newBadges = { 'new-badge': { progress: 50 } };
			apiFetch.mockResolvedValue( { badges: newBadges } );

			await saveBadgeStats( newBadges );

			// Subsequent fetch should return cached data without API call
			apiFetch.mockClear();
			const result = await fetchBadgeStats();

			expect( apiFetch ).not.toHaveBeenCalled();
			expect( result ).toEqual( newBadges );
		} );

		it( 'returns empty object for missing badges in response', async () => {
			apiFetch.mockResolvedValue( {} );

			const result = await saveBadgeStats( {} );

			expect( result ).toEqual( {} );
		} );

		it( 'throws error on API failure', async () => {
			apiFetch.mockRejectedValue( new Error( 'Save failed' ) );

			await expect( saveBadgeStats( {} ) ).rejects.toThrow(
				'Save failed'
			);
		} );

		it( 'uses default error message when error has no message', async () => {
			apiFetch.mockRejectedValue( {} );

			await expect( saveBadgeStats( {} ) ).rejects.toThrow(
				'Failed to save badge stats'
			);
		} );
	} );

	describe( 'clearBadgeServiceCache', () => {
		it( 'clears activities cache', async () => {
			apiFetch.mockResolvedValue( { activities: [] } );

			await fetchActivities();
			clearBadgeServiceCache();
			await fetchActivities();

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'clears badge stats cache', async () => {
			apiFetch.mockResolvedValue( { badges: {} } );

			await fetchBadgeStats();
			clearBadgeServiceCache();
			await fetchBadgeStats();

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );
	} );

	describe( 'cache expiration', () => {
		beforeEach( () => {
			jest.useFakeTimers();
		} );

		afterEach( () => {
			jest.useRealTimers();
		} );

		it( 'refetches activities after cache TTL expires', async () => {
			apiFetch.mockResolvedValue( { activities: [] } );

			await fetchActivities();

			// Advance time past TTL (5 minutes)
			jest.advanceTimersByTime( 5 * 60 * 1000 + 1 );

			await fetchActivities();

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'refetches badge stats after cache TTL expires', async () => {
			apiFetch.mockResolvedValue( { badges: {} } );

			await fetchBadgeStats();

			// Advance time past TTL (5 minutes)
			jest.advanceTimersByTime( 5 * 60 * 1000 + 1 );

			await fetchBadgeStats();

			expect( apiFetch ).toHaveBeenCalledTimes( 2 );
		} );

		it( 'uses cache within TTL', async () => {
			apiFetch.mockResolvedValue( { activities: [] } );

			await fetchActivities();

			// Advance time but stay within TTL
			jest.advanceTimersByTime( 4 * 60 * 1000 );

			await fetchActivities();

			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
