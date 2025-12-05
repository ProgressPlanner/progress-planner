/**
 * Progress Planner Onboarding Wizard
 * Handles the onboarding wizard functionality
 *
 * Dependencies: progress-planner/license-generator
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

		// Store previously focused element for accessibility
		this.previouslyFocusedElement = null;

		// Fullscreen mode flag
		this.isFullscreenMode = config.fullscreenMode || false;

		// Restore saved progress if available
		this.restoreSavedProgress();

		// Make state work with reactive updates.
		this.setupStateProxy();

		// Set DOM related properties FIRST.
		this.popover = document.getElementById( this.config.popoverId );
		this.fullscreenWrapper = document.getElementById(
			'prpl-onboarding-fullscreen'
		);
		this.contentWrapper = this.popover.querySelector(
			'.tour-content-wrapper'
		);

		// Popover buttons.
		this.closeBtn = this.popover.querySelector( '#prpl-tour-close-btn' );

		// Initialize tour steps AFTER popover is set
		this.tourSteps = this.initializeTourSteps();

		// Setup event listeners after DOM is ready
		this.setupEventListeners();

		// Auto-start onboarding if on the dedicated onboarding page
		if ( this.config.isOnboardingPage ) {
			this.startOnboarding();
		}
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

		// Setup next button (handled by step now)
		step.setupNextButton();

		// Update step indicator
		this.popover.dataset.prplStep = this.state.currentStep;
		this.updateStepNavigation();
	}

	/**
	 * Update step navigation in left column
	 */
	updateStepNavigation() {
		const stepItems = this.popover.querySelectorAll(
			'.prpl-nav-step-item'
		);
		let activeStepTitle = '';

		stepItems.forEach( ( item, index ) => {
			const icon = item.querySelector( '.prpl-step-icon' );
			const stepNumber = index + 1;

			// Remove all state classes
			item.classList.remove( 'prpl-active', 'prpl-completed' );

			// Add appropriate class and update icon
			if ( index < this.state.currentStep ) {
				// Completed step: show checkmark
				item.classList.add( 'prpl-completed' );
				icon.textContent = '✓';
			} else if ( index === this.state.currentStep ) {
				// Active step: show number
				item.classList.add( 'prpl-active' );
				icon.textContent = stepNumber;
				activeStepTitle =
					item.querySelector( '.prpl-step-label' ).textContent;
			} else {
				// Future step: show number
				icon.textContent = stepNumber;
			}
		} );

		// Update mobile step label
		const mobileStepLabel = this.popover.querySelector(
			'#prpl-onboarding-mobile-step-label'
		);
		if ( mobileStepLabel ) {
			mobileStepLabel.textContent = activeStepTitle;
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
		if ( step.beforeNextStep ) {
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
			// Wait for save to complete before redirecting to prevent re-triggering
			if (
				this.config.lastStepRedirectUrl &&
				this.config.lastStepRedirectUrl.length > 0
			) {
				await this.saveProgressToServer();
				window.location.href = this.config.lastStepRedirectUrl;
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
		// If fullscreen mode, hide the wrapper and remove body class
		if ( this.isFullscreenMode && this.fullscreenWrapper ) {
			this.fullscreenWrapper.style.display = 'none';
			document.body.classList.remove( 'prpl-onboarding-active' );
			this.popover.classList.remove( 'prpl-popover-visible' );
		} else if ( this.popover ) {
			this.popover.hidePopover();
		}

		this.saveProgressToServer();

		// Cleanup active step
		if ( this.state.cleanup ) {
			this.state.cleanup();
		}

		// If on the onboarding page and not finishing, redirect back
		if ( this.config.isOnboardingPage && this.config.cancelUrl && ! this.state.data.finished ) {
			window.location.href = this.config.cancelUrl;
			return;
		}

		// Reset cleanup
		this.state.cleanup = null;

		// Restore focus to previously focused element for accessibility
		if (
			this.previouslyFocusedElement &&
			typeof this.previouslyFocusedElement.focus === 'function'
		) {
			this.previouslyFocusedElement.focus();
			this.previouslyFocusedElement = null;
		}
	}

	/**
	 * Start the onboarding
	 */
	startOnboarding() {
		if ( this.popover ) {
			// Store currently focused element for accessibility
			this.previouslyFocusedElement =
				this.popover.ownerDocument.activeElement;

			// If fullscreen mode, show the wrapper and add body class
			// Don't use popover API in fullscreen mode - it moves to top layer and breaks positioning
			if ( this.isFullscreenMode && this.fullscreenWrapper ) {
				this.fullscreenWrapper.style.display = 'flex';
				document.body.classList.add( 'prpl-onboarding-active' );
				this.popover.classList.add( 'prpl-popover-visible' );
			} else {
				this.popover.showPopover();
			}

			this.updateStepNavigation();
			this.renderStep();

			// Move focus to popover for keyboard accessibility
			// Use setTimeout to ensure popover is visible before focusing
			setTimeout( () => {
				this.popover.focus();
			}, 0 );
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
	 * Delegates to current step's updateNextButton method
	 */
	updateNextButton() {
		const step = this.tourSteps[ this.state.currentStep ];
		if ( step && typeof step.updateNextButton === 'function' ) {
			step.updateNextButton();
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

			// Note: nextBtn click handler is now set up in renderStep()
			// since the button is part of the step content

			if ( this.closeBtn ) {
				this.closeBtn.addEventListener( 'click', ( e ) => {
					console.log( 'Close button clicked!' );

					// Display quit confirmation if on welcome step (since privacy policy is accepted there)
					if ( this.state.currentStep === 0 ) {
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

		// Get template from DOM
		const template = document.getElementById(
			'prpl-onboarding-quit-confirmation'
		);
		if ( ! template ) {
			console.error( 'Quit confirmation template not found' );
			return;
		}

		this.contentWrapper.innerHTML = template.innerHTML;

		// Add event listeners
		const quitYes = this.contentWrapper.querySelector( '#prpl-quit-yes' );
		const quitNo = this.contentWrapper.querySelector( '#prpl-quit-no' );

		if ( quitYes ) {
			quitYes.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				this.closeTour();
			} );
		}

		if ( quitNo ) {
			quitNo.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				// Restore original content
				this.contentWrapper.innerHTML = originalContent;

				// Re-mount the step
				this.renderStep();
			} );
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
				action: 'progress_planner_onboarding_complete_task',
			} ),
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}
}
