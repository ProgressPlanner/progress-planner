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
