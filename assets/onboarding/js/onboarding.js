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

		// Restore saved progress if available
		this.restoreSavedProgress();

		// Make state work with reactive updates.
		this.setupStateProxy();

		// Set DOM related properties FIRST.
		this.popover = document.getElementById( this.config.popoverId );
		this.contentWrapper = this.popover.querySelector(
			'.tour-content-wrapper'
		);
		this.footer = this.popover.querySelector( '.tour-footer' );

		// Popover buttons.
		this.nextBtn = this.popover.querySelector( '.prpl-tour-next' );
		this.closeBtn = this.popover.querySelector( '#prpl-tour-close-btn' );

		// Initialize tour steps AFTER popover is set
		this.tourSteps = this.initializeTourSteps();

		// Setup event listeners after DOM is ready
		this.setupEventListeners();
	}

	/**
	 * Restore saved progress from server
	 */
	restoreSavedProgress() {
		if (
			! this.config.savedProgress ||
			typeof this.config.savedProgress !== 'object'
		) {
			return;
		}

		const savedState = this.config.savedProgress;

		// Restore currentStep if valid
		if (
			typeof savedState.currentStep === 'number' &&
			savedState.currentStep >= 0
		) {
			this.state.currentStep = savedState.currentStep;
			console.log(
				'Restored onboarding progress to step:',
				this.state.currentStep
			);
		}

		// Restore data object if present
		if ( savedState.data && typeof savedState.data === 'object' ) {
			// Merge saved data with default state
			this.state.data = {
				...this.state.data,
				...savedState.data,
			};

			// Ensure moreTasksCompleted is an object
			if (
				! this.state.data.moreTasksCompleted ||
				typeof this.state.data.moreTasksCompleted !== 'object'
			) {
				this.state.data.moreTasksCompleted = {};
			}

			console.log( 'Restored onboarding data:', this.state.data );
		}
	}

	/**
	 * Initialize tour steps configuration
	 * Creates instances of step components
	 */
	initializeTourSteps() {
		// Create instances of step components.
		const steps = this.config.steps.map( ( stepName ) => {
			if (
				window[ `Prpl${ stepName }` ] &&
				typeof window[ `Prpl${ stepName }` ] === 'object'
			) {
				return window[ `Prpl${ stepName }` ];
			}

			console.error(
				`Step class "${ stepName }" not found. Available on window:`,
				Object.keys( window ).filter( ( key ) =>
					key.includes( 'Step' )
				)
			);

			return null;
		} );

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
		this.contentWrapper.innerHTML = step.render();

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
	 * Toggle footer visibility
	 * @param {boolean} visible - Whether to show the footer
	 */
	toggleFooter( visible ) {
		if ( this.footer ) {
			this.footer.style.display = visible ? '' : 'none';
		}
	}

	/**
	 * Move to next step
	 */
	async nextStep() {
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

		// Call beforeNextStep if step has it (for async operations like license generation)
		if ( typeof step.beforeNextStep === 'function' ) {
			try {
				await step.beforeNextStep();
			} catch ( error ) {
				console.error( 'Error in beforeNextStep:', error );
				return; // Don't proceed if beforeNextStep fails
			}
		}

		if ( this.state.currentStep < this.tourSteps.length - 1 ) {
			this.state.currentStep++;
			console.log( 'Moving to step:', this.state.currentStep );
			this.saveProgressToServer();
			this.renderStep();
		} else {
			console.log( 'Finishing tour - reached last step' );
			this.state.data.finished = true;
			this.closeTour();

			// Redirect to the Progress Planner dashboard
			const redirectUrl = this.nextBtn.getAttribute( 'data-redirect-to' );
			if ( redirectUrl ) {
				window.location.href = redirectUrl;
			}
		}
	}

	/**
	 * Move to previous step, currently not used.
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
	 * Start the onboarding
	 */
	startOnboarding() {
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
					action: 'progress_planner_onboarding_save_progress',
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
		const isLastStep = this.state.currentStep === this.tourSteps.length - 1;

		// Check if user can proceed to next step
		this.nextBtn.disabled = ! step.canProceed( this.state );

		// Update button text if step provides custom text
		const buttonText = step.getNextButtonText();
		if ( buttonText ) {
			// Step provides custom button text
			this.nextBtn.textContent = buttonText;
		} else if ( isLastStep ) {
			// On last step, use "Take me to the Recommendations dashboard" text
			const dashboardText =
				this.config.l10n && this.config.l10n.dashboard
					? this.config.l10n.dashboard
					: 'Take me to the Recommendations dashboard';
			this.nextBtn.textContent = dashboardText;
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

			if ( this.closeBtn ) {
				this.closeBtn.addEventListener( 'click', ( e ) => {
					console.log( 'Close button clicked!' );

					// Check if privacy is accepted on welcome step
					if (
						this.state.currentStep === 0 &&
						! this.state.data.privacyAccepted
					) {
						e.preventDefault();
						this.showQuitConfirmation();
						return;
					}

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
	 * Show quit confirmation when trying to close without accepting privacy
	 */
	showQuitConfirmation() {
		// Replace content with confirmation message
		const originalContent = this.contentWrapper.innerHTML;

		this.contentWrapper.innerHTML = `
			<div class="prpl-quit-confirmation">
				<div class="prpl-error-box">
					<span class="dashicons dashicons-warning"></span>
					<div>
						<h3>Are you sure you want to quit?</h3>
						<p>You need to finish the onboarding before you can work with the Progress Planner plugin and start improving your site.</p>
					</div>
				</div>
				<div class="prpl-quit-actions">
					<a href="#" id="prpl-quit-yes" class="prpl-quit-link">Yes, quit the onboarding (for now)</a>
					<a href="#" id="prpl-quit-no" class="prpl-quit-link prpl-quit-link-primary">No, let's finish the onboarding!</a>
				</div>
			</div>
		`;

		// Hide footer.
		this.toggleFooter( false );

		// Add event listeners
		const quitYes = this.contentWrapper.querySelector( '#prpl-quit-yes' );
		const quitNo = this.contentWrapper.querySelector( '#prpl-quit-no' );

		quitYes.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			this.closeTour();
		} );

		quitNo.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			// Restore original content
			this.contentWrapper.innerHTML = originalContent;
			// Re-mount the step
			this.renderStep();
		} );
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
				action: 'progress_planner_onboarding_complete_task',
			} ),
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}
}
