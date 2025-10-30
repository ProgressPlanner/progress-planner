/* global progressPlanner, progressPlannerAjaxRequest, progressPlannerSaveLicenseKey, prplL10n */
/*
 * Settings
 *
 * A script to handle the settings page.
 *
 * Dependencies: progress-planner/ajax-request, progress-planner/onboard, wp-util, progress-planner/l10n
 */

// Submit the email.
const settingsLicenseForm = document.getElementById(
	'prpl-settings-license-form'
);
if ( !! settingsLicenseForm ) {
	settingsLicenseForm.addEventListener( 'submit', async ( event ) => {
		event.preventDefault();
		const form = new FormData( event.target );
		const data = {};

		// Build the onboarding data object.
		for ( const [ key, value ] of form.entries() ) {
			data[ key ] = value;
		}

		document.getElementById( 'submit-license-key' ).disabled = true;
		document.getElementById( 'submit-license-key' ).innerHTML =
			prplL10n( 'subscribing' );

		try {
			const response = await progressPlannerAjaxRequest( {
				url: progressPlanner.onboardNonceURL,
				data,
			} );

			if ( response.status === 'ok' ) {
				// Add the nonce to our data object.
				data.nonce = response.nonce;

				// Make the request to the API.
				const apiResponse = await progressPlannerAjaxRequest( {
					url: progressPlanner.onboardAPIUrl,
					data,
				} );

				// Make a local request to save the response data.
				await progressPlannerSaveLicenseKey( apiResponse.license_key );

				document.getElementById( 'submit-license-key' ).innerHTML =
					prplL10n( 'subscribed' );

				// Timeout so the license key is saved.
				setTimeout( () => {
					// Reload the page.
					window.location.reload();
				}, 500 );
			}
		} catch ( error ) {
			console.warn( error );
			document.getElementById( 'submit-license-key' ).disabled = false;
			document.getElementById( 'submit-license-key' ).innerHTML =
				prplL10n( 'subscribe' );
		}
	} );
}
