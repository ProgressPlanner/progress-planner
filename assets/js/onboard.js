/* global progressPlanner, progressPlannerAjaxRequest, progressPlannerTriggerScan */
/*
 * Onboard
 *
 * A script to handle the onboarding process.
 *
 * Dependencies: progress-planner-ajax-request, progress-planner-scan-posts
 */

/**
 * Make a request to save the license key.
 *
 * @param {string} licenseKey The license key.
 */
const progressPlannerSaveLicenseKey = ( licenseKey ) => {
	// eslint-disable-next-line no-console
	console.log( 'License key: ' + licenseKey );
	progressPlannerAjaxRequest( {
		url: progressPlanner.ajaxUrl,
		data: {
			action: 'progress_planner_save_onboard_data',
			_ajax_nonce: progressPlanner.nonce,
			key: licenseKey,
		},
	} );
};

/**
 * Make the AJAX request.
 *
 * @param {Object} data The data to send with the request.
 */
const progressPlannerAjaxAPIRequest = ( data ) => {
	progressPlannerAjaxRequest( {
		url: progressPlanner.onboardAPIUrl,
		data,
		successAction: ( response ) => {
			// Show success message.
			document.getElementById(
				'no-license' === response.license_key
					? 'prpl-account-not-created-message'
					: 'prpl-account-created-message'
			).style.display = 'block';

			// Hide the form.
			document.getElementById( 'prpl-onboarding-form' ).style.display =
				'none';

			// Make a local request to save the response data.
			progressPlannerSaveLicenseKey( response.license_key );

			// Start scanning posts.
			progressPlannerTriggerScan();

			// Start the tasks.
			progressPlannerOnboardTasks();
		},
		failAction: ( response ) => {
			// eslint-disable-next-line no-console
			console.warn( response );
		},
	} );
};

/**
 * Make the AJAX request.
 *
 * Make a request to get the nonce.
 * Once the nonce is received, make a request to the API.
 *
 * @param {Object} data The data to send with the request.
 */
const progressPlannerOnboardCall = ( data ) => {
	progressPlannerAjaxRequest( {
		url: progressPlanner.onboardNonceURL,
		data,
		successAction: ( response ) => {
			if ( 'ok' === response.status ) {
				// Add the nonce to our data object.
				data.nonce = response.nonce;

				// Make the request to the API.
				progressPlannerAjaxAPIRequest( data );
			}
		},
	} );
};

if ( document.getElementById( 'prpl-onboarding-form' ) ) {
	document
		.querySelectorAll( 'input[name="with-email"]' )
		.forEach( ( input ) => {
			input.addEventListener( 'change', function () {
				if ( 'no' === this.value ) {
					document
						.getElementById( 'prpl-onboarding-form' )
						.querySelectorAll( 'input' )
						.forEach( ( inputField ) => {
							inputField.required = false;
						} );
				} else {
					document
						.getElementById( 'prpl-onboarding-form' )
						.querySelectorAll( 'input' )
						.forEach( ( inputField ) => {
							if (
								'name' === inputField.name ||
								'email' === inputField.name
							) {
								inputField.required = true;
							}
						} );
				}
				document
					.getElementById( 'prpl-onboarding-form' )
					.querySelectorAll(
						'.prpl-form-fields, .prpl-form-fields, .prpl-button-primary, .prpl-button-secondary--no-email'
					)
					.forEach( ( el ) => el.classList.toggle( 'prpl-hidden' ) );
			} );
		} );

	document
		.querySelector( '#prpl-onboarding-form input[name="privacy-policy"]' )
		.addEventListener( 'change', function () {
			const privacyPolicyAccepted = !! this.checked;

			if ( privacyPolicyAccepted ) {
				document
					.getElementById( 'prpl-onboarding-submit-wrapper' )
					.classList.remove( 'prpl-disabled' );
			} else {
				document
					.getElementById( 'prpl-onboarding-submit-wrapper' )
					.classList.add( 'prpl-disabled' );
			}
		} );

	document
		.getElementById( 'prpl-onboarding-form' )
		.addEventListener( 'submit', function ( event ) {
			event.preventDefault();

			const privacyPolicyAccepted = !! document.querySelector(
				'#prpl-onboarding-form input[name="privacy-policy"]'
			).checked;

			// Make sure the user accepted the privacy policy.
			if ( ! privacyPolicyAccepted ) {
				return;
			}

			document.querySelector(
				'#prpl-onboarding-form input[type="submit"]'
			).disabled = true;

			// Get all form data.
			const data = Object.fromEntries( new FormData( event.target ) );

			// If the user doesn't want to use email, remove the email and name.
			if ( 'no' === data.with_email ) {
				data.email = '';
				data.name = '';
			}

			progressPlannerOnboardCall( data );
		} );
}

async function progressPlannerOnboardTasks() {
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
	onBoardRedirect( 'onboardTasks' );
}

/**
 * Redirect user to the stats page after onboarding.
 * We redirect if both post scanning and onboarding tasks are finished.
 *
 * @param {string} context The context of the redirect.
 */
function onBoardRedirect( context = '' ) {
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

	// If context is scanPosts and for some reason the onboarding tasks element is not found (or other way around), redirect.
	if (
		( 'scanPosts' === context && ! onboardingTasksElement ) ||
		( context === 'onboardTasks' && ! scanProgressElement )
	) {
		window.location.href = redirectUrl + '&content-scan-finished=true';
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
			if (
				onboardingTasksElement.querySelectorAll(
					'.prpl-onboarding-task-completed'
				).length > 0
			) {
				window.location.href =
					redirectUrl + '&content-scan-finished=true&delay-tour=true';
			} else {
				window.location.href =
					redirectUrl + '&content-scan-finished=true';
			}
		}
	}
}
