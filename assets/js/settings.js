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
	settingsLicenseForm.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		const form = new FormData( this );
		const data = {};

		// Build the onboarding data object.
		for ( const [ key, value ] of form.entries() ) {
			data[ key ] = value;
		}

		progressPlannerAjaxRequest( {
			url: progressPlanner.onboardNonceURL,
			data,
		} )
			.then( ( response ) => {
				if ( 'ok' === response.status ) {
					// Add the nonce to our data object.
					data.nonce = response.nonce;

					// Make the request to the API.
					progressPlannerAjaxRequest( {
						url: progressPlanner.onboardAPIUrl,
						data,
					} )
						.then( ( apiResponse ) => {
							// Make a local request to save the response data.
							progressPlannerSaveLicenseKey(
								apiResponse.license_key
							);

							document.getElementById(
								'submit-license-key'
							).innerHTML = prplL10n( 'subscribed' );

							// Timeout so the license key is saved.
							setTimeout( () => {
								// Reload the page.
								window.location.reload();
							}, 500 );
						} )
						.catch( ( error ) => {
							console.warn( error );
						} );
				}
			} )
			.catch( ( error ) => {
				console.warn( error );
			} );

		document.getElementById( 'submit-license-key' ).disabled = true;
		document.getElementById( 'submit-license-key' ).innerHTML =
			prplL10n( 'subscribing' );
	} );
}
