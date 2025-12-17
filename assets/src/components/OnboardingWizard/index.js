/**
 * OnboardingWizard Component
 *
 * Main onboarding wizard component that manages the multi-step wizard.
 *
 * @package
 */

import {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
	useRef,
	useCallback,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useOnboardingWizard } from '../../hooks/useOnboardingWizard';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';
import WelcomeStep from './steps/WelcomeStep';
import WhatsWhatStep from './steps/WhatsWhatStep';
import FirstTaskStep from './steps/FirstTaskStep';
import BadgesStep from './steps/BadgesStep';
import EmailFrequencyStep from './steps/EmailFrequencyStep';
import SettingsStep from './steps/SettingsStep';
import MoreTasksStep from './steps/MoreTasksStep';
import OnboardingNavigation from './OnboardingNavigation';
import QuitConfirmation from './QuitConfirmation';

/**
 * OnboardingWizard component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Wizard configuration from PHP.
 * @param {Object} ref          - Ref to expose startOnboarding method.
 * @return {JSX.Element|null} The wizard component or null if not enabled.
 */
const OnboardingWizard = forwardRef( function OnboardingWizard(
	{ config },
	ref
) {
	const { onboardingWizard } = config;

	// Initialize hooks before early return to comply with React hooks rules.
	const { steps, savedProgress, ajaxUrl, nonce } = onboardingWizard || {};

	const progressHooks = useOnboardingProgress( {
		ajaxUrl: ajaxUrl || '',
		nonce: nonce || '',
	} );
	const {
		wizardState,
		updateState,
		nextStep,
		prevStep,
		goToStep,
		currentStep,
		currentStepData,
	} = useOnboardingWizard( onboardingWizard || {}, progressHooks );

	const [ showQuitConfirmation, setShowQuitConfirmation ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	const popoverRef = useRef( null );
	const shouldAutoStartWizard = useDashboardStore(
		( state ) => state.shouldAutoStartWizard
	);
	const setShouldAutoStartWizard = useDashboardStore(
		( state ) => state.setShouldAutoStartWizard
	);

	// Expose startOnboarding method via ref (like develop's window.prplOnboardWizard.startOnboarding).
	useImperativeHandle( ref, () => ( {
		startOnboarding() {
			if (
				! wizardState.data.finished &&
				onboardingWizard?.enabled &&
				popoverRef.current
			) {
				// Show popover using native API (like develop)
				if ( typeof popoverRef.current.showPopover === 'function' ) {
					popoverRef.current.showPopover();
				}
				setIsOpen( true );

				// Move focus to popover for keyboard accessibility
				setTimeout( () => {
					if ( popoverRef.current ) {
						popoverRef.current.focus();
					}
				}, 0 );
			}
		},
	} ) );

	/**
	 * Ref callback to detect when popover element is mounted.
	 * Checks Zustand store for auto-start flag and handles auto-start.
	 *
	 * @param {HTMLElement|null} element - The popover element or null when unmounted.
	 * @return {void}
	 */
	const popoverRefCallback = useCallback(
		( element ) => {
			// Store ref for imperative handle
			popoverRef.current = element;

			// Only proceed if element is mounted and wizard is enabled
			if ( ! element || ! onboardingWizard?.enabled ) {
				return;
			}

			// Don't auto-start if wizard is already finished
			if ( wizardState.data.finished ) {
				return;
			}

			// Check if we should auto-start (from Zustand store or saved progress)
			const hasSavedProgress =
				savedProgress &&
				Object.keys( savedProgress ).length > 0;

			// Auto-start if:
			// 1. Zustand flag is set (privacy not accepted or resuming)
			// 2. There's saved progress (resuming)
			if ( shouldAutoStartWizard || hasSavedProgress ) {
				// Popover element is now in DOM, safe to show
				if ( typeof element.showPopover === 'function' ) {
					element.showPopover();
					setIsOpen( true );

					// Clear the Zustand flag after starting
					if ( shouldAutoStartWizard ) {
						setShouldAutoStartWizard( false );
					}

					// Move focus to popover for keyboard accessibility
					setTimeout( () => {
						if ( element ) {
							element.focus();
						}
					}, 0 );
				}
			}
		},
		[
			onboardingWizard?.enabled,
			wizardState.data.finished,
			savedProgress,
			shouldAutoStartWizard,
			setShouldAutoStartWizard,
		]
	);

	// Handle keyboard navigation (Escape key to close).
	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		/**
		 * Handle Escape key press.
		 *
		 * @param {KeyboardEvent} event - Keyboard event.
		 */
		const handleKeyDown = ( event ) => {
			if ( event.key === 'Escape' && ! showQuitConfirmation ) {
				setShowQuitConfirmation( true );
			}
		};

		document.addEventListener( 'keydown', handleKeyDown );

		return () => {
			document.removeEventListener( 'keydown', handleKeyDown );
		};
	}, [ isOpen, showQuitConfirmation ] );

	/**
	 * Handle close button click.
	 */
	const handleClose = () => {
		setShowQuitConfirmation( true );
	};

	/**
	 * Handle quit confirmation.
	 */
	const handleQuit = () => {
		if (
			popoverRef.current &&
			typeof popoverRef.current.hidePopover === 'function'
		) {
			popoverRef.current.hidePopover();
		}
		setIsOpen( false );
		setShowQuitConfirmation( false );
		// Save progress before closing.
		progressHooks.saveProgress( wizardState ).catch( () => {
			// Silently fail.
		} );
	};

	/**
	 * Handle cancel quit.
	 */
	const handleCancelQuit = () => {
		setShowQuitConfirmation( false );
	};

	/**
	 * Render current step component.
	 *
	 * @return {JSX.Element} Current step component.
	 */
	const renderStep = () => {
		if ( ! currentStepData ) {
			return null;
		}

		const handleBack = currentStep > 0 ? prevStep : null;

		const stepProps = {
			wizardState,
			updateState,
			onNext: nextStep,
			onBack: handleBack,
			config: onboardingWizard,
			stepData: currentStepData,
		};

		switch ( currentStepData.id ) {
			case 'onboarding-step-welcome':
				return <WelcomeStep { ...stepProps } />;
			case 'onboarding-step-whats-what':
				return <WhatsWhatStep { ...stepProps } />;
			case 'onboarding-step-first-task':
				return <FirstTaskStep { ...stepProps } />;
			case 'onboarding-step-badges':
				return <BadgesStep { ...stepProps } />;
			case 'onboarding-step-email-frequency':
				return <EmailFrequencyStep { ...stepProps } />;
			case 'onboarding-step-settings':
				return <SettingsStep { ...stepProps } />;
			case 'onboarding-step-more-tasks':
				return <MoreTasksStep { ...stepProps } />;
			default:
				return null;
		}
	};

	// Always render wizard (like develop's add_popover), but control visibility via isOpen.
	// If wizard is not enabled, don't render at all.
	if ( ! onboardingWizard?.enabled ) {
		return null;
	}

	return (
		<>
			<div
				ref={ popoverRefCallback }
				id="prpl-popover-onboarding"
				className="prpl-popover-onboarding"
				popover="manual"
				tabIndex={ -1 }
				data-prpl-step={ currentStep }
				role="dialog"
				aria-modal="true"
				aria-labelledby="prpl-onboarding-title"
			>
				<div className="prpl-onboarding-layout">
					<OnboardingNavigation
						steps={ steps }
						currentStep={ currentStep }
						onStepClick={ goToStep }
						logoHtml={ onboardingWizard.logoHtml }
					/>
					<div className="prpl-onboarding-content">
						<div className="tour-content-wrapper">
							{ renderStep() }
						</div>
					</div>
				</div>

				<button
					id="prpl-tour-close-btn"
					className="prpl-popover-close"
					onClick={ handleClose }
					aria-label={ __( 'Close', 'progress-planner' ) }
				>
					<span className="dashicons dashicons-no-alt"></span>
				</button>
			</div>

			{ showQuitConfirmation && (
				<QuitConfirmation
					onConfirm={ handleQuit }
					onCancel={ handleCancelQuit }
					config={ onboardingWizard }
				/>
			) }
		</>
	);
} );

export default OnboardingWizard;
