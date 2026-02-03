/**
 * Tests for useCelebration Hook
 */

import { renderHook, act } from '@testing-library/react';
import confetti from 'canvas-confetti';
import { useCelebration } from '../index';
import { dispatchGridResize } from '../../../utils/gridResize';

// Mock canvas-confetti
jest.mock( 'canvas-confetti', () => jest.fn() );

// Mock gridResize utility
jest.mock( '../../../utils/gridResize', () => ( {
	dispatchGridResize: jest.fn(),
} ) );

describe( 'useCelebration', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		// Reset window.prplCelebrate
		window.prplCelebrate = {
			raviIconUrl: '/ravi.svg',
			monthIconUrl: '/month.svg',
			contentIconUrl: '/content.svg',
			maintenanceIconUrl: '/maintenance.svg',
		};
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( 'hook return value', () => {
		it( 'returns celebrate function', () => {
			const { result } = renderHook( () => useCelebration() );

			expect( typeof result.current.celebrate ).toBe( 'function' );
		} );

		it( 'returns triggerGridResize function', () => {
			const { result } = renderHook( () => useCelebration() );

			expect( typeof result.current.triggerGridResize ).toBe(
				'function'
			);
		} );
	} );

	describe( 'celebrate', () => {
		it( 'triggers confetti animation', () => {
			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( null );
			} );

			// Advance through all timeouts (0ms, 100ms, 200ms)
			act( () => {
				jest.advanceTimersByTime( 300 );
			} );

			// Should have been called multiple times (3 delays × confetti options)
			expect( confetti ).toHaveBeenCalled();
		} );

		it( 'uses default origin when no container element', () => {
			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( null );
			} );

			act( () => {
				jest.advanceTimersByTime( 300 );
			} );

			// Check that confetti was called with default origin
			expect( confetti ).toHaveBeenCalledWith(
				expect.objectContaining( {
					origin: { x: 0.5, y: 0.3 },
				} )
			);
		} );

		it( 'calculates origin from container element', () => {
			// Create mock elements
			const containerEl = document.createElement( 'div' );
			containerEl.className = 'prpl-suggested-tasks-list';
			Object.defineProperty( containerEl, 'offsetWidth', { value: 400 } );
			containerEl.getBoundingClientRect = jest.fn( () => ( {
				left: 100,
				top: 200,
			} ) );
			document.body.appendChild( containerEl );

			const taskEl = document.createElement( 'div' );
			containerEl.appendChild( taskEl );

			// Mock window dimensions
			Object.defineProperty( window, 'innerWidth', { value: 1000 } );
			Object.defineProperty( window, 'innerHeight', { value: 800 } );

			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( taskEl );
			} );

			act( () => {
				jest.advanceTimersByTime( 300 );
			} );

			// Origin should be calculated based on container position
			// x = (100 + 400/2) / 1000 = 0.3
			// y = (200 + 50) / 800 = 0.3125
			expect( confetti ).toHaveBeenCalledWith(
				expect.objectContaining( {
					origin: { x: 0.3, y: 0.3125 },
				} )
			);

			// Cleanup
			document.body.removeChild( containerEl );
		} );

		it( 'uses confetti with staggered delays', () => {
			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( null );
			} );

			// At time 0, first confetti should fire
			act( () => {
				jest.advanceTimersByTime( 0 );
			} );
			const callsAt0 = confetti.mock.calls.length;

			// At time 100ms, second confetti should fire
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			const callsAt100 = confetti.mock.calls.length;
			expect( callsAt100 ).toBeGreaterThan( callsAt0 );

			// At time 200ms, third confetti should fire
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			const callsAt200 = confetti.mock.calls.length;
			expect( callsAt200 ).toBeGreaterThan( callsAt100 );
		} );

		it( 'uses custom confetti options from config', () => {
			window.prplCelebrate = {
				confettiOptions: [
					{
						particleCount: 50,
						spread: 180,
					},
				],
			};

			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( null );
			} );

			act( () => {
				jest.advanceTimersByTime( 300 );
			} );

			expect( confetti ).toHaveBeenCalledWith(
				expect.objectContaining( {
					particleCount: 50,
					spread: 180,
				} )
			);
		} );

		it( 'removes admin menu points badges', () => {
			// Create mock admin menu badge
			const adminMenu = document.createElement( 'div' );
			adminMenu.id = 'adminmenu';
			const menuItem = document.createElement( 'li' );
			menuItem.id = 'toplevel_page_progress-planner';
			const badge = document.createElement( 'span' );
			badge.className = 'update-plugins';
			menuItem.appendChild( badge );
			adminMenu.appendChild( menuItem );
			document.body.appendChild( adminMenu );

			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.celebrate( null );
			} );

			// Badge should be removed
			expect(
				document.querySelector(
					'#adminmenu #toplevel_page_progress-planner .update-plugins'
				)
			).toBeNull();

			// Cleanup
			document.body.removeChild( adminMenu );
		} );

		it( 'handles missing prplCelebrate config', () => {
			window.prplCelebrate = undefined;

			const { result } = renderHook( () => useCelebration() );

			// Should not throw
			expect( () => {
				act( () => {
					result.current.celebrate( null );
				} );
				act( () => {
					jest.advanceTimersByTime( 300 );
				} );
			} ).not.toThrow();

			expect( confetti ).toHaveBeenCalled();
		} );
	} );

	describe( 'triggerGridResize', () => {
		it( 'calls dispatchGridResize', () => {
			const { result } = renderHook( () => useCelebration() );

			act( () => {
				result.current.triggerGridResize();
			} );

			expect( dispatchGridResize ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable celebrate function reference', () => {
			const { result, rerender } = renderHook( () => useCelebration() );

			const firstCelebrate = result.current.celebrate;
			rerender();
			const secondCelebrate = result.current.celebrate;

			expect( firstCelebrate ).toBe( secondCelebrate );
		} );

		it( 'returns stable triggerGridResize function reference', () => {
			const { result, rerender } = renderHook( () => useCelebration() );

			const firstTrigger = result.current.triggerGridResize;
			rerender();
			const secondTrigger = result.current.triggerGridResize;

			expect( firstTrigger ).toBe( secondTrigger );
		} );
	} );
} );
