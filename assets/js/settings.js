/* global prplL10n, LicenseGenerator */
/*
 * Settings
 *
 * A script to handle the settings page.
 *
 * Dependencies: progress-planner/l10n, progress-planner/license-generator
 */

// Submit the email.
const settingsLicenseForm = document.getElementById(
	'prpl-settings-license-form'
);
if ( !! settingsLicenseForm ) {
	settingsLicenseForm.addEventListener( 'submit', function ( event ) {
		event.preventDefault();
		const form = new FormData( this );
		const data = {};

		// Build the onboarding data object.
		for ( const [ key, value ] of form.entries() ) {
			data[ key ] = value;
		}

		document.getElementById( 'submit-license-key' ).disabled = true;
		document.getElementById( 'submit-license-key' ).innerHTML =
			prplL10n( 'subscribing' );

		LicenseGenerator.generateLicense( data )
			.then( () => {
				document.getElementById( 'submit-license-key' ).innerHTML =
					prplL10n( 'subscribed' );

				// Timeout so the license key is saved.
				setTimeout( () => {
					// Reload the page.
					window.location.reload();
				}, 500 );
			} )
			.catch( ( error ) => {
				console.warn( error );
			} );
	} );
}
