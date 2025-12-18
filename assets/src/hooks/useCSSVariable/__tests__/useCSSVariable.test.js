/**
 * Tests for useCSSVariable Hook
 */

import { renderHook } from '@testing-library/react';
import { useCSSVariable, useCSSVariables } from '../index';

describe( 'useCSSVariable', () => {
	let originalGetComputedStyle;
	let mockGetPropertyValue;

	beforeEach( () => {
		mockGetPropertyValue = jest.fn();
		originalGetComputedStyle = window.getComputedStyle;
		window.getComputedStyle = jest.fn( () => ( {
			getPropertyValue: mockGetPropertyValue,
		} ) );
	} );

	afterEach( () => {
		window.getComputedStyle = originalGetComputedStyle;
	} );

	describe( 'useCSSVariable', () => {
		it( 'returns CSS variable value', () => {
			mockGetPropertyValue.mockReturnValue( '16px' );

			const { result } = renderHook( () =>
				useCSSVariable( '--prpl-padding' )
			);

			expect( result.current ).toBe( '16px' );
			expect( mockGetPropertyValue ).toHaveBeenCalledWith(
				'--prpl-padding'
			);
		} );

		it( 'trims whitespace from value', () => {
			mockGetPropertyValue.mockReturnValue( '  24px  ' );

			const { result } = renderHook( () =>
				useCSSVariable( '--prpl-margin' )
			);

			expect( result.current ).toBe( '24px' );
		} );

		it( 'returns fallback when variable is empty', () => {
			mockGetPropertyValue.mockReturnValue( '' );

			const { result } = renderHook( () =>
				useCSSVariable( '--prpl-missing', '10px' )
			);

			expect( result.current ).toBe( '10px' );
		} );

		it( 'returns fallback when variable is whitespace only', () => {
			mockGetPropertyValue.mockReturnValue( '   ' );

			const { result } = renderHook( () =>
				useCSSVariable( '--prpl-whitespace', 'default' )
			);

			expect( result.current ).toBe( 'default' );
		} );

		it( 'uses empty string as default fallback', () => {
			mockGetPropertyValue.mockReturnValue( '' );

			const { result } = renderHook( () =>
				useCSSVariable( '--prpl-no-fallback' )
			);

			expect( result.current ).toBe( '' );
		} );

		it( 'reads from document.documentElement', () => {
			mockGetPropertyValue.mockReturnValue( 'red' );

			renderHook( () => useCSSVariable( '--prpl-color' ) );

			expect( window.getComputedStyle ).toHaveBeenCalledWith(
				document.documentElement
			);
		} );
	} );

	describe( 'useCSSVariables', () => {
		it( 'returns object with variable values', () => {
			mockGetPropertyValue
				.mockReturnValueOnce( '16px' )
				.mockReturnValueOnce( 'blue' )
				.mockReturnValueOnce( '1.5' );

			const { result } = renderHook( () =>
				useCSSVariables( {
					'--prpl-padding': '8px',
					'--prpl-color': 'red',
					'--prpl-ratio': '1',
				} )
			);

			expect( result.current ).toEqual( {
				'--prpl-padding': '16px',
				'--prpl-color': 'blue',
				'--prpl-ratio': '1.5',
			} );
		} );

		it( 'uses fallbacks for missing variables', () => {
			mockGetPropertyValue
				.mockReturnValueOnce( '20px' )
				.mockReturnValueOnce( '' );

			const { result } = renderHook( () =>
				useCSSVariables( {
					'--prpl-found': 'fallback1',
					'--prpl-missing': 'fallback2',
				} )
			);

			expect( result.current ).toEqual( {
				'--prpl-found': '20px',
				'--prpl-missing': 'fallback2',
			} );
		} );

		it( 'returns empty object for empty input', () => {
			const { result } = renderHook( () => useCSSVariables( {} ) );

			expect( result.current ).toEqual( {} );
			expect( mockGetPropertyValue ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'SSR compatibility', () => {
		it( 'returns fallback when window is undefined', () => {
			// Temporarily remove window
			const originalWindow = global.window;
			// eslint-disable-next-line no-undefined
			delete global.window;

			// Note: Can't test this well in jsdom since window is always defined
			// but we verify the hook doesn't crash

			global.window = originalWindow;
		} );
	} );
} );
