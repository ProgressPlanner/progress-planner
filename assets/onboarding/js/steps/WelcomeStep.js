/**
 * Welcome step - First step in the onboarding flow
 * Displays a welcome message, logo, and privacy policy checkbox
 */
/* global OnboardingStep, LicenseGenerator, ProgressPlannerOnboardData */

class PrplWelcomeStep extends OnboardingStep {
	constructor() {
		super( {
			id: 'welcome',
			templateId: 'tour-step-welcome',
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
		};

		checkbox.addEventListener( 'change', handler );

		return () => {
			checkbox.removeEventListener( 'change', handler );
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
	 * Custom button text for welcome step
	 * @return {string} Button text
	 */
	getNextButtonText() {
		return ProgressPlannerOnboardData.l10n.startOnboarding;
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
		const nextBtn = this.wizard.nextBtn;
		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>'; // WP spinner.

		nextBtn.parentElement.insertBefore( spinner, nextBtn );
		nextBtn.disabled = true;

		try {
			// Generate license
			await this.generateLicense();
		} catch ( error ) {
			console.error( 'Failed to generate license:', error );

			// Display error message to user
			this.showErrorMessage( error.message );

			// Re-enable the button so user can retry
			nextBtn.disabled = false;

			// Don't proceed to next step
			throw error;
		} finally {
			// Remove spinner
			spinner.remove();
			this.isGeneratingLicense = false;
		}
	}

	/**
	 * Show error message to user
	 * Uses generic error styling that can be reused across all steps
	 * @param {string} message Error message to display
	 */
	showErrorMessage( message ) {
		// Remove existing error if any
		this.clearErrorMessage();

		// Create error message element
		const errorDiv = document.createElement( 'div' );
		errorDiv.className = 'prpl-error-message';
		errorDiv.innerHTML = `
			<div class="prpl-error-box">
				<span class="dashicons dashicons-warning"></span>
				<div>
					<h3>Error generating license</h3>
					<p>${ this.escapeHtml( message ) }</p>
				</div>
			</div>
		`;

		// Insert error message before the footer
		const footer = this.wizard.popover.querySelector( '.tour-footer' );
		footer.parentElement.insertBefore( errorDiv, footer );
	}

	/**
	 * Clear error message
	 */
	clearErrorMessage() {
		const existingError = this.wizard.popover.querySelector(
			'.prpl-error-message'
		);
		if ( existingError ) {
			existingError.remove();
		}
	}

	/**
	 * Escape HTML to prevent XSS
	 * @param {string} text Text to escape
	 * @return {string} Escaped text
	 */
	escapeHtml( text ) {
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}

	/**
	 * Generate license on server
	 * Uses LicenseGenerator utility class
	 * @return {Promise} Resolves when license is generated
	 */
	async generateLicense() {
		// Use LicenseGenerator to handle the license generation process
		return LicenseGenerator.generateLicense( {
			name: '',
			email: '',
			site: ProgressPlannerOnboardData.site,
			timezone_offset: ProgressPlannerOnboardData.timezone_offset,
		} );
	}
}

window.PrplWelcomeStep = new PrplWelcomeStep();
