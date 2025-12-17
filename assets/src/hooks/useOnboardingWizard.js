/**
 * useOnboardingWizard Hook
 *
 * Manages onboarding wizard state and navigation.
 *
 * @package
 */

import { useState, useCallback, useEffect } from '@wordpress/element';
import { useOnboardingProgress } from './useOnboardingProgress';

/**
 * Hook for managing onboarding wizard state.
 *
 * @param {Object} config              - Configuration object.
 * @param {Array}  config.steps        - Array of step definitions.
 * @param {Object} config.savedProgress - Saved progress from server.
 * @param {Object} progressHooks       - Progress management hooks.
 * @return {Object} Wizard state and navigation functions.
 */
export function useOnboardingWizard( config, progressHooks ) {
	const { steps = [], savedProgress = null } = config;
	const { saveProgress } = progressHooks;

	// Initialize state from saved progress or defaults.
	const [ wizardState, setWizardState ] = useState( () => {
		if ( savedProgress ) {
			return {
				currentStep: savedProgress.currentStep || 0,
				data: savedProgress.data || {
					privacyAccepted: false,
					firstTaskCompleted: false,
					moreTasksCompleted: {},
					finished: false,
					emailFrequency: {
						choice: null,
						name: '',
						email: '',
					},
					settings: {},
				},
			};
		}

		return {
			currentStep: 0,
			data: {
				privacyAccepted: false,
				firstTaskCompleted: false,
				moreTasksCompleted: {},
				finished: false,
				emailFrequency: {
					choice: null,
					name: '',
					email: '',
				},
				settings: {},
			},
		};
	} );

	/**
	 * Update wizard state.
	 *
	 * @param {Object} updates - State updates to apply.
	 */
	const updateState = useCallback( ( updates ) => {
		setWizardState( ( prev ) => ( {
			...prev,
			...updates,
			data: {
				...prev.data,
				...( updates.data || {} ),
			},
		} ) );
	}, [] );

	/**
	 * Navigate to next step.
	 */
	const nextStep = useCallback( () => {
		setWizardState( ( prev ) => {
			const next = Math.min( prev.currentStep + 1, steps.length - 1 );
			return { ...prev, currentStep: next };
		} );
	}, [ steps.length ] );

	/**
	 * Navigate to previous step.
	 */
	const prevStep = useCallback( () => {
		setWizardState( ( prev ) => {
			const prevStep = Math.max( prev.currentStep - 1, 0 );
			return { ...prev, currentStep: prevStep };
		} );
	}, [] );

	/**
	 * Navigate to specific step.
	 *
	 * @param {number} stepIndex - Step index to navigate to.
	 */
	const goToStep = useCallback( ( stepIndex ) => {
		setWizardState( ( prev ) => ( {
			...prev,
			currentStep: Math.max( 0, Math.min( stepIndex, steps.length - 1 ) ),
		} ) );
	}, [ steps.length ] );

	/**
	 * Auto-save progress after state changes.
	 */
	useEffect( () => {
		const timeoutId = setTimeout( () => {
			saveProgress( wizardState ).catch( () => {
				// Silently fail - progress saving is best effort.
			} );
		}, 500 ); // Debounce saves.

		return () => clearTimeout( timeoutId );
	}, [ wizardState, saveProgress ] );

	return {
		wizardState,
		updateState,
		nextStep,
		prevStep,
		goToStep,
		currentStep: wizardState.currentStep,
		currentStepData: steps[ wizardState.currentStep ] || null,
		totalSteps: steps.length,
	};
}

