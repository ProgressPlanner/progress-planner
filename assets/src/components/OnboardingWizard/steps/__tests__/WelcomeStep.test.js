/**
 * Tests for WelcomeStep Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg, i ) => {
			result = result.replace( `%${ i + 1 }$s`, arg );
			result = result.replace( '%s', arg );
		} );
		return result;
	},
} ) );

// Mock useLicenseGenerator hook
jest.mock( '../../../../hooks/useLicenseGenerator', () => ( {
	useLicenseGenerator: jest.fn( () => ( {
		generateLicense: jest.fn().mockResolvedValue( {} ),
		isGenerating: false,
	} ) ),
} ) );

// Mock OnboardingStep component - respect hideFooter prop
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">{ props.children }</div>
) );

// Import after mocks
import WelcomeStep from '../WelcomeStep';
import { useLicenseGenerator } from '../../../../hooks/useLicenseGenerator';

describe( 'WelcomeStep', () => {
	const defaultConfig = {
		onboardNonceURL: 'https://example.com/nonce',
		onboardAPIUrl: 'https://api.example.com',
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce',
		site: 'https://example.com',
		timezoneOffset: 0,
		hasLicense: true,
		l10n: { brandingName: 'Progress Planner' },
		baseUrl: '/wp-content/plugins/progress-planner',
		privacyPolicyUrl: 'https://progressplanner.com/privacy-policy/',
	};

	const defaultProps = {
		wizardState: {
			data: {
				privacyAccepted: false,
			},
		},
		updateState: jest.fn(),
		config: defaultConfig,
		onNext: jest.fn(),
		onBack: null,
		stepData: { id: 'onboarding-step-welcome' },
	};

	beforeEach( () => {
		jest.clearAllMocks();
		useLicenseGenerator.mockReturnValue( {
			generateLicense: jest.fn().mockResolvedValue( {} ),
			isGenerating: false,
		} );
	} );

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders tour title', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Ready to push your website forward/ )
			).toBeInTheDocument();
		} );

		it( 'renders description text', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.getByText( /helps you set clear, focused goals/ )
			).toBeInTheDocument();
		} );

		it( 'renders time message', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.getByText( 'This will only take a few minutes.' )
			).toBeInTheDocument();
		} );

		it( 'renders next button', () => {
			const { container } = render( <WelcomeStep { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-tour-next' )
			).toBeInTheDocument();
		} );

		it( 'renders welcome graphic image', () => {
			const { container } = render( <WelcomeStep { ...defaultProps } /> );

			const img = container.querySelector( 'img' );
			expect( img ).toBeInTheDocument();
		} );
	} );

	describe( 'with license', () => {
		it( 'does not show privacy checkbox when has license', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.queryByLabelText( /I accept the/ )
			).not.toBeInTheDocument();
		} );

		it( 'can proceed without privacy acceptance when has license', () => {
			const { container } = render( <WelcomeStep { ...defaultProps } /> );

			const button = container.querySelector( '.prpl-tour-next' );
			expect( button ).not.toHaveClass( 'prpl-btn-disabled' );
		} );

		it( 'calls onNext when button clicked with license', async () => {
			const onNext = jest.fn();

			const { container } = render(
				<WelcomeStep { ...defaultProps } onNext={ onNext } />
			);

			const button = container.querySelector( '.prpl-tour-next' );
			await act( async () => {
				fireEvent.click( button );
			} );

			expect( onNext ).toHaveBeenCalled();
		} );
	} );

	describe( 'without license', () => {
		const configWithoutLicense = {
			...defaultConfig,
			hasLicense: false,
		};

		const propsWithoutLicense = {
			...defaultProps,
			config: configWithoutLicense,
		};

		it( 'shows privacy checkbox when no license', () => {
			render( <WelcomeStep { ...propsWithoutLicense } /> );

			expect( screen.getByRole( 'checkbox' ) ).toBeInTheDocument();
		} );

		it( 'privacy checkbox is unchecked by default', () => {
			render( <WelcomeStep { ...propsWithoutLicense } /> );

			expect( screen.getByRole( 'checkbox' ) ).not.toBeChecked();
		} );

		it( 'cannot proceed without privacy acceptance', () => {
			const { container } = render(
				<WelcomeStep { ...propsWithoutLicense } />
			);

			const button = container.querySelector( '.prpl-tour-next' );
			expect( button ).toHaveClass( 'prpl-btn-disabled' );
		} );

		it( 'can proceed after accepting privacy', () => {
			const { container } = render(
				<WelcomeStep { ...propsWithoutLicense } />
			);

			const checkbox = screen.getByRole( 'checkbox' );
			fireEvent.click( checkbox );

			const button = container.querySelector( '.prpl-tour-next' );
			expect( button ).not.toHaveClass( 'prpl-btn-disabled' );
		} );

		it( 'updates wizard state when privacy accepted', () => {
			const updateState = jest.fn();

			render(
				<WelcomeStep
					{ ...propsWithoutLicense }
					updateState={ updateState }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			fireEvent.click( checkbox );

			expect( updateState ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						privacyAccepted: true,
					} ),
				} )
			);
		} );

		it( 'renders privacy checkbox wrapper', () => {
			const { container } = render(
				<WelcomeStep { ...propsWithoutLicense } />
			);

			expect(
				container.querySelector( '.prpl-privacy-checkbox-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders checkbox label with privacy text', () => {
			render( <WelcomeStep { ...propsWithoutLicense } /> );

			expect( screen.getByText( /I accept the/ ) ).toBeInTheDocument();
		} );
	} );

	describe( 'license generation', () => {
		const configWithoutLicense = {
			...defaultConfig,
			hasLicense: false,
		};

		const propsWithoutLicense = {
			...defaultProps,
			config: configWithoutLicense,
			wizardState: {
				data: {
					privacyAccepted: true,
				},
			},
		};

		it( 'calls generateLicense when proceeding without license', async () => {
			const mockGenerateLicense = jest.fn().mockResolvedValue( {} );
			useLicenseGenerator.mockReturnValue( {
				generateLicense: mockGenerateLicense,
				isGenerating: false,
			} );

			const { container } = render(
				<WelcomeStep { ...propsWithoutLicense } />
			);

			const button = container.querySelector( '.prpl-tour-next' );
			await act( async () => {
				fireEvent.click( button );
			} );

			expect( mockGenerateLicense ).toHaveBeenCalledWith( {
				'with-email': 'no',
			} );
		} );

		it( 'shows spinner when generating license', () => {
			useLicenseGenerator.mockReturnValue( {
				generateLicense: jest.fn().mockResolvedValue( {} ),
				isGenerating: true,
			} );

			const { container } = render(
				<WelcomeStep { ...propsWithoutLicense } />
			);

			expect( container.querySelector( '.spinner' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'initial state', () => {
		it( 'uses privacyAccepted from wizard state', () => {
			const propsWithAccepted = {
				...defaultProps,
				config: {
					...defaultConfig,
					hasLicense: false,
				},
				wizardState: {
					data: {
						privacyAccepted: true,
					},
				},
			};

			render( <WelcomeStep { ...propsWithAccepted } /> );

			expect( screen.getByRole( 'checkbox' ) ).toBeChecked();
		} );
	} );

	describe( 'branding', () => {
		it( 'uses branding name from l10n', () => {
			render( <WelcomeStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Progress Planner helps you/ )
			).toBeInTheDocument();
		} );

		it( 'falls back to default branding name', () => {
			const configWithoutBranding = {
				...defaultConfig,
				l10n: {},
			};

			render(
				<WelcomeStep
					{ ...defaultProps }
					config={ configWithoutBranding }
				/>
			);

			expect(
				screen.getByText( /Progress Planner helps you/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'image path', () => {
		it( 'uses baseUrl for image path', () => {
			const { container } = render( <WelcomeStep { ...defaultProps } /> );

			const img = container.querySelector( 'img' );
			expect( img ).toHaveAttribute(
				'src',
				expect.stringContaining(
					'/wp-content/plugins/progress-planner'
				)
			);
		} );

		it( 'handles missing baseUrl', () => {
			const configWithoutBaseUrl = {
				...defaultConfig,
				baseUrl: undefined,
			};

			const { container } = render(
				<WelcomeStep
					{ ...defaultProps }
					config={ configWithoutBaseUrl }
				/>
			);

			const img = container.querySelector( 'img' );
			expect( img ).toHaveAttribute(
				'src',
				expect.stringContaining( 'thumbs_up_ravi_rtl.svg' )
			);
		} );
	} );
} );
