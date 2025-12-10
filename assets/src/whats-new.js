/**
 * What's New widget entry point.
 *
 * This file initializes the React What's New widget component
 * and mounts it to the DOM.
 */

import { createRoot } from '@wordpress/element';
import WhatsNew from './widgets/WhatsNew';

/**
 * Initialize the What's New widget.
 */
function init() {
	const container = document.getElementById( 'prpl-whats-new-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <WhatsNew /> );
	}
}

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
