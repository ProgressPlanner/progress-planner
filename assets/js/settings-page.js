/* global alert, prplDocumentReady, progressPlannerSettingsPage, progressPlannerAjaxRequest, prplL10n */
/*
 * Settings Page
 *
 * A script to handle the settings page.
 *
 * Dependencies: progress-planner/document-ready, wp-util, progress-planner/ajax-request, progress-planner/l10n
 */
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
	const prplFormSubmit = function ( event ) {
		event.preventDefault();
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
	};
	document
		.getElementById( 'prpl-settings-submit' )
		.addEventListener( 'click', prplFormSubmit );
	document
		.getElementById( 'prpl-settings' )
		.addEventListener( 'submit', prplFormSubmit );
} );

/**
 * API Status Manager
 * Handles the display and state of the API status check
 */
class APIStatusManager {
	/**
	 * @param {string} wrapperSelector - The selector for the status wrapper element
	 */
	constructor( wrapperSelector ) {
		this.wrapper = document.querySelector( wrapperSelector );
	}

	/**
	 * Update the status text content
	 * @param {string} text - The text to display
	 */
	updateStatusText( text ) {
		const textElement = this.wrapper?.querySelector(
			'.prpl-api-status-text'
		);
		if ( textElement ) {
			textElement.textContent = text;
		}
	}

	/**
	 * Update the status classes
	 * @param {string} status - The status class to add ('ok', 'error', 'checking')
	 */
	updateStatusClasses( status ) {
		if ( ! this.wrapper ) {
			return;
		}

		this.wrapper.classList.remove(
			'prpl-api-status-ok',
			'prpl-api-status-error',
			'prpl-api-status-checking'
		);
		this.wrapper.classList.add( `prpl-api-status-${ status }` );
	}

	/**
	 * Handle API response
	 * @param {Object} response - The API response
	 */
	handleResponse( response ) {
		if ( response.status === 'ok' && response.nonce ) {
			this.updateStatusText( prplL10n( 'remoteAPIStatusOk' ) );
			this.updateStatusClasses( 'ok' );
		} else {
			this.updateStatusText(
				response?.message || prplL10n( 'remoteAPIStatusError' )
			);
			this.updateStatusClasses( 'error' );
		}
	}

	/**
	 * Handle API error
	 * @param {Error} error - The error object
	 */
	handleError( error ) {
		this.updateStatusText(
			error?.message || prplL10n( 'remoteAPIStatusError' )
		);
		this.updateStatusClasses( 'error' );
	}

	/**
	 * Check the API status
	 */
	checkStatus() {
		if ( ! this.wrapper ) {
			return;
		}

		this.updateStatusClasses( 'checking' );

		progressPlannerAjaxRequest( {
			url: progressPlannerSettingsPage.onboardNonceURL,
			data: {
				site: progressPlannerSettingsPage.siteUrl,
			},
		} )
			.then( ( response ) => this.handleResponse( response ) )
			.catch( ( error ) => this.handleError( error ) );
	}
}

// Add click handler for API status check button
prplDocumentReady( () => {
	// Initialize the API status manager
	const apiStatusManager = new APIStatusManager(
		'.prpl-api-status-response-wrapper'
	);

	const statusButton = document.getElementById( 'prpl-setting-api-status' );
	if ( statusButton ) {
		statusButton.addEventListener( 'click', () =>
			apiStatusManager.checkStatus()
		);
	}
} );
