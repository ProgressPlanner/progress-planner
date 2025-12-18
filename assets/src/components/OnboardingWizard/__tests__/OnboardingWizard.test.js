/**
 * Tests for OnboardingWizard Component
 */

/* global Element */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { createRef } from '@wordpress/element';

// Mock Element.prototype.matches to handle :popover-open pseudo-class
const originalMatches = Element.prototype.matches;
Element.prototype.matches = function ( selector ) {
	if ( selector === ':popover-open' ) {
		return false;
	}
	return originalMatches.call( this, selector );
};

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/api-fetch', () => jest.fn() );

// Mock dashboardStore
jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => false ),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useOnboardingWizard', () => ( {
	useOnboardingWizard: jest.fn( () => ( {
		wizardState: { data: { finished: false }, steps: {} },
		updateState: jest.fn(),
		nextStep: jest.fn(),
		prevStep: jest.fn(),
		goToStep: jest.fn(),
		currentStep: 0,
		currentStepData: { id: 'onboarding-step-welcome' },
	} ) ),
} ) );

jest.mock( '../../../hooks/useOnboardingProgress', () => ( {
	useOnboardingProgress: jest.fn( () => ( {
		saveProgress: jest.fn().mockResolvedValue( {} ),
	} ) ),
} ) );

// Mock step components
jest.mock( '../steps/WelcomeStep', () => () => (
	<div data-testid="welcome-step">WelcomeStep</div>
) );

jest.mock( '../steps/WhatsWhatStep', () => () => (
	<div data-testid="whats-what-step">WhatsWhatStep</div>
) );

jest.mock( '../steps/FirstTaskStep', () => () => (
	<div data-testid="first-task-step">FirstTaskStep</div>
) );

jest.mock( '../steps/BadgesStep', () => () => (
	<div data-testid="badges-step">BadgesStep</div>
) );

jest.mock( '../steps/EmailFrequencyStep', () => () => (
	<div data-testid="email-frequency-step">EmailFrequencyStep</div>
) );

jest.mock( '../steps/SettingsStep', () => () => (
	<div data-testid="settings-step">SettingsStep</div>
) );

jest.mock( '../steps/MoreTasksStep', () => () => (
	<div data-testid="more-tasks-step">MoreTasksStep</div>
) );

jest.mock( '../OnboardingNavigation', () => () => (
	<div data-testid="onboarding-navigation">OnboardingNavigation</div>
) );

jest.mock( '../QuitConfirmation', () => ( props ) => (
	<div data-testid="quit-confirmation">
		QuitConfirmation
		<button onClick={ props.onConfirm } data-testid="quit-confirm-btn">
			Confirm
		</button>
		<button onClick={ props.onCancel } data-testid="quit-cancel-btn">
			Cancel
		</button>
	</div>
) );

// Import after mocks
import OnboardingWizard from '../index';
import apiFetch from '@wordpress/api-fetch';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { useOnboardingWizard } from '../../../hooks/useOnboardingWizard';
import { useOnboardingProgress } from '../../../hooks/useOnboardingProgress';

