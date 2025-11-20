/**
 * Email Frequency step - Allow users to opt in/out of weekly emails
 * If opted in, collects name and email for subscription
 */
/* global OnboardingStep, ProgressPlannerOnboardData, LicenseGenerator */

class PrplEmailFrequencyStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-email-frequency',
		} );
	}

	/**
	 * Mount the email frequency step
	 * Sets up radio button and form field listeners
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		const emailWeeklyRadio =
			this.popover.querySelector( '#prpl-email-weekly' );
		const dontEmailRadio = this.popover.querySelector( '#prpl-dont-email' );
		const emailForm = this.popover.querySelector( '#prpl-email-form' );
		const nameInput = this.popover.querySelector( '#prpl-email-name' );
		const emailInput = this.popover.querySelector( '#prpl-email-address' );

		if ( ! emailWeeklyRadio || ! dontEmailRadio || ! emailForm ) {
			return () => {};
		}

		// Initialize state
		if ( ! state.data.emailFrequency ) {
			state.data.emailFrequency = {
				choice: 'weekly', // Default to 'weekly'
				name: nameInput ? nameInput.value.trim() : '', // Get pre-populated value
				email: emailInput ? emailInput.value.trim() : '', // Get pre-populated value
			};
		}

		// Set radio button state from wizard state
		if ( state.data.emailFrequency.choice === 'weekly' ) {
			emailWeeklyRadio.checked = true;
			emailForm.style.display = 'block';
		} else if ( state.data.emailFrequency.choice === 'none' ) {
			dontEmailRadio.checked = true;
			emailForm.style.display = 'none';
		}

		// Set form values from state (or keep pre-populated values)
		if ( nameInput ) {
			nameInput.value = state.data.emailFrequency.name || nameInput.value;
		}
		if ( emailInput ) {
			emailInput.value =
				state.data.emailFrequency.email || emailInput.value;
		}

		// Radio button change handlers
		const weeklyHandler = ( e ) => {
			if ( e.target.checked ) {
				state.data.emailFrequency.choice = 'weekly';
				emailForm.style.display = 'block';

				// Update button state
				this.wizard.updateNextButton();
			}
		};

		const dontEmailHandler = ( e ) => {
			if ( e.target.checked ) {
				state.data.emailFrequency.choice = 'none';
				emailForm.style.display = 'none';

				// Update button state
				this.wizard.updateNextButton();
			}
		};

		// Form input handlers
		const nameHandler = ( e ) => {
			state.data.emailFrequency.name = e.target.value.trim();
			this.wizard.updateNextButton();
		};

		const emailHandler = ( e ) => {
			state.data.emailFrequency.email = e.target.value.trim();
			this.wizard.updateNextButton();
		};

		// Add event listeners
		emailWeeklyRadio.addEventListener( 'change', weeklyHandler );
		dontEmailRadio.addEventListener( 'change', dontEmailHandler );

		if ( nameInput ) {
			nameInput.addEventListener( 'input', nameHandler );
		}
		if ( emailInput ) {
			emailInput.addEventListener( 'input', emailHandler );
		}

		// Cleanup function
		return () => {
			emailWeeklyRadio.removeEventListener( 'change', weeklyHandler );
			dontEmailRadio.removeEventListener( 'change', dontEmailHandler );

			if ( nameInput ) {
				nameInput.removeEventListener( 'input', nameHandler );
			}
			if ( emailInput ) {
				emailInput.removeEventListener( 'input', emailHandler );
			}
		};
	}

	/**
	 * User can proceed if:
	 * - "Don't email me" is selected, OR
	 * - "Email me weekly" is selected AND both name and email fields are filled
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if can proceed
	 */
	canProceed( state ) {
		// Initialize state if needed (defensive check)
		if ( ! state.data.emailFrequency ) {
			state.data.emailFrequency = {
				choice: null,
				name: '',
				email: '',
			};
		}

		const emailFrequency = state.data.emailFrequency;

		if ( ! emailFrequency.choice ) {
			return false;
		}

		// If user chose "don't email", they can proceed immediately
		if ( emailFrequency.choice === 'none' ) {
			return true;
		}

		// If user chose "weekly", check that name and email are filled
		if ( emailFrequency.choice === 'weekly' ) {
			return !! ( emailFrequency.name && emailFrequency.email );
		}

		return false;
	}

	/**
	 * Called before advancing to next step
	 * Fires AJAX request to subscribe user if "Email me weekly" was selected
	 * @return {Promise} Resolves when action is complete
	 */
	async beforeNextStep() {
		const state = this.getState();

		// Only send AJAX if user chose to receive emails
		if ( state.data.emailFrequency.choice !== 'weekly' ) {
			return Promise.resolve();
		}

		// Show spinner
		const nextBtn = this.wizard.nextBtn;
		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>';

		nextBtn.parentElement.insertBefore( spinner, nextBtn );
		nextBtn.disabled = true;

		try {
			// Use LicenseGenerator to handle the license generation process
			await LicenseGenerator.generateLicense( {
				name: state.data.emailFrequency.name,
				email: state.data.emailFrequency.email,
				site: ProgressPlannerOnboardData.site,
				timezone_offset: ProgressPlannerOnboardData.timezone_offset,
				'with-email': 'yes',
			} );

			console.log( 'Successfully subscribed' );
		} catch ( error ) {
			console.error( 'Failed to subscribe:', error );

			// Display error message to user
			this.showErrorMessage(
				error.message || 'Failed to subscribe. Please try again.'
			);

			// Re-enable the button so user can retry
			nextBtn.disabled = false;

			// Don't proceed to next step
			throw error;
		} finally {
			// Remove spinner
			spinner.remove();
		}
	}

	/**
	 * Show error message to user
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
					<h3>Error subscribing</h3>
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
}

window.PrplEmailFrequencyStep = new PrplEmailFrequencyStep();
