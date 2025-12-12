/**
 * Hook to read CSS custom properties (CSS variables).
 *
 * @param {string} name     - CSS variable name (e.g., '--prpl-padding').
 * @param {string} fallback - Fallback value if variable is not found.
 * @return {string} The CSS variable value or fallback.
 */
export function useCSSVariable( name, fallback = '' ) {
	// For inline styles, we can't use CSS variables directly.
	// This hook reads the computed value from the document root.
	if ( typeof window === 'undefined' || ! document.documentElement ) {
		return fallback;
	}

	const value = window
		.getComputedStyle( document.documentElement )
		.getPropertyValue( name )
		.trim();

	return value || fallback;
}

/**
 * Get multiple CSS variables at once.
 * Note: This is not a React hook, but a utility function.
 *
 * @param {Object} variables - Object mapping variable names to fallback values.
 * @return {Object} Object with same keys but CSS variable values.
 */
export function useCSSVariables( variables ) {
	const result = {};
	// useCSSVariable is not actually a React hook (doesn't use hooks), but ESLint sees the "use" prefix
	for ( const [ name, fallback ] of Object.entries( variables ) ) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		result[ name ] = useCSSVariable( name, fallback );
	}
	return result;
}
