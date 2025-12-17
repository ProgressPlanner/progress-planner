/**
 * OnboardingWizard Component
 *
 * Main onboarding wizard component that manages the multi-step wizard.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
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
 * @return {JSX.Element|null} The wizard component or null if not enabled.
 */
export default function OnboardingWizard( { config } ) {
	const { onboardingWizard } = config;

	if ( ! onboardingWizard?.enabled ) {
		return null;
	}

	const { steps, savedProgress, ajaxUrl, nonce } = onboardingWizard;

	const progressHooks = useOnboardingProgress( { ajaxUrl, nonce } );
	const {
		wizardState,
		updateState,
		nextStep,
		prevStep,
		goToStep,
		currentStep,
		currentStepData,
		totalSteps,
	} = useOnboardingWizard( onboardingWizard, progressHooks );

	const [ showQuitConfirmation, setShowQuitConfirmation ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );

	// Auto-open wizard if there's saved progress or if it should start.
	useEffect( () => {
		// Don't show if wizard is already finished.
		if ( wizardState.data.finished ) {
			return;
		}

		// Show wizard if:
		// 1. There's saved progress (user is resuming)
		// 2. Privacy policy is accepted but wizard hasn't been completed
		if (
			savedProgress ||
			( config.privacyPolicyAccepted && onboardingWizard?.enabled )
		) {
			setIsOpen( true );
		}
	}, [
		savedProgress,
		config.privacyPolicyAccepted,
		onboardingWizard?.enabled,
		wizardState.data.finished,
	] );

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

	if ( ! isOpen ) {
		return null;
	}

	return (
		<>
			<div
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
}
