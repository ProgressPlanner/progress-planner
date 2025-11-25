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
	 * Get the text for the "Next" button
	 * Override this method to customize button text per step
	 * @return {string|null} Button text or null to use default
	 */
	getNextButtonText() {
		// Return null to use default translated text from wizard
		return null;
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
	 * @param {string} title   Optional error title (defaults to "Error")
	 */
	showErrorMessage( message, title = 'Error' ) {
		// Remove existing error if any
		this.clearErrorMessage();

		// Create error message element
		const errorDiv = document.createElement( 'div' );
		errorDiv.className = 'prpl-error-message';
		errorDiv.innerHTML = `
			<div class="prpl-error-box">
				<span class="dashicons dashicons-warning"></span>
				<div>
					<h3>${ this.escapeHtml( title ) }</h3>
					<p>${ this.escapeHtml( message ) }</p>
				</div>
			</div>
		`;

		// Insert error message before the footer
		const footer = this.wizard?.popover?.querySelector( '.tour-footer' );
		if ( footer ) {
			footer.parentElement.insertBefore( errorDiv, footer );
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
}
