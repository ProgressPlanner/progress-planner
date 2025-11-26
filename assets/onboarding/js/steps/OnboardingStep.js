/**
 * Base class for onboarding steps
 * All step components should extend this class
 */
class OnboardingStep {
	/**
	 * Constructor
	 * @param {Object} config            - Step configuration
	 * @param {string} config.id         - Unique step identifier
	 * @param {string} config.templateId - ID of the template element containing the step HTML
	 */
	constructor( config ) {
		this.templateId = config.templateId;
		this.wizard = null; // Reference to parent wizard
		this.popover = null; // Reference to popover element
		this.cleanup = null; // Cleanup function for event listeners
		this.nextBtn = null; // Reference to next button element
	}

	/**
	 * Set wizard reference
	 * @param {ProgressPlannerOnboardWizard} wizard
	 */
	setWizard( wizard ) {
		this.wizard = wizard;
		this.popover = wizard.popover;
	}

	/**
	 * Get the step's HTML content
	 * @return {string} HTML content
	 */
	render() {
		const template = document.getElementById( this.templateId );
		if ( ! template ) {
			console.error( `Template not found: ${ this.templateId }` );
			return '';
		}
		return template.innerHTML;
	}

	/**
	 * Called when step is mounted to DOM
	 * Override this method to setup event listeners and step-specific logic
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function to be called when step unmounts
	 */
	onMount( state ) {
		// Override in subclass
		return () => {};
	}

	/**
	 * Check if user can proceed to next step
	 * Override this method to add step-specific validation
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if user can proceed
	 */
	canProceed( state ) {
		// Override in subclass
		return true;
	}

	/**
	 * Called when step is about to be unmounted
	 * Override this method for cleanup logic
	 */
	onUnmount() {
		if ( this.cleanup ) {
			this.cleanup();
			this.cleanup = null;
		}
	}

	/**
	 * Utility method to update wizard state
	 * @param {string} key   - State key to update
	 * @param {*}      value - New value
	 */
	updateState( key, value ) {
		if ( this.wizard ) {
			this.wizard.state.data[ key ] = value;
		}
	}

	/**
	 * Utility method to get current state
	 * @return {Object} Current wizard state
	 */
	getState() {
		return this.wizard ? this.wizard.state : null;
	}

	/**
	 * Utility method to advance to next step
	 */
	nextStep() {
		if ( this.wizard ) {
			this.wizard.nextStep();
		}
	}

	/**
	 * Show error message to user
	 * @param {string} message Error message to display
	 * @param {string} title   Optional error title
	 */
	showErrorMessage( message, title = '' ) {
		// Remove existing error if any
		this.clearErrorMessage();

		// Build title HTML if provided
		const titleHtml = title ? `<h3>${ this.escapeHtml( title ) }</h3>` : '';

		// Create error message element
		const errorDiv = document.createElement( 'div' );
		errorDiv.className = 'prpl-error-message';
		errorDiv.innerHTML = `
			<div class="prpl-error-box">
				<span class="dashicons dashicons-warning"></span>
				<div>
					${ titleHtml }
					<p>${ this.escapeHtml( message ) }</p>
				</div>
			</div>
		`;

		// TODO: Move to step footer instead of popover footer?
		const footer =
			this.wizard?.contentWrapper?.querySelector( '.tour-footer' );
		if ( footer ) {
			footer.prepend( errorDiv );
		}
	}

