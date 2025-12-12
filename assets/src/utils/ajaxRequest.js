/**
 * AJAX Request Utility
 *
 * Standalone utility function for making AJAX requests using FormData.
 * This is a modern replacement for progressPlannerAjaxRequest that uses the fetch API
 * instead of XMLHttpRequest. Can be used in both React and non-React contexts.
 *
 * @example
 * ```js
 * import { ajaxRequest } from '../utils/ajaxRequest';
 *
 * // In a React component or vanilla JS
 * const response = await ajaxRequest({
 *   url: '/wp-admin/admin-ajax.php',
 *   data: {
 *     action: 'my_action',
 *     nonce: '...',
 *     // ... other data
 *   }
 * });
 * ```
 *
 * @example
 * ```js
 * // Migration from progressPlannerAjaxRequest
 * // Before:
 * progressPlannerAjaxRequest({ url, data })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 *
 * // After:
 * import { ajaxRequest } from './utils/ajaxRequest';
 * ajaxRequest({ url, data })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * ```
 */

/**
 * Make an AJAX request using FormData.
 *
 * This function provides the same API as progressPlannerAjaxRequest but uses
 * the modern fetch API instead of XMLHttpRequest. It's designed to work with
 * WordPress admin-ajax.php endpoints that require FormData.
 *
 * @param {Object}   params      Request parameters.
 * @param {string}   params.url  The URL to send the request to.
 * @param {Object}   params.data The data to send with the request.
 * @return {Promise<Object>} Promise resolving to the parsed JSON response.
 * @throws {Error} Rejects with the response object if status is not 200.
 *
 * @example
 * ```js
 * try {
 *   const response = await ajaxRequest({
 *     url: progressPlanner.ajaxUrl,
 *     data: {
 *       action: 'progress_planner_save_onboard_data',
 *       _ajax_nonce: progressPlanner.nonce,
 *       key: licenseKey,
 *     },
 *   });
 *   console.log('Success:', response);
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 * ```
 */
export async function ajaxRequest( { url, data } ) {
	// Create FormData from the data object.
	const formData = new FormData();
	for ( const [ key, value ] of Object.entries( data ) ) {
		formData.append( key, value );
	}

	// Make the request using fetch API.
	const response = await fetch( url, {
		method: 'POST',
		body: formData,
		credentials: 'same-origin',
	} );

	// Parse JSON response.
	// Read as text first so we can use it for error messages if parsing fails.
	const responseText = await response.text();
	let parsedResponse;
	try {
		parsedResponse = JSON.parse( responseText );
	} catch ( parseError ) {
		// If JSON parsing fails and status is not 200, log warning.
		if ( ! response.ok ) {
			console.warn( 'Failed to parse response:', response, parseError );
			// Throw error with raw response text for non-200 status.
			throw new Error( responseText || 'Request failed' );
		}
		// If status is 200 but JSON parsing fails, rethrow.
		throw parseError;
	}

	// Check if response is successful.
	if ( response.ok ) {
		return parsedResponse;
	}

	// Request completed but status is not 200.
	// Reject with the parsed response (matching original behavior).
	throw parsedResponse;
}

