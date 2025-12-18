/**
 * Tests for Welcome Component
 */

import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import Welcome from '../Welcome';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg, i ) => {
			result = result
				.replace( '%s', arg )
				.replace( `%${ i + 1 }$s`, arg );
		} );
		return result;
	},
} ) );

describe( 'Welcome', () => {
	const mockConfig = {
		onboardNonceURL: 'https://api.example.com/nonce',
		onboardAPIUrl: 'https://api.example.com/onboard',
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce',
		userFirstName: 'John',
		userEmail: 'john@example.com',
		siteUrl: 'https://mysite.com',
		timezoneOffset: -5,
		branding: {
			progressIconHtml: '<svg class="progress-icon"></svg>',
			homeUrl: 'https://progressplanner.com',
			privacyPolicyUrl: 'https://progressplanner.com/privacy-policy/',
		},
		baseUrl: '/wp-content/plugins/progress-planner',
	};

	// Store original values
	const originalFetch = global.fetch;

	beforeEach( () => {
		jest.clearAllMocks();

		// Mock fetch
		global.fetch = jest.fn().mockResolvedValue( {
			json: () => Promise.resolve( { status: 'ok' } ),
		} );
	} );

	afterEach( () => {
		global.fetch = originalFetch;
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.prpl-welcome' )
			).toBeInTheDocument();
		} );

		it( 'renders welcome header', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.welcome-header' )
			).toBeInTheDocument();
		} );

		it( 'renders welcome title', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByText( 'Welcome to the Progress Planner plugin!' )
			).toBeInTheDocument();
		} );

		it( 'renders progress icon when provided', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.progress-icon' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding form', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '#prpl-onboarding-form' )
			).toBeInTheDocument();
		} );

		it( 'renders inner content section', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.inner-content' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding image', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const img = container.querySelector( 'img.onboarding' );
			expect( img ).toBeInTheDocument();
			expect( img.src ).toContain( 'image_onboaring_block.png' );
		} );
	} );

	describe( 'email preference radio buttons', () => {
		it( 'renders email preference radio buttons', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '#prpl-with-email-yes' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '#prpl-with-email-no' )
			).toBeInTheDocument();
		} );

		it( 'has "yes" selected by default', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const yesRadio = container.querySelector( '#prpl-with-email-yes' );
			const noRadio = container.querySelector( '#prpl-with-email-no' );

			expect( yesRadio.checked ).toBe( true );
			expect( noRadio.checked ).toBe( false );
		} );

		it( 'can switch to "no" option', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const noRadio = container.querySelector( '#prpl-with-email-no' );
			fireEvent.click( noRadio );

			expect( noRadio.checked ).toBe( true );
		} );

		it( 'hides form fields when "no" is selected', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const noRadio = container.querySelector( '#prpl-with-email-no' );
			fireEvent.click( noRadio );

			const formFields = container.querySelector( '.prpl-form-fields' );
			expect( formFields ).toHaveClass( 'prpl-hidden' );
		} );

		it( 'shows form fields when "yes" is selected', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const formFields = container.querySelector( '.prpl-form-fields' );
			expect( formFields ).not.toHaveClass( 'prpl-hidden' );
		} );
	} );

	describe( 'form fields', () => {
		it( 'renders name input', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '#prpl-name' )
			).toBeInTheDocument();
		} );

		it( 'renders email input', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '#prpl-email' )
			).toBeInTheDocument();
		} );

		it( 'pre-fills name from config', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const nameInput = container.querySelector( '#prpl-name' );
			expect( nameInput.value ).toBe( 'John' );
		} );

		it( 'pre-fills email from config', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const emailInput = container.querySelector( '#prpl-email' );
			expect( emailInput.value ).toBe( 'john@example.com' );
		} );

		it( 'allows editing name', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const nameInput = container.querySelector( '#prpl-name' );
			fireEvent.change( nameInput, { target: { value: 'Jane' } } );

			expect( nameInput.value ).toBe( 'Jane' );
		} );

		it( 'allows editing email', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const emailInput = container.querySelector( '#prpl-email' );
			fireEvent.change( emailInput, {
				target: { value: 'jane@example.com' },
			} );

			expect( emailInput.value ).toBe( 'jane@example.com' );
		} );

		it( 'name field is required when email preference is yes', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const nameInput = container.querySelector( '#prpl-name' );
			expect( nameInput ).toHaveAttribute( 'required' );
		} );

		it( 'email field is required when email preference is yes', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const emailInput = container.querySelector( '#prpl-email' );
			expect( emailInput ).toHaveAttribute( 'required' );
		} );
	} );

	describe( 'privacy policy checkbox', () => {
		it( 'renders privacy policy checkbox', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '#prpl-privacy-policy' )
			).toBeInTheDocument();
		} );

		it( 'privacy policy is unchecked by default', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const checkbox = container.querySelector( '#prpl-privacy-policy' );
			expect( checkbox.checked ).toBe( false );
		} );

		it( 'can check privacy policy', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const checkbox = container.querySelector( '#prpl-privacy-policy' );
			fireEvent.click( checkbox );

			expect( checkbox.checked ).toBe( true );
		} );

		it( 'privacy policy checkbox is required', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const checkbox = container.querySelector( '#prpl-privacy-policy' );
			expect( checkbox ).toHaveAttribute( 'required' );
		} );
	} );

	describe( 'submit buttons', () => {
		it( 'renders submit button for email preference', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByDisplayValue(
					'Get going and send me weekly emails'
				)
			).toBeInTheDocument();
		} );

		it( 'renders submit button for no email preference', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByDisplayValue( 'Continue without emailing me' )
			).toBeInTheDocument();
		} );

		it( 'shows email submit button when email preference is yes', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const emailSubmit = container.querySelector(
				'input[value="Get going and send me weekly emails"]'
			);
			expect( emailSubmit ).not.toHaveClass( 'prpl-hidden' );
		} );

		it( 'hides no-email submit button when email preference is yes', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const noEmailSubmit = container.querySelector(
				'input[value="Continue without emailing me"]'
			);
			expect( noEmailSubmit ).toHaveClass( 'prpl-hidden' );
		} );

		it( 'shows no-email submit button when email preference is no', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const noRadio = container.querySelector( '#prpl-with-email-no' );
			fireEvent.click( noRadio );

			const noEmailSubmit = container.querySelector(
				'input[value="Continue without emailing me"]'
			);
			expect( noEmailSubmit ).not.toHaveClass( 'prpl-hidden' );
		} );

		it( 'submit wrapper is disabled when privacy policy not accepted', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const submitWrapper = container.querySelector(
				'#prpl-onboarding-submit-wrapper'
			);
			expect( submitWrapper ).toHaveClass( 'prpl-disabled' );
		} );

		it( 'submit wrapper is enabled when privacy policy accepted', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const checkbox = container.querySelector( '#prpl-privacy-policy' );
			fireEvent.click( checkbox );

			const submitWrapper = container.querySelector(
				'#prpl-onboarding-submit-wrapper'
			);
			expect( submitWrapper ).not.toHaveClass( 'prpl-disabled' );
		} );
	} );

	describe( 'form submission', () => {
		it( 'does not submit when privacy policy not accepted', async () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const form = container.querySelector( '#prpl-onboarding-form' );

			await act( async () => {
				fireEvent.submit( form );
			} );

			expect( global.fetch ).not.toHaveBeenCalled();
		} );

		it( 'submits form when privacy policy is accepted', async () => {
			global.fetch = jest.fn().mockResolvedValue( {
				json: () =>
					Promise.resolve( { status: 'ok', nonce: 'api-nonce' } ),
			} );

			const { container } = render( <Welcome config={ mockConfig } /> );

			const checkbox = container.querySelector( '#prpl-privacy-policy' );
			fireEvent.click( checkbox );

			const form = container.querySelector( '#prpl-onboarding-form' );

			await act( async () => {
				fireEvent.submit( form );
			} );

			await waitFor( () => {
				expect( global.fetch ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'branding', () => {
		it( 'uses branding homeUrl for link', () => {
			render( <Welcome config={ mockConfig } /> );

			const links = screen.getAllByRole( 'link' );
			const homeLinks = links.filter( ( link ) =>
				link.href.includes( 'progressplanner.com' )
			);
			expect( homeLinks.length ).toBeGreaterThan( 0 );
		} );

		it( 'uses branding privacyPolicyUrl for privacy link', () => {
			render( <Welcome config={ mockConfig } /> );

			const privacyLinks = screen
				.getAllByRole( 'link' )
				.filter( ( link ) =>
					link.textContent.includes( 'Privacy policy' )
				);
			expect( privacyLinks.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'default config values', () => {
		it( 'handles missing userFirstName', () => {
			const configWithoutName = {
				...mockConfig,
				userFirstName: undefined,
			};

			const { container } = render(
				<Welcome config={ configWithoutName } />
			);

			const nameInput = container.querySelector( '#prpl-name' );
			expect( nameInput.value ).toBe( '' );
		} );

		it( 'handles missing userEmail', () => {
			const configWithoutEmail = {
				...mockConfig,
				userEmail: undefined,
			};

			const { container } = render(
				<Welcome config={ configWithoutEmail } />
			);

			const emailInput = container.querySelector( '#prpl-email' );
			expect( emailInput.value ).toBe( '' );
		} );

		it( 'handles missing branding object', () => {
			const configNoBranding = {
				...mockConfig,
				branding: undefined,
			};

			const { container } = render(
				<Welcome config={ configNoBranding } />
			);

			expect(
				container.querySelector( '.prpl-welcome' )
			).toBeInTheDocument();
		} );

		it( 'handles missing progressIconHtml', () => {
			const configNoIcon = {
				...mockConfig,
				branding: {
					...mockConfig.branding,
					progressIconHtml: null,
				},
			};

			const { container } = render( <Welcome config={ configNoIcon } /> );

			expect(
				container.querySelector( '.progress-icon' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'hidden inputs', () => {
		it( 'has hidden site input', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const siteInput = container.querySelector( 'input[name="site"]' );
			expect( siteInput ).toBeInTheDocument();
			expect( siteInput.type ).toBe( 'hidden' );
			expect( siteInput.value ).toBe( 'https://mysite.com' );
		} );

		it( 'has hidden timezone_offset input', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const tzInput = container.querySelector(
				'input[name="timezone_offset"]'
			);
			expect( tzInput ).toBeInTheDocument();
			expect( tzInput.type ).toBe( 'hidden' );
			expect( tzInput.value ).toBe( '-5' );
		} );
	} );

	describe( 'form notice content', () => {
		it( 'renders stay on track title', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByText( 'Stay on track with weekly updates' )
			).toBeInTheDocument();
		} );

		it( 'renders choose your preference text', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByText( 'Choose your preference:' )
			).toBeInTheDocument();
		} );

		it( 'renders yes email option text', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByText( 'Yes, send me weekly updates!' )
			).toBeInTheDocument();
		} );

		it( 'renders no email option text', () => {
			render( <Welcome config={ mockConfig } /> );

			expect(
				screen.getByText( 'No, I do not want emails right now.' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has prpl-form-notice class', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.prpl-form-notice' )
			).toBeInTheDocument();
		} );

		it( 'has prpl-onboard-form-radio-select class', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.prpl-onboard-form-radio-select' )
			).toBeInTheDocument();
		} );

		it( 'has prpl-form-fields class', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect(
				container.querySelector( '.prpl-form-fields' )
			).toBeInTheDocument();
		} );

		it( 'submit button has prpl-button-primary class', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const submitBtn = container.querySelector(
				'input[value="Get going and send me weekly emails"]'
			);
			expect( submitBtn ).toHaveClass( 'prpl-button-primary' );
		} );

		it( 'no-email submit button has prpl-button-secondary class', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			const submitBtn = container.querySelector(
				'input[value="Continue without emailing me"]'
			);
			expect( submitBtn ).toHaveClass( 'prpl-button-secondary' );
		} );
	} );

	describe( 'layout sections', () => {
		it( 'has left section', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect( container.querySelector( '.left' ) ).toBeInTheDocument();
		} );

		it( 'has right section', () => {
			const { container } = render( <Welcome config={ mockConfig } /> );

			expect( container.querySelector( '.right' ) ).toBeInTheDocument();
		} );
	} );
} );
