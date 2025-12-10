/**
 * Streak Badges Entry Point
 *
 * Mounts the StreakBadges React widget to the DOM.
 */

import { createRoot } from '@wordpress/element';
import StreakBadges from './widgets/StreakBadges';

/**
 * Initialize the Streak Badges widget.
 */
function init() {
	const container = document.getElementById( 'prpl-streak-badges-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <StreakBadges /> );
	}
}

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
