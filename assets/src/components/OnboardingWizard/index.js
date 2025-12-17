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
		console.log( '[OnboardingWizard] Fetching wizard config from REST API' );

		const fetchWizardConfig = async () => {
			try {
				setIsLoadingConfig( true );
				setConfigError( null );

				const response = await apiFetch( {
					path: '/progress-planner/v1/onboarding-wizard/config',
				} );

				console.log( '[OnboardingWizard] Wizard config fetched from REST API', {
					enabled: response.enabled,
					hasSteps: !! response.steps,
					stepsCount: response.steps?.length || 0,
					hasSavedProgress: !! response.savedProgress,
				} );

				setWizardConfig( response );
			} catch ( error ) {
				console.error( '[OnboardingWizard] Error fetching wizard config from REST API', error );

				// Fallback to config.onboardingWizard if available.
				if ( fallbackWizard ) {
					console.log( '[OnboardingWizard] Using fallback config from props' );
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
	const shouldAutoStartWizard = useDashboardStore(
		( state ) => state.shouldAutoStartWizard
	);
	const setShouldAutoStartWizard = useDashboardStore(
		( state ) => state.setShouldAutoStartWizard
	);

	// Log Zustand store state changes
	useEffect( () => {
		console.log( '[OnboardingWizard] Zustand shouldAutoStartWizard changed', {
			shouldAutoStartWizard,
			wizardEnabled: onboardingWizard?.enabled,
			wizardFinished: wizardState.data.finished,
			isOpen,
		} );
	}, [ shouldAutoStartWizard, onboardingWizard?.enabled, wizardState.data.finished, isOpen ] );

	// Log component mount and initial state
	useEffect( () => {
		console.log( '[OnboardingWizard] Component mounted/updated', {
			wizardEnabled: onboardingWizard?.enabled,
			wizardFinished: wizardState.data.finished,
			privacyPolicyAccepted: config.privacyPolicyAccepted,
			hasSavedProgress: !! savedProgress,
			shouldAutoStartWizard,
			isOpen,
		} );
	}, [] );

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
			console.log( '[OnboardingWizard] popoverRefCallback called', {
				element: !! element,
				elementId: element?.id,
				hasShowPopover: element && typeof element.showPopover === 'function',
				wizardEnabled: onboardingWizard?.enabled,
				wizardFinished: wizardState.data.finished,
				isOpen,
				shouldAutoStartWizard,
				savedProgress: !! savedProgress,
				savedProgressKeys: savedProgress
					? Object.keys( savedProgress )
					: [],
			} );

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
				console.log( '[OnboardingWizard] Ref callback: No element, returning' );
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
					console.log( '[OnboardingWizard] Popover toggle event', {
						newState: event.newState,
						isOpen: event.newState === 'open',
						popoverMatches: element.matches( ':popover-open' ),
					} );
					setIsOpen( event.newState === 'open' );
				};

				element.addEventListener( 'toggle', handleToggle );
				element.__prplToggleHandler = handleToggle;
			}

			if ( ! onboardingWizard?.enabled ) {
				console.log( '[OnboardingWizard] Ref callback: Wizard not enabled, returning' );
				return;
			}

			// Don't auto-start if wizard is already finished
			if ( wizardState.data.finished ) {
				console.log( '[OnboardingWizard] Ref callback: Wizard already finished, returning' );
				return;
			}

			// Don't auto-start if popover is already open
			if ( element.matches( ':popover-open' ) ) {
				console.log( '[OnboardingWizard] Ref callback: Popover already open, syncing state' );
				setIsOpen( true );
				return;
			}

			// Check if we should auto-start (from Zustand store or saved progress)
			const hasSavedProgress =
				savedProgress &&
				Object.keys( savedProgress ).length > 0;

			console.log( '[OnboardingWizard] Ref callback: Checking auto-start conditions', {
				shouldAutoStartWizard,
				hasSavedProgress,
				savedProgressKeys: savedProgress ? Object.keys( savedProgress ) : [],
				willAutoStart: shouldAutoStartWizard || hasSavedProgress,
			} );

			// Auto-start if:
			// 1. Zustand flag is set (privacy not accepted)
			// 2. There's saved progress (resuming)
			if ( shouldAutoStartWizard || hasSavedProgress ) {
				console.log( '[OnboardingWizard] Ref callback: Attempting to show popover' );

				// Popover element is now in DOM, safe to show
				if ( typeof element.showPopover === 'function' ) {
					console.log( '[OnboardingWizard] Ref callback: Calling showPopover()' );
					try {
						element.showPopover();
						setIsOpen( true );
						console.log( '[OnboardingWizard] Ref callback: showPopover() called successfully, isOpen set to true' );

						// Clear the Zustand flag after starting
						if ( shouldAutoStartWizard ) {
							console.log( '[OnboardingWizard] Ref callback: Clearing shouldAutoStartWizard flag' );
							setShouldAutoStartWizard( false );
						}

						// Move focus to popover for keyboard accessibility
						setTimeout( () => {
							if ( element ) {
								element.focus();
								console.log( '[OnboardingWizard] Ref callback: Focus moved to popover' );
							}
						}, 0 );
					} catch ( error ) {
						console.error( '[OnboardingWizard] Ref callback: Error calling showPopover()', error );
					}
				} else {
					console.warn( '[OnboardingWizard] Ref callback: element.showPopover is not a function', {
						element,
						showPopover: element.showPopover,
						typeof: typeof element.showPopover,
					} );
				}
			} else {
				console.log( '[OnboardingWizard] Ref callback: Auto-start conditions not met, not showing popover' );
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
		console.log( '[OnboardingWizard] handleClose called (close button clicked)' );
		setShowQuitConfirmation( true );
	};

	/**
	 * Handle quit confirmation.
	 */
	const handleQuit = () => {
		console.log( '[OnboardingWizard] handleQuit called', {
			hasPopoverRef: !! popoverRef.current,
			hasHidePopover: popoverRef.current && typeof popoverRef.current.hidePopover === 'function',
			isOpen,
			popoverIsOpen: popoverRef.current?.matches( ':popover-open' ),
		} );

		setShowQuitConfirmation( false );
		
		// Save progress before closing (don't wait for it).
		progressHooks.saveProgress( wizardState ).catch( () => {
			// Silently fail.
		} );

		// Hide popover - toggle event will update isOpen state
		const element = popoverRef.current;
		if ( element && typeof element.hidePopover === 'function' ) {
			console.log( '[OnboardingWizard] Calling hidePopover()' );
			try {
				element.hidePopover();
				console.log( '[OnboardingWizard] hidePopover() called successfully' );
				
				// Immediately set isOpen to false - toggle event will confirm or correct it
				setIsOpen( false );
				
				// Verify it actually closed after a short delay
				setTimeout( () => {
					if ( element && element.matches( ':popover-open' ) ) {
						console.warn( '[OnboardingWizard] Popover still open after hidePopover(), forcing close' );
						// Force close by removing the popover attribute temporarily
						element.removeAttribute( 'popover' );
						setTimeout( () => {
							element.setAttribute( 'popover', 'manual' );
							setIsOpen( false );
						}, 0 );
					} else {
						console.log( '[OnboardingWizard] Popover closed successfully' );
					}
				}, 50 );
			} catch ( error ) {
				console.error( '[OnboardingWizard] Error calling hidePopover()', error );
				setIsOpen( false );
			}
		} else {
			console.warn( '[OnboardingWizard] hidePopover not available, using fallback' );
			// Fallback if hidePopover is not available
			setIsOpen( false );
		}
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

	// Show loading state while fetching config.
	if ( isLoadingConfig ) {
		console.log( '[OnboardingWizard] Loading wizard config...' );
		return null; // Don't render while loading.
	}

	// Show error state if config failed to load and no fallback.
	if ( configError && ! fallbackWizard ) {
		console.error( '[OnboardingWizard] Failed to load wizard config', configError );
		return null; // Don't render on error.
	}

	// Always render wizard (like develop's add_popover), but control visibility via isOpen.
	// If wizard is not enabled, don't render at all.
	if ( ! onboardingWizard?.enabled ) {
		console.log( '[OnboardingWizard] Not rendering: wizard not enabled', {
			onboardingWizard: !! onboardingWizard,
			enabled: onboardingWizard?.enabled,
		} );
		return null;
	}

	console.log( '[OnboardingWizard] Rendering wizard', {
		wizardEnabled: onboardingWizard?.enabled,
		wizardFinished: wizardState.data.finished,
		isOpen,
		shouldAutoStartWizard,
		hasSavedProgress: !! savedProgress,
		currentStep,
	} );

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
