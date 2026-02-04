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
 * @type {Array<{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}>}
 */
const widgetRegistry = [];

/**
 * Register a widget.
 *
 * @param {Object}   widgetData                 - Widget registration data.
 * @param {string}   widgetData.id              - Unique widget ID.
 * @param {Function} widgetData.component       - React component.
 * @param {number}   widgetData.priority        - Display priority (lower = earlier, default: 10).
 * @param {number}   widgetData.width           - Widget width (1 or 2, default: 1).
 * @param {boolean}  widgetData.forceLastColumn - Force to last column (default: false).
 * @param {string}   widgetData.title           - Widget title (default: '').
 * @param {string}   widgetData.infoIconSvg     - Info icon SVG content (default: '').
 */
export function registerWidget( widgetData ) {
	const {
		id,
		component,
		priority = 10,
		width = 1,
		forceLastColumn = false,
		title = '',
		infoIconSvg = '',
	} = widgetData;

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
	const widgetEntry = {
		id,
		component,
		priority,
		width,
		forceLastColumn,
		title,
		infoIconSvg,
	};

	if ( existingIndex >= 0 ) {
		// Update existing registration
		widgetRegistry[ existingIndex ] = widgetEntry;
	} else {
		// Add new registration
		widgetRegistry.push( widgetEntry );
	}
}

/**
 * Get all registered widgets, sorted by priority.
 *
 * @return {Array<{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}>} Sorted widgets.
 */
export function getRegisteredWidgets() {
	return [ ...widgetRegistry ].sort( ( a, b ) => a.priority - b.priority );
}

/**
 * Get a widget by ID.
 *
 * @param {string} widgetId - Widget ID.
 * @return {{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}|undefined} Widget or undefined.
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
