/**
 * Task Completion Events Utility
 *
 * Dispatches events when tasks are completed to update React components.
 */

/**
 * Dispatch task completion event for React components.
 *
 * @param {number} points - The points earned from the completed task.
 * @return {void}
 */
export function dispatchTaskCompletedEvent( points ) {
	if ( ! points || typeof points !== 'number' ) {
		return;
	}

	// Dispatch event for React components.
	document.dispatchEvent(
		new CustomEvent( 'prpl-task-completed', {
			detail: { points },
		} )
	);
}

/**
 * Update Ravi gauge (legacy function name for backward compatibility).
 * This function now only dispatches the event - React components handle the updates.
 *
 * @param {number} pointsDiff - The points difference.
 * @return {void}
 */
export function prplUpdateRaviGauge( pointsDiff ) {
	dispatchTaskCompletedEvent( pointsDiff );
}

// Make prplUpdateRaviGauge available globally for backward compatibility.
if ( typeof window !== 'undefined' ) {
	window.prplUpdateRaviGauge = prplUpdateRaviGauge;
}
