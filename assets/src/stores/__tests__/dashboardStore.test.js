/**
 * Tests for Dashboard Store (Zustand)
 */

import { act } from '@testing-library/react';
import { useDashboardStore } from '../dashboardStore';

describe( 'dashboardStore', () => {
	// Reset store state before each test
	beforeEach( () => {
		act( () => {
			useDashboardStore.setState( {
				sessionPoints: 0,
				totalPoints: 0,
				lastCompletionTime: null,
				lastCompletedTask: null,
				activityScore: { current: 0, target: 100 },
				badgeProgress: {},
				cacheInvalidatedAt: null,
				shouldAutoStartWizard: false,
			} );
		} );
	} );

	describe( 'initial state', () => {
		it( 'has correct initial state', () => {
			const state = useDashboardStore.getState();

			expect( state.sessionPoints ).toBe( 0 );
			expect( state.totalPoints ).toBe( 0 );
			expect( state.lastCompletionTime ).toBeNull();
			expect( state.lastCompletedTask ).toBeNull();
			expect( state.activityScore ).toEqual( {
				current: 0,
				target: 100,
			} );
			expect( state.badgeProgress ).toEqual( {} );
			expect( state.cacheInvalidatedAt ).toBeNull();
			expect( state.shouldAutoStartWizard ).toBe( false );
		} );
	} );

	describe( 'onTaskCompleted', () => {
		it( 'adds points to sessionPoints', () => {
			const { onTaskCompleted } = useDashboardStore.getState();

			act( () => {
				onTaskCompleted( { id: 1 }, 5 );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 5 );
		} );

		it( 'sets lastCompletedTask', () => {
			const { onTaskCompleted } = useDashboardStore.getState();
			const task = { id: 1, title: 'Test Task' };

			act( () => {
				onTaskCompleted( task, 0 );
			} );

			expect( useDashboardStore.getState().lastCompletedTask ).toEqual(
				task
			);
		} );

		it( 'sets lastCompletionTime', () => {
			const { onTaskCompleted } = useDashboardStore.getState();
			const before = Date.now();

			act( () => {
				onTaskCompleted( { id: 1 }, 0 );
			} );

			const after = Date.now();
			const timestamp = useDashboardStore.getState().lastCompletionTime;

			expect( timestamp ).toBeGreaterThanOrEqual( before );
			expect( timestamp ).toBeLessThanOrEqual( after );
		} );

		it( 'accumulates points from multiple completions', () => {
			const { onTaskCompleted } = useDashboardStore.getState();

			act( () => {
				onTaskCompleted( { id: 1 }, 5 );
				onTaskCompleted( { id: 2 }, 3 );
				onTaskCompleted( { id: 3 }, 7 );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 15 );
		} );

		it( 'defaults to 0 points when not provided', () => {
			const { onTaskCompleted } = useDashboardStore.getState();

			act( () => {
				onTaskCompleted( { id: 1 } );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 0 );
		} );
	} );

	describe( 'onTaskUncompleted', () => {
		it( 'subtracts points from sessionPoints', () => {
			// Set initial points
			act( () => {
				useDashboardStore.setState( { sessionPoints: 10 } );
			} );

			const { onTaskUncompleted } = useDashboardStore.getState();

			act( () => {
				onTaskUncompleted( { id: 1 }, 3 );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 7 );
		} );

		it( 'does not go below 0', () => {
			act( () => {
				useDashboardStore.setState( { sessionPoints: 2 } );
			} );

			const { onTaskUncompleted } = useDashboardStore.getState();

			act( () => {
				onTaskUncompleted( { id: 1 }, 5 );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 0 );
		} );

		it( 'handles zero points', () => {
			act( () => {
				useDashboardStore.setState( { sessionPoints: 10 } );
			} );

			const { onTaskUncompleted } = useDashboardStore.getState();

			act( () => {
				onTaskUncompleted( { id: 1 }, 0 );
			} );

			expect( useDashboardStore.getState().sessionPoints ).toBe( 10 );
		} );
	} );

	describe( 'updateActivityScore', () => {
		it( 'updates activity score current value', () => {
			const { updateActivityScore } = useDashboardStore.getState();

			act( () => {
				updateActivityScore( { current: 50 } );
			} );

			expect( useDashboardStore.getState().activityScore ).toEqual( {
				current: 50,
				target: 100,
			} );
		} );

		it( 'updates activity score target value', () => {
			const { updateActivityScore } = useDashboardStore.getState();

			act( () => {
				updateActivityScore( { target: 200 } );
			} );

			expect( useDashboardStore.getState().activityScore ).toEqual( {
				current: 0,
				target: 200,
			} );
		} );

		it( 'updates both values at once', () => {
			const { updateActivityScore } = useDashboardStore.getState();

			act( () => {
				updateActivityScore( { current: 75, target: 150 } );
			} );

			expect( useDashboardStore.getState().activityScore ).toEqual( {
				current: 75,
				target: 150,
			} );
		} );

		it( 'preserves existing values not updated', () => {
			act( () => {
				useDashboardStore.setState( {
					activityScore: { current: 30, target: 100, extra: 'value' },
				} );
			} );

			const { updateActivityScore } = useDashboardStore.getState();

			act( () => {
				updateActivityScore( { current: 50 } );
			} );

			const score = useDashboardStore.getState().activityScore;
			expect( score.current ).toBe( 50 );
			expect( score.target ).toBe( 100 );
			expect( score.extra ).toBe( 'value' );
		} );
	} );

	describe( 'updateBadgeProgress', () => {
		it( 'sets badge progress for a type', () => {
			const { updateBadgeProgress } = useDashboardStore.getState();

			act( () => {
				updateBadgeProgress( 'content', {
					progress: 50,
					remaining: 5,
				} );
			} );

			expect( useDashboardStore.getState().badgeProgress ).toEqual( {
				content: { progress: 50, remaining: 5 },
			} );
		} );

		it( 'updates existing badge type', () => {
			act( () => {
				useDashboardStore.setState( {
					badgeProgress: {
						content: { progress: 30, remaining: 7 },
					},
				} );
			} );

			const { updateBadgeProgress } = useDashboardStore.getState();

			act( () => {
				updateBadgeProgress( 'content', {
					progress: 60,
					remaining: 4,
				} );
			} );

			expect(
				useDashboardStore.getState().badgeProgress.content
			).toEqual( {
				progress: 60,
				remaining: 4,
			} );
		} );

		it( 'preserves other badge types', () => {
			act( () => {
				useDashboardStore.setState( {
					badgeProgress: {
						content: { progress: 50, remaining: 5 },
						maintenance: { progress: 30, remaining: 3 },
					},
				} );
			} );

			const { updateBadgeProgress } = useDashboardStore.getState();

			act( () => {
				updateBadgeProgress( 'content', {
					progress: 75,
					remaining: 2,
				} );
			} );

			const badgeProgress = useDashboardStore.getState().badgeProgress;
			expect( badgeProgress.content ).toEqual( {
				progress: 75,
				remaining: 2,
			} );
			expect( badgeProgress.maintenance ).toEqual( {
				progress: 30,
				remaining: 3,
			} );
		} );
	} );

	describe( 'invalidateCache', () => {
		it( 'sets cacheInvalidatedAt timestamp', () => {
			const before = Date.now();
			const { invalidateCache } = useDashboardStore.getState();

			act( () => {
				invalidateCache();
			} );

			const after = Date.now();
			const timestamp = useDashboardStore.getState().cacheInvalidatedAt;

			expect( timestamp ).toBeGreaterThanOrEqual( before );
			expect( timestamp ).toBeLessThanOrEqual( after );
		} );

		it( 'updates timestamp on subsequent calls', () => {
			const { invalidateCache } = useDashboardStore.getState();

			act( () => {
				invalidateCache();
			} );

			const first = useDashboardStore.getState().cacheInvalidatedAt;

			// Wait a tick to ensure different timestamp
			return new Promise( ( resolve ) => {
				setTimeout( () => {
					act( () => {
						invalidateCache();
					} );

					const second =
						useDashboardStore.getState().cacheInvalidatedAt;
					expect( second ).toBeGreaterThanOrEqual( first );
					resolve();
				}, 1 );
			} );
		} );
	} );

	describe( 'setShouldAutoStartWizard', () => {
		it( 'sets shouldAutoStartWizard to true', () => {
			const { setShouldAutoStartWizard } = useDashboardStore.getState();

			act( () => {
				setShouldAutoStartWizard( true );
			} );

			expect( useDashboardStore.getState().shouldAutoStartWizard ).toBe(
				true
			);
		} );

		it( 'sets shouldAutoStartWizard to false', () => {
			act( () => {
				useDashboardStore.setState( { shouldAutoStartWizard: true } );
			} );

			const { setShouldAutoStartWizard } = useDashboardStore.getState();

			act( () => {
				setShouldAutoStartWizard( false );
			} );

			expect( useDashboardStore.getState().shouldAutoStartWizard ).toBe(
				false
			);
		} );
	} );
} );
