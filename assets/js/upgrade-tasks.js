/* global prplDocumentReady */
/*
 * Onboard tasks
 *
 * A script to process the onboarding task checklist.
 *
 * Dependencies: progress-planner-document-ready
 */

/**
 * Process the onboarding task checklist.
 *
 * @return {Promise} The promise of the tasks.
 */
async function prplOnboardTasks() {
	return new Promise( ( resolve, reject ) => {
		( async () => {
			const tasksElement = document.getElementById(
				'prpl-onboarding-tasks'
			);
			const timeToWait = 2000;

			if ( ! tasksElement ) {
				return;
			}

			// Display the tasks.
			tasksElement.style.display = 'block';

			const listItems = tasksElement.querySelectorAll( 'li' );

			// Create an array of Promises
			const tasks = Array.from( listItems ).map( ( li, index ) => {
				return new Promise( ( resolve ) => {
					li.classList.add( 'prpl-onboarding-task-loading' );

					setTimeout(
						() => {
							const taskCompleted =
								'true' === li.dataset.prplTaskCompleted;
							const classToAdd = taskCompleted
								? 'prpl-onboarding-task-completed'
								: 'prpl-onboarding-task-not-completed';
							li.classList.remove(
								'prpl-onboarding-task-loading'
							);
							li.classList.add( classToAdd );

							// Update total points.
							if ( taskCompleted ) {
								const totalPointsElement =
									document.querySelector(
										'#prpl-onboarding-tasks .prpl-onboarding-tasks-total-points'
									);
								const totalPoints = parseInt(
									totalPointsElement.textContent
								);
								const taskPoints = parseInt(
									li.querySelector(
										'.prpl-suggested-task-points'
									).textContent
								);
								totalPointsElement.textContent =
									totalPoints + taskPoints + 'pt';
							}

							resolve(); // Mark this task as complete.
						},
						( index + 1 ) * timeToWait
					);
				} );
			} );

			// Wait for all tasks to complete.
			await Promise.all( tasks );

			// We add a small delay to make sure the user sees if the last task is completed and total points.
			await new Promise( ( resolve ) =>
				setTimeout( resolve, timeToWait )
			);

			// Resolve the promise.
			resolve();
		} )();
	} );
}

/**
 * Redirect user to the stats page after onboarding or plugin upgrade.
 */
const prplOnboardRedirect = () => {
	const onboardingTasksElement = document.getElementById(
		'prpl-onboarding-tasks'
	);

	let redirectUrl = window.location.href
		.replace( '&content-scan-finished=true', '' )
		.replace( '&content-scan', '' )
		.replace( '&delay-tour=true', '' );

	// If plugin is upgraded, we dont show the tour.
	if ( document.getElementById( 'prpl-popover-upgrade-tasks' ) ) {
		window.location.href = redirectUrl;
	} else {
		// We show the tour.
		redirectUrl = redirectUrl + '&content-scan-finished=true';

		// Check if there are completed tasks, delay tour so the user can see the celebration.
		if (
			onboardingTasksElement.querySelectorAll(
				'.prpl-onboarding-task-completed'
			).length > 0
		) {
			redirectUrl + '&delay-tour=true';
		}

		window.location.href = redirectUrl;
	}
};

// Trigger the onboarding tasks popover if it is in the DOM.
prplDocumentReady( function () {
	const popover = document.getElementById( 'prpl-popover-upgrade-tasks' );
	if ( popover ) {
		popover.showPopover();

		prplOnboardTasks().then( () => {
			prplOnboardRedirect();
		} );
	}
} );
