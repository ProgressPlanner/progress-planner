/**
 * Dashboard Header entry point.
 *
 * Initializes the React-based dashboard header component.
 */

import { createRoot } from '@wordpress/element';
import DashboardHeader from './widgets/DashboardHeader';

/**
 * Initialize the dashboard header.
 */
function init() {
	const container = document.getElementById( 'prpl-dashboard-header-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <DashboardHeader /> );
	}
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
