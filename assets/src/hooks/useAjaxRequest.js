/**
 * useAjaxRequest Hook
 *
 * React hook for making AJAX requests using FormData (for WordPress admin-ajax.php endpoints).
 * This is a React-friendly replacement for progressPlannerAjaxRequest.
 *
 * @example
 * ```jsx
 * import { useAjaxRequest } from '../hooks/useAjaxRequest';
 *
 * function MyComponent() {
 *   const { request, loading, error } = useAjaxRequest();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       const response = await request({
 *         url: '/wp-admin/admin-ajax.php',
 *         data: {
 *           action: 'my_action',
 *           nonce: '...',
 *           // ... other data
 *         }
 *       });
 *       console.log('Success:', response);
 *     } catch (err) {
 *       console.error('Error:', err);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleSubmit} disabled={loading}>
 *       {loading ? 'Loading...' : 'Submit'}
 *     </button>
 *   );
 * }
 * ```
 */

import { useState, useCallback } from '@wordpress/element';

/**
 * Custom hook for making AJAX requests with FormData.
 *
 * This hook provides a React-friendly interface for making POST requests
 * to WordPress admin-ajax.php endpoints or other endpoints that require FormData.
 *
 * @return {Object} Hook return value.
 * @return {Function} return.request - Function to make the AJAX request.
 * @return {boolean} return.loading - Whether a request is currently in progress.
 * @return {Error|null} return.error - Error object if the last request failed, null otherwise.
 *
 * @example
 * ```jsx
 * const { request, loading, error } = useAjaxRequest();
 *
 * const handleClick = async () => {
 *   const response = await request({
 *     url: progressPlanner.ajaxUrl,
 *     data: { action: 'my_action', nonce: progressPlanner.nonce }
 *   });
 * };
 * ```
 */
export function useAjaxRequest() {
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Make an AJAX request using FormData.
	 *
	 * @param {Object}   params      Request parameters.
	 * @param {string}   params.url  The URL to send the request to.
	 * @param {Object}   params.data The data to send with the request.
	 * @return {Promise<Object>} Promise resolving to the parsed JSON response.
	 * @throws {Error} Rejects with the response object if status is not 200.
	 */
	const request = useCallback( async ( { url, data } ) => {
		setLoading( true );
		setError( null );

		try {
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
				setLoading( false );
				return parsedResponse;
			}

			// Request completed but status is not 200.
			setLoading( false );
			setError( parsedResponse );
			throw parsedResponse;
		} catch ( err ) {
			setLoading( false );
			setError( err );
			throw err;
		}
	}, [] );

	return { request, loading, error };
}

