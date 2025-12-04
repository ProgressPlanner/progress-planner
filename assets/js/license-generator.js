/**
 * License Generator - Handles license key generation during onboarding
 * Adapted from onboard.js
 */
/* global progressPlanner */

// eslint-disable-next-line no-unused-vars
class LicenseGenerator {
	/**
	 * Store config for use in other methods.
	 *
	 * @type {Object}
	 */
	static config = null;

	/**
	 * Get the default config from progressPlanner global.
	 *
	 * @return {Object} Default configuration object.
	 */
	static getDefaultConfig() {
		// eslint-disable-next-line no-undef
		if ( typeof progressPlanner !== 'undefined' ) {
			return {
				// eslint-disable-next-line no-undef
				onboardNonceURL: progressPlanner.onboardNonceURL,
				// eslint-disable-next-line no-undef
				onboardAPIUrl: progressPlanner.onboardAPIUrl,
				// eslint-disable-next-line no-undef
				adminAjaxUrl: progressPlanner.ajaxUrl,
				// eslint-disable-next-line no-undef
				nonce: progressPlanner.nonce,
			};
		}
		return {};
	}

	/**
	 * Make a request to save the license key.
	 *
	 * @param {string} licenseKey The license key.
	 * @return {Promise} Promise that resolves when license is saved
	 */
	static saveLicenseKey( licenseKey ) {
		console.log( 'License key: ' + licenseKey );
		return LicenseGenerator.ajaxRequest( {
			url: LicenseGenerator.config.adminAjaxUrl,
			data: {
				action: 'progress_planner_save_onboard_data',
				_ajax_nonce: LicenseGenerator.config.nonce,
				key: licenseKey,
			},
		} );
	}

	/**
	 * Make the AJAX request to the API.
	 *
	 * @param {Object} data The data to send with the request.
	 * @return {Promise} Promise that resolves when request completes
	 */
	static ajaxAPIRequest( data ) {
		return LicenseGenerator.ajaxRequest( {
			url: LicenseGenerator.config.onboardAPIUrl,
			data,
		} )
			.then( ( response ) => {
				// Make a local request to save the response data.
				return LicenseGenerator.saveLicenseKey( response.license_key );
			} )
			.catch( ( error ) => {
				console.warn( error );
				throw error;
			} );
	}

	/**
	 * Make the AJAX request.
	 *
	 * Make a request to get the nonce.
	 * Once the nonce is received, make a request to the API.
	 *
	 * @param {Object} data   The data to send with the request.
	 * @param {Object} config Optional configuration object. Falls back to progressPlanner global.
	 * @return {Promise} Promise that resolves when license is generated
	 */
	static generateLicense( data = {}, config = null ) {
		// Store config for use in other methods, fall back to default if not provided.
		LicenseGenerator.config = config || LicenseGenerator.getDefaultConfig();

		return LicenseGenerator.ajaxRequest( {
			url: LicenseGenerator.config.onboardNonceURL,
			data,
		} ).then( ( response ) => {
			if ( 'ok' === response.status ) {
				// Add the nonce to our data object.
				data.nonce = response.nonce;

				// Make the request to the API.
				return LicenseGenerator.ajaxAPIRequest( data );
			}
			// Handle error response
			const errorMessage =
				response.message ||
				'Failed to get nonce for license generation';
			throw new Error( errorMessage );
		} );
	}

	/**
	 * Helper function to make AJAX requests
	 *
	 * @param {Object} options      Request options
	 * @param {string} options.url  The URL to send the request to
	 * @param {Object} options.data The data to send with the request
	 * @return {Promise} Promise that resolves with response data
	 */
	static ajaxRequest( options ) {
		const { url, data } = options;

		return fetch( url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( data ),
			credentials: 'same-origin',
		} )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw new Error( 'Request failed: ' + response.status );
				}
				return response.json();
			} )
			.catch( ( error ) => {
				console.error( 'AJAX request error:', error );
				throw error;
			} );
	}
}
