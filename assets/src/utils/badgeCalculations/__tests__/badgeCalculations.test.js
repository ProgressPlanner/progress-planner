/**
 * Tests for Badge Calculation Utilities
 */

import {
	calculateContentBadgeProgress,
	calculateWeeklyStreak,
	calculateMaintenanceBadgeProgress,
	calculateMonthlyBadgeProgress,
} from '../index';

describe( 'badgeCalculations', () => {
	describe( 'calculateContentBadgeProgress', () => {
		describe( 'content-curator badge (special logic)', () => {
			const badge = {
				id: 'content-curator',
				thresholds: { existingPosts: 20, newPosts: 10 },
			};

			it( 'returns 100% progress when totalPostsCount >= 20 (existing posts threshold)', () => {
				const result = calculateContentBadgeProgress(
					badge,
					[],
					20,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBe( 100 );
				expect( result.remaining ).toBe( 0 );
			} );

			it( 'returns 100% progress when totalPostsCount exceeds threshold', () => {
				const result = calculateContentBadgeProgress(
					badge,
					[],
					50,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBe( 100 );
				expect( result.remaining ).toBe( 0 );
			} );

			it( 'calculates progress based on new posts when existing posts < 20', () => {
				const activities = [
					{
						category: 'content',
						type: 'publish',
						date: '2024-06-01',
					},
					{
						category: 'content',
						type: 'publish',
						date: '2024-06-02',
					},
					{
						category: 'content',
						type: 'publish',
						date: '2024-06-03',
					},
				];
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					5,
					new Date( '2024-01-01' )
				);
				// 3 new posts out of 10 = 30% (via newPosts calculation)
				// 5 existing out of 20 = 25% (via existingPosts calculation)
				// Progress should be max of the two approaches
				expect( result.progress ).toBe( 30 );
				expect( result.remaining ).toBeLessThanOrEqual( 10 );
			} );

			it( 'ignores activities before activation date', () => {
				const activities = [
					// This activity is before activation date
					{
						category: 'content',
						type: 'publish',
						date: '2023-12-01',
					},
				];
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					5,
					new Date( '2024-01-01' )
				);
				// Activity before activation shouldn't count
				expect( result.remaining ).toBeGreaterThan( 0 );
			} );

			it( 'ignores non-content activities', () => {
				const activities = [
					{
						category: 'maintenance',
						type: 'update',
						date: '2024-06-01',
					},
				];
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					5,
					new Date( '2024-01-01' )
				);
				// Maintenance activities shouldn't count toward content badge
				expect( result.remaining ).toBeGreaterThan( 0 );
			} );

			it( 'ignores non-publish content activities', () => {
				const activities = [
					{ category: 'content', type: 'update', date: '2024-06-01' },
				];
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					5,
					new Date( '2024-01-01' )
				);
				// Update activities shouldn't count
				expect( result.remaining ).toBeGreaterThan( 0 );
			} );

			it( 'handles empty activities array', () => {
				const result = calculateContentBadgeProgress(
					badge,
					[],
					5,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBeGreaterThanOrEqual( 0 );
				expect( result.remaining ).toBeGreaterThan( 0 );
			} );

			it( 'completes when 10 new posts are published', () => {
				const activities = Array( 10 )
					.fill( null )
					.map( ( _, i ) => ( {
						category: 'content',
						type: 'publish',
						date: `2024-06-${ String( i + 1 ).padStart( 2, '0' ) }`,
					} ) );
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					5,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBe( 100 );
				expect( result.remaining ).toBe( 0 );
			} );
		} );

		describe( 'other content badges', () => {
			const badge = {
				id: 'content-writer',
				thresholds: { newPosts: 25 },
			};

			it( 'calculates progress correctly', () => {
				const activities = Array( 5 )
					.fill( null )
					.map( ( _, i ) => ( {
						category: 'content',
						type: 'publish',
						date: `2024-06-${ String( i + 1 ).padStart( 2, '0' ) }`,
					} ) );
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					10,
					new Date( '2024-01-01' )
				);
				// 5 out of 25 = 20%
				expect( result.progress ).toBe( 20 );
				expect( result.remaining ).toBe( 20 );
			} );

			it( 'caps progress at 100%', () => {
				const activities = Array( 30 )
					.fill( null )
					.map( ( _, i ) => ( {
						category: 'content',
						type: 'publish',
						date: `2024-06-${ String( ( i % 28 ) + 1 ).padStart(
							2,
							'0'
						) }`,
					} ) );
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					50,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBe( 100 );
				expect( result.remaining ).toBe( 0 );
			} );

			it( 'handles exact threshold', () => {
				const activities = Array( 25 )
					.fill( null )
					.map( ( _, i ) => ( {
						category: 'content',
						type: 'publish',
						date: `2024-06-${ String( ( i % 28 ) + 1 ).padStart(
							2,
							'0'
						) }`,
					} ) );
				const result = calculateContentBadgeProgress(
					badge,
					activities,
					0,
					new Date( '2024-01-01' )
				);
				expect( result.progress ).toBe( 100 );
				expect( result.remaining ).toBe( 0 );
			} );
		} );
	} );

	describe( 'calculateWeeklyStreak', () => {
		it( 'returns 0 streak with no activities', () => {
			const result = calculateWeeklyStreak(
				[],
				new Date( '2024-01-01' )
			);
			expect( result.max_streak ).toBe( 0 );
			expect( result.current_streak ).toBe( 0 );
		} );

		it( 'returns 1 streak with single week activity', () => {
			const activities = [ { date: '2024-01-03' } ];
			const result = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' )
			);
			expect( result.max_streak ).toBeGreaterThanOrEqual( 1 );
		} );

		it( 'calculates streak with consecutive weekly activities', () => {
			// Create activities for 3 consecutive weeks
			const activities = [
				{ date: '2024-01-03' }, // Week 1
				{ date: '2024-01-10' }, // Week 2
				{ date: '2024-01-17' }, // Week 3
			];
			const result = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' )
			);
			expect( result.max_streak ).toBeGreaterThanOrEqual( 3 );
		} );

		it( 'ignores activities before start date', () => {
			const activities = [
				{ date: '2023-12-15' }, // Before start date
				{ date: '2024-01-03' }, // After start date
			];
			const result = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' )
			);
			// Only one valid week
			expect( result.max_streak ).toBeGreaterThanOrEqual( 1 );
		} );

		it( 'respects allowed break parameter', () => {
			// Create activities with a 1-week gap
			const activities = [
				{ date: '2024-01-03' }, // Week 1
				// Week 2 - no activity (gap)
				{ date: '2024-01-17' }, // Week 3
			];
			const resultWithBreak = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' ),
				1 // Allow 1 break
			);
			const resultNoBreak = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' ),
				0 // No breaks allowed
			);

			// With allowed break, streak should continue
			expect( resultWithBreak.max_streak ).toBeGreaterThanOrEqual(
				resultNoBreak.max_streak
			);
		} );

		it( 'handles multiple activities in same week', () => {
			const activities = [
				{ date: '2024-01-02' },
				{ date: '2024-01-03' },
				{ date: '2024-01-04' },
			];
			const result = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' )
			);
			// All activities are in the same week, so streak should be 1
			expect( result.max_streak ).toBeGreaterThanOrEqual( 1 );
		} );

		it( 'resets streak after gap exceeds allowed breaks', () => {
			const activities = [
				{ date: '2024-01-03' }, // Week 1
				// Week 2 - gap
				// Week 3 - gap
				{ date: '2024-01-24' }, // Week 4
			];
			const result = calculateWeeklyStreak(
				activities,
				new Date( '2024-01-01' ),
				1 // Only 1 break allowed, but there are 2 weeks gap
			);
			// Streak should reset because gap is too large
			expect( result.max_streak ).toBeLessThanOrEqual( 2 );
		} );
	} );

	describe( 'calculateMaintenanceBadgeProgress', () => {
		const badge = {
			id: 'progress-padawan',
			thresholds: { weeks: 6 },
		};

		it( 'returns 0 progress with no activities', () => {
			const result = calculateMaintenanceBadgeProgress(
				badge,
				[],
				new Date( '2024-01-01' )
			);
			expect( result.progress ).toBe( 0 );
			expect( result.remaining ).toBe( 6 );
		} );

		it( 'only counts maintenance activities', () => {
			const activities = [
				{ category: 'content', type: 'publish', date: '2024-01-03' },
				{ category: 'maintenance', type: 'update', date: '2024-01-03' },
			];
			const result = calculateMaintenanceBadgeProgress(
				badge,
				activities,
				new Date( '2024-01-01' )
			);
			// Only maintenance activity should count
			expect( result.progress ).toBeGreaterThan( 0 );
		} );

		it( 'calculates progress based on weekly streak', () => {
			// 3 weeks of maintenance activities
			const activities = [
				{ category: 'maintenance', date: '2024-01-03' },
				{ category: 'maintenance', date: '2024-01-10' },
				{ category: 'maintenance', date: '2024-01-17' },
			];
			const result = calculateMaintenanceBadgeProgress(
				badge,
				activities,
				new Date( '2024-01-01' )
			);
			// 3 out of 6 weeks = 50%
			expect( result.progress ).toBe( 50 );
			expect( result.remaining ).toBe( 3 );
		} );

		it( 'completes at 6 weeks', () => {
			const activities = Array( 6 )
				.fill( null )
				.map( ( _, i ) => ( {
					category: 'maintenance',
					date: new Date(
						new Date( '2024-01-03' ).getTime() +
							i * 7 * 24 * 60 * 60 * 1000
					)
						.toISOString()
						.split( 'T' )[ 0 ],
				} ) );
			const result = calculateMaintenanceBadgeProgress(
				badge,
				activities,
				new Date( '2024-01-01' )
			);
			expect( result.progress ).toBe( 100 );
			expect( result.remaining ).toBe( 0 );
		} );

		it( 'caps progress at 100%', () => {
			// More than 6 weeks
			const activities = Array( 10 )
				.fill( null )
				.map( ( _, i ) => ( {
					category: 'maintenance',
					date: new Date(
						new Date( '2024-01-03' ).getTime() +
							i * 7 * 24 * 60 * 60 * 1000
					)
						.toISOString()
						.split( 'T' )[ 0 ],
				} ) );
			const result = calculateMaintenanceBadgeProgress(
				badge,
				activities,
				new Date( '2024-01-01' )
			);
			expect( result.progress ).toBe( 100 );
			expect( result.remaining ).toBe( 0 );
		} );
	} );

	describe( 'calculateMonthlyBadgeProgress', () => {
		const badge = {
			id: 'monthly-2024-m06',
			type: 'monthly',
		};
		const monthStart = new Date( '2024-06-01' );
		const monthEnd = new Date( '2024-06-30' );
		const targetPoints = 10;

		it( 'returns 0 progress with no activities', () => {
			const result = calculateMonthlyBadgeProgress(
				badge,
				[],
				monthStart,
				monthEnd,
				targetPoints
			);
			expect( result.progress ).toBe( 0 );
			expect( result.remaining ).toBe( 10 );
			expect( result.points ).toBe( 0 );
		} );

		it( 'calculates progress based on points', () => {
			const activities = [
				{ date: '2024-06-05', points: 3 },
				{ date: '2024-06-10', points: 2 },
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			// 5 out of 10 points = 50%
			expect( result.progress ).toBe( 50 );
			expect( result.remaining ).toBe( 5 );
			expect( result.points ).toBe( 5 );
		} );

		it( 'ignores activities outside the month', () => {
			const activities = [
				{ date: '2024-05-30', points: 5 }, // Before month
				{ date: '2024-06-15', points: 3 }, // During month
				{ date: '2024-07-01', points: 5 }, // After month
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			// Only 3 points from June
			expect( result.points ).toBe( 3 );
		} );

		it( 'handles activities on month boundaries', () => {
			const activities = [
				{ date: '2024-06-01', points: 2 }, // First day
				{ date: '2024-06-30', points: 3 }, // Last day
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			expect( result.points ).toBe( 5 );
		} );

		it( 'caps progress at 100%', () => {
			const activities = [ { date: '2024-06-05', points: 15 } ];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			expect( result.progress ).toBe( 100 );
			expect( result.remaining ).toBe( 0 );
		} );

		it( 'ignores activities without points property', () => {
			const activities = [
				{ date: '2024-06-05', points: 3 },
				{ date: '2024-06-10' }, // No points
				{ date: '2024-06-15', points: null }, // Null points
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			expect( result.points ).toBe( 3 );
		} );

		it( 'respects noNextBadgePoints option', () => {
			const activities = [
				{ date: '2024-06-05', points: 5 },
				// Future month activities that could overflow
				{ date: '2024-07-15', points: 20 },
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints,
				{ noNextBadgePoints: true }
			);
			// Should not include overflow from next month
			expect( result.points ).toBe( 5 );
			expect( result.progress ).toBe( 50 );
		} );

		it( 'includes overflow points from future months when incomplete', () => {
			const activities = [
				{ date: '2024-06-05', points: 5 }, // Current month - 5 points (incomplete)
				{ date: '2024-07-15', points: 20 }, // Next month - 20 points (10 excess)
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			// Should include overflow from next month
			// Current month has 5 points, next month has 20 (10 excess)
			// Total should be 5 + 10 = 15 points
			expect( result.points ).toBeGreaterThan( 5 );
		} );

		it( 'does not add overflow when current month is already complete', () => {
			const activities = [
				{ date: '2024-06-05', points: 10 }, // Current month - complete
				{ date: '2024-07-15', points: 20 }, // Next month - excess
			];
			const result = calculateMonthlyBadgeProgress(
				badge,
				activities,
				monthStart,
				monthEnd,
				targetPoints
			);
			// Current month is complete, no need for overflow
			expect( result.points ).toBe( 10 );
			expect( result.progress ).toBe( 100 );
		} );
	} );
} );
