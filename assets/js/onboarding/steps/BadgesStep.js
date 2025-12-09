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
	 * Mount badges step and lazy-load badge graphic
	 * Badge is only loaded after privacy policy is accepted
	 * @return {Function} Cleanup function
	 */
	onMount() {
		const gaugeElement = document.getElementById( 'prpl-gauge-onboarding' );

		if ( ! gaugeElement ) {
			return () => {};
		}

		// Create badge element using innerHTML to properly instantiate the custom element
		const badgeId = gaugeElement.getAttribute( 'data-badge-id' );
		const badgeName = gaugeElement.getAttribute( 'data-badge-name' );
		const brandingId = gaugeElement.getAttribute( 'data-branding-id' );

		gaugeElement.innerHTML = `
			<prpl-badge
				complete="true"
				badge-id="${ badgeId }"
				badge-name="${ badgeName }"
				branding-id="${ brandingId }"
			></prpl-badge>
		`;

		// Increment badge point(s) after badge is loaded
		setTimeout( () => {
			if ( gaugeElement ) {
				// Check if the first task was completed.
				if ( this.wizard.state.data.firstTaskCompleted ) {
					gaugeElement.value += 1;
				}
			}
		}, 1500 );

		return () => {};
	}

	/**
	 * User can always proceed from badges step
	 * @return {boolean} Always returns true
	 */
	canProceed() {
		return true;
	}
}

window.PrplBadgesStep = new PrplBadgesStep();
