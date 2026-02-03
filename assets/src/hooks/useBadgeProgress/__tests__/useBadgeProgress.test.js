/**
 * Tests for useBadgeProgress Hook
 */

import { renderHook } from '@testing-library/react';
import { useBadgeProgress } from '../index';

// Mock the badge calculations
jest.mock( '../../../utils/badgeCalculations', () => ( {
	calculateContentBadgeProgress: jest.fn( () => ( {
		progress: 50,
		remaining: 5,
	} ) ),
	calculateMaintenanceBadgeProgress: jest.fn( () => ( {
		progress: 30,
		remaining: 7,
	} ) ),
	calculateMonthlyBadgeProgress: jest.fn( () => ( {
		progress: 80,
		remaining: 2,
		points: 8,
	} ) ),
} ) );

// Mock the badges config
jest.mock( '../../../config/badges', () => ( {
	getBadgeById: jest.fn( ( badgeId ) => {
		// Return mock badges for known IDs
		const badges = {
			'content-curator': { id: 'content-curator', type: 'content' },
			'revision-ranger': { id: 'revision-ranger', type: 'content' },
			'purposeful-publisher': {
				id: 'purposeful-publisher',
				type: 'content',
			},
			'progress-padawan': { id: 'progress-padawan', type: 'maintenance' },
			'maintenance-maniac': {
				id: 'maintenance-maniac',
				type: 'maintenance',
			},
			'super-site-specialist': {
				id: 'super-site-specialist',
				type: 'maintenance',
			},
		};

		// Handle monthly badges
		if ( badgeId.startsWith( 'monthly-' ) ) {
			return { id: badgeId, type: 'monthly' };
		}

		return badges[ badgeId ] || null;
	} ),
} ) );

// Import mocks for assertions
import {
	calculateContentBadgeProgress,
	calculateMaintenanceBadgeProgress,
	calculateMonthlyBadgeProgress,
} from '../../../utils/badgeCalculations';
import { getBadgeById } from '../../../config/badges';

