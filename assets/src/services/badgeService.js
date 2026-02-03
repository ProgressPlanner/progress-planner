/**
 * Badge Service
 *
 * Handles API calls for activities and badge stats.
 * Uses the centralized apiFetchCache for caching and request deduplication.
 */

import apiFetch from '@wordpress/api-fetch';
import { cachedApiFetch, clearCacheFor, setCacheFor } from './apiFetchCache';

/**
 * Clear badge service cache.
 * Delegates to the centralized cache service.
 */
export function clearBadgeServiceCache() {
	clearCacheFor( '/progress-planner/v1/activities' );
	clearCacheFor( '/progress-planner/v1/badge-stats' );
}

/**
 * Fetch activities data from API.
 *
 * @param {boolean} bypassCache - Whether to bypass the cache.
 * @return {Promise<Object>} Activities data with activities array, totalPostsCount, and activationDate.
 */
export async function fetchActivities( bypassCache = false ) {
	try {
		const response = await cachedApiFetch(
			{ path: '/progress-planner/v1/activities' },
			{ skipCache: bypassCache }
		);

		// Transform the response data.
		return {
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
	try {
		const response = await cachedApiFetch(
			{ path: '/progress-planner/v1/badge-stats' },
			{ skipCache: bypassCache }
		);

		return response.badges || {};
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

		// Write-through cache: store the response for subsequent GET requests.
		setCacheFor( '/progress-planner/v1/badge-stats', response );

		return response.badges || {};
	} catch ( error ) {
		throw new Error( error.message || 'Failed to save badge stats' );
	}
}
