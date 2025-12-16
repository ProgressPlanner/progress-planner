/**
 * Badge Service
 *
 * Handles API calls for activities and badge stats with caching
 * to prevent redundant API calls from multiple badge widgets.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Simple cache for badge service data.
 */
const serviceCache = {
	activities: null,
	activitiesTimestamp: 0,
	badgeStats: null,
	badgeStatsTimestamp: 0,
};

/**
 * Cache TTL in milliseconds (5 minutes).
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Check if cached data is still valid.
 *
 * @param {number} timestamp - Cache timestamp.
 * @return {boolean} True if cache is valid.
 */
function isCacheValid( timestamp ) {
	return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Clear all service cache.
 */
export function clearBadgeServiceCache() {
	serviceCache.activities = null;
	serviceCache.activitiesTimestamp = 0;
	serviceCache.badgeStats = null;
	serviceCache.badgeStatsTimestamp = 0;
}

/**
 * Fetch activities data from API.
 *
 * @param {boolean} bypassCache - Whether to bypass the cache.
 * @return {Promise<Object>} Activities data with activities array, totalPostsCount, and activationDate.
 */
export async function fetchActivities( bypassCache = false ) {
	// Return cached data if valid.
	if (
		! bypassCache &&
		serviceCache.activities &&
		isCacheValid( serviceCache.activitiesTimestamp )
	) {
		return serviceCache.activities;
	}

	try {
		const response = await apiFetch( {
			path: '/progress-planner/v1/activities',
		} );

		const data = {
			activities: response.activities || [],
			totalPostsCount: response.totalPostsCount || 0,
			activationDate: response.activationDate
				? new Date( response.activationDate )
				: new Date(),
			config: response.config || {
				brandingId: 0,
				remoteServerUrl: '',
				placeholderUrl: '',
			},
		};

		// Cache the response.
		serviceCache.activities = data;
		serviceCache.activitiesTimestamp = Date.now();

		return data;
	} catch ( error ) {
		throw new Error( error.message || 'Failed to fetch activities' );
	}
}

/**
 * Fetch badge stats from API.
 *
 * @param {boolean} bypassCache - Whether to bypass the cache.
 * @return {Promise<Object>} Badge stats object.
 */
export async function fetchBadgeStats( bypassCache = false ) {
	// Return cached data if valid.
	if (
		! bypassCache &&
		serviceCache.badgeStats &&
		isCacheValid( serviceCache.badgeStatsTimestamp )
	) {
		return serviceCache.badgeStats;
	}

	try {
		const response = await apiFetch( {
			path: '/progress-planner/v1/badge-stats',
		} );

		const data = response.badges || {};

		// Cache the response.
		serviceCache.badgeStats = data;
		serviceCache.badgeStatsTimestamp = Date.now();

		return data;
	} catch ( error ) {
		throw new Error( error.message || 'Failed to fetch badge stats' );
	}
}

/**
 * Save badge stats to API.
 * Also invalidates the badge stats cache.
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

		const data = response.badges || {};

		// Update cache with new data.
		serviceCache.badgeStats = data;
		serviceCache.badgeStatsTimestamp = Date.now();

		return data;
	} catch ( error ) {
		throw new Error( error.message || 'Failed to save badge stats' );
	}
}
