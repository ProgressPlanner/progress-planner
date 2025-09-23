/**
 * Progress Planner Tour
 * Handles the front-end onboarding tour functionality
 */
// eslint-disable-next-line no-unused-vars
class ProgressPlannerTour {
	constructor( config ) {
		this.popoverId = 'prpl-popover-front-end-onboarding';
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

		this.tourSteps = this.initializeTourSteps();
		this.setupStateProxy();

		// Set DOM related properties.
		this.popover = document.getElementById( this.popoverId );
		this.contentWrapper = this.popover.querySelector(
			'.tour-content-wrapper'
		);
		this.prevBtn = this.popover.querySelector( '.prpl-tour-prev' );
		this.nextBtn = this.popover.querySelector( '.prpl-tour-next' );
		this.finishBtn = this.popover.querySelector( '#prpl-finish-btn' );

		// Setup event listeners after DOM is ready
		this.setupEventListeners();
	}

	/**
	 * Initialize tour steps configuration
	 */
	initializeTourSteps() {
		return [
			{
				id: 'welcome',
				render: () =>
					document.getElementById( 'tour-step-welcome' ).innerHTML,
			},
			{
				id: 'first-task',
				render: () =>
					document.getElementById( 'tour-step-first-task' ).innerHTML,
				onMount: ( state ) => this.mountFirstTaskStep( state ),
				canProceed: ( state ) => !! state.data.firstTaskCompleted,
			},
			{
				id: 'badges',
				render: () =>
					document.getElementById( 'tour-step-badges' ).innerHTML,
			},
			{
				id: 'more-tasks',
				render: () =>
					document.getElementById( 'tour-step-more-tasks' ).innerHTML,
				onMount: ( state ) => this.mountMoreTasksStep( state ),
				canProceed: ( state ) => {
					return (
						Object.keys( state.data.moreTasksCompleted ).length >
							0 &&
						Object.values( state.data.moreTasksCompleted ).every(
							Boolean
						)
					);
				},
			},
			{
				id: 'finish',
				render: () =>
					document.getElementById( 'tour-step-finish' ).innerHTML,
			},
		];
	}

	/**
	 * Mount first task step
	 * @param {Object} state
	 */
	mountFirstTaskStep( state ) {
		const btn = this.popover.querySelector( '#first-task-btn' );
		if ( ! btn ) return () => {};

		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );

			const form = thisBtn.closest( 'form' ); // find parent form
			let formValues = {};

			if ( form ) {
				const formData = new FormData( form );

				// Convert to plain object
				formValues = Object.fromEntries( formData.entries() );
			}

			this.completeTask( thisBtn.dataset.taskId, formValues )
				.then( () => {
					thisBtn.classList.add( 'prpl-complete-task-btn-completed' );
					state.data.firstTaskCompleted = {
						[ thisBtn.dataset.taskId ]: true,
					};
				} )
				.catch( ( error ) => {
					console.error( error );
					thisBtn.classList.add( 'prpl-complete-task-btn-error' );
				} );
		};

		btn.addEventListener( 'click', handler );
		return () => btn.removeEventListener( 'click', handler );
	}

	/**
	 * Mount more tasks step
	 * @param {Object} state
	 */
	mountMoreTasksStep( state ) {
		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );

			const form = thisBtn.closest( 'form' ); // find parent form
			let formValues = {};

			if ( form ) {
				const formData = new FormData( form );

				// Convert to plain object
				formValues = Object.fromEntries( formData.entries() );
			}

			this.completeTask( thisBtn.dataset.taskId, formValues )
				.then( () => {
					thisBtn.classList.add( 'prpl-complete-task-btn-completed' );
					state.data.moreTasksCompleted[
						thisBtn.dataset.taskId
					] = true;
				} )
				.catch( ( error ) => {
					console.error( error );
					thisBtn.classList.add( 'prpl-complete-task-btn-error' );
				} );
		};

		const btns = this.popover.querySelectorAll( 'button[data-task-id]' );
		btns.forEach( ( btn ) => {
			btn.addEventListener( 'click', handler );
			state.data.moreTasksCompleted[ btn.dataset.taskId ] = false;
		} );

		return () => {
			btns.forEach( ( btn ) =>
				btn.removeEventListener( 'click', handler )
			);
		};
	}

	/**
	 * Complete a task via AJAX
	 * @param {string} taskId
	 * @param {Object} formValues
	 */
	async completeTask( taskId, formValues = {} ) {
		const response = await fetch( this.config.adminAjaxUrl, {
			method: 'POST',
			body: new URLSearchParams( {
				form_values: JSON.stringify( formValues ),
				task_id: taskId,
				nonce: this.config.nonceProgressPlanner,
				action: 'progress_planner_tour_complete_task',
			} ),
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}

	/**
	 * Render current step
	 */
	renderStep() {
		const step = this.tourSteps[ this.state.currentStep ];

		this.popover.querySelector( '.tour-content-wrapper' ).innerHTML =
			step.render();

		// Cleanup previous step
		if ( this.state.cleanup ) {
			this.state.cleanup();
		}

		// Mount current step
		if ( typeof step.onMount === 'function' ) {
			this.state.cleanup = step.onMount( this.state );
		} else {
			this.state.cleanup = () => {};
		}

		// Update step indicator
		this.popover.dataset.prplStep = this.state.currentStep;
		this.updateButtonStates();
		this.updateNextButton();
	}

	/**
	 * Update button visibility states
	 */
	updateButtonStates() {
		const isFirstStep = this.state.currentStep === 0;
		const isLastStep = this.state.currentStep === this.tourSteps.length - 1;

		// Toggle button visibility
		this.prevBtn.style.display =
			isFirstStep || isLastStep ? 'none' : 'inline-block';
		this.nextBtn.style.display = isLastStep ? 'none' : 'inline-block';
		this.finishBtn.style.display = isLastStep ? 'inline-block' : 'none';
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

		if ( step.canProceed && ! step.canProceed( this.state ) ) {
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

		if ( step.canProceed ) {
			this.nextBtn.disabled = ! step.canProceed( this.state );
		} else {
			this.nextBtn.disabled = false;
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
		return document.getElementById( this.popoverId );
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

			if ( this.prevBtn ) {
				this.prevBtn.addEventListener( 'click', () => {
					console.log( 'Prev button clicked!' );
					this.prevStep();
				} );
			}

			if ( this.finishBtn ) {
				this.finishBtn.addEventListener( 'click', () => {
					console.log( 'Finish button clicked!' );
					this.state.data.finished = true;
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
