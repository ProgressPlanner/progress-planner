/**
 * Dashboard Entry Point
 *
 * Single entry point for the entire Progress Planner dashboard.
 * Mounts the Dashboard component to the DOM.
 */

import { createRoot } from '@wordpress/element';
import Dashboard from './components/Dashboard';

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

