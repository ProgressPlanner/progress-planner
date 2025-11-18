/**
 * Welcome step - First step in the onboarding flow
 * Displays a welcome message and logo
 */
class WelcomeStep extends OnboardingStep {
	constructor() {
		super( {
			id: 'welcome',
			templateId: 'tour-step-welcome',
		} );
	}

	/**
	 * No special mounting logic needed for welcome step
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		// Welcome step has no special logic
		// Just display the content
		return () => {};
	}

	/**
	 * User can always proceed from welcome step
	 * @param {Object} state - Wizard state
	 * @return {boolean} Always returns true
	 */
	canProceed( state ) {
		return true;
	}
}
