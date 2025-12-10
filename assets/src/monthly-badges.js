/**
 * Monthly Badges Entry Point
 *
 * Mounts the MonthlyBadges React widget to the DOM.
 */

import { createRoot } from '@wordpress/element';
import MonthlyBadges from './widgets/MonthlyBadges';

/**
 * Initialize the Monthly Badges widget.
 */
function init() {
	const container = document.getElementById( 'prpl-monthly-badges-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <MonthlyBadges /> );
	}
}

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
