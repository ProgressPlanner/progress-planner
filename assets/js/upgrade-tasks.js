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
 */
// eslint-disable-next-line no-unused-vars
async function prplOnboardTasks() {
	const tasksElement = document.getElementById( 'prpl-onboarding-tasks' );
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
					li.classList.remove( 'prpl-onboarding-task-loading' );
					li.classList.add( classToAdd );

					// Update total points.
					if ( taskCompleted ) {
						const totalPointsElement = document.querySelector(
							'#prpl-onboarding-tasks .prpl-onboarding-tasks-total-points'
						);
						const totalPoints = parseInt(
							totalPointsElement.textContent
						);
						const taskPoints = parseInt(
							li.querySelector( '.prpl-suggested-task-points' )
								.textContent
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
	await new Promise( ( resolve ) => setTimeout( resolve, timeToWait ) );

	// Set the data-onboarding-finished attribute.
	tasksElement.setAttribute( 'data-onboarding-finished', 'true' );

	// Redirect if scanning is finished.
	prplOnboardRedirect( 'onboardTasks' );
}

/**
 * Redirect user to the stats page after onboarding or plugin upgrade.
 * On onboard screen we redirect only if both post scanning and onboarding tasks are finished.
 *
 * @param {string} context The context of the redirect.
 */
const prplOnboardRedirect = ( context = '' ) => {
	const scanProgressElement = document.getElementById(
		'progress-planner-scan-progress'
	);
	const onboardingTasksElement = document.getElementById(
		'prpl-onboarding-tasks'
	);

	const redirectUrl = window.location.href
		.replace( '&content-scan-finished=true', '' )
		.replace( '&content-scan', '' )
		.replace( '&delay-tour=true', '' );

	// If context is scanPosts and for some reason the onboarding tasks element is not found, redirect.
	if ( 'scanPosts' === context && ! onboardingTasksElement ) {
		window.location.href = redirectUrl + '&content-scan-finished=true';
	}

	// If context is onboardTasks and for some reason the scanning progress element is not found (ie on plugin upgrade), redirect.
	if ( context === 'onboardTasks' && ! scanProgressElement ) {
		// If plugin is upgraded, we dont show the tour.
		window.location.href = document.getElementById(
			'prpl-popover-upgrade-tasks'
		)
			? redirectUrl
			: redirectUrl + '&content-scan-finished=true';
	}

	// Both elements are found, check if both are completed.
	if ( onboardingTasksElement && scanProgressElement ) {
		if (
			'true' ===
				onboardingTasksElement.getAttribute(
					'data-onboarding-finished'
				) &&
			'true' ===
				scanProgressElement.getAttribute( 'data-onboarding-finished' )
		) {
			// Check if there are completed tasks, delay tour so the user can see the celebration.
			const redirectArgs =
				onboardingTasksElement.querySelectorAll(
					'.prpl-onboarding-task-completed'
				).length > 0
					? '&content-scan-finished=true&delay-tour=true'
					: '&content-scan-finished=true';
			window.location.href = redirectUrl + redirectArgs;
		}
	}
};

// Trigger the onboarding tasks popover if it is in the DOM.
prplDocumentReady( function () {
	const popover = document.getElementById( 'prpl-popover-upgrade-tasks' );
	if ( popover ) {
		popover.showPopover();

		prplOnboardTasks();
	}
} );
