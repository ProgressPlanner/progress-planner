/**
 * Content Activity Widget Entry Point
 *
 * This is the main entry point for the Content Activity widget React application.
 */

import { createRoot } from '@wordpress/element';
import ContentActivity from './widgets/ContentActivity';

document.addEventListener( 'DOMContentLoaded', () => {
	const container = document.getElementById( 'prpl-content-activity-root' );
	if ( container ) {
		createRoot( container ).render( <ContentActivity /> );
	}
} );
