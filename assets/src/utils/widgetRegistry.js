/**
 * Widget Registry
 *
 * Shared registry for dashboard widgets. Widgets register themselves via
 * WordPress hooks, and DashboardWidgets reads from this registry.
 */

import { addAction } from '@wordpress/hooks';

/**
 * Registry storage for widgets.
 *
 * @type {Array<{id: string, component: Function, priority: number}>}
 */
const widgetRegistry = [];

/**
 * Register a widget.
 *
 * @param {Object} widgetData - Widget registration data.
 * @param {string} widgetData.id - Unique widget ID.
 * @param {Function} widgetData.component - React component.
 * @param {number} widgetData.priority - Display priority (lower = earlier, default: 10).
 */
function registerWidget( widgetData ) {
	const { id, component, priority = 10 } = widgetData;

	if ( ! id || ! component ) {
		// eslint-disable-next-line no-console
		console.warn(
			'Widget registration failed: id and component are required',
			widgetData
		);
		return;
	}

	// Check if widget already registered
	const existingIndex = widgetRegistry.findIndex( ( w ) => w.id === id );
	if ( existingIndex >= 0 ) {
		// Update existing registration
		widgetRegistry[ existingIndex ] = { id, component, priority };
	} else {
		// Add new registration
		widgetRegistry.push( { id, component, priority } );
	}
}

/**
 * Get all registered widgets, sorted by priority.
 *
 * @return {Array<{id: string, component: Function, priority: number}>} Sorted widgets.
 */
export function getRegisteredWidgets() {
	return [ ...widgetRegistry ].sort( ( a, b ) => a.priority - b.priority );
}

/**
 * Get a widget by ID.
 *
 * @param {string} widgetId - Widget ID.
 * @return {{id: string, component: Function, priority: number}|undefined} Widget or undefined.
 */
export function getWidget( widgetId ) {
	return widgetRegistry.find( ( w ) => w.id === widgetId );
}

// Listen for widget registrations via WordPress hooks
addAction(
	'prpl.dashboard.registerWidget',
	'progress-planner/widget-registry',
	registerWidget
);