	/**
	 * Clear error message
	 */
	clearErrorMessage() {
		const existingError = this.wizard?.popover?.querySelector(
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
	 * Show spinner before a button and disable the button
	 * @param {HTMLElement} button Button element to show spinner before and disable
	 * @return {HTMLElement} The created spinner element
	 */
	showSpinner( button ) {
		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>';

		button.parentElement.insertBefore( spinner, button );
		button.disabled = true;

		return spinner;
	}

	/**
	 * Toggle visibility of the footer in this step's template
	 * @param {boolean} visible - Whether to show the footer
	 */
	toggleStepFooter( visible ) {
		const stepFooter = this.wizard?.contentWrapper?.querySelector(
			'.tour-content-wrapper .tour-footer'
		);
		if ( stepFooter ) {
			stepFooter.style.display = visible ? 'flex' : 'none';
		}
	}

	/**
	 * Called before advancing to next step
	 * Fires AJAX request to subscribe user if "Email me weekly" was selected
	 * @return {Promise} Resolves when action is complete
	 */
	async beforeNextStep() {
		// Override in subclass
		return Promise.resolve();
	}

	/**
	 * Setup next button after step is rendered
	 * Finds button, attaches click handler, and initializes state
	 * Called automatically by wizard after rendering
	 */
	setupNextButton() {
		// Find the next button in the rendered step content
		this.nextBtn =
			this.wizard?.contentWrapper?.querySelector( '.prpl-tour-next' );

		if ( ! this.nextBtn ) {
			// Step doesn't have a next button (e.g., SettingsStep with sub-steps)
			return;
		}

		// Remove any existing listeners by cloning the button
		const newBtn = this.nextBtn.cloneNode( true );
		if ( this.nextBtn.parentNode ) {
			this.nextBtn.parentNode.replaceChild( newBtn, this.nextBtn );
		}
		this.nextBtn = newBtn;

		// Add click listener
		this.nextBtn.addEventListener( 'click', () => {
			console.log( 'Next button clicked!' );
			this.nextStep();
		} );

		// Initialize button state
		this.updateNextButton();

		// Call hook for subclasses to add custom button behavior
		// Returns optional cleanup function
		const customCleanup = this.onNextButtonSetup();

		// If step provided a cleanup function, chain it with existing cleanup
		if ( customCleanup && typeof customCleanup === 'function' ) {
			const originalCleanup = this.cleanup;
			this.cleanup = () => {
				customCleanup();
				if ( originalCleanup ) {
					originalCleanup();
				}
			};
		}
	}

	/**
	 * Called after next button is setup
	 * Override to add custom button behavior
	 * @return {Function|void} Optional cleanup function
	 */
	onNextButtonSetup() {
		// Override in subclass
		// Return a cleanup function if you need to remove event listeners
	}

	/**
	 * Update next button state (text and enabled/disabled)
	 * Called when step state changes
	 */
	updateNextButton() {
		if ( ! this.nextBtn ) {
			return;
		}

		const state = this.getState();
		const canProceed = this.canProceed( state );

		// Update enabled/disabled state
		this.setNextButtonDisabled( ! canProceed );

		// Update button text
		this.updateNextButtonText();
	}

	/**
	 * Update next button text based on step configuration and wizard state
	 * Currently this is only used to change button text on the last step to "Take me to the Recommendations dashboard"
	 */
	updateNextButtonText() {
		if ( ! this.nextBtn || ! this.wizard ) {
			return;
		}

		const isLastStep =
			this.wizard.state.currentStep === this.wizard.tourSteps.length - 1;

		// Check if step provides custom button text
		if ( isLastStep ) {
			// On last step, use "Take me to the Recommendations dashboard" text
			const dashboardText =
				this.wizard.config?.l10n?.dashboard ||
				'Take me to the Recommendations dashboard';
			this.nextBtn.textContent = dashboardText;
		}
	}

	/**
	 * Enable or disable the next button
	 * Separated into its own method for easy customization
	 * @param {boolean} disabled - Whether to disable the button
	 */
	setNextButtonDisabled( disabled ) {
		if ( ! this.nextBtn ) {
			return;
		}

		// Currently using the disabled attribute
		// TODO: Consider using prpl-btn-disabled CSS class instead
		if ( disabled ) {
			this.nextBtn.classList.add( 'prpl-btn-disabled' );
		} else {
			this.nextBtn.classList.remove( 'prpl-btn-disabled' );
		}

		// this.nextBtn.disabled = disabled;
	}
}