describe( 'OnboardingWizard', () => {
	const mockWizardConfig = {
		enabled: true,
		steps: [
			{ id: 'onboarding-step-welcome' },
			{ id: 'onboarding-step-whats-what' },
		],
		savedProgress: null,
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce',
		logoHtml: '<img src="logo.png" />',
	};

	const defaultConfig = {
		onboardingWizard: mockWizardConfig,
	};

	beforeEach( () => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue( mockWizardConfig );

		useDashboardStore.mockImplementation( ( selector ) => {
			const state = {
				shouldAutoStartWizard: false,
				setShouldAutoStartWizard: jest.fn(),
			};
			return selector( state );
		} );

		useOnboardingWizard.mockReturnValue( {
			wizardState: { data: { finished: false }, steps: {} },
			updateState: jest.fn(),
			nextStep: jest.fn(),
			prevStep: jest.fn(),
			goToStep: jest.fn(),
			currentStep: 0,
			currentStepData: { id: 'onboarding-step-welcome' },
		} );

		useOnboardingProgress.mockReturnValue( {
			saveProgress: jest.fn().mockResolvedValue( {} ),
		} );
	} );

	describe( 'loading state', () => {
		it( 'returns null while loading config', () => {
			apiFetch.mockImplementation(
				() => new Promise( () => {} ) // Never resolves
			);

			const { container } = render(
				<OnboardingWizard config={ defaultConfig } />
			);

			// Should render nothing during loading
			expect( container.firstChild ).toBeNull();
		} );
	} );

	describe( 'error handling', () => {
		it( 'uses fallback config on API error', async () => {
			apiFetch.mockRejectedValue( new Error( 'API Error' ) );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			// Should still render with fallback config
			expect( screen.getByTestId( 'welcome-step' ) ).toBeInTheDocument();
		} );

		it( 'returns null on error with no fallback', async () => {
			apiFetch.mockRejectedValue( new Error( 'API Error' ) );

			const configWithoutFallback = {};

			let container;
			await act( async () => {
				const result = render(
					<OnboardingWizard config={ configWithoutFallback } />
				);
				container = result.container;
			} );

			expect( container.firstChild ).toBeNull();
		} );
	} );

	describe( 'disabled wizard', () => {
		it( 'returns null when wizard is not enabled', async () => {
			const disabledConfig = {
				onboardingWizard: {
					...mockWizardConfig,
					enabled: false,
				},
			};

			apiFetch.mockResolvedValue( {
				...mockWizardConfig,
				enabled: false,
			} );

			let container;
			await act( async () => {
				const result = render(
					<OnboardingWizard config={ disabledConfig } />
				);
				container = result.container;
			} );

			expect( container.firstChild ).toBeNull();
		} );
	} );

	describe( 'enabled wizard', () => {
		it( 'renders popover element', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				document.getElementById( 'prpl-popover-onboarding' )
			).toBeInTheDocument();
		} );

		it( 'renders with dialog role', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();
		} );

		it( 'has aria-modal attribute', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByRole( 'dialog' ) ).toHaveAttribute(
				'aria-modal',
				'true'
			);
		} );

		it( 'renders current step component', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByTestId( 'welcome-step' ) ).toBeInTheDocument();
		} );

		it( 'renders navigation component', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByTestId( 'onboarding-navigation' )
			).toBeInTheDocument();
		} );

		it( 'renders close button', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByRole( 'button', { name: 'Close' } )
			).toBeInTheDocument();
		} );

		it( 'has correct popover class', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const popover = document.getElementById(
				'prpl-popover-onboarding'
			);
			expect( popover ).toHaveClass( 'prpl-popover-onboarding' );
		} );

		it( 'has popover attribute', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const popover = document.getElementById(
				'prpl-popover-onboarding'
			);
			expect( popover ).toHaveAttribute( 'popover', 'manual' );
		} );

		it( 'has data-prpl-step attribute', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const popover = document.getElementById(
				'prpl-popover-onboarding'
			);
			expect( popover ).toHaveAttribute( 'data-prpl-step', '0' );
		} );
	} );

	describe( 'step rendering', () => {
		it( 'renders WelcomeStep for welcome step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 0,
				currentStepData: { id: 'onboarding-step-welcome' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByTestId( 'welcome-step' ) ).toBeInTheDocument();
		} );

		it( 'renders WhatsWhatStep for whats-what step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 1,
				currentStepData: { id: 'onboarding-step-whats-what' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByTestId( 'whats-what-step' )
			).toBeInTheDocument();
		} );

		it( 'renders FirstTaskStep for first-task step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 2,
				currentStepData: { id: 'onboarding-step-first-task' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByTestId( 'first-task-step' )
			).toBeInTheDocument();
		} );

		it( 'renders BadgesStep for badges step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 3,
				currentStepData: { id: 'onboarding-step-badges' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByTestId( 'badges-step' ) ).toBeInTheDocument();
		} );

		it( 'renders EmailFrequencyStep for email-frequency step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 4,
				currentStepData: { id: 'onboarding-step-email-frequency' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByTestId( 'email-frequency-step' )
			).toBeInTheDocument();
		} );

		it( 'renders SettingsStep for settings step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 5,
				currentStepData: { id: 'onboarding-step-settings' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( screen.getByTestId( 'settings-step' ) ).toBeInTheDocument();
		} );

		it( 'renders MoreTasksStep for more-tasks step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 6,
				currentStepData: { id: 'onboarding-step-more-tasks' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.getByTestId( 'more-tasks-step' )
			).toBeInTheDocument();
		} );

		it( 'renders null for unknown step', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 0,
				currentStepData: { id: 'unknown-step' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.queryByTestId( 'welcome-step' )
			).not.toBeInTheDocument();
		} );

		it( 'renders null when no currentStepData', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: false }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 0,
				currentStepData: null,
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				screen.queryByTestId( 'welcome-step' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'quit confirmation', () => {
		it( 'shows quit confirmation when close button clicked', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = screen.getByRole( 'button', { name: 'Close' } );
			fireEvent.click( closeBtn );

			expect(
				screen.getByTestId( 'quit-confirmation' )
			).toBeInTheDocument();
		} );

		it( 'hides navigation when quit confirmation shown', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = screen.getByRole( 'button', { name: 'Close' } );
			fireEvent.click( closeBtn );

			expect(
				screen.queryByTestId( 'onboarding-navigation' )
			).not.toBeInTheDocument();
		} );

		it( 'hides close button when quit confirmation shown', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = screen.getByRole( 'button', { name: 'Close' } );
			fireEvent.click( closeBtn );

			expect(
				screen.queryByRole( 'button', { name: 'Close' } )
			).not.toBeInTheDocument();
		} );

		it( 'returns to step when cancel quit', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = screen.getByRole( 'button', { name: 'Close' } );
			fireEvent.click( closeBtn );

			const cancelBtn = screen.getByTestId( 'quit-cancel-btn' );
			fireEvent.click( cancelBtn );

			expect( screen.getByTestId( 'welcome-step' ) ).toBeInTheDocument();
		} );

		it( 'saves progress when quit confirmed', async () => {
			const mockSaveProgress = jest.fn().mockResolvedValue( {} );
			useOnboardingProgress.mockReturnValue( {
				saveProgress: mockSaveProgress,
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = screen.getByRole( 'button', { name: 'Close' } );
			fireEvent.click( closeBtn );

			const confirmBtn = screen.getByTestId( 'quit-confirm-btn' );
			await act( async () => {
				fireEvent.click( confirmBtn );
			} );

			expect( mockSaveProgress ).toHaveBeenCalled();
		} );
	} );

	describe( 'imperative handle', () => {
		it( 'exposes startOnboarding method via ref', async () => {
			const ref = createRef();

			await act( async () => {
				render(
					<OnboardingWizard ref={ ref } config={ defaultConfig } />
				);
			} );

			expect( ref.current ).toHaveProperty( 'startOnboarding' );
			expect( typeof ref.current.startOnboarding ).toBe( 'function' );
		} );
	} );

	describe( 'API fetch', () => {
		it( 'fetches config from REST API on mount', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/onboarding-wizard/config',
			} );
		} );
	} );

	describe( 'finished wizard', () => {
		it( 'still renders when wizard is finished', async () => {
			useOnboardingWizard.mockReturnValue( {
				wizardState: { data: { finished: true }, steps: {} },
				updateState: jest.fn(),
				nextStep: jest.fn(),
				prevStep: jest.fn(),
				goToStep: jest.fn(),
				currentStep: 0,
				currentStepData: { id: 'onboarding-step-welcome' },
			} );

			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			// Wizard should still be in DOM (visibility controlled elsewhere)
			expect(
				document.getElementById( 'prpl-popover-onboarding' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'layout structure', () => {
		it( 'renders onboarding layout container', async () => {
			const { container } = await act( async () => {
				return render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				container.querySelector( '.prpl-onboarding-layout' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding content container', async () => {
			const { container } = await act( async () => {
				return render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				container.querySelector( '.prpl-onboarding-content' )
			).toBeInTheDocument();
		} );

		it( 'renders tour content wrapper', async () => {
			const { container } = await act( async () => {
				return render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				container.querySelector( '.tour-content-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'close button has correct ID', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			expect(
				document.getElementById( 'prpl-tour-close-btn' )
			).toBeInTheDocument();
		} );

		it( 'close button has correct class', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = document.getElementById( 'prpl-tour-close-btn' );
			expect( closeBtn ).toHaveClass( 'prpl-popover-close' );
		} );

		it( 'close button has dashicon', async () => {
			await act( async () => {
				render( <OnboardingWizard config={ defaultConfig } /> );
			} );

			const closeBtn = document.getElementById( 'prpl-tour-close-btn' );
			expect(
				closeBtn.querySelector( '.dashicons-no-alt' )
			).toBeInTheDocument();
		} );
	} );
} );
