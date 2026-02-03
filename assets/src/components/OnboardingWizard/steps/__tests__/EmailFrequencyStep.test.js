/**
 * Tests for EmailFrequencyStep Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/api-fetch', () => jest.fn() );

// Mock OnboardingStep component
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">
		<button
			onClick={ props.onNext }
			disabled={ props.canProceed && ! props.canProceed() }
			data-testid="next-button"
		>
			{ props.buttonText }
		</button>
		{ props.children }
	</div>
) );

// Import after mocks
import EmailFrequencyStep from '../EmailFrequencyStep';
import apiFetch from '@wordpress/api-fetch';

describe( 'EmailFrequencyStep', () => {
	const defaultConfig = {
		userFirstName: 'John',
		userEmail: 'john@example.com',
		site: 'https://example.com',
		timezoneOffset: 0,
	};

	const defaultProps = {
		wizardState: {
			data: {},
		},
		updateState: jest.fn(),
		config: defaultConfig,
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: { id: 'onboarding-step-email-frequency' },
	};

	beforeEach( () => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue( { success: true } );
	} );

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders email frequency heading', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'heading', { name: 'Email Frequency' } )
			).toBeInTheDocument();
		} );

		it( 'renders explanation text', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Stay on track with emails/ )
			).toBeInTheDocument();
		} );

		it( 'renders weekly option', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect(
				screen.getByLabelText( /Email me weekly/ )
			).toBeInTheDocument();
		} );

		it( 'renders dont email option', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect(
				screen.getByLabelText( /Don't email me/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'default state', () => {
		it( 'has weekly selected by default', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const weeklyRadio = screen.getByLabelText( /Email me weekly/ );
			expect( weeklyRadio ).toBeChecked();
		} );

		it( 'shows name and email fields when weekly selected', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect( screen.getByLabelText( 'First name' ) ).toBeInTheDocument();
			expect( screen.getByLabelText( 'Email' ) ).toBeInTheDocument();
		} );

		it( 'populates name field from config', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect( screen.getByLabelText( 'First name' ) ).toHaveValue(
				'John'
			);
		} );

		it( 'populates email field from config', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			expect( screen.getByLabelText( 'Email' ) ).toHaveValue(
				'john@example.com'
			);
		} );
	} );

	describe( 'dont email option', () => {
		it( 'hides form when dont email selected', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const dontEmailRadio = screen.getByLabelText( /Don't email me/ );
			fireEvent.click( dontEmailRadio );

			expect(
				screen.queryByLabelText( 'First name' )
			).not.toBeInTheDocument();
		} );

		it( 'can proceed immediately with dont email', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const dontEmailRadio = screen.getByLabelText( /Don't email me/ );
			fireEvent.click( dontEmailRadio );

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).not.toBeDisabled();
		} );

		it( 'calls onNext without API call for dont email', async () => {
			const onNext = jest.fn();

			render(
				<EmailFrequencyStep { ...defaultProps } onNext={ onNext } />
			);

			const dontEmailRadio = screen.getByLabelText( /Don't email me/ );
			fireEvent.click( dontEmailRadio );

			const nextBtn = screen.getByTestId( 'next-button' );
			await act( async () => {
				fireEvent.click( nextBtn );
			} );

			expect( apiFetch ).not.toHaveBeenCalled();
			expect( onNext ).toHaveBeenCalled();
		} );
	} );

	describe( 'weekly option validation', () => {
		it( 'cannot proceed without name', () => {
			const configWithoutName = {
				...defaultConfig,
				userFirstName: '',
			};

			render(
				<EmailFrequencyStep
					{ ...defaultProps }
					config={ configWithoutName }
				/>
			);

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).toBeDisabled();
		} );

		it( 'cannot proceed without email', () => {
			const configWithoutEmail = {
				...defaultConfig,
				userEmail: '',
			};

			render(
				<EmailFrequencyStep
					{ ...defaultProps }
					config={ configWithoutEmail }
				/>
			);

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).toBeDisabled();
		} );

		it( 'can proceed with name and email', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).not.toBeDisabled();
		} );
	} );

	describe( 'subscription API call', () => {
		it( 'calls API when subscribing', async () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const nextBtn = screen.getByTestId( 'next-button' );
			await act( async () => {
				fireEvent.click( nextBtn );
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: '/progress-planner/v1/popover/subscribe',
					method: 'POST',
				} )
			);
		} );

		it( 'calls onNext on successful subscription', async () => {
			const onNext = jest.fn();
			apiFetch.mockResolvedValue( { success: true } );

			render(
				<EmailFrequencyStep { ...defaultProps } onNext={ onNext } />
			);

			const nextBtn = screen.getByTestId( 'next-button' );
			await act( async () => {
				fireEvent.click( nextBtn );
			} );

			expect( onNext ).toHaveBeenCalled();
		} );

		it( 'shows error on failed subscription', async () => {
			apiFetch.mockRejectedValue( new Error( 'Subscription failed' ) );
			jest.spyOn( console, 'error' ).mockImplementation( () => {} );

			render( <EmailFrequencyStep { ...defaultProps } /> );

			const nextBtn = screen.getByTestId( 'next-button' );
			await act( async () => {
				fireEvent.click( nextBtn );
			} );

			expect(
				screen.getByText( /Subscription failed|Failed to subscribe/ )
			).toBeInTheDocument();

			console.error.mockRestore();
		} );
	} );

	describe( 'form input handling', () => {
		it( 'updates name field', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const nameInput = screen.getByLabelText( 'First name' );
			fireEvent.change( nameInput, { target: { value: 'Jane' } } );

			expect( nameInput ).toHaveValue( 'Jane' );
		} );

		it( 'updates email field', () => {
			render( <EmailFrequencyStep { ...defaultProps } /> );

			const emailInput = screen.getByLabelText( 'Email' );
			fireEvent.change( emailInput, {
				target: { value: 'jane@example.com' },
			} );

			expect( emailInput ).toHaveValue( 'jane@example.com' );
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render(
				<EmailFrequencyStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper', () => {
			const { container } = render(
				<EmailFrequencyStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'renders email options container', () => {
			const { container } = render(
				<EmailFrequencyStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-email-frequency-options' )
			).toBeInTheDocument();
		} );
	} );
} );
