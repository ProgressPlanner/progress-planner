/**
 * Todo Widget Entry Point.
 *
 * Initializes the React-based Todo widget.
 */

import { createRoot } from '@wordpress/element';
import TodoWidget from './widgets/TodoWidget';

/**
 * Initialize the Todo widget.
 */
function init() {
	const container = document.getElementById( 'prpl-todo-root' );
	if ( container ) {
		const root = createRoot( container );
		root.render( <TodoWidget /> );
	}
}

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
