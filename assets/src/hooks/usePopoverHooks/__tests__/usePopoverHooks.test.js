/**
 * Tests for usePopoverHooks Hook
 */

import { renderHook } from '@testing-library/react';
import { addAction, removeAction } from '@wordpress/hooks';
import { usePopoverHooks } from '../index';

// Mock @wordpress/hooks
jest.mock( '@wordpress/hooks', () => ( {
	addAction: jest.fn(),
	removeAction: jest.fn(),
} ) );

describe( 'usePopoverHooks', () => {
	const mockOnOpen = jest.fn();
	const mockOnClose = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'hook registration', () => {
		it( 'registers open action on mount', () => {
			renderHook( () => usePopoverHooks( mockOnOpen, mockOnClose ) );

			expect( addAction ).toHaveBeenCalledWith(
				'prpl.popover.open',
				'prpl/popover-manager',
				expect.any( Function )
			);
		} );

		it( 'registers close action on mount', () => {
			renderHook( () => usePopoverHooks( mockOnOpen, mockOnClose ) );

			expect( addAction ).toHaveBeenCalledWith(
				'prpl.popover.close',
				'prpl/popover-manager',
				expect.any( Function )
			);
		} );

		it( 'removes open action on unmount', () => {
			const { unmount } = renderHook( () =>
				usePopoverHooks( mockOnOpen, mockOnClose )
			);

			unmount();

			expect( removeAction ).toHaveBeenCalledWith(
				'prpl.popover.open',
				'prpl/popover-manager'
			);
		} );

		it( 'removes close action on unmount', () => {
			const { unmount } = renderHook( () =>
				usePopoverHooks( mockOnOpen, mockOnClose )
			);

			unmount();

			expect( removeAction ).toHaveBeenCalledWith(
				'prpl.popover.close',
				'prpl/popover-manager'
			);
		} );
	} );

	describe( 'callback invocation', () => {
		it( 'invokes onPopoverOpen callback with correct arguments', () => {
			renderHook( () => usePopoverHooks( mockOnOpen, mockOnClose ) );

			// Get the registered open handler
			const openHandler = addAction.mock.calls.find(
				( call ) => call[ 0 ] === 'prpl.popover.open'
			)[ 2 ];

			const mockTask = { id: 'task-123', title: 'Test Task' };
			openHandler( 'task-123', mockTask );

			expect( mockOnOpen ).toHaveBeenCalledWith( 'task-123', mockTask );
		} );

		it( 'invokes onPopoverClose callback with correct arguments', () => {
			renderHook( () => usePopoverHooks( mockOnOpen, mockOnClose ) );

			// Get the registered close handler
			const closeHandler = addAction.mock.calls.find(
				( call ) => call[ 0 ] === 'prpl.popover.close'
			)[ 2 ];

			closeHandler( 'task-123' );

			expect( mockOnClose ).toHaveBeenCalledWith( 'task-123' );
		} );
	} );

	describe( 'ref updates', () => {
		it( 'uses latest onPopoverOpen callback', () => {
			const firstCallback = jest.fn();
			const secondCallback = jest.fn();

			const { rerender } = renderHook(
				( { onOpen } ) => usePopoverHooks( onOpen, mockOnClose ),
				{ initialProps: { onOpen: firstCallback } }
			);

			// Get the registered handler
			const openHandler = addAction.mock.calls.find(
				( call ) => call[ 0 ] === 'prpl.popover.open'
			)[ 2 ];

			// Update callback
			rerender( { onOpen: secondCallback } );

			// Call the handler
			openHandler( 'task-1', {} );

			// Should use the updated callback
			expect( firstCallback ).not.toHaveBeenCalled();
			expect( secondCallback ).toHaveBeenCalled();
		} );

		it( 'uses latest onPopoverClose callback', () => {
			const firstCallback = jest.fn();
			const secondCallback = jest.fn();

			const { rerender } = renderHook(
				( { onClose } ) => usePopoverHooks( mockOnOpen, onClose ),
				{ initialProps: { onClose: firstCallback } }
			);

			// Get the registered handler
			const closeHandler = addAction.mock.calls.find(
				( call ) => call[ 0 ] === 'prpl.popover.close'
			)[ 2 ];

			// Update callback
			rerender( { onClose: secondCallback } );

			// Call the handler
			closeHandler( 'task-1' );

			// Should use the updated callback
			expect( firstCallback ).not.toHaveBeenCalled();
			expect( secondCallback ).toHaveBeenCalled();
		} );
	} );

	describe( 'error handling', () => {
		it( 'handles addAction errors gracefully', () => {
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );
			addAction.mockImplementation( () => {
				throw new Error( 'addAction failed' );
			} );

			// Should not throw
			expect( () => {
				renderHook( () => usePopoverHooks( mockOnOpen, mockOnClose ) );
			} ).not.toThrow();

			expect( errorSpy ).toHaveBeenCalledWith(
				'Failed to register popover hooks:',
				expect.any( Error )
			);

			errorSpy.mockRestore();
		} );

		it( 'handles removeAction errors gracefully', () => {
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );

			// Reset addAction to work normally
			addAction.mockImplementation( () => {} );

			removeAction.mockImplementation( () => {
				throw new Error( 'removeAction failed' );
			} );

			const { unmount } = renderHook( () =>
				usePopoverHooks( mockOnOpen, mockOnClose )
			);

			// Should not throw
			expect( () => {
				unmount();
			} ).not.toThrow();

			expect( errorSpy ).toHaveBeenCalledWith(
				'Failed to remove popover hooks:',
				expect.any( Error )
			);

			errorSpy.mockRestore();
		} );
	} );

	describe( 'handler stability', () => {
		it( 'does not re-register hooks when callbacks change', () => {
			const { rerender } = renderHook(
				( { onOpen, onClose } ) => usePopoverHooks( onOpen, onClose ),
				{
					initialProps: {
						onOpen: mockOnOpen,
						onClose: mockOnClose,
					},
				}
			);

			const initialAddActionCalls = addAction.mock.calls.length;

			// Update callbacks
			rerender( {
				onOpen: jest.fn(),
				onClose: jest.fn(),
			} );

			// Should not have registered new actions
			expect( addAction.mock.calls.length ).toBe( initialAddActionCalls );
		} );
	} );
} );
