/**
 * Progress Planner Onboarding Wizard
 * Handles the onboarding wizard functionality
 */
/* global ProgressPlannerOnboardData */

// eslint-disable-next-line no-unused-vars
class ProgressPlannerOnboardWizard {
	constructor( config ) {
		this.config = config;
		this.state = {
			currentStep: 0,
			data: {
				moreTasksCompleted: {},
				firstTaskCompleted: false,
				finished: false,
			},
			cleanup: null,
		};

		this.setupStateProxy();

		// Set DOM related properties FIRST.
		this.popover = document.getElementById( this.config.popoverId );
		this.contentWrapper = this.popover.querySelector(
			'.tour-content-wrapper'
		);
		this.nextBtn = this.popover.querySelector( '.prpl-tour-next' );
		this.dashboardBtn = this.popover.querySelector( '#prpl-dashboard-btn' );
		this.closeBtn = this.popover.querySelector( '#prpl-tour-close-btn' );

		// Initialize tour steps AFTER popover is set
		this.tourSteps = this.initializeTourSteps();

		// Setup event listeners after DOM is ready
		this.setupEventListeners();
	}

	/**
	 * Initialize tour steps configuration
	 * Creates instances of step components
	 */
	initializeTourSteps() {
		const steps = [
			new WelcomeStep(),
			new FirstTaskStep(),
			new BadgesStep(),
			new MoreTasksStep(),
		];

		// Set wizard reference for each step
		steps.forEach( ( step ) => step.setWizard( this ) );

		return steps;
	}

	/**
	 * Render current step
	 */
	renderStep() {
		const step = this.tourSteps[ this.state.currentStep ];

		// Render step content
		this.popover.querySelector( '.tour-content-wrapper' ).innerHTML =
			step.render();

		// Cleanup previous step
		if ( this.state.cleanup ) {
			this.state.cleanup();
			this.state.cleanup = null;
		}

		// Mount current step and store cleanup function
		this.state.cleanup = step.onMount( this.state );

		// Update step indicator
		this.popover.dataset.prplStep = this.state.currentStep;
		this.updateStepNavigation();
		this.updateButtonStates();
		this.updateNextButton();
	}

	/**
	 * Update step navigation in left column
	 */
	updateStepNavigation() {
		const stepItems = this.popover.querySelectorAll( '.prpl-step-item' );

		stepItems.forEach( ( item, index ) => {
			const icon = item.querySelector( '.prpl-step-icon' );
			const stepNumber = index + 1;

			// Remove all state classes
			item.classList.remove( 'active', 'completed' );

			// Add appropriate class and update icon
			if ( index < this.state.currentStep ) {
				// Completed step: show checkmark
				item.classList.add( 'completed' );
				icon.textContent = '✓';
			} else if ( index === this.state.currentStep ) {
				// Active step: show number
				item.classList.add( 'active' );
				icon.textContent = stepNumber;
			} else {
				// Future step: show number
				icon.textContent = stepNumber;
			}
		} );
	}

	/**
	 * Update button visibility states
	 */
	updateButtonStates() {
		const isLastStep = this.state.currentStep === this.tourSteps.length - 1;

		// Toggle button visibility
		this.nextBtn.style.display =
			isLastStep || this.state.currentStep === 1 // We hide the "First task" step.
				? 'none'
				: 'inline-block';
		this.dashboardBtn.style.display = isLastStep ? 'inline-block' : 'none';
	}

	/**
	 * Move to next step
	 */
	nextStep() {
		console.log(
			'nextStep() called, current step:',
			this.state.currentStep
		);
		const step = this.tourSteps[ this.state.currentStep ];

		// Check if user can proceed from current step
		if ( ! step.canProceed( this.state ) ) {
			console.log( 'Cannot proceed - step requirements not met' );
			return;
		}

		if ( this.state.currentStep < this.tourSteps.length - 1 ) {
			this.state.currentStep++;
			console.log( 'Moving to step:', this.state.currentStep );
			this.saveProgressToServer();
			this.renderStep();
		} else {
			console.log( 'Closing tour - reached last step' );
			this.closeTour();
		}
	}

	/**
	 * Move to previous step
	 */
	prevStep() {
		if ( this.state.currentStep > 0 ) {
			this.state.currentStep--;
			this.renderStep();
		}
	}

	/**
	 * Close the tour
	 */
	closeTour() {
		if ( this.popover ) {
			this.popover.hidePopover();
		}
		this.saveProgressToServer();

		// Cleanup active step
		if ( this.state.cleanup ) {
			this.state.cleanup();
		}

		// Reset cleanup
		this.state.cleanup = null;
	}

