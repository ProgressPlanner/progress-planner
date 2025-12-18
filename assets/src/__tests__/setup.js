/**
 * Test Setup File
 *
 * Configures global mocks for WordPress packages and browser globals.
 */

// Add jest-dom matchers
import '@testing-library/jest-dom';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => {
	const mockApiFetch = jest.fn();
	mockApiFetch.use = jest.fn();
	mockApiFetch.createNonceMiddleware = jest.fn();
	mockApiFetch.createRootURLMiddleware = jest.fn();
	return mockApiFetch;
} );

// Mock @wordpress/i18n
jest.mock( '@wordpress/i18n', () => ( {
	__: ( text ) => text,
	_x: ( text ) => text,
	_n: ( single, plural, count ) => ( count === 1 ? single : plural ),
	_nx: ( single, plural, count ) => ( count === 1 ? single : plural ),
	sprintf: ( format, ...args ) => {
		let i = 0;
		return format.replace( /%[sd]/g, () => args[ i++ ] );
	},
} ) );

// Mock @wordpress/hooks
jest.mock( '@wordpress/hooks', () => ( {
	applyFilters: ( hookName, value ) => value,
	addFilter: jest.fn(),
	removeFilter: jest.fn(),
	doAction: jest.fn(),
	addAction: jest.fn(),
	removeAction: jest.fn(),
	hasAction: jest.fn( () => false ),
	hasFilter: jest.fn( () => false ),
} ) );

// Global window mocks for WordPress localized data
Object.assign( global.window, {
	progressPlannerBadge: {
		remoteServerRootUrl: 'https://progressplanner.com',
		placeholderImageUrl: '/placeholder.svg',
	},
	prplCelebrate: {
		raviIconUrl: '/ravi.svg',
		monthIconUrl: '/month.svg',
		contentIconUrl: '/content.svg',
		maintenanceIconUrl: '/maintenance.svg',
	},
	prplSuggestedTasksConfig: {
		nonce: 'test-nonce',
		ajaxUrl: '/wp-admin/admin-ajax.php',
	},
	prplDashboardConfig: {
		restUrl: '/wp-json/',
		nonce: 'test-nonce',
	},
} );
