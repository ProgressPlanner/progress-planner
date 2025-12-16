/**
 * First Task step - User completes their first task
 * Handles task completion and form submission
 */
/* global OnboardingStep, ProgressPlannerTourUtils */
class PrplFirstTaskStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-first-task',
		} );
	}

	/**
	 * Mount the first task step
	 * Sets up event listener for task completion
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		const btn = this.popover.querySelector( '.prpl-complete-task-btn' );
		if ( ! btn ) {
			return () => {};
		}

		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );
			const form = thisBtn.closest( 'form' );
			let formValues = {};

			if ( form ) {
				const formData = new FormData( form );
				formValues = Object.fromEntries( formData.entries() );
			}

			ProgressPlannerTourUtils.completeTask(
				thisBtn.dataset.taskId,
				formValues
			)
				.then( () => {
					thisBtn.classList.add( 'prpl-complete-task-btn-completed' );
					this.updateState( 'firstTaskCompleted', {
						[ thisBtn.dataset.taskId ]: true,
					} );

					// Automatically advance to the next step
					this.nextStep();
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
	 * User can only proceed if they've completed the first task
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if first task is completed
	 */
	canProceed( state ) {
		return !! state.data.firstTaskCompleted;
	}
}

window.PrplFirstTaskStep = new PrplFirstTaskStep();
