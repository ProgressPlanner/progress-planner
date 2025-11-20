/**
 * Badges step - Explains the badge system to users
 * Simple informational step with no user interaction required
 */
/* global OnboardingStep */

class PrplBadgesStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-badges',
		} );
	}

	/**
	 * No special mounting logic needed for badges step
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		// Badges step is informational only
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

window.PrplBadgesStep = new PrplBadgesStep();
