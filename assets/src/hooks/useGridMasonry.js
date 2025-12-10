/**
 * useGridMasonry Hook
 *
 * Handles CSS grid masonry layout for dashboard widgets.
 * Listens for 'prpl/grid/resize' events and calculates grid-row-end spans.
 */

import { useEffect } from '@wordpress/element';

/**
 * Hook to handle grid masonry layout for widgets.
 *
 * This hook sets up event listeners for:
 * - 'prpl/grid/resize' custom event (dispatched by widgets when content changes)
 * - 'resize' window event (for responsive layout)
 * - 'load' window event (for initial layout after all resources load)
 */
export function useGridMasonry() {
	useEffect( () => {
		/**
		 * Handle grid resize by calculating row spans for each widget.
		 */
		const handleGridResize = () => {
			document
				.querySelectorAll( '.prpl-widget-wrapper' )
				.forEach( ( item ) => {
					if ( ! item || item.classList.contains( 'in-popover' ) ) {
						return;
					}

					const innerContainer = item.querySelector(
						'.widget-inner-container'
					);
					if ( ! innerContainer ) {
						return;
					}

					const container = document.querySelector(
						'.prpl-widgets-container'
					);
					if ( ! container ) {
						return;
					}

					const rowHeight = parseInt(
						window
							.getComputedStyle( container )
							.getPropertyValue( 'grid-auto-rows' )
					);

					const paddingTop = parseInt(
						window
							.getComputedStyle( item )
							.getPropertyValue( 'padding-top' )
					);
					const paddingBottom = parseInt(
						window
							.getComputedStyle( item )
							.getPropertyValue( 'padding-bottom' )
					);

					const rowSpan = Math.ceil(
						( innerContainer.getBoundingClientRect().height +
							paddingTop +
							paddingBottom ) /
							rowHeight
					);

					item.style.gridRowEnd = 'span ' + ( rowSpan + 1 );
				} );
		};

		/**
		 * Trigger resize with a small delay.
		 */
		const triggerResize = () => {
			setTimeout( handleGridResize, 0 );
		};

		// Listen for custom event from widgets.
		window.addEventListener( 'prpl/grid/resize', handleGridResize );
		window.addEventListener( 'resize', triggerResize );
		window.addEventListener( 'load', triggerResize );

		// Initial calls.
		triggerResize();
		setTimeout( triggerResize, 1000 );

		// Cleanup on unmount.
		return () => {
			window.removeEventListener( 'prpl/grid/resize', handleGridResize );
			window.removeEventListener( 'resize', triggerResize );
			window.removeEventListener( 'load', triggerResize );
		};
	}, [] );
}
