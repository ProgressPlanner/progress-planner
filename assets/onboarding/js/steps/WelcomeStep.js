/**
 * Welcome step - First step in the onboarding flow
 * Displays a welcome message, logo, and privacy policy checkbox
 */
/* global OnboardingStep, LicenseGenerator, ProgressPlannerOnboardData */

class PrplWelcomeStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-welcome',
		} );
		this.isGeneratingLicense = false;
	}

	/**
	 * Mount the welcome step
	 * Sets up checkbox listener and initializes state
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		const checkbox = this.popover.querySelector( '#prpl-privacy-checkbox' );

		if ( ! checkbox ) {
			return () => {};
		}

		// Initialize state
		if ( ! state.data.privacyAccepted ) {
			state.data.privacyAccepted = false;
		}

		// Set checkbox state from wizard state
		checkbox.checked = state.data.privacyAccepted;

		const handler = ( e ) => {
			state.data.privacyAccepted = e.target.checked;

			// Remove active class from required indicator.
			this.popover
				.querySelector(
					'.prpl-privacy-checkbox-wrapper .prpl-required-indicator'
				)
				.classList.remove( 'prpl-required-indicator-active' );
		};

		checkbox.addEventListener( 'change', handler );

		return () => {
			checkbox.removeEventListener( 'change', handler );
		};
	}

	/**
	 * Setup custom handler for disabled button clicks
	 * Shows error message when user tries to proceed without accepting privacy policy
	 * @return {Function} Cleanup function
	 */
	onNextButtonSetup() {
		const disabledClickHandler = ( e ) => {
			if ( this.nextBtn.classList.contains( 'prpl-btn-disabled' ) ) {
				e.preventDefault();
				e.stopPropagation();

				this.popover
					.querySelector(
						'.prpl-privacy-checkbox-wrapper .prpl-required-indicator'
					)
					.classList.add( 'prpl-required-indicator-active' );
			}
		};

		this.nextBtn.addEventListener( 'click', disabledClickHandler );

		// Return cleanup function
		return () => {
			this.nextBtn?.removeEventListener( 'click', disabledClickHandler );
		};
	}

	/**
	 * User can only proceed if privacy policy is accepted
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if privacy is accepted
	 */
	canProceed( state ) {
		return !! state.data.privacyAccepted;
	}

	/**
	 * Called before advancing to next step
	 * Generates license and shows spinner
	 * @return {Promise} Resolves when license is generated
	 */
	async beforeNextStep() {
		if ( this.isGeneratingLicense ) {
			return;
		}

		this.isGeneratingLicense = true;

		// Clear any existing error messages
		this.clearErrorMessage();

		// Show spinner
		const spinner = this.showSpinner( this.nextBtn );

		try {
			// Generate license
			await this.generateLicense();
		} catch ( error ) {
			console.error( 'Failed to generate license:', error );

			// Display error message to user
			this.showErrorMessage( error.message, 'Error generating license' );

			// Re-enable the button so user can retry
			this.setNextButtonDisabled( false );

			// Don't proceed to next step
			throw error;
		} finally {
			// Remove spinner
			spinner.remove();
			this.isGeneratingLicense = false;
		}
	}

	/**
	 * Generate license on server
	 * Uses LicenseGenerator utility class
	 * @return {Promise} Resolves when license is generated
	 */
	async generateLicense() {
		// Use LicenseGenerator to handle the license generation process
		return LicenseGenerator.generateLicense(
			{
				name: '',
				email: '',
				'with-email': 'no',
				site: ProgressPlannerOnboardData.site,
				timezone_offset: ProgressPlannerOnboardData.timezone_offset,
			},
			{
				onboardNonceURL: ProgressPlannerOnboardData.onboardNonceURL,
				onboardAPIUrl: ProgressPlannerOnboardData.onboardAPIUrl,
				adminAjaxUrl: ProgressPlannerOnboardData.adminAjaxUrl,
				nonce: ProgressPlannerOnboardData.nonceProgressPlanner,
			}
		);
	}
}

window.PrplWelcomeStep = new PrplWelcomeStep();
