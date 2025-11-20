/**
 * Whats Next step - Explains the badge system to users
 * Simple informational step with no user interaction required
 */
/* global OnboardingStep */
class PrplWhatsNextStep extends OnboardingStep {
	constructor() {
		super( {
			id: 'whats-next',
			templateId: 'tour-step-whats-next',
		} );
	}

	/**
	 * No special mounting logic needed for badges step
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		// Whats Next step is informational only
		// No special logic needed
		return () => {};
	}

	/**
	 * User can always proceed from badges step
	 * @param {Object} state - Wizard state
	 * @return {boolean} Always returns true
	 */
	canProceed( state ) {
		return true;
	}
}

window.PrplWhatsNextStep = new PrplWhatsNextStep();
