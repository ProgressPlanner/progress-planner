/**
 * Base class for onboarding steps
 * All step components should extend this class
 */
class OnboardingStep {
	/**
	 * Constructor
	 * @param {Object} config - Step configuration
	 * @param {string} config.id - Unique step identifier
	 * @param {string} config.templateId - ID of the template element containing the step HTML
	 */
	constructor( config ) {
		this.id = config.id;
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
	 * @param {string} key - State key to update
	 * @param {*} value - New value
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
}
