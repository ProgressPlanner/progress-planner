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
import apiFetch from '@wordpress/api-fetch';
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
	// State for wizard config fetched from REST API.
	const [ wizardConfig, setWizardConfig ] = useState( null );
	const [ isLoadingConfig, setIsLoadingConfig ] = useState( true );
	const [ configError, setConfigError ] = useState( null );

	// Fallback to config.onboardingWizard if available (for backwards compatibility).
	const fallbackWizard = config.onboardingWizard;

	// Fetch wizard config from REST API on mount.
	useEffect( () => {
		const fetchWizardConfig = async () => {
			try {
				setIsLoadingConfig( true );
				setConfigError( null );

				const response = await apiFetch( {
					path: '/progress-planner/v1/onboarding-wizard/config',
				} );

				setWizardConfig( response );
			} catch ( error ) {
				// Fallback to config.onboardingWizard if available.
				if ( fallbackWizard ) {
					setWizardConfig( fallbackWizard );
				} else {
					setConfigError( error );
				}
			} finally {
				setIsLoadingConfig( false );
			}
		};

		fetchWizardConfig();
	}, [ fallbackWizard ] );

	// Use fetched config or fallback.
	const onboardingWizard = wizardConfig || fallbackWizard;

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
	const hasManuallyQuitRef = useRef( false ); // Track if user manually quit to prevent auto-restart
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
	 * Also sets up toggle event listener to sync isOpen state.
	 *
	 * @param {HTMLElement|null} element - The popover element or null when unmounted.
	 * @return {void}
	 */
	const popoverRefCallback = useCallback(
		( element ) => {
			// Store ref for imperative handle
			const previousElement = popoverRef.current;
			popoverRef.current = element;

			// Clean up toggle listener from previous element if it changed
			if ( previousElement && previousElement !== element ) {
				const previousToggleHandler = previousElement.__prplToggleHandler;
				if ( previousToggleHandler ) {
					previousElement.removeEventListener( 'toggle', previousToggleHandler );
					delete previousElement.__prplToggleHandler;
				}
			}

			// Only proceed if element is mounted and wizard is enabled
			if ( ! element ) {
				return;
			}

			// Set up toggle event listener to sync isOpen state with popover's actual state
			if ( ! element.__prplToggleHandler ) {
				/**
				 * Handle popover toggle event to sync isOpen state.
				 *
				 * @param {Event} event - Toggle event.
				 */
				const handleToggle = ( event ) => {
					setIsOpen( event.newState === 'open' );
				};

				element.addEventListener( 'toggle', handleToggle );
				element.__prplToggleHandler = handleToggle;
			}

			if ( ! onboardingWizard?.enabled ) {
				return;
			}

			// Don't auto-start if wizard is already finished
			if ( wizardState.data.finished ) {
				return;
			}

			// Don't auto-start if popover is already open
			if ( element.matches( ':popover-open' ) ) {
				setIsOpen( true );
				return;
			}

			// Don't auto-start if user has manually quit (prevents re-opening after quit)
			if ( hasManuallyQuitRef.current ) {
				return;
			}

			// Check if we should auto-start (only when there's NO saved progress, like develop branch)
			const hasSavedProgress =
				savedProgress &&
				Object.keys( savedProgress ).length > 0;

			// Auto-start ONLY when there's NO saved progress (matches develop branch logic)
			// Develop branch: if ( ! $get_saved_progress ) { startOnboarding(); }
			// Conditions:
			// 1. Zustand flag is set (privacy not accepted - fresh install)
			// 2. There is NO saved progress (user hasn't quit before)
			// 3. User hasn't manually quit in this session
			if ( shouldAutoStartWizard && ! hasSavedProgress && ! hasManuallyQuitRef.current ) {
				// Popover element is now in DOM, safe to show
				if ( typeof element.showPopover === 'function' ) {
					try {
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
					} catch ( error ) {
						console.error( '[OnboardingWizard] Ref callback: Error calling showPopover()', error );
					}
				}
			}
		},
		[
			onboardingWizard?.enabled,
			wizardState.data.finished,
			savedProgress,
			shouldAutoStartWizard,
			setShouldAutoStartWizard,
			isOpen,
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
	 * Matches develop branch's closeTour() behavior: hide popover first, then save progress.
	 */
	const handleQuit = () => {
		// Mark that user manually quit to prevent auto-restart
		hasManuallyQuitRef.current = true;

		// Hide quit confirmation UI
		setShowQuitConfirmation( false );

		// Hide popover first (like develop branch's closeTour)
		const element = popoverRef.current;
		if ( element && typeof element.hidePopover === 'function' ) {
			element.hidePopover();
		}
		setIsOpen( false );

		// Save progress to server (like develop branch's saveProgressToServer)
		progressHooks.saveProgress( wizardState ).catch( () => {
			// Silently fail - progress save shouldn't block closing
		} );
	};

	/**
	 * Handle cancel quit.
	 */
	const handleCancelQuit = () => {
		setShowQuitConfirmation( false );
	};

	/**
	 * Render current step component or quit confirmation.
	 *
	 * @return {JSX.Element} Current step component or quit confirmation.
	 */
	const renderStep = () => {
		// Show quit confirmation if requested
		if ( showQuitConfirmation ) {
			return (
				<QuitConfirmation
					onConfirm={ handleQuit }
					onCancel={ handleCancelQuit }
					config={ onboardingWizard }
				/>
			);
		}

		// Otherwise show current step
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

	// Show loading state while fetching config.
	if ( isLoadingConfig ) {
		return null; // Don't render while loading.
	}

	// Show error state if config failed to load and no fallback.
	if ( configError && ! fallbackWizard ) {
		return null; // Don't render on error.
	}

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
					{ ! showQuitConfirmation && (
						<OnboardingNavigation
							steps={ steps }
							currentStep={ currentStep }
							onStepClick={ goToStep }
							logoHtml={ onboardingWizard.logoHtml }
						/>
					) }
					<div className="prpl-onboarding-content">
						<div className="tour-content-wrapper">
							{ renderStep() }
						</div>
					</div>
				</div>

				{ ! showQuitConfirmation && (
					<button
						id="prpl-tour-close-btn"
						className="prpl-popover-close"
						onClick={ handleClose }
						aria-label={ __( 'Close', 'progress-planner' ) }
					>
						<span className="dashicons dashicons-no-alt"></span>
					</button>
				) }
			</div>
		</>
	);
} );

export default OnboardingWizard;
