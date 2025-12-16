/**
 * Task Completion Events Utility
 *
 * @deprecated Since React migration. Use useDashboardStore instead for cross-widget
 * communication. This file is kept for backward compatibility with any legacy
 * code that might still call window.prplUpdateRaviGauge.
 *
 * React components should use:
 * - `useDashboardStore()` hook from `stores/dashboardStore.js`
 * - `onTaskCompleted(task, points)` action from store
 *
 * @see assets/src/stores/dashboardStore.js
 */

/**
 * Dispatch task completion event for React components.
 *
 * @deprecated Use useDashboardStore().onTaskCompleted() instead.
 * @param {number} points - The points earned from the completed task.
 * @return {void}
 */
export function dispatchTaskCompletedEvent( points ) {
	// eslint-disable-next-line no-console
	console.warn(
		'dispatchTaskCompletedEvent is deprecated. Use useDashboardStore().onTaskCompleted() instead.'
	);

	if ( ! points || typeof points !== 'number' ) {
		return;
	}

	// Dispatch event for any remaining legacy listeners.
	document.dispatchEvent(
		new CustomEvent( 'prpl-task-completed', {
			detail: { points },
		} )
	);
}

/**
 * Update Ravi gauge (legacy function name for backward compatibility).
 *
 * @deprecated Use useDashboardStore().onTaskCompleted() instead.
 * @param {number} pointsDiff - The points difference.
 * @return {void}
 */
export function prplUpdateRaviGauge( pointsDiff ) {
	// eslint-disable-next-line no-console
	console.warn(
		'window.prplUpdateRaviGauge is deprecated. Use useDashboardStore().onTaskCompleted() instead.'
	);
	dispatchTaskCompletedEvent( pointsDiff );
}

// Make prplUpdateRaviGauge available globally for backward compatibility.
// This will show a deprecation warning when called.
if ( typeof window !== 'undefined' ) {
	window.prplUpdateRaviGauge = prplUpdateRaviGauge;
}
