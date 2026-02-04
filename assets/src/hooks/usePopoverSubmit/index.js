/**
 * usePopoverSubmit Hook
 *
 * Encapsulates the common loading/error/submit pattern used across popovers.
 * Manages isLoading and error state, wraps an async submit function with
 * try-catch-finally, and calls preventDefault on the form event.
 *
 * @param {Function} submitFn - Async function to execute on submit.
 *                            Receives the form event as its argument.
 * @param {Array}    deps     - Dependency array for useCallback.
 * @return {Object} { isLoading, error, handleSubmit }
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function usePopoverSubmit( submitFn, deps = [] ) {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			setIsLoading( true );
			setError( null );

			try {
				await submitFn( e );
			} catch ( err ) {
				setError(
					err.message ||
						__(
							'Something went wrong. Please try again.',
							'progress-planner'
						)
				);
			} finally {
				setIsLoading( false );
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	);

	return { isLoading, error, handleSubmit };
}

export default usePopoverSubmit;
