/**
 * Content Badges Entry Point
 *
 * Mounts the ContentBadges React widget to the DOM.
 */

import { createRoot } from '@wordpress/element';
import ContentBadges from './widgets/ContentBadges';

/**
 * Initialize the Content Badges widget.
 */
function init() {
	const container = document.getElementById( 'prpl-content-badges-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <ContentBadges /> );
	}
}

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