	/**
	 * Start the tour
	 */
	startTour() {
		if ( this.popover ) {
			this.popover.showPopover();
			this.updateStepNavigation();
			this.renderStep();
		}
	}

	/**
	 * Save progress to server
	 */
	async saveProgressToServer() {
		try {
			const response = await fetch( this.config.adminAjaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					state: JSON.stringify( this.state ),
					nonce: this.config.nonceProgressPlanner,
					action: 'progress_planner_tour_save_progress',
				} ),
				credentials: 'same-origin',
			} );

			if ( ! response.ok ) {
				throw new Error( 'Request failed: ' + response.status );
			}

			return response.json();
		} catch ( error ) {
			console.error( 'Failed to save tour progress:', error );
		}
	}

	/**
	 * Update next button state
	 */
	updateNextButton() {
		const step = this.tourSteps[ this.state.currentStep ];

		// Check if user can proceed to next step
		this.nextBtn.disabled = ! step.canProceed( this.state );

		// Update button text if step provides custom text
		const buttonText = step.getNextButtonText();
		if ( buttonText ) {
			// Step provides custom button text
			this.nextBtn.textContent = buttonText;
		} else {
			// Use default translated text
			const defaultText =
				this.config.l10n && this.config.l10n.next
					? this.config.l10n.next
					: 'Next';
			this.nextBtn.textContent = defaultText;
		}
	}

	/**
	 * Update DOM, used for reactive updates.
	 * All changes which should happen when the state changes should be done here.
	 */
	updateDOM() {
		this.updateNextButton();
	}

	/**
	 * Get popover element
	 */
	getPopover() {
		if ( ! this.popover ) {
			this.popover = document.getElementById( this.config.popoverId );
		}
		return this.popover;
	}

	/**
	 * Setup event listeners
	 */
	setupEventListeners() {
		console.log( 'Setting up event listeners...' );
		if ( this.popover ) {
			console.log( 'Popover found:', this.popover );

			this.popover.addEventListener( 'beforetoggle', ( event ) => {
				if ( event.newState === 'open' ) {
					console.log( 'Tour opened' );
				}
				if ( event.newState === 'closed' ) {
					console.log( 'Tour closed' );
				}
			} );

			if ( this.nextBtn ) {
				this.nextBtn.addEventListener( 'click', () => {
					console.log( 'Next button clicked!' );
					this.nextStep();
				} );
			}

			if ( this.dashboardBtn ) {
				this.dashboardBtn.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					console.log( 'Dashboard button clicked!' );
					this.state.data.finished = true;
					this.closeTour();

					// Redirect to the dashboard.
					window.location.href =
						this.dashboardBtn.getAttribute( 'data-redirect-to' );
				} );
			}

			if ( this.closeBtn ) {
				this.closeBtn.addEventListener( 'click', () => {
					console.log( 'Close button clicked!' );
					this.state.data.finished =
						this.state.currentStep === this.tourSteps.length - 1;
					this.closeTour();
				} );
			}
		} else {
			console.error( 'Popover not found!' );
		}
	}

	/**
	 * Setup state proxy for reactive updates
	 */
	setupStateProxy() {
		this.state.data = this.createDeepProxy( this.state.data, () =>
			this.updateDOM()
		);
	}

	/**
	 * Create deep proxy for nested object changes
	 * @param {Object}   target
	 * @param {Function} callback
	 */
	createDeepProxy( target, callback ) {
		// Recursively wrap existing nested objects first
		for ( const key of Object.keys( target ) ) {
			if (
				target[ key ] &&
				typeof target[ key ] === 'object' &&
				! Array.isArray( target[ key ] )
			) {
				target[ key ] = this.createDeepProxy( target[ key ], callback );
			}
		}

		return new Proxy( target, {
			set: ( obj, prop, value ) => {
				if (
					value &&
					typeof value === 'object' &&
					! Array.isArray( value )
				) {
					value = this.createDeepProxy( value, callback );
				}
				obj[ prop ] = value;
				callback();
				return true;
			},
		} );
	}
}

class ProgressPlannerTourUtils {
	/**
	 * Complete a task via AJAX
	 * @param {string} taskId
	 * @param {Object} formValues
	 */
	static async completeTask( taskId, formValues = {} ) {
		const response = await fetch( ProgressPlannerOnboardData.adminAjaxUrl, {
			method: 'POST',
			body: new URLSearchParams( {
				form_values: JSON.stringify( formValues ),
				task_id: taskId,
				nonce: ProgressPlannerOnboardData.nonceProgressPlanner,
				action: 'progress_planner_tour_complete_task',
			} ),
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}
}
