/**
 * Tests for useOnboardingProgress Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useOnboardingProgress } from '../index';
import { ajaxRequest } from '../../../utils/ajaxRequest';

// Mock ajaxRequest
jest.mock( '../../../utils/ajaxRequest', () => ( {
	ajaxRequest: jest.fn(),
} ) );

describe( 'useOnboardingProgress', () => {
	const defaultConfig = {
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce-123',
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'initial state', () => {
		it( 'returns saveProgress function', () => {
			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			expect( typeof result.current.saveProgress ).toBe( 'function' );
		} );

		it( 'returns isSaving as false initially', () => {
			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			expect( result.current.isSaving ).toBe( false );
		} );

		it( 'returns error as null initially', () => {
			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			expect( result.current.error ).toBeNull();
		} );
	} );

	describe( 'saveProgress', () => {
		it( 'sends correct AJAX request data', async () => {
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			const state = {
				currentStep: 2,
				data: { privacyAccepted: true },
			};

			await act( async () => {
				await result.current.saveProgress( state );
			} );

			expect( ajaxRequest ).toHaveBeenCalledWith( {
				url: '/wp-admin/admin-ajax.php',
				data: {
					action: 'progress_planner_onboarding_save_progress',
					nonce: 'test-nonce-123',
					state: JSON.stringify( state ),
				},
			} );
		} );

		it( 'returns response on success', async () => {
			const mockResponse = {
				success: true,
				data: { saved: true },
			};
			ajaxRequest.mockResolvedValue( mockResponse );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			let response;
			await act( async () => {
				response = await result.current.saveProgress( {} );
			} );

			expect( response ).toEqual( mockResponse );
		} );

		it( 'sets isSaving to true during request', async () => {
			let resolveRequest;
			ajaxRequest.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveRequest = resolve;
					} )
			);

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			let promise;
			act( () => {
				promise = result.current.saveProgress( {} );
			} );

			// Should be saving
			expect( result.current.isSaving ).toBe( true );

			// Resolve the request
			await act( async () => {
				resolveRequest( { success: true } );
				await promise;
			} );

			// Should no longer be saving
			expect( result.current.isSaving ).toBe( false );
		} );

		it( 'throws error when response.success is false', async () => {
			ajaxRequest.mockResolvedValue( {
				success: false,
				data: { message: 'Permission denied' },
			} );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.saveProgress( {} )
				).rejects.toThrow( 'Permission denied' );
			} );

			expect( result.current.error ).toBe( 'Permission denied' );
		} );

		it( 'uses default error message when response has no message', async () => {
			ajaxRequest.mockResolvedValue( {
				success: false,
				data: {},
			} );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.saveProgress( {} )
				).rejects.toThrow( 'Failed to save progress' );
			} );

			expect( result.current.error ).toBe( 'Failed to save progress' );
		} );

		it( 'handles network errors', async () => {
			ajaxRequest.mockRejectedValue( new Error( 'Network error' ) );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.saveProgress( {} )
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
				useOnboardingProgress( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.saveProgress( {} );
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.error ).toBe( 'First error' );

			// Second request succeeds
			ajaxRequest.mockResolvedValueOnce( { success: true } );

			await act( async () => {
				await result.current.saveProgress( {} );
			} );

			// Error should be cleared
			expect( result.current.error ).toBeNull();
		} );

		it( 'sets isSaving to false after error', async () => {
			ajaxRequest.mockRejectedValue( new Error( 'Error' ) );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.saveProgress( {} );
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.isSaving ).toBe( false );
		} );

		it( 'serializes state object as JSON', async () => {
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useOnboardingProgress( defaultConfig )
			);

			const complexState = {
				currentStep: 3,
				data: {
					privacyAccepted: true,
					firstTaskCompleted: true,
					moreTasksCompleted: { task1: true, task2: false },
					emailFrequency: {
						choice: 'weekly',
						name: 'Test User',
						email: 'test@example.com',
					},
				},
			};

			await act( async () => {
				await result.current.saveProgress( complexState );
			} );

			expect( ajaxRequest ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						state: JSON.stringify( complexState ),
					} ),
				} )
			);
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable saveProgress reference when config unchanged', () => {
			const { result, rerender } = renderHook(
				( config ) => useOnboardingProgress( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.saveProgress;
			rerender( defaultConfig );
			const secondFunc = result.current.saveProgress;

			expect( firstFunc ).toBe( secondFunc );
		} );

		it( 'returns new saveProgress reference when ajaxUrl changes', () => {
			const { result, rerender } = renderHook(
				( config ) => useOnboardingProgress( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.saveProgress;
			rerender( { ...defaultConfig, ajaxUrl: '/new-ajax-url' } );
			const secondFunc = result.current.saveProgress;

			expect( firstFunc ).not.toBe( secondFunc );
		} );

		it( 'returns new saveProgress reference when nonce changes', () => {
			const { result, rerender } = renderHook(
				( config ) => useOnboardingProgress( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.saveProgress;
			rerender( { ...defaultConfig, nonce: 'new-nonce' } );
			const secondFunc = result.current.saveProgress;

			expect( firstFunc ).not.toBe( secondFunc );
		} );
	} );
} );
