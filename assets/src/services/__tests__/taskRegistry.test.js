/**
 * Tests for taskRegistry Service
 */

import {
	setTaskRenderCallback,
	getTaskProviderClass,
	getTaskProviderInstance,
} from '../taskRegistry';

// Mock @wordpress/hooks
jest.mock( '@wordpress/hooks', () => ( {
	addAction: jest.fn(),
} ) );

// Mock useTasksApi
jest.mock( '../../hooks/useTasksApi', () => ( {
	createTaskPost: jest.fn(),
} ) );

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'taskRegistry', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'setTaskRenderCallback', () => {
		it( 'accepts a callback function', () => {
			const callback = jest.fn();

			// Should not throw
			expect( () => {
				setTaskRenderCallback( callback );
			} ).not.toThrow();
		} );

		it( 'accepts null to clear callback', () => {
			// Should not throw
			expect( () => {
				setTaskRenderCallback( null );
			} ).not.toThrow();
		} );

		it( 'replaces existing callback', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			// Should not throw when replacing
			expect( () => {
				setTaskRenderCallback( callback1 );
				setTaskRenderCallback( callback2 );
			} ).not.toThrow();
		} );
	} );

	describe( 'getTaskProviderClass', () => {
		it( 'returns null for non-existent provider', () => {
			const result = getTaskProviderClass( 'non-existent-provider' );
			expect( result ).toBeNull();
		} );

		it( 'returns null for null providerId', () => {
			const result = getTaskProviderClass( null );
			expect( result ).toBeNull();
		} );

		it( 'returns null for undefined providerId', () => {
			const result = getTaskProviderClass( undefined );
			expect( result ).toBeNull();
		} );

		it( 'returns null for empty string providerId', () => {
			const result = getTaskProviderClass( '' );
			expect( result ).toBeNull();
		} );

		it( 'returns null for falsy values', () => {
			expect( getTaskProviderClass( 0 ) ).toBeNull();
			expect( getTaskProviderClass( false ) ).toBeNull();
		} );
	} );

	describe( 'getTaskProviderInstance', () => {
		it( 'returns null for non-existent provider', () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			const result = getTaskProviderInstance( 'non-existent-provider' );

			expect( result ).toBeNull();
			expect( warnSpy ).toHaveBeenCalledWith(
				expect.stringContaining( 'not found in registry' ),
				expect.any( Array )
			);

			warnSpy.mockRestore();
		} );

		it( 'returns null for null providerId', () => {
			const result = getTaskProviderInstance( null );
			expect( result ).toBeNull();
		} );

		it( 'returns null for undefined providerId', () => {
			const result = getTaskProviderInstance( undefined );
			expect( result ).toBeNull();
		} );

		it( 'returns null for empty string providerId', () => {
			const result = getTaskProviderInstance( '' );
			expect( result ).toBeNull();
		} );

		it( 'logs warning with available provider IDs', () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			getTaskProviderInstance( 'missing-provider' );

			expect( warnSpy ).toHaveBeenCalledWith(
				expect.stringContaining( 'Available providers:' ),
				expect.any( Array )
			);

			warnSpy.mockRestore();
		} );

		it( 'does not log warning for falsy providerId', () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			getTaskProviderInstance( null );
			getTaskProviderInstance( undefined );
			getTaskProviderInstance( '' );

			// Should not warn for falsy values - just returns null
			expect( warnSpy ).not.toHaveBeenCalled();

			warnSpy.mockRestore();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'getTaskProviderClass handles special characters in ID', () => {
			const result = getTaskProviderClass( 'provider-with-dashes' );
			expect( result ).toBeNull();
		} );

		it( 'getTaskProviderClass handles numeric string ID', () => {
			const result = getTaskProviderClass( '12345' );
			expect( result ).toBeNull();
		} );

		it( 'getTaskProviderInstance handles special characters in ID', () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			const result = getTaskProviderInstance( 'provider/with/slashes' );
			expect( result ).toBeNull();

			warnSpy.mockRestore();
		} );
	} );
} );
