/**
 * Tests for Grid Resize Utility
 */

import { dispatchGridResize } from '../index';

describe( 'gridResize', () => {
	describe( 'dispatchGridResize', () => {
		let eventHandler;

		beforeEach( () => {
			eventHandler = jest.fn();
			window.addEventListener( 'prpl/grid/resize', eventHandler );
		} );

		afterEach( () => {
			window.removeEventListener( 'prpl/grid/resize', eventHandler );
			jest.useRealTimers();
		} );

		it( 'dispatches prpl/grid/resize event immediately when delay is 0', () => {
			dispatchGridResize( 0 );

			expect( eventHandler ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'dispatches prpl/grid/resize event immediately when no delay provided', () => {
			dispatchGridResize();

			expect( eventHandler ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'dispatches event after delay when delay > 0', () => {
			jest.useFakeTimers();

			dispatchGridResize( 100 );

			// Should not fire immediately
			expect( eventHandler ).not.toHaveBeenCalled();

			// Advance time by 100ms
			jest.advanceTimersByTime( 100 );

			expect( eventHandler ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'does not fire event before delay expires', () => {
			jest.useFakeTimers();

			dispatchGridResize( 500 );

			// Advance time by only 200ms
			jest.advanceTimersByTime( 200 );

			expect( eventHandler ).not.toHaveBeenCalled();

			// Advance remaining time
			jest.advanceTimersByTime( 300 );

			expect( eventHandler ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'dispatches CustomEvent with correct type', () => {
			let receivedEvent = null;
			const specificHandler = ( event ) => {
				receivedEvent = event;
			};
			window.addEventListener( 'prpl/grid/resize', specificHandler );

			dispatchGridResize( 0 );

			expect( receivedEvent ).toBeInstanceOf( CustomEvent );
			expect( receivedEvent.type ).toBe( 'prpl/grid/resize' );

			window.removeEventListener( 'prpl/grid/resize', specificHandler );
		} );

		it( 'can dispatch multiple events with different delays', () => {
			jest.useFakeTimers();

			dispatchGridResize( 100 );
			dispatchGridResize( 200 );
			dispatchGridResize( 300 );

			expect( eventHandler ).not.toHaveBeenCalled();

			jest.advanceTimersByTime( 100 );
			expect( eventHandler ).toHaveBeenCalledTimes( 1 );

			jest.advanceTimersByTime( 100 );
			expect( eventHandler ).toHaveBeenCalledTimes( 2 );

			jest.advanceTimersByTime( 100 );
			expect( eventHandler ).toHaveBeenCalledTimes( 3 );
		} );
	} );
} );
