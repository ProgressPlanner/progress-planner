/**
 * Tests for useLicenseGenerator Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useLicenseGenerator } from '../index';
import { ajaxRequest } from '../../../utils/ajaxRequest';

// Mock ajaxRequest
jest.mock( '../../../utils/ajaxRequest', () => ( {
	ajaxRequest: jest.fn(),
} ) );

describe( 'useLicenseGenerator', () => {
	const defaultConfig = {
		onboardNonceURL: 'https://api.example.com/nonce',
		onboardAPIUrl: 'https://api.example.com/license',
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce-123',
		siteUrl: 'https://mysite.com',
		timezoneOffset: -5,
	};

	let originalFetch;

	beforeEach( () => {
		jest.clearAllMocks();
		originalFetch = global.fetch;
		global.fetch = jest.fn();
	} );

	afterEach( () => {
		global.fetch = originalFetch;
	} );

	describe( 'initial state', () => {
		it( 'returns generateLicense function', () => {
			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			expect( typeof result.current.generateLicense ).toBe( 'function' );
		} );

		it( 'returns isGenerating as false initially', () => {
			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			expect( result.current.isGenerating ).toBe( false );
		} );

		it( 'returns error as null initially', () => {
			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			expect( result.current.error ).toBeNull();
		} );
	} );

	describe( 'generateLicense', () => {
		it( 'completes 3-step license generation', async () => {
			// Mock nonce fetch
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( {
							status: 'ok',
							nonce: 'generated-nonce',
						} ),
				} )
				// Mock license generation
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( {
							license_key: 'LICENSE-KEY-123',
						} ),
				} );

			// Mock save license
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			let licenseKey;
			await act( async () => {
				licenseKey = await result.current.generateLicense();
			} );

			expect( licenseKey ).toBe( 'LICENSE-KEY-123' );
			expect( global.fetch ).toHaveBeenCalledTimes( 2 );
			expect( ajaxRequest ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'sends correct data to nonce endpoint', async () => {
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'nonce' } ),
				} )
				.mockResolvedValueOnce( {
					json: () => Promise.resolve( { license_key: 'key' } ),
				} );
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await result.current.generateLicense();
			} );

			const [ nonceUrl, nonceOptions ] = global.fetch.mock.calls[ 0 ];
			expect( nonceUrl ).toBe( 'https://api.example.com/nonce' );
			expect( nonceOptions.method ).toBe( 'POST' );
			expect( nonceOptions.body.get( 'site' ) ).toBe(
				'https://mysite.com'
			);
		} );

		it( 'sends correct data to license endpoint', async () => {
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'api-nonce' } ),
				} )
				.mockResolvedValueOnce( {
					json: () => Promise.resolve( { license_key: 'key' } ),
				} );
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await result.current.generateLicense( { name: 'Test User' } );
			} );

			const [ licenseUrl, licenseOptions ] = global.fetch.mock.calls[ 1 ];
			expect( licenseUrl ).toBe( 'https://api.example.com/license' );
			expect( licenseOptions.method ).toBe( 'POST' );
			expect( licenseOptions.body.get( 'nonce' ) ).toBe( 'api-nonce' );
			expect( licenseOptions.body.get( 'site' ) ).toBe(
				'https://mysite.com'
			);
			expect( licenseOptions.body.get( 'timezone_offset' ) ).toBe( '-5' );
			expect( licenseOptions.body.get( 'name' ) ).toBe( 'Test User' );
		} );

		it( 'saves license via ajaxRequest', async () => {
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'nonce' } ),
				} )
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { license_key: 'NEW-LICENSE' } ),
				} );
			ajaxRequest.mockResolvedValue( { success: true } );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await result.current.generateLicense();
			} );

			expect( ajaxRequest ).toHaveBeenCalledWith( {
				url: '/wp-admin/admin-ajax.php',
				data: {
					action: 'progress_planner_save_onboard_data',
					_ajax_nonce: 'test-nonce-123',
					key: 'NEW-LICENSE',
				},
			} );
		} );

		it( 'sets isGenerating to true during request', async () => {
			let resolveNonce;
			global.fetch.mockImplementationOnce(
				() =>
					new Promise( ( resolve ) => {
						resolveNonce = resolve;
					} )
			);

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			let promise;
			act( () => {
				promise = result.current.generateLicense();
			} );

			expect( result.current.isGenerating ).toBe( true );

			// Complete the request
			global.fetch.mockResolvedValueOnce( {
				json: () => Promise.resolve( { license_key: 'key' } ),
			} );
			ajaxRequest.mockResolvedValue( { success: true } );

			await act( async () => {
				resolveNonce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'nonce' } ),
				} );
				await promise;
			} );

			expect( result.current.isGenerating ).toBe( false );
		} );
	} );

	describe( 'error handling', () => {
		it( 'throws error when nonce request fails', async () => {
			global.fetch.mockResolvedValueOnce( {
				json: () => Promise.resolve( { status: 'error' } ),
			} );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.generateLicense()
				).rejects.toThrow( 'Failed to get nonce' );
			} );

			expect( result.current.error ).toBe( 'Failed to get nonce' );
		} );

		it( 'throws error when license generation fails', async () => {
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'nonce' } ),
				} )
				.mockResolvedValueOnce( {
					json: () => Promise.resolve( { error: 'Invalid request' } ),
				} );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.generateLicense()
				).rejects.toThrow( 'Failed to generate license' );
			} );

			expect( result.current.error ).toBe( 'Failed to generate license' );
		} );

		it( 'handles network errors', async () => {
			global.fetch.mockRejectedValueOnce( new Error( 'Network error' ) );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				await expect(
					result.current.generateLicense()
				).rejects.toThrow( 'Network error' );
			} );

			expect( result.current.error ).toBe( 'Network error' );
		} );

		it( 'clears error on new request', async () => {
			// First request fails
			global.fetch.mockResolvedValueOnce( {
				json: () => Promise.resolve( { status: 'error' } ),
			} );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.generateLicense();
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.error ).toBe( 'Failed to get nonce' );

			// Second request succeeds
			global.fetch
				.mockResolvedValueOnce( {
					json: () =>
						Promise.resolve( { status: 'ok', nonce: 'nonce' } ),
				} )
				.mockResolvedValueOnce( {
					json: () => Promise.resolve( { license_key: 'key' } ),
				} );
			ajaxRequest.mockResolvedValue( { success: true } );

			await act( async () => {
				await result.current.generateLicense();
			} );

			expect( result.current.error ).toBeNull();
		} );

		it( 'sets isGenerating to false after error', async () => {
			global.fetch.mockRejectedValueOnce( new Error( 'Error' ) );

			const { result } = renderHook( () =>
				useLicenseGenerator( defaultConfig )
			);

			await act( async () => {
				try {
					await result.current.generateLicense();
				} catch ( e ) {
					// Expected
				}
			} );

			expect( result.current.isGenerating ).toBe( false );
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable generateLicense reference when config unchanged', () => {
			const { result, rerender } = renderHook(
				( config ) => useLicenseGenerator( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.generateLicense;
			rerender( defaultConfig );
			const secondFunc = result.current.generateLicense;

			expect( firstFunc ).toBe( secondFunc );
		} );

		it( 'returns new generateLicense reference when config changes', () => {
			const { result, rerender } = renderHook(
				( config ) => useLicenseGenerator( config ),
				{ initialProps: defaultConfig }
			);

			const firstFunc = result.current.generateLicense;
			rerender( { ...defaultConfig, siteUrl: 'https://newsite.com' } );
			const secondFunc = result.current.generateLicense;

			expect( firstFunc ).not.toBe( secondFunc );
		} );
	} );
} );
