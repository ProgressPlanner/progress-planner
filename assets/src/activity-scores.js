/**
 * Activity Scores Entry Point
 *
 * Mounts the ActivityScores React widget to the DOM.
 */

import { createRoot } from '@wordpress/element';
import ActivityScores from './widgets/ActivityScores';

/**
 * Initialize the Activity Scores widget.
 */
function init() {
	const container = document.getElementById( 'prpl-activity-scores-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <ActivityScores /> );
	}
}

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
