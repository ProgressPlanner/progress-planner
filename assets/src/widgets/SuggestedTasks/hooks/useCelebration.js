/**
 * Celebration Hook.
 *
 * Provides functions for triggering task completion celebrations.
 */

import { useCallback } from '@wordpress/element';

/**
 * Custom hook for task celebration functionality.
 *
 * @return {Object} Object containing celebration functions.
 */
export function useCelebration() {
	/**
	 * Trigger celebration for a completed task.
	 *
	 * This dispatches the 'prpl/celebrateTasks' event which is handled
	 * by the existing celebrate.js script to render confetti.
	 *
	 * @param {HTMLElement} element The task element to celebrate.
	 */
	const celebrate = useCallback( ( element ) => {
		document.dispatchEvent(
			new CustomEvent( 'prpl/celebrateTasks', {
				detail: { element },
			} )
		);
	}, [] );

	/**
	 * Remove celebrated tasks from the DOM.
	 *
	 * This dispatches the 'prpl/removeCelebratedTasks' event which is handled
	 * by the existing celebrate.js script.
	 */
	const removeCelebratedTasks = useCallback( () => {
		document.dispatchEvent(
			new CustomEvent( 'prpl/removeCelebratedTasks' )
		);
	}, [] );

	/**
	 * Update the Ravi gauge with earned points.
	 *
	 * @param {number} points The points to add to the gauge.
	 */
	const updateRaviGauge = useCallback( ( points ) => {
		if ( typeof window.prplUpdateRaviGauge === 'function' ) {
			window.prplUpdateRaviGauge( points );
		}
	}, [] );

	/**
	 * Trigger grid resize event.
	 *
	 * This dispatches the 'prpl/grid/resize' event which is handled
	 * by the grid masonry layout to recalculate item positions.
	 */
	const triggerGridResize = useCallback( () => {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	}, [] );

	return {
		celebrate,
		removeCelebratedTasks,
		updateRaviGauge,
		triggerGridResize,
	};
}

export default useCelebration;
