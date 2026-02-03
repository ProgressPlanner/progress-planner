/**
 * useLicenseGenerator Hook
 *
 * Handles license key generation during onboarding.
 *
 * @package
 */

import { useState, useCallback } from '@wordpress/element';
import { ajaxRequest } from '../../utils/ajaxRequest';

/**
 * Hook for generating license keys during onboarding.
 *
 * @param {Object} config                 - Configuration object.
 * @param {string} config.onboardNonceURL - URL to get nonce.
 * @param {string} config.onboardAPIUrl   - URL to generate license.
 * @param {string} config.ajaxUrl         - AJAX URL for saving license.
 * @param {string} config.nonce           - Nonce for AJAX requests.
 * @param {string} config.siteUrl         - Site URL.
 * @param {number} config.timezoneOffset  - Timezone offset.
 * @return {Object} License generation functions.
 */
export function useLicenseGenerator( {
	onboardNonceURL,
	onboardAPIUrl,
	ajaxUrl,
	nonce,
	siteUrl,
	timezoneOffset,
} ) {
	const [ isGenerating, setIsGenerating ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Generate and save license key.
	 *
	 * @param {Object} data - Additional data for license generation.
	 * @return {Promise<string>} Promise resolving to license key.
	 */
	const generateLicense = useCallback(
		async ( data = {} ) => {
			setIsGenerating( true );
			setError( null );

			try {
				// Step 1: Get nonce
				const nonceFormData = new FormData();
				nonceFormData.append( 'site', siteUrl );
				const nonceResponse = await fetch( onboardNonceURL, {
					method: 'POST',
					body: nonceFormData,
				} ).then( ( res ) => res.json() );

				if ( nonceResponse.status !== 'ok' ) {
					throw new Error( 'Failed to get nonce' );
				}

				// Step 2: Generate license
				const formData = new FormData();
				formData.append( 'nonce', nonceResponse.nonce );
				formData.append( 'site', siteUrl );
				formData.append( 'timezone_offset', timezoneOffset.toString() );
				Object.entries( data ).forEach( ( [ key, value ] ) => {
					formData.append( key, value );
				} );

				const licenseResponse = await fetch( onboardAPIUrl, {
					method: 'POST',
					body: formData,
				} ).then( ( res ) => res.json() );

				if ( ! licenseResponse.license_key ) {
					throw new Error( 'Failed to generate license' );
				}

				// Step 3: Save license locally
				await ajaxRequest( {
					url: ajaxUrl,
					data: {
						action: 'progress_planner_save_onboard_data',
						_ajax_nonce: nonce,
						key: licenseResponse.license_key,
					},
				} );

				return licenseResponse.license_key;
			} catch ( err ) {
				setError( err.message || 'Failed to generate license' );
				throw err;
			} finally {
				setIsGenerating( false );
			}
		},
		[
			onboardNonceURL,
			onboardAPIUrl,
			ajaxUrl,
			nonce,
			siteUrl,
			timezoneOffset,
		]
	);

	return {
		generateLicense,
		isGenerating,
		error,
	};
}
