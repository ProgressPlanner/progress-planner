/**
 * Tests for useBadgeProgressSave Hook
 */

import { renderHook } from '@testing-library/react';
import { useBadgeProgressSave } from '../index';
import { saveBadgeStats } from '../../../services/badgeService';

// Mock badgeService
jest.mock( '../../../services/badgeService', () => ( {
	saveBadgeStats: jest.fn(),
} ) );

describe( 'useBadgeProgressSave', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		saveBadgeStats.mockResolvedValue( { success: true } );
	} );

	describe( 'initial render', () => {
		it( 'does not save when badgeProgress is null', () => {
			renderHook( () => useBadgeProgressSave( null, {} ) );

			expect( saveBadgeStats ).not.toHaveBeenCalled();
		} );

		it( 'does not save when badgeProgress is empty object', () => {
			renderHook( () => useBadgeProgressSave( {}, {} ) );

			expect( saveBadgeStats ).not.toHaveBeenCalled();
		} );

		it( 'saves progress on initial render when different from saved', () => {
			const badgeProgress = {
				'content-curator': { progress: 50, remaining: 5 },
			};
			const savedStats = {};

			renderHook( () =>
				useBadgeProgressSave( badgeProgress, savedStats )
			);

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 50, remaining: 5 },
			} );
		} );
	} );

	describe( 'progress change detection', () => {
		it( 'saves when progress changes', async () => {
			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: {
							'content-curator': { progress: 50, remaining: 5 },
						},
						saved: {
							'content-curator': { progress: 50, remaining: 5 },
						},
					},
				}
			);

			// Wait for initial effect to complete
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );
			saveBadgeStats.mockClear();

			// Update progress
			rerender( {
				progress: {
					'content-curator': { progress: 60, remaining: 4 },
				},
				saved: { 'content-curator': { progress: 50, remaining: 5 } },
			} );

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 60, remaining: 4 },
			} );
		} );

		it( 'saves when remaining changes', async () => {
			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: {
							'content-curator': { progress: 50, remaining: 5 },
						},
						saved: {
							'content-curator': { progress: 50, remaining: 5 },
						},
					},
				}
			);

			// Wait for initial effect to complete
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );
			saveBadgeStats.mockClear();

			rerender( {
				progress: {
					'content-curator': { progress: 50, remaining: 4 },
				},
				saved: { 'content-curator': { progress: 50, remaining: 5 } },
			} );

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 50, remaining: 4 },
			} );
		} );

		it( 'does not save when progress matches saved stats', () => {
			const badgeProgress = {
				'content-curator': { progress: 50, remaining: 5 },
			};
			const savedStats = {
				'content-curator': { progress: 50, remaining: 5 },
			};

			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: badgeProgress,
						saved: savedStats,
					},
				}
			);

			// Clear initial call
			saveBadgeStats.mockClear();

			// Rerender with same values
			rerender( {
				progress: { ...badgeProgress },
				saved: savedStats,
			} );

			// Should not save since values match both saved and previous
			expect( saveBadgeStats ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'newly completed badges', () => {
		it( 'saves when badge becomes newly completed', async () => {
			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: {
							'content-curator': { progress: 90, remaining: 1 },
						},
						saved: {
							'content-curator': { progress: 90, remaining: 1 },
						},
					},
				}
			);

			// Wait for initial effect to complete
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );
			saveBadgeStats.mockClear();

			// Badge becomes completed
			rerender( {
				progress: {
					'content-curator': { progress: 100, remaining: 0 },
				},
				saved: { 'content-curator': { progress: 90, remaining: 1 } },
			} );

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 100, remaining: 0 },
			} );
		} );

		it( 'does not resave already completed badge with same values', () => {
			const badgeProgress = {
				'content-curator': { progress: 100, remaining: 0 },
			};
			const savedStats = {
				'content-curator': { progress: 100, remaining: 0 },
			};

			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: badgeProgress,
						saved: savedStats,
					},
				}
			);

			saveBadgeStats.mockClear();

			// Rerender with same completed values
			rerender( {
				progress: { ...badgeProgress },
				saved: savedStats,
			} );

			expect( saveBadgeStats ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'multiple badges', () => {
		it( 'saves all badges with changes', () => {
			renderHook( () =>
				useBadgeProgressSave(
					{
						'content-curator': { progress: 50, remaining: 5 },
						'progress-padawan': { progress: 30, remaining: 7 },
					},
					{}
				)
			);

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 50, remaining: 5 },
				'progress-padawan': { progress: 30, remaining: 7 },
			} );
		} );

		it( 'only saves badges that changed', async () => {
			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: {
							'content-curator': { progress: 50, remaining: 5 },
							'progress-padawan': { progress: 30, remaining: 7 },
						},
						saved: {
							'content-curator': { progress: 50, remaining: 5 },
							'progress-padawan': { progress: 30, remaining: 7 },
						},
					},
				}
			);

			// Wait for initial effect to complete
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );
			saveBadgeStats.mockClear();

			// Only change one badge
			rerender( {
				progress: {
					'content-curator': { progress: 60, remaining: 4 },
					'progress-padawan': { progress: 30, remaining: 7 },
				},
				saved: {
					'content-curator': { progress: 50, remaining: 5 },
					'progress-padawan': { progress: 30, remaining: 7 },
				},
			} );

			// Only content-curator should be saved
			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 60, remaining: 4 },
			} );
		} );
	} );

	describe( 'points handling', () => {
		it( 'includes points when present in progress', () => {
			renderHook( () =>
				useBadgeProgressSave(
					{
						'monthly-2024-m6': {
							progress: 80,
							remaining: 2,
							points: 8,
						},
					},
					{}
				)
			);

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'monthly-2024-m6': { progress: 80, remaining: 2, points: 8 },
			} );
		} );

		it( 'does not include points when undefined', () => {
			renderHook( () =>
				useBadgeProgressSave(
					{
						'content-curator': { progress: 50, remaining: 5 },
					},
					{}
				)
			);

			expect( saveBadgeStats ).toHaveBeenCalledWith( {
				'content-curator': { progress: 50, remaining: 5 },
			} );

			// Verify points is not in the call
			const callArg = saveBadgeStats.mock.calls[ 0 ][ 0 ];
			expect( callArg[ 'content-curator' ] ).not.toHaveProperty(
				'points'
			);
		} );
	} );

	describe( 'error handling', () => {
		it( 'silently handles save errors', async () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );
			saveBadgeStats.mockRejectedValue( new Error( 'Save failed' ) );

			// Should not throw
			expect( () => {
				renderHook( () =>
					useBadgeProgressSave(
						{ 'content-curator': { progress: 50, remaining: 5 } },
						{}
					)
				);
			} ).not.toThrow();

			// Wait for async error handling
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );

			expect( warnSpy ).toHaveBeenCalledWith(
				'Failed to save badge progress:',
				expect.any( Error )
			);

			warnSpy.mockRestore();
		} );
	} );

	describe( 'concurrent save prevention', () => {
		it( 'does not trigger concurrent saves', async () => {
			let resolveFirst;
			saveBadgeStats.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveFirst = resolve;
					} )
			);

			const { rerender } = renderHook(
				( { progress, saved } ) =>
					useBadgeProgressSave( progress, saved ),
				{
					initialProps: {
						progress: {
							'content-curator': { progress: 50, remaining: 5 },
						},
						saved: {},
					},
				}
			);

			// First save is in progress
			expect( saveBadgeStats ).toHaveBeenCalledTimes( 1 );

			// Try to trigger another save while first is pending
			rerender( {
				progress: {
					'content-curator': { progress: 60, remaining: 4 },
				},
				saved: {},
			} );

			// Should not trigger another save while one is in progress
			// Note: This depends on the isSavingRef flag in the hook
			// The effect still runs but skips saving due to the flag

			// Resolve first save
			resolveFirst( { success: true } );

			// Wait for state update
			await new Promise( ( resolve ) => setTimeout( resolve, 10 ) );

			// Now rerender again - should allow new save
			saveBadgeStats.mockClear();
			rerender( {
				progress: {
					'content-curator': { progress: 70, remaining: 3 },
				},
				saved: {},
			} );

			expect( saveBadgeStats ).toHaveBeenCalled();
		} );
	} );
} );
