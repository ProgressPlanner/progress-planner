/**
 * Dashboard Entry Point
 *
 * Single entry point for the entire Progress Planner dashboard.
 * Mounts the Dashboard component to the DOM.
 */

// Clear stale WP API schema cache from sessionStorage.
// Must run synchronously before any apiFetch calls.
if ( 'sessionStorage' in window ) {
	try {
		for ( const key in window.sessionStorage ) {
			if (
				key.indexOf( 'wp-api-schema-model' ) > -1 &&
				window.sessionStorage
					.getItem( key )
					.indexOf( '/wp/v2/prpl_recommendations' ) === -1
			) {
				window.sessionStorage.removeItem( key );
				break;
			}
		}
	} catch ( e ) {} // eslint-disable-line no-empty
}

import apiFetch from '@wordpress/api-fetch';
import { createRoot } from '@wordpress/element';
import Dashboard from './components/Dashboard';
import prplSuggestedTask from './utils/prplSuggestedTask';
import { createPreloadingMiddleware } from './services/preloadingMiddleware';

// Register preloading middleware BEFORE any API calls are made.
// This intercepts apiFetch calls and returns preloaded data instantly.
if ( window.prplPreloadedData ) {
	apiFetch.use( createPreloadingMiddleware( window.prplPreloadedData ) );
}
// Initialize widget registry (sets up hook listener for widget registrations)
import './utils/widgetRegistry';

// Attach to window immediately so inline onclick handlers can access it.
// This must be done before React renders to ensure it's available when
// PHP-generated HTML with inline handlers is parsed.
window.prplSuggestedTask = prplSuggestedTask;

/**
 * Initialize the dashboard.
 */
function init() {
	const container = document.getElementById( 'prpl-dashboard-root' );
	if ( container ) {
		const root = createRoot( container );
		const config = window.prplDashboardConfig || {};
		root.render( <Dashboard config={ config } /> );
	}
}

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
