/**
 * Tasks API Hook.
 *
 * Provides functions for interacting with the tasks REST API.
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Snooze duration map (duration key to days).
 */
const SNOOZE_DURATION_DAYS = {
	'1-week': 7,
	'2-weeks': 14,
	'1-month': 30,
	'3-months': 90,
	'6-months': 180,
	'1-year': 365,
	forever: 3650,
};

/**
 * Build query string from parameters object.
 *
 * @param {Object} params The parameters object.
 * @return {string} The query string.
 */
function buildQueryString( params ) {
	const searchParams = new URLSearchParams();

	Object.entries( params ).forEach( ( [ key, value ] ) => {
		if ( Array.isArray( value ) ) {
			value.forEach( ( v ) => searchParams.append( key, v ) );
		} else if ( value !== undefined && value !== null && value !== '' ) {
			searchParams.append( key, value );
		}
	} );

	return searchParams.toString();
}

/**
 * Fetch tasks from the API.
 *
 * @param {Object}   options                 Fetch options.
 * @param {string}   options.status          Task status (publish, pending, future, trash).
 * @param {number}   options.perPage         Number of tasks to fetch.
 * @param {string}   options.excludeProvider Provider to exclude (e.g., 'user').
 * @param {string}   options.provider        Provider to include.
 * @param {number[]} options.excludeIds      Array of post IDs to exclude.
 * @return {Promise<Array>} Promise resolving to array of tasks.
 */
export async function fetchTasks( {
	status = 'publish',
	perPage = 100,
	excludeProvider,
	provider,
	excludeIds = [],
} = {} ) {
	const params = {
		status,
		per_page: perPage,
		_embed: true,
		'filter[orderby]': 'menu_order',
		'filter[order]': 'ASC',
	};

	if ( excludeProvider ) {
		params.exclude_provider = excludeProvider;
	}

	if ( provider ) {
		params.provider = provider;
	}

	if ( excludeIds.length > 0 ) {
		params.exclude = excludeIds.join( ',' );
	}

	const query = buildQueryString( params );

	try {
		const response = await apiFetch( {
			path: `/wp/v2/prpl_recommendations?${ query }`,
		} );
		return response || [];
	} catch ( error ) {
		console.error( 'Error fetching tasks:', error );
		return [];
	}
}

/**
 * Complete a task (change status to trash).
 *
 * @param {number} postId The post ID.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
export async function completeTask( postId ) {
	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }`,
		method: 'POST',
		data: {
			status: 'trash',
		},
	} );
}

/**
 * Snooze a task (change status to future with scheduled date).
 *
 * @param {number} postId   The post ID.
 * @param {string} duration The snooze duration key.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
export async function snoozeTask( postId, duration ) {
	const durationDays = SNOOZE_DURATION_DAYS[ duration ] || 7;

	// Calculate the future date.
	const futureDate = new Date(
		Date.now() + durationDays * 24 * 60 * 60 * 1000
	);
	const dateString = futureDate.toISOString().split( '.' )[ 0 ];

	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }`,
		method: 'POST',
		data: {
			status: 'future',
			date: dateString,
			date_gmt: dateString,
		},
	} );
}

/**
 * Delete a task permanently.
 *
 * @param {number} postId The post ID.
 * @return {Promise<Object>} Promise resolving to the deleted task.
 */
export async function deleteTask( postId ) {
	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }?force=true`,
		method: 'DELETE',
	} );
}

/**
 * Update a task.
 *
 * @param {number} postId The post ID.
 * @param {Object} data   The data to update.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
export async function updateTask( postId, data ) {
	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }`,
		method: 'POST',
		data,
	} );
}

/**
 * Send a task action for analytics.
 *
 * @param {number} postId     The post ID.
 * @param {string} actionType The action type (complete, delete, pending).
 * @return {Promise<Object>} Promise resolving to the response.
 */
export async function sendTaskAction( postId, actionType ) {
	const nonce = window.prplSuggestedTasksConfig?.nonce || '';
	const ajaxUrl =
		window.prplSuggestedTasksConfig?.ajaxUrl || '/wp-admin/admin-ajax.php';

	const formData = new FormData();
	formData.append( 'action', 'progress_planner_suggested_task_action' );
	formData.append( 'post_id', postId );
	formData.append( 'action_type', actionType );
	formData.append( 'nonce', nonce );

	try {
		const response = await fetch( ajaxUrl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		} );
		return response.json();
	} catch ( error ) {
		console.error( 'Error sending task action:', error );
		return null;
	}
}

/**
 * Submit an interactive task form.
 *
 * @param {Object} options             Submit options.
 * @param {string} options.setting     The setting name.
 * @param {string} options.value       The value to set.
 * @param {Array}  options.settingPath The path to the setting (for nested values).
 * @return {Promise<Object>} Promise resolving to the response.
 */
export async function submitInteractiveTask( {
	setting,
	value,
	settingPath = [],
} ) {
	const nonce = window.prplSuggestedTasksConfig?.nonce || '';
	const ajaxUrl =
		window.prplSuggestedTasksConfig?.ajaxUrl || '/wp-admin/admin-ajax.php';

	const formData = new FormData();
	formData.append( 'action', 'prpl_interactive_task_submit' );
	formData.append( 'setting', setting );
	formData.append( 'value', value );
	formData.append( 'setting_path', JSON.stringify( settingPath ) );
	formData.append( 'nonce', nonce );

	try {
		const response = await fetch( ajaxUrl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		} );
		return response.json();
	} catch ( error ) {
		console.error( 'Error submitting interactive task:', error );
		throw error;
	}
}

/**
 * Update WordPress site settings via REST API.
 *
 * @param {Object} settings Key-value pairs of settings to update.
 * @return {Promise<Object>} Promise resolving to the updated settings.
 */
export async function updateSiteSettings( settings ) {
	return apiFetch( {
		path: '/wp/v2/settings',
		method: 'POST',
		data: settings,
	} );
}
