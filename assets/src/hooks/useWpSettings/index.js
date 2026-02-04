/**
 * useWpSettings Hook
 *
 * Wraps useApiData('/wp/v2/settings') and extracts requested keys.
 * All callers share the same cached request via useApiData's built-in caching.
 *
 * @param {Array} keys - Setting keys to extract (e.g. ['description', 'timezone_string']).
 * @return {Object} { settings, isLoading, error } where settings is an object with only the requested keys.
 */

import { useMemo } from '@wordpress/element';
import { useApiData } from '../useApiData';

export function useWpSettings( keys = [] ) {
	const { data, isLoading, error } = useApiData( '/wp/v2/settings' );

	const settings = useMemo( () => {
		if ( ! data ) {
			return {};
		}

		const result = {};
		for ( const key of keys ) {
			result[ key ] = data[ key ] ?? '';
		}
		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ data, ...keys ] );

	return { settings, isLoading, error };
}

export default useWpSettings;
