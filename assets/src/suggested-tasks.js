/**
 * Suggested Tasks widget entry point.
 *
 * This file initializes the React Suggested Tasks widget component
 * and mounts it to the DOM.
 */

import { createRoot } from '@wordpress/element';
import SuggestedTasks from './widgets/SuggestedTasks';

/**
 * Initialize the Suggested Tasks widget.
 */
function init() {
	const container = document.getElementById( 'prpl-suggested-tasks-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <SuggestedTasks /> );
	}
}

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
