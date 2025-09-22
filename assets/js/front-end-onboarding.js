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
	}

	/**
	 * Initialize tour steps configuration
	 */
	initializeTourSteps() {
		return [
			{
				id: 'welcome',
				title: 'Welcome',
				render: () =>
					document.getElementById( 'tour-step-welcome' ).innerHTML,
			},
			{
				id: 'first-task',
				title: 'Complete your first task',
				render: () =>
					document.getElementById( 'tour-step-first-task' ).innerHTML,
				onMount: ( state ) => this.mountFirstTaskStep( state ),
				canProceed: ( state ) => !! state.data.firstTaskCompleted,
			},
			{
				id: 'badges',
				title: 'Our badges are waiting for you',
				render: () =>
					document.getElementById( 'tour-step-badges' ).innerHTML,
			},
			{
				id: 'more-tasks',
				title: 'Complete more tasks',
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
				title: 'Setup complete',
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
		const btn = document.querySelector( '#first-task-btn' );
		if ( ! btn ) return () => {};

		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );
			this.completeTask( thisBtn.dataset.taskId )
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
		state.data.moreTasksCompleted = {};

		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );
			this.completeTask( thisBtn.dataset.taskId )
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

		const btns = document.querySelectorAll( 'button[data-task-id]' );
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
	 */
	async completeTask( taskId ) {
		const response = await fetch( this.config.adminAjaxUrl, {
			method: 'POST',
			body: new URLSearchParams( {
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
		const popover = this.getPopover();

		popover.querySelector( '.tour-title' ).innerHTML = step.title;
		popover.querySelector( '.tour-content' ).innerHTML = step.render();

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
		popover.dataset.prplStep = this.state.currentStep;
		this.updateButtonStates();
		this.updateNextButton();
	}

	/**
	 * Update button visibility states
	 */
	updateButtonStates() {
		const popover = this.getPopover();
		const isFirstStep = this.state.currentStep === 0;
		const isLastStep = this.state.currentStep === this.tourSteps.length - 1;

		// Toggle button visibility
		popover.querySelector( '.prpl-tour-prev' ).style.display =
			isFirstStep || isLastStep ? 'none' : 'inline-block';
		popover.querySelector( '.prpl-tour-next' ).style.display = isLastStep
			? 'none'
			: 'inline-block';
		popover.querySelector( '#prpl-finish-btn' ).style.display = isLastStep
			? 'inline-block'
			: 'none';
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
		const popover = this.getPopover();
		if ( popover ) {
			popover.hidePopover();
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
		const popover = this.getPopover();
		if ( popover ) {
			popover.showPopover();
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
		const popover = this.getPopover();
		const nextBtn = popover.querySelector( '.prpl-tour-next' );

		if ( step.canProceed ) {
			nextBtn.disabled = ! step.canProceed( this.state );
		} else {
			nextBtn.disabled = false;
		}
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
		const popover = this.getPopover();
		if ( popover ) {
			console.log( 'Popover found:', popover );

			popover.addEventListener( 'beforetoggle', ( event ) => {
				if ( event.newState === 'open' ) {
					console.log( 'Tour opened' );
				}
				if ( event.newState === 'closed' ) {
					console.log( 'Tour closed' );
				}
			} );

			const nextBtn = popover.querySelector( '.prpl-tour-next' );
			const prevBtn = popover.querySelector( '.prpl-tour-prev' );
			const finishBtn = popover.querySelector( '#prpl-finish-btn' );

			console.log( 'Next button found:', nextBtn );
			console.log( 'Prev button found:', prevBtn );
			console.log( 'Finish button found:', finishBtn );

			if ( nextBtn ) {
				nextBtn.addEventListener( 'click', () => {
					console.log( 'Next button clicked!' );
					this.nextStep();
				} );
			}

			if ( prevBtn ) {
				prevBtn.addEventListener( 'click', () => {
					console.log( 'Prev button clicked!' );
					this.prevStep();
				} );
			}

			if ( finishBtn ) {
				finishBtn.addEventListener( 'click', () => {
					console.log( 'Finish button clicked!' );
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
			this.updateNextButton()
		);
	}

	/**
	 * Create deep proxy for nested object changes
	 * @param {Object}   target
	 * @param {Function} callback
	 */
	createDeepProxy( target, callback ) {
		return new Proxy( target, {
			// Note: Maybe hook into get here as well, to handle reactivity better.

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
