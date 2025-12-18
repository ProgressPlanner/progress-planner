/**
 * Tests for useGridMasonry Hook
 */

import { renderHook } from '@testing-library/react';
import { useGridMasonry } from '../index';

describe( 'useGridMasonry', () => {
	let originalAddEventListener;
	let originalRemoveEventListener;
	let addedListeners;
	let removedListeners;

	beforeEach( () => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		// Track event listeners
		addedListeners = [];
		removedListeners = [];

		originalAddEventListener = window.addEventListener;
		originalRemoveEventListener = window.removeEventListener;

		window.addEventListener = jest.fn( ( event, handler ) => {
			addedListeners.push( { event, handler } );
		} );

		window.removeEventListener = jest.fn( ( event, handler ) => {
			removedListeners.push( { event, handler } );
		} );

		// Default mock for empty DOM
		document.querySelectorAll = jest.fn( () => [] );
	} );

	afterEach( () => {
		window.addEventListener = originalAddEventListener;
		window.removeEventListener = originalRemoveEventListener;
		jest.useRealTimers();
	} );

	describe( 'event listener setup', () => {
		it( 'adds prpl/grid/resize event listener', () => {
			renderHook( () => useGridMasonry() );

			const resizeListener = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			);
			expect( resizeListener ).toBeDefined();
		} );

		it( 'adds window resize event listener', () => {
			renderHook( () => useGridMasonry() );

			const resizeListener = addedListeners.find(
				( l ) => l.event === 'resize'
			);
			expect( resizeListener ).toBeDefined();
		} );

		it( 'adds window load event listener', () => {
			renderHook( () => useGridMasonry() );

			const loadListener = addedListeners.find(
				( l ) => l.event === 'load'
			);
			expect( loadListener ).toBeDefined();
		} );
	} );

	describe( 'event listener cleanup', () => {
		it( 'removes all event listeners on unmount', () => {
			const { unmount } = renderHook( () => useGridMasonry() );

			unmount();

			expect( removedListeners ).toContainEqual(
				expect.objectContaining( { event: 'prpl/grid/resize' } )
			);
			expect( removedListeners ).toContainEqual(
				expect.objectContaining( { event: 'resize' } )
			);
			expect( removedListeners ).toContainEqual(
				expect.objectContaining( { event: 'load' } )
			);
		} );

		it( 'removes same handler functions that were added', () => {
			const { unmount } = renderHook( () => useGridMasonry() );

			const addedResizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;

			unmount();

			const removedResizeHandler = removedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;

			expect( removedResizeHandler ).toBe( addedResizeHandler );
		} );
	} );

	describe( 'grid resize handling', () => {
		it( 'triggers initial resize with timeout', () => {
			const querySelectorAll = jest.fn( () => [] );
			document.querySelectorAll = querySelectorAll;

			renderHook( () => useGridMasonry() );

			// Initial timeout call
			jest.advanceTimersByTime( 0 );

			expect( querySelectorAll ).toHaveBeenCalledWith(
				'.prpl-widget-wrapper'
			);
		} );

		it( 'triggers second resize after 1 second', () => {
			const querySelectorAll = jest.fn( () => [] );
			document.querySelectorAll = querySelectorAll;

			renderHook( () => useGridMasonry() );

			querySelectorAll.mockClear();

			jest.advanceTimersByTime( 1000 );

			expect( querySelectorAll ).toHaveBeenCalled();
		} );

		it( 'skips widgets in popover', () => {
			const popoverWidget = document.createElement( 'div' );
			popoverWidget.classList.add( 'prpl-widget-wrapper', 'in-popover' );
			popoverWidget.style.gridRowEnd = '';

			document.querySelectorAll = jest.fn( () => [ popoverWidget ] );

			renderHook( () => useGridMasonry() );

			// Trigger the resize
			const resizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;
			resizeHandler();

			// Style should not be set
			expect( popoverWidget.style.gridRowEnd ).toBe( '' );
		} );

		it( 'skips widgets without inner container', () => {
			const widget = document.createElement( 'div' );
			widget.classList.add( 'prpl-widget-wrapper' );
			widget.style.gridRowEnd = '';

			// No inner container
			widget.querySelector = jest.fn( () => null );

			document.querySelectorAll = jest.fn( () => [ widget ] );

			renderHook( () => useGridMasonry() );

			const resizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;
			resizeHandler();

			expect( widget.style.gridRowEnd ).toBe( '' );
		} );

		it( 'calculates and sets grid-row-end', () => {
			// Create mock elements
			const innerContainer = document.createElement( 'div' );
			innerContainer.getBoundingClientRect = jest.fn( () => ( {
				height: 100,
			} ) );

			const widget = document.createElement( 'div' );
			widget.classList.add( 'prpl-widget-wrapper' );
			widget.querySelector = jest.fn( ( selector ) => {
				if ( selector === '.widget-inner-container' ) {
					return innerContainer;
				}
				return null;
			} );

			const container = document.createElement( 'div' );
			container.classList.add( 'prpl-widgets-container' );

			// Mock document.querySelector for container
			const originalQuerySelector = document.querySelector;
			document.querySelector = jest.fn( ( selector ) => {
				if ( selector === '.prpl-widgets-container' ) {
					return container;
				}
				return originalQuerySelector.call( document, selector );
			} );

			document.querySelectorAll = jest.fn( () => [ widget ] );

			// Mock getComputedStyle
			const originalGetComputedStyle = window.getComputedStyle;
			window.getComputedStyle = jest.fn( ( el ) => {
				if ( el === container ) {
					return { getPropertyValue: () => '10' }; // grid-auto-rows
				}
				if ( el === widget ) {
					return {
						getPropertyValue: ( prop ) => {
							if ( prop === 'padding-top' ) {
								return '5';
							}
							if ( prop === 'padding-bottom' ) {
								return '5';
							}
							return '0';
						},
					};
				}
				return originalGetComputedStyle( el );
			} );

			renderHook( () => useGridMasonry() );

			const resizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;
			resizeHandler();

			// Height: 100 + paddingTop: 5 + paddingBottom: 5 = 110
			// rowHeight: 10
			// rowSpan: Math.ceil(110 / 10) = 11
			// gridRowEnd: 'span ' + (11 + 1) = 'span 12'
			expect( widget.style.gridRowEnd ).toBe( 'span 12' );

			// Restore
			window.getComputedStyle = originalGetComputedStyle;
			document.querySelector = originalQuerySelector;
		} );

		it( 'skips when no container found', () => {
			const innerContainer = document.createElement( 'div' );
			const widget = document.createElement( 'div' );
			widget.classList.add( 'prpl-widget-wrapper' );
			widget.querySelector = jest.fn( () => innerContainer );

			document.querySelectorAll = jest.fn( () => [ widget ] );
			document.querySelector = jest.fn( () => null ); // No container

			renderHook( () => useGridMasonry() );

			const resizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;
			resizeHandler();

			expect( widget.style.gridRowEnd ).toBe( '' );
		} );
	} );

	describe( 'custom event triggering', () => {
		it( 'handles prpl/grid/resize event', () => {
			const querySelectorAll = jest.fn( () => [] );
			document.querySelectorAll = querySelectorAll;

			renderHook( () => useGridMasonry() );

			querySelectorAll.mockClear();

			// Get and call the handler
			const resizeHandler = addedListeners.find(
				( l ) => l.event === 'prpl/grid/resize'
			)?.handler;
			resizeHandler();

			expect( querySelectorAll ).toHaveBeenCalledWith(
				'.prpl-widget-wrapper'
			);
		} );
	} );
} );
