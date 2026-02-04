/**
 * Dashboard Configuration Utility
 *
 * Centralizes access to window.prplDashboardConfig, window.progressPlannerAdmin,
 * and window.progressPlanner. Provides typed getters for common config values.
 */

/**
 * Get a config value by key with a fallback default.
 * Searches prplDashboardConfig, then progressPlannerAdmin, then progressPlanner.
 *
 * @param {string} key          - The configuration key.
 * @param {*}      defaultValue - Fallback value if key is not found.
 * @return {*} The config value or default.
 */
export function getConfig( key, defaultValue = '' ) {
	return (
		window.prplDashboardConfig?.[ key ] ??
		window.progressPlannerAdmin?.[ key ] ??
		window.progressPlanner?.[ key ] ??
		defaultValue
	);
}

/**
 * Get the branding ID.
 *
 * @return {number} The branding ID.
 */
export function getBrandingId() {
	return getConfig( 'brandingId', 0 );
}

/**
 * Get the AJAX URL.
 *
 * @return {string} The AJAX URL.
 */
export function getAjaxUrl() {
	return getConfig( 'ajaxUrl', '/wp-admin/admin-ajax.php' );
}

/**
 * Get the nonce value.
 *
 * @return {string} The nonce.
 */
export function getNonce() {
	return getConfig( 'nonce', '' );
}
