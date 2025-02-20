/* global XMLHttpRequest */

/**
 * A helper to make AJAX requests.
 *
 * @param {Object}   params               The callback parameters.
 * @param {string}   params.url           The URL to send the request to.
 * @param {Object}   params.data          The data to send with the request.
 * @param {Function} params.successAction The callback to run on success.
 * @param {Function} params.failAction    The callback to run on failure.
 */
// eslint-disable-next-line no-unused-vars
const progressPlannerAjaxRequest = ( {
	url,
	data,
	successAction,
	failAction,
} ) => {
	const http = new XMLHttpRequest();
	http.open( 'POST', url, true );
	http.onreadystatechange = () => {
		const defaultCallback = ( response ) => {
			// eslint-disable-next-line no-console
			console.info( response );
		};

		let response;
		try {
			response = JSON.parse( http.response );
		} catch ( e ) {
			if ( http.readyState === 4 && http.status !== 200 ) {
				// eslint-disable-next-line no-console
				console.warn( http, e );
				return http.response;
			}
		}

		if ( http.readyState === 4 ) {
			if ( http.status === 200 ) {
				return successAction
					? successAction( response )
					: defaultCallback( response );
			}

			// Request is completed, but the status is not 200.
			return failAction
				? failAction( response )
				: defaultCallback( response );
		}
	};

	const dataForm = new FormData();

	// eslint-disable-next-line prefer-const
	for ( let [ key, value ] of Object.entries( data ) ) {
		dataForm.append( key, value );
	}

	http.send( dataForm );
};
