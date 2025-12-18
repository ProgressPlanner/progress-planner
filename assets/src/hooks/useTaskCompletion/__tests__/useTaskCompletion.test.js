/**
 * Tests for useTaskCompletion Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useTaskCompletion } from '../index';
import { ajaxRequest } from '../../../utils/ajaxRequest';

// Mock ajaxRequest
jest.mock( '../../../utils/ajaxRequest', () => ( {
	ajaxRequest: jest.fn(),
} ) );

describe( 'useTaskCompletion', () => {
	const defaultConfig = {
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce-123',
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'initial state', () => {
		it( 'returns completeTask function', () => {
			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			expect( typeof result.current.completeTask ).toBe( 'function' );
		} );

		it( 'returns isCompleting as false initially', () => {
			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			expect( result.current.isCompleting ).toBe( false );
		} );

		it( 'returns error as null initially', () => {
			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			expect( result.current.error ).toBeNull();
		} );
	} );

	describe( 'completeTask', () => {
		it( 'sends correct AJAX request data', async () => {
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				await result.current.completeTask( 'my-task-id', {
					field1: 'value1',
				} );
			} );

			expect( ajaxRequest ).toHaveBeenCalledWith( {
				url: '/wp-admin/admin-ajax.php',
				data: {
					action: 'progress_planner_onboarding_complete_task',
					nonce: 'test-nonce-123',
					task_id: 'my-task-id',
					form_values: JSON.stringify( { field1: 'value1' } ),
				},
			} );
		} );

		it( 'uses empty object for form values when not provided', async () => {
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				await result.current.completeTask( 'task-id' );
			} );

			expect( ajaxRequest ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						form_values: '{}',
					} ),
				} )
			);
		} );

		it( 'sets isCompleting to true during request', async () => {
			let resolveRequest;
			ajaxRequest.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveRequest = resolve;
					} )
			);

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			// Start the request
			let promise;
			act( () => {
				promise = result.current.completeTask( 'task-id' );
			} );

			// Should be completing
			expect( result.current.isCompleting ).toBe( true );

			// Resolve the request
			await act( async () => {
				resolveRequest( { success: true } );
				await promise;
			} );

			// Should no longer be completing
			expect( result.current.isCompleting ).toBe( false );
		} );

		it( 'returns response on success', async () => {
			const mockResponse = {
				success: true,
				data: { points: 10 },
			};
			ajaxRequest.mockResolvedValue( mockResponse );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			let response;
			await act( async () => {
				response = await result.current.completeTask( 'task-id' );
			} );

			expect( response ).toEqual( mockResponse );
		} );

		it( 'throws error and sets error state on failure', async () => {
			ajaxRequest.mockResolvedValue( {
				success: false,
				data: { message: 'Task not found' },
			} );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.completeTask( 'invalid-task' )
				).rejects.toThrow( 'Task not found' );
			} );

			expect( result.current.error ).toBe( 'Task not found' );
		} );

		it( 'uses default error message when response has no message', async () => {
			ajaxRequest.mockResolvedValue( {
				success: false,
				data: {},
			} );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.completeTask( 'task-id' )
				).rejects.toThrow( 'Failed to complete task' );
			} );

			expect( result.current.error ).toBe( 'Failed to complete task' );
		} );

		it( 'handles network errors', async () => {
			ajaxRequest.mockRejectedValue( new Error( 'Network error' ) );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.completeTask( 'task-id' )
				).rejects.toThrow( 'Network error' );
			} );

			expect( result.current.error ).toBe( 'Network error' );
		} );

		it( 'clears error on new request', async () => {
			// First request fails
			ajaxRequest.mockResolvedValueOnce( {
				success: false,
				data: { message: 'First error' },
			} );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.completeTask( 'task-id' );
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.error ).toBe( 'First error' );

			// Second request succeeds
			ajaxRequest.mockResolvedValueOnce( { success: true } );

			await act( async () => {
				await result.current.completeTask( 'task-id' );
			} );

			// Error should be cleared
			expect( result.current.error ).toBeNull();
		} );

		it( 'sets isCompleting to false after error', async () => {
			ajaxRequest.mockRejectedValue( new Error( 'Error' ) );

			const { result } = renderHook( () =>
				useTaskCompletion( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.completeTask( 'task-id' );
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.isCompleting ).toBe( false );
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable completeTask reference when config unchanged', () => {
			const { result, rerender } = renderHook(
				( config ) => useTaskCompletion( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.completeTask;
			rerender( defaultConfig );
			const secondFunc = result.current.completeTask;

			expect( firstFunc ).toBe( secondFunc );
		} );

		it( 'returns new completeTask reference when ajaxUrl changes', () => {
			const { result, rerender } = renderHook(
				( config ) => useTaskCompletion( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.completeTask;
			rerender( { ...defaultConfig, ajaxUrl: '/new-ajax-url' } );
			const secondFunc = result.current.completeTask;

			expect( firstFunc ).not.toBe( secondFunc );
		} );

		it( 'returns new completeTask reference when nonce changes', () => {
			const { result, rerender } = renderHook(
				( config ) => useTaskCompletion( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.completeTask;
			rerender( { ...defaultConfig, nonce: 'new-nonce' } );
			const secondFunc = result.current.completeTask;

			expect( firstFunc ).not.toBe( secondFunc );
		} );
	} );
} );
