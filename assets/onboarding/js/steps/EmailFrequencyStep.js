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
				this.updateNextButton();
			}
		};

		const dontEmailHandler = ( e ) => {
			if ( e.target.checked ) {
				state.data.emailFrequency.choice = 'none';
				emailForm.style.display = 'none';

				// Update button state
				this.updateNextButton();
			}
		};

		// Form input handlers
		const nameHandler = ( e ) => {
			state.data.emailFrequency.name = e.target.value.trim();
			this.updateNextButton();
		};

		const emailHandler = ( e ) => {
			state.data.emailFrequency.email = e.target.value.trim();
			this.updateNextButton();
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
		const spinner = this.showSpinner( this.nextBtn );

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
				error.message || 'Failed to subscribe. Please try again.',
				'Error subscribing'
			);

			// Re-enable the button so user can retry
			this.setNextButtonDisabled( false );

			// Don't proceed to next step
			throw error;
		} finally {
			// Remove spinner
			spinner.remove();
		}
	}
}

window.PrplEmailFrequencyStep = new PrplEmailFrequencyStep();
