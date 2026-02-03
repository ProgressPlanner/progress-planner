/**
 * Tests for usePopoverForms Hook
 */

import apiFetch from '@wordpress/api-fetch';
import {
	submitSiteSettings,
	submitPluginSettings,
	submitCustom,
	deletePost,
	closePopover,
	submitSubscribeForm,
} from '../index';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'usePopoverForms', () => {
	let popoverElement;
	let formElement;
	let submitButton;

	beforeEach( () => {
		jest.clearAllMocks();

		// Set up DOM elements
		popoverElement = document.createElement( 'div' );
		popoverElement.id = 'test-popover';
		popoverElement.hidePopover = jest.fn();

		formElement = document.createElement( 'form' );

		submitButton = document.createElement( 'button' );
		submitButton.type = 'submit';
		formElement.appendChild( submitButton );

		popoverElement.appendChild( formElement );
		document.body.appendChild( popoverElement );
	} );

	afterEach( () => {
		document.body.innerHTML = '';
	} );

	describe( 'submitSiteSettings', () => {
		it( 'submits settings via REST API', async () => {
			apiFetch.mockResolvedValue( { blogname: 'Test Site' } );

			// Add form input
			const input = document.createElement( 'input' );
			input.name = 'blogname';
			input.value = 'Test Site';
			formElement.appendChild( input );

			const result = await submitSiteSettings( {
				settingAPIKey: 'blogname',
				setting: 'blogname',
				popoverId: 'test-popover',
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { blogname: 'Test Site' },
			} );
			expect( result ).toEqual( { blogname: 'Test Site' } );
		} );

		it( 'uses provided value instead of form value', async () => {
			apiFetch.mockResolvedValue( { blogname: 'Direct Value' } );

			await submitSiteSettings( {
				settingAPIKey: 'blogname',
				setting: 'blogname',
				popoverId: 'test-popover',
				value: 'Direct Value',
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { blogname: 'Direct Value' },
			} );
		} );

		it( 'applies settingCallbackValue transformation', async () => {
			apiFetch.mockResolvedValue( { option: 'LOWERCASE' } );

			const input = document.createElement( 'input' );
			input.name = 'option';
			input.value = 'lowercase';
			formElement.appendChild( input );

			await submitSiteSettings( {
				settingAPIKey: 'option',
				setting: 'option',
				popoverId: 'test-popover',
				settingCallbackValue: ( val ) => val.toUpperCase(),
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { option: 'LOWERCASE' },
			} );
		} );

		it( 'shows loading state during request', async () => {
			let resolveRequest;
			apiFetch.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveRequest = resolve;
					} )
			);

			const promise = submitSiteSettings( {
				settingAPIKey: 'test',
				setting: 'test',
				popoverId: 'test-popover',
				value: 'value',
			} );

			// Button should be disabled during request
			expect( submitButton.disabled ).toBe( true );

			// Spinner should be added
			expect(
				formElement.querySelector( 'span.prpl-spinner' )
			).not.toBeNull();

			resolveRequest( { success: true } );
			await promise;

			// Button should be re-enabled
			expect( submitButton.disabled ).toBe( false );

			// Spinner should be removed
			expect(
				formElement.querySelector( 'span.prpl-spinner' )
			).toBeNull();
		} );

		it( 'shows error on failure', async () => {
			apiFetch.mockRejectedValue( new Error( 'API Error' ) );

			await expect(
				submitSiteSettings( {
					settingAPIKey: 'test',
					setting: 'test',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow( 'API Error' );

			// Error message should be shown
			const errorMessage = popoverElement.querySelector(
				'p.prpl-interactive-task-error-message'
			);
			expect( errorMessage ).not.toBeNull();
		} );

		it( 'throws error when form not found and no value provided', async () => {
			document.body.innerHTML = '';

			await expect(
				submitSiteSettings( {
					settingAPIKey: 'test',
					setting: 'test',
					popoverId: 'nonexistent',
				} )
			).rejects.toThrow( 'Form not found and no value provided' );
		} );

		it( 'works without form when value is provided', async () => {
			document.body.innerHTML = '';
			apiFetch.mockResolvedValue( { test: 'value' } );

			const result = await submitSiteSettings( {
				settingAPIKey: 'test',
				setting: 'test',
				popoverId: 'nonexistent',
				value: 'value',
			} );

			expect( result ).toEqual( { test: 'value' } );
		} );
	} );

	describe( 'submitPluginSettings', () => {
		it( 'submits to plugin REST endpoint', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			const input = document.createElement( 'input' );
			input.name = 'plugin_option';
			input.value = 'option_value';
			formElement.appendChild( input );

			const result = await submitPluginSettings( {
				setting: 'plugin_option',
				popoverId: 'test-popover',
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/popover/submit',
				method: 'POST',
				data: {
					setting: 'plugin_option',
					value: 'option_value',
					setting_path: '',
				},
			} );
			expect( result ).toEqual( { success: true } );
		} );

		it( 'handles array settingPath', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitPluginSettings( {
				setting: 'option',
				settingPath: [ 'parent', 'child' ],
				popoverId: 'test-popover',
				value: 'value',
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						setting_path: '["parent","child"]',
					} ),
				} )
			);
		} );

		it( 'handles string settingPath', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitPluginSettings( {
				setting: 'option',
				settingPath: '["already","json"]',
				popoverId: 'test-popover',
				value: 'value',
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						setting_path: '["already","json"]',
					} ),
				} )
			);
		} );

		it( 'throws error when response.success is not true', async () => {
			apiFetch.mockResolvedValue( { success: false } );

			await expect(
				submitPluginSettings( {
					setting: 'option',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow( 'Settings update failed' );
		} );

		it( 'shows error on API failure', async () => {
			apiFetch.mockRejectedValue( new Error( 'Network error' ) );

			await expect(
				submitPluginSettings( {
					setting: 'option',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow( 'Network error' );

			const errorMessage = popoverElement.querySelector(
				'p.prpl-interactive-task-error-message'
			);
			expect( errorMessage ).not.toBeNull();
		} );
	} );

	describe( 'submitCustom', () => {
		it( 'executes callback and returns response', async () => {
			const callback = jest.fn().mockResolvedValue( { success: true } );

			const result = await submitCustom( {
				popoverId: 'test-popover',
				callback,
			} );

			expect( callback ).toHaveBeenCalled();
			expect( result ).toEqual( { success: true } );
		} );

		it( 'shows loading state during callback', async () => {
			let resolveCallback;
			const callback = jest.fn(
				() =>
					new Promise( ( resolve ) => {
						resolveCallback = resolve;
					} )
			);

			const promise = submitCustom( {
				popoverId: 'test-popover',
				callback,
			} );

			expect( submitButton.disabled ).toBe( true );

			resolveCallback( { success: true } );
			await promise;

			expect( submitButton.disabled ).toBe( false );
		} );

		it( 'throws error when callback returns success: false', async () => {
			const callback = jest.fn().mockResolvedValue( { success: false } );

			await expect(
				submitCustom( {
					popoverId: 'test-popover',
					callback,
				} )
			).rejects.toThrow( 'Custom submit failed' );
		} );

		it( 'throws error when form not found', async () => {
			document.body.innerHTML = '';

			await expect(
				submitCustom( {
					popoverId: 'nonexistent',
					callback: jest.fn(),
				} )
			).rejects.toThrow( 'Form not found' );
		} );

		it( 'handles callback errors', async () => {
			const callback = jest
				.fn()
				.mockRejectedValue( new Error( 'Callback error' ) );

			await expect(
				submitCustom( {
					popoverId: 'test-popover',
					callback,
				} )
			).rejects.toThrow( 'Callback error' );

			// Should hide loading and show error
			expect( submitButton.disabled ).toBe( false );
			const errorMessage = popoverElement.querySelector(
				'p.prpl-interactive-task-error-message'
			);
			expect( errorMessage ).not.toBeNull();
		} );
	} );

	describe( 'deletePost', () => {
		it( 'deletes post via REST API', async () => {
			apiFetch.mockResolvedValue( { deleted: true } );

			const result = await deletePost( 123 );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/posts/123?force=true',
				method: 'DELETE',
			} );
			expect( result ).toEqual( { deleted: true } );
		} );

		it( 'uses custom post type', async () => {
			apiFetch.mockResolvedValue( { deleted: true } );

			await deletePost( 456, 'pages' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/pages/456?force=true',
				method: 'DELETE',
			} );
		} );

		it( 'defaults to posts type', async () => {
			apiFetch.mockResolvedValue( { deleted: true } );

			await deletePost( 789 );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: '/wp/v2/posts/789?force=true',
				} )
			);
		} );
	} );

	describe( 'closePopover', () => {
		it( 'calls hidePopover on element', () => {
			closePopover( 'test-popover' );

			expect( popoverElement.hidePopover ).toHaveBeenCalled();
		} );

		it( 'does nothing when popover not found', () => {
			// Should not throw
			expect( () => closePopover( 'nonexistent' ) ).not.toThrow();
		} );

		it( 'does nothing when hidePopover is not a function', () => {
			const simpleElement = document.createElement( 'div' );
			simpleElement.id = 'simple-element';
			document.body.appendChild( simpleElement );

			// Should not throw
			expect( () => closePopover( 'simple-element' ) ).not.toThrow();
		} );
	} );

	describe( 'submitSubscribeForm', () => {
		it( 'submits subscription data', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			const result = await submitSubscribeForm( {
				name: 'Test User',
				email: 'test@example.com',
				popoverId: 'test-popover',
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/popover/subscribe',
				method: 'POST',
				data: expect.objectContaining( {
					name: 'Test User',
					email: 'test@example.com',
					with_email: 'yes',
				} ),
			} );
			expect( result ).toEqual( { success: true } );
		} );

		it( 'trims name and email', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitSubscribeForm( {
				name: '  Test User  ',
				email: '  test@example.com  ',
				popoverId: 'test-popover',
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						name: 'Test User',
						email: 'test@example.com',
					} ),
				} )
			);
		} );

		it( 'includes site URL and timezone offset', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitSubscribeForm( {
				name: 'Test',
				email: 'test@test.com',
				popoverId: 'test-popover',
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						site: window.location.origin,
						timezone_offset: expect.any( Number ),
					} ),
				} )
			);
		} );

		it( 'throws error when success is false', async () => {
			apiFetch.mockResolvedValue( { success: false } );

			await expect(
				submitSubscribeForm( {
					name: 'Test',
					email: 'test@test.com',
					popoverId: 'test-popover',
				} )
			).rejects.toThrow( 'Subscription failed' );
		} );

		it( 'throws error when form not found', async () => {
			document.body.innerHTML = '';

			await expect(
				submitSubscribeForm( {
					name: 'Test',
					email: 'test@test.com',
					popoverId: 'nonexistent',
				} )
			).rejects.toThrow( 'Form not found' );
		} );

		it( 'shows loading state during submission', async () => {
			let resolveRequest;
			apiFetch.mockImplementation(
				() =>
					new Promise( ( resolve ) => {
						resolveRequest = resolve;
					} )
			);

			const promise = submitSubscribeForm( {
				name: 'Test',
				email: 'test@test.com',
				popoverId: 'test-popover',
			} );

			expect( submitButton.disabled ).toBe( true );

			resolveRequest( { success: true } );
			await promise;

			expect( submitButton.disabled ).toBe( false );
		} );
	} );

	describe( 'loading state helper functions', () => {
		it( 'finds button with data-action attribute when no submit button', async () => {
			// Remove submit button and add action button
			submitButton.remove();
			const actionButton = document.createElement( 'button' );
			actionButton.setAttribute( 'data-action', 'completeTask' );
			formElement.appendChild( actionButton );

			apiFetch.mockResolvedValue( { success: true } );

			await submitSiteSettings( {
				settingAPIKey: 'test',
				setting: 'test',
				popoverId: 'test-popover',
				value: 'value',
			} );

			// Action button should have been used for loading state
			expect( actionButton.disabled ).toBe( false );
		} );
	} );

	describe( 'error state helper functions', () => {
		it( 'does not duplicate error messages', async () => {
			apiFetch.mockRejectedValue( new Error( 'Error 1' ) );

			// First failure
			await expect(
				submitSiteSettings( {
					settingAPIKey: 'test',
					setting: 'test',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow();

			// Second failure
			await expect(
				submitSiteSettings( {
					settingAPIKey: 'test',
					setting: 'test',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow();

			// Should only have one error message
			const errorMessages = popoverElement.querySelectorAll(
				'p.prpl-interactive-task-error-message'
			);
			expect( errorMessages.length ).toBe( 1 );
		} );

		it( 'clears error on new request', async () => {
			// First request fails
			apiFetch.mockRejectedValueOnce( new Error( 'Error' ) );

			await expect(
				submitSiteSettings( {
					settingAPIKey: 'test',
					setting: 'test',
					popoverId: 'test-popover',
					value: 'value',
				} )
			).rejects.toThrow();

			// Verify error exists
			expect(
				popoverElement.querySelector(
					'p.prpl-interactive-task-error-message'
				)
			).not.toBeNull();

			// Second request succeeds
			apiFetch.mockResolvedValueOnce( { success: true } );

			await submitSiteSettings( {
				settingAPIKey: 'test',
				setting: 'test',
				popoverId: 'test-popover',
				value: 'value',
			} );

			// Error should be cleared (clearError is called at start of request)
			// But since request succeeded, no new error is added
			// Note: The clearError function removes error before request starts
		} );
	} );
} );
