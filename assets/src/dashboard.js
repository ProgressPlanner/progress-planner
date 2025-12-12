/**
 * Dashboard Entry Point
 *
 * Single entry point for the entire Progress Planner dashboard.
 * Mounts the Dashboard component to the DOM.
 */

import { createRoot } from '@wordpress/element';
import Dashboard from './components/Dashboard';
import prplSuggestedTask from './utils/prplSuggestedTask';
// Initialize widget registry (sets up hook listener for widget registrations)
import './utils/widgetRegistry';
// Initialize task completion events utility (provides window.prplUpdateRaviGauge)
import './utils/taskCompletionEvents';

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