describe( 'useBadgeProgress', () => {
	const mockActivationDate = new Date( '2024-01-01' );
	const mockActivities = [
		{ date: '2024-06-15', type: 'publish', category: 'post' },
		{ date: '2024-06-16', type: 'update', category: 'post' },
	];

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic functionality', () => {
		it( 'returns empty object when activationDate is null', () => {
			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: null,
				} )
			);

			expect( result.current ).toEqual( {} );
		} );

		it( 'returns badge progress when activationDate is provided', () => {
			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
				} )
			);

			// Should have content and maintenance badges
			expect( result.current ).toHaveProperty( 'content-curator' );
			expect( result.current ).toHaveProperty( 'progress-padawan' );
		} );
	} );

	describe( 'content badges', () => {
		it( 'calculates progress for all content badges', () => {
			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					totalPostsCount: 10,
				} )
			);

			// Should call calculateContentBadgeProgress for each content badge
			expect( calculateContentBadgeProgress ).toHaveBeenCalledTimes( 3 );
		} );

		it( 'uses saved progress when badge is complete', () => {
			const savedStats = {
				'content-curator': {
					progress: 100,
					remaining: 0,
				},
			};

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
				} )
			);

			expect( result.current[ 'content-curator' ] ).toEqual( {
				progress: 100,
				remaining: 0,
			} );
		} );

		it( 'recalculates when saved progress is incomplete', () => {
			const savedStats = {
				'content-curator': {
					progress: 50,
					remaining: 5,
				},
			};

			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
				} )
			);

			// Should still calculate since not 100% complete
			expect( calculateContentBadgeProgress ).toHaveBeenCalled();
		} );
	} );

	describe( 'maintenance badges', () => {
		it( 'calculates progress for all maintenance badges', () => {
			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
				} )
			);

			// Should call calculateMaintenanceBadgeProgress for each maintenance badge
			expect( calculateMaintenanceBadgeProgress ).toHaveBeenCalledTimes(
				3
			);
		} );

		it( 'uses saved progress when badge is complete', () => {
			const savedStats = {
				'progress-padawan': {
					progress: 100,
					remaining: 0,
				},
			};

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
				} )
			);

			expect( result.current[ 'progress-padawan' ] ).toEqual( {
				progress: 100,
				remaining: 0,
			} );
		} );

		it( 'uses recent saved progress within 2 days', () => {
			const recentDate = new Date();
			recentDate.setDate( recentDate.getDate() - 1 ); // 1 day ago

			const savedStats = {
				'progress-padawan': {
					progress: 60,
					remaining: 4,
					date: recentDate.toISOString(),
				},
			};

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
				} )
			);

			expect( result.current[ 'progress-padawan' ] ).toEqual( {
				progress: 60,
				remaining: 4,
			} );
		} );

		it( 'recalculates when saved progress is older than 2 days', () => {
			const oldDate = new Date();
			oldDate.setDate( oldDate.getDate() - 5 ); // 5 days ago

			const savedStats = {
				'progress-padawan': {
					progress: 60,
					remaining: 4,
					date: oldDate.toISOString(),
				},
			};

			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
				} )
			);

			// Should recalculate since saved data is old
			expect( calculateMaintenanceBadgeProgress ).toHaveBeenCalled();
		} );
	} );

	describe( 'monthly badges', () => {
		const mockGetMonthlyBadgeDateRange = jest.fn( ( badgeId ) => {
			// Parse the badge ID to get year and month
			const match = badgeId.match( /monthly-(\d+)-m(\d+)/ );
			if ( ! match ) {
				return null;
			}
			const year = parseInt( match[ 1 ], 10 );
			const month = parseInt( match[ 2 ], 10 ) - 1; // 0-indexed

			return {
				startDate: new Date( year, month, 1 ),
				endDate: new Date( year, month + 1, 0 ),
			};
		} );

		beforeEach( () => {
			mockGetMonthlyBadgeDateRange.mockClear();
		} );

		it( 'does not process monthly badges without date range function', () => {
			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					getMonthlyBadgeDateRange: null,
				} )
			);

			expect( calculateMonthlyBadgeProgress ).not.toHaveBeenCalled();
		} );

		it( 'processes monthly badges when date range function is provided', () => {
			renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					getMonthlyBadgeDateRange: mockGetMonthlyBadgeDateRange,
				} )
			);

			expect( calculateMonthlyBadgeProgress ).toHaveBeenCalled();
		} );

		it( 'uses saved progress for complete monthly badges', () => {
			const savedStats = {
				'monthly-2024-m6': {
					progress: 100,
					remaining: 0,
					points: 10,
				},
			};

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
					getMonthlyBadgeDateRange: mockGetMonthlyBadgeDateRange,
				} )
			);

			expect( result.current[ 'monthly-2024-m6' ] ).toEqual( {
				progress: 100,
				remaining: 0,
				points: 10,
			} );
		} );

		it( 'includes current month badge', () => {
			const now = new Date();
			const currentMonthId = `monthly-${ now.getFullYear() }-m${
				now.getMonth() + 1
			}`;

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					getMonthlyBadgeDateRange: mockGetMonthlyBadgeDateRange,
				} )
			);

			expect( result.current ).toHaveProperty( currentMonthId );
		} );

		it( 'includes monthly badges from saved stats', () => {
			const savedStats = {
				'monthly-2023-m1': {
					progress: 50,
					remaining: 5,
					points: 5,
				},
			};

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats,
					getMonthlyBadgeDateRange: mockGetMonthlyBadgeDateRange,
				} )
			);

			expect( result.current ).toHaveProperty( 'monthly-2023-m1' );
		} );
	} );

	describe( 'memoization', () => {
		it( 'returns same object reference when inputs do not change', () => {
			const props = {
				activities: mockActivities,
				activationDate: mockActivationDate,
				savedStats: {},
			};

			const { result, rerender } = renderHook(
				( hookProps ) => useBadgeProgress( hookProps ),
				{ initialProps: props }
			);

			const firstResult = result.current;
			rerender( props );
			const secondResult = result.current;

			expect( firstResult ).toBe( secondResult );
		} );

		it( 'returns new object when activities change', () => {
			const { result, rerender } = renderHook(
				( { activities } ) =>
					useBadgeProgress( {
						activities,
						activationDate: mockActivationDate,
					} ),
				{ initialProps: { activities: mockActivities } }
			);

			const firstResult = result.current;
			rerender( {
				activities: [ ...mockActivities, { date: '2024-06-17' } ],
			} );
			const secondResult = result.current;

			expect( firstResult ).not.toBe( secondResult );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty activities array', () => {
			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: [],
					activationDate: mockActivationDate,
				} )
			);

			// Should still return badge progress (calculated from empty activities)
			expect( result.current ).toHaveProperty( 'content-curator' );
		} );

		it( 'handles undefined savedStats', () => {
			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
					savedStats: undefined,
				} )
			);

			expect( result.current ).toHaveProperty( 'content-curator' );
		} );

		it( 'handles missing badge in config', () => {
			// Temporarily make getBadgeById return null for a badge
			getBadgeById.mockImplementation( ( badgeId ) => {
				if ( badgeId === 'content-curator' ) {
					return null;
				}
				return { id: badgeId, type: 'content' };
			} );

			const { result } = renderHook( () =>
				useBadgeProgress( {
					activities: mockActivities,
					activationDate: mockActivationDate,
				} )
			);

			// Should not have content-curator since getBadgeById returned null
			expect( result.current[ 'content-curator' ] ).toBeUndefined();
		} );
	} );
} );
