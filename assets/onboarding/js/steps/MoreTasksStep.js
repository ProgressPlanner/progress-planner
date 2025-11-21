/**
 * More Tasks step - User completes additional tasks
 * Handles multiple tasks that can be completed in any order
 * Each task may open a sub-popover with its own form
 */
/* global OnboardingStep, PopoverTask */

class PrplMoreTasksStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-more-tasks',
		} );
		this.tasks = [];
	}

	/**
	 * Mount the more tasks step
	 * Initializes all tasks and sets up event listeners
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
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

		// Initialize PopoverTask instances for each task
		this.tasks = Array.from(
			this.popover.querySelectorAll( '[data-popover="task"]' )
		).map( ( t ) => new PopoverTask( t ) );

		// Listen for task completion events
		const handler = ( e ) => {
			// Update state when a task is completed
			state.data.moreTasksCompleted[ e.detail.id ] = true;

			// Check if all tasks are completed
			this.wizard.updateNextButton();
		};

		this.popover.addEventListener( 'taskCompleted', handler );

		// Return cleanup function
		return () => {
			this.popover.removeEventListener( 'taskCompleted', handler );
			// Clean up task instances
			this.tasks = [];
		};
	}

	/**
	 * User can only proceed if all tasks are completed
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if all tasks are completed
	 */
	canProceed( state ) {
		if ( ! state.data.moreTasksCompleted ) {
			return false;
		}

		const completedTasks = Object.keys( state.data.moreTasksCompleted );
		if ( completedTasks.length === 0 ) {
			return false;
		}

		// Check if all tasks are completed
		return Object.values( state.data.moreTasksCompleted ).every( Boolean );
	}
}

window.PrplMoreTasksStep = new PrplMoreTasksStep();
