/* global alert, prplDocumentReady */

const prplTogglePageSelectorSettingVisibility = function ( page, value ) {
	const itemRadiosWrapperEl = document.querySelector(
		`.prpl-pages-item-${ page } .radios`
	);

	if ( ! itemRadiosWrapperEl ) {
		return;
	}

	// Show only create button.
	if ( 'no' === value || 'not-applicable' === value ) {
		// Hide <select> wrapper.
		itemRadiosWrapperEl.querySelector(
			'.prpl-select-page'
		).style.visibility = 'hidden';
	}

	// Show only select and edit button.
	if ( 'yes' === value ) {
		// Show <select> wrapper.
		itemRadiosWrapperEl.querySelector(
			'.prpl-select-page'
		).style.visibility = 'visible';
	}
};

prplDocumentReady( function () {
	document
		.querySelectorAll( 'input[type="radio"][data-page]' )
		.forEach( function ( radio ) {
			const page = radio.getAttribute( 'data-page' ),
				value = radio.value;

			if ( radio ) {
				// Show/hide the page selector setting if radio is checked.
				if ( radio.checked ) {
					prplTogglePageSelectorSettingVisibility( page, value );
				}

				// Add listeners for all radio buttons.
				radio.addEventListener( 'change', function () {
					prplTogglePageSelectorSettingVisibility( page, value );
				} );
			}
		} );
} );

/**
 * Handle the form submission.
 */
prplDocumentReady( function () {
	document
		.getElementById( 'prpl-settings-submit' )
		.addEventListener( 'click', function () {
			const formData = new FormData(
				document.getElementById( 'prpl-settings' )
			);
			const data = {
				action: 'prpl_settings_form',
			};
			formData.forEach( function ( value, key ) {
				data[ key ] = value;
			} );
			const request = wp.ajax.post( 'prpl_settings_form', data );
			request.done( function () {
				window.location.reload();
			} );
			request.fail( function ( response ) {
				alert( response.licensingError || response ); // eslint-disable-line no-alert
			} );
		} );
} );
