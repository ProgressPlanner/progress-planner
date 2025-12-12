/**
 * More Tasks step - User completes additional tasks
 * Handles multiple tasks that can be completed in any order
 * Each task may open a sub-popover with its own form
 * Split into 2 substeps: intro screen and task list
 */
/* global OnboardingStep, PrplOnboardTask */

class PrplMoreTasksStep extends OnboardingStep {
	subSteps = [ 'more-tasks-intro', 'more-tasks-tasks' ];

	constructor() {
		super( {
			templateId: 'onboarding-step-more-tasks',
		} );
		this.tasks = [];
		this.currentSubStep = 0;
	}

	/**
	 * Mount the more tasks step
	 * Initializes all tasks and sets up event listeners
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		// Always start from first sub-step
		this.currentSubStep = 0;

		// Hide footer initially (will show on tasks substep)
		this.toggleStepFooter( false );

		// Render the current sub-step
		this.renderSubStep( state );

		// Setup continue button listener
		const continueBtn = this.popover.querySelector(
			'.prpl-more-tasks-continue'
		);
		if ( continueBtn ) {
			continueBtn.addEventListener( 'click', () => {
				this.advanceSubStep( state );
			} );
		}

		// Setup finish onboarding link in intro
		const finishLink = this.popover.querySelector(
			'.prpl-more-tasks-substep[data-substep="intro"] .prpl-finish-onboarding'
		);
		if ( finishLink ) {
			finishLink.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				this.wizard.finishOnboarding();
			} );
		}

		// Initialize task completion tracking
		const moreTasks = this.popover.querySelectorAll(
			'.prpl-task-item[data-task-id]'
		);
		moreTasks.forEach( ( btn ) => {
			if ( ! state.data.moreTasksCompleted ) {
				state.data.moreTasksCompleted = {};
			}
			state.data.moreTasksCompleted[ btn.dataset.taskId ] = false;
		} );

		// Initialize PrplOnboardTask instances for each task, passing wizard reference
		this.tasks = Array.from(
			this.popover.querySelectorAll( '[data-popover="task"]' )
		).map( ( t ) => new PrplOnboardTask( t, this.wizard ) );

		// Listen for task completion events
		const handler = ( e ) => {
			// Update state when a task is completed
			state.data.moreTasksCompleted[ e.detail.id ] = true;

			// Update next button state
			this.updateNextButton();
		};

		this.popover.addEventListener( 'taskCompleted', handler );

		// Return cleanup function
		return () => {
			this.popover.removeEventListener( 'taskCompleted', handler );
			// Clean up task instances
			this.tasks = [];
			// Show footer when leaving this step
			this.toggleStepFooter( true );
		};
	}

	/**
	 * Render the current sub-step
	 * @param {Object} state - Wizard state
	 */
	renderSubStep( state ) {
		const subStepName = this.subSteps[ this.currentSubStep ];

		// Show/hide sub-step containers
		this.subSteps.forEach( ( step ) => {
			const container = this.popover.querySelector(
				`.prpl-more-tasks-substep[data-substep="${ step }"]`
			);
			if ( container ) {
				container.style.display = step === subStepName ? '' : 'none';
			}
		} );

		// Show footer only on tasks substep
		const isTasksSubStep = subStepName === 'more-tasks-tasks';
		this.toggleStepFooter( isTasksSubStep );

		// Update Next button state if on tasks sub-step
		if ( isTasksSubStep ) {
			this.updateNextButton();
		}
	}

	/**
	 * Advance to next sub-step
	 * @param {Object} state - Wizard state
	 */
	advanceSubStep( state ) {
		if ( this.currentSubStep < this.subSteps.length - 1 ) {
			this.currentSubStep++;
			this.renderSubStep( state );
		}
	}

	/**
	 * User can only proceed if on tasks substep
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if can proceed
	 */
	canProceed( state ) {
		// Can only proceed if on tasks substep
		return this.currentSubStep === this.subSteps.length - 1;
	}
}

window.PrplMoreTasksStep = new PrplMoreTasksStep();
