/**
 * A helper to make AJAX requests using the modern Fetch API.
 *
 * @param {Object} params      The callback parameters.
 * @param {string} params.url  The URL to send the request to.
 * @param {Object} params.data The data to send with the request.
 * @return {Promise} A promise that resolves with the response data.
 */
// eslint-disable-next-line no-unused-vars
const progressPlannerAjaxRequest = async ( { url, data } ) => {
	const formData = new FormData();

	for ( const [ key, value ] of Object.entries( data ) ) {
		formData.append( key, value );
	}

	try {
		const response = await fetch( url, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin', // Important for WordPress nonces
		} );

		if ( ! response.ok ) {
			throw new Error( `HTTP error! status: ${ response.status }` );
		}

		return await response.json();
	} catch ( error ) {
		console.warn( error );
		throw error;
	}
};
