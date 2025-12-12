/**
 * Badge Service
 *
 * Handles API calls for activities and badge stats.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Fetch activities data from API.
 *
 * @return {Promise<Object>} Activities data with activities array, totalPostsCount, and activationDate.
 */
export async function fetchActivities() {
	try {
		const response = await apiFetch( {
			path: '/progress-planner/v1/activities',
		} );

		return {
			activities: response.activities || [],
			totalPostsCount: response.totalPostsCount || 0,
			activationDate: response.activationDate
				? new Date( response.activationDate )
				: new Date(),
		};
	} catch ( error ) {
		throw new Error( error.message || 'Failed to fetch activities' );
	}
}

/**
 * Fetch badge stats from API.
 *
 * @return {Promise<Object>} Badge stats object.
 */
export async function fetchBadgeStats() {
	try {
		const response = await apiFetch( {
			path: '/progress-planner/v1/badge-stats',
		} );

		return response.badges || {};
	} catch ( error ) {
		throw new Error( error.message || 'Failed to fetch badge stats' );
	}
}

/**
 * Save badge stats to API.
 *
 * @param {Object} badges - Badge stats object to save.
 * @return {Promise<Object>} Updated badge stats.
 */
export async function saveBadgeStats( badges ) {
	try {
		const response = await apiFetch( {
			path: '/progress-planner/v1/badge-stats',
			method: 'POST',
			data: {
				badges,
			},
		} );

		return response.badges || {};
	} catch ( error ) {
		throw new Error( error.message || 'Failed to save badge stats' );
	}
}
