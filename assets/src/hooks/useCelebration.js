/**
 * Celebration Hook.
 *
 * Provides functions for triggering task completion celebrations.
 */

import { useCallback } from '@wordpress/element';
import confetti from 'canvas-confetti';

/**
 * Custom hook for task celebration functionality.
 *
 * @return {Object} Object containing celebration functions.
 */
export function useCelebration() {
	/**
	 * Trigger celebration for a completed task.
	 *
	 * Renders confetti animation using canvas-confetti library.
	 *
	 * @param {HTMLElement} element The task element to celebrate.
	 */
	const celebrate = useCallback( ( element ) => {
		// Get container element
		const containerEl = element?.closest( '.prpl-suggested-tasks-list' )
			|| document.querySelector(
				'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list'
			);

		// Calculate origin (normalized 0-1)
		const origin = containerEl
			? {
					x:
						( containerEl.getBoundingClientRect().left +
							containerEl.offsetWidth / 2 ) /
						window.innerWidth,
					y:
						( containerEl.getBoundingClientRect().top + 50 ) /
						window.innerHeight,
			  }
			: { x: 0.5, y: 0.3 };

		// Get config from window.prplCelebrate (localized from PHP)
		const config = window.prplCelebrate || {};

		// Default confetti options
		const defaults = {
			spread: 360,
			ticks: 50,
			gravity: 1,
			decay: 0.94,
			startVelocity: 30,
			shapes: [ 'star' ],
			colors: [ 'FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8' ],
		};

		// Get confetti options (from PHP or default)
		let confettiOptions = [
			{
				particleCount: 30,
				scalar: 4,
				shapes: [ 'image' ],
				shapeOptions: {
					image: [
						{ src: config.raviIconUrl },
						{ src: config.raviIconUrl },
						{ src: config.raviIconUrl },
						{ src: config.monthIconUrl },
						{ src: config.contentIconUrl },
						{ src: config.maintenanceIconUrl },
					],
				},
			},
		];

		// Triple check if the confetti options are an array and not undefined.
		if (
			typeof config.confettiOptions !== 'undefined' &&
			Array.isArray( config.confettiOptions ) &&
			config.confettiOptions.length > 0
		) {
			confettiOptions = config.confettiOptions;
		}

		// Render confetti with delays (0ms, 100ms, 200ms)
		[ 0, 100, 200 ].forEach( ( delay ) => {
			setTimeout( () => {
				confettiOptions.forEach( ( option ) => {
					confetti( {
						...defaults,
						...option,
						origin,
					} );
				} );
			}, delay );
		} );

		// Remove admin menu points badge
		const points = document.querySelectorAll(
			'#adminmenu #toplevel_page_progress-planner .update-plugins'
		);
		points.forEach( ( point ) => point.remove() );
	}, [] );

	/**
	 * Remove celebrated tasks from the DOM.
	 *
	 * This function is kept for backward compatibility but is no longer needed
	 * as React components handle task removal themselves.
	 */
	const removeCelebratedTasks = useCallback( () => {
		// This is now handled by React components directly
		// Keeping for backward compatibility if needed
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
