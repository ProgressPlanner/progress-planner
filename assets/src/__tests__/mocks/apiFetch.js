/**
 * API Fetch Test Utilities
 *
 * Helpers for mocking @wordpress/api-fetch in tests.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Mock successful API response.
 *
 * @param {*} data - Data to return from the mock.
 */
export function mockApiFetchSuccess( data ) {
	apiFetch.mockResolvedValueOnce( data );
}

/**
 * Mock API error.
 *
 * @param {string} error - Error message.
 */
export function mockApiFetchError( error ) {
	apiFetch.mockRejectedValueOnce( new Error( error ) );
}

/**
 * Reset all API fetch mocks.
 */
export function resetApiFetchMocks() {
	apiFetch.mockReset();
}

/**
 * Get the calls made to apiFetch.
 *
 * @return {Array} Array of call arguments.
 */
export function getApiFetchCalls() {
	return apiFetch.mock.calls;
}
