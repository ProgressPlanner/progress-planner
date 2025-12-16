/**
 * useApiData Hook
 *
 * Shared hook for fetching data from the REST API with loading/error states.
 */

import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook for fetching data from REST API.
 *
 * @param {string}        path         - The API endpoint path.
 * @param {Array}         dependencies - Optional dependencies array for useEffect.
 * @param {string|Object} errorMessage - Default error message or object with message property.
 * @return {Object} Object containing isLoading, error, and data states.
 */
export function useApiData(
	path,
	dependencies = [],
	errorMessage = 'Failed to load data'
) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ data, setData ] = useState( null );

	useEffect( () => {
		// Skip fetch if path is empty
		if ( ! path ) {
			setIsLoading( false );
			return;
		}

		const fetchData = async () => {
			setIsLoading( true );
			setError( null );

			try {
				const response = await apiFetch( { path } );
				setData( response );
			} catch ( err ) {
				const message =
					err.message ||
					( typeof errorMessage === 'string'
						? errorMessage
						: errorMessage.message || 'Failed to load data' );
				setError( message );
			} finally {
				setIsLoading( false );
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ path, ...dependencies ] );

	return { isLoading, error, data };
}

export default useApiData;
