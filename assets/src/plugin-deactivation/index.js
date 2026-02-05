/**
 * Plugin Deactivation Entry Point
 *
 * Mounts the deactivation feedback modal on the plugins page.
 * Intercepts the WP deactivate link click to show the modal.
 */

import { createRoot, useState, useEffect } from '@wordpress/element';
import DeactivationModal from './DeactivationModal';
import './deactivation.css';

/**
 * App component that manages modal visibility.
 *
 * @return {JSX.Element} The deactivation app.
 */
function DeactivationApp() {
	const [ isOpen, setIsOpen ] = useState( false );
	const config = window.prplDeactivationConfig || {};

	useEffect( () => {
		const deactivateLink = document.getElementById(
			`deactivate-${ config.pluginSlug }`
		);
		if ( ! deactivateLink ) {
			return;
		}

		const handleClick = ( e ) => {
			e.preventDefault();
			setIsOpen( true );
		};

		deactivateLink.addEventListener( 'click', handleClick );

		return () => {
			deactivateLink.removeEventListener( 'click', handleClick );
		};
	}, [ config.pluginSlug ] );

	const handleDismiss = () => {
		setIsOpen( false );
		// Redirect to deactivation URL.
		const deactivateLink = document.getElementById(
			`deactivate-${ config.pluginSlug }`
		);
		if ( deactivateLink ) {
			window.location.href = deactivateLink.href;
		}
	};

	return (
		<DeactivationModal
			config={ config }
			isOpen={ isOpen }
			onDismiss={ handleDismiss }
		/>
	);
}

// Mount the app.
const container = document.getElementById( 'prpl-deactivation-root' );
if ( container ) {
	const root = createRoot( container );
	root.render( <DeactivationApp /> );
}
