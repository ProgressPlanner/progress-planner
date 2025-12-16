/**
 * Grid Resize Utility
 *
 * Dispatches the 'prpl/grid/resize' custom event to trigger masonry grid recalculation.
 * This event is listened to by useGridMasonry hook.
 */

/**
 * Dispatch a grid resize event.
 *
 * @param {number} delay - Optional delay in milliseconds before dispatching.
 */
export function dispatchGridResize( delay = 0 ) {
	if ( delay > 0 ) {
		setTimeout( () => {
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		}, delay );
	} else {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	}
}
