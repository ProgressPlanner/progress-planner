/**
 * Tasks API Hook.
 *
 * Provides functions for interacting with the tasks REST API.
 * Used by both SuggestedTasks and TodoWidget.
 */

import apiFetch from '@wordpress/api-fetch';
import { cachedApiFetch } from '../../services/apiFetchCache';

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
 * @param {number}   options.page            Page number (1-based, defaults to 1).
 * @param {string}   options.excludeProvider Provider to exclude (e.g., 'user').
 * @param {string}   options.provider        Provider to include.
 * @param {number[]} options.excludeIds      Array of post IDs to exclude.
 * @param {boolean}  options.needsPagination Whether pagination info is needed (default true).
 *                                           Set to false to enable preloading support.
 * @return {Promise<Object>} Promise resolving to object with tasks array and pagination metadata.
 */
export async function fetchTasks( {
	status = 'publish',
	perPage = 5,
	page = 1,
	excludeProvider,
	provider,
	excludeIds = [],
	needsPagination = true,
} = {} ) {
	const params = {
		status,
		per_page: perPage,
		page,
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
		// If pagination not needed, use simple fetch (supports preloading)
		if ( ! needsPagination ) {
			const tasks = await apiFetch( {
				path: `/wp/v2/prpl_recommendations?${ query }`,
			} );
			return {
				tasks: tasks || [],
				totalPages: 1,
				hasMore: false,
			};
		}

		// Use apiFetch with custom parse to access response headers
		const response = await apiFetch( {
			path: `/wp/v2/prpl_recommendations?${ query }`,
			parse: false, // Don't parse JSON automatically, we need the response object
		} );

		// apiFetch with parse: false returns the Response object
		const tasks = await response.json();
		const totalPages = parseInt(
			response.headers.get( 'X-WP-TotalPages' ) || '1',
			10
		);

		return {
			tasks: tasks || [],
			totalPages,
			hasMore: page < totalPages,
		};
	} catch ( error ) {
		console.error( 'Error fetching tasks:', error );
		// Return empty result with no more pages on error
		return {
			tasks: [],
			totalPages: 1,
			hasMore: false,
		};
	}
}

/**
 * Create a new task.
 *
 * @param {Object} options            Create options.
 * @param {string} options.title      Task title.
 * @param {number} options.menuOrder  Menu order for sorting.
 * @param {number} options.providerId Provider taxonomy term ID.
 * @param {number} options.points     Points value (default 0).
 * @return {Promise<Object>} Promise resolving to the created task.
 */
export async function createTask( {
	title,
	menuOrder = 0,
	providerId,
	points = 0,
} ) {
	return apiFetch( {
		path: '/wp/v2/prpl_recommendations',
		method: 'POST',
		data: {
			title,
			status: 'publish',
			menu_order: menuOrder,
			prpl_recommendations_provider: providerId,
			prpl_points: points,
		},
	} );
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
	try {
		// Use REST API endpoint instead of AJAX.
		// Convert settingPath to JSON string if it's an array
		let settingPathValue = '';
		if ( settingPath && Array.isArray( settingPath ) ) {
			settingPathValue = JSON.stringify( settingPath );
		} else if ( typeof settingPath === 'string' ) {
			settingPathValue = settingPath;
		}

		const response = await apiFetch( {
			path: '/progress-planner/v1/popover/submit',
			method: 'POST',
			data: {
				setting,
				value,
				setting_path: settingPathValue,
			},
		} );
		return response;
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

/**
 * Create a task post via task evaluation endpoint.
 *
 * @param {Object} taskDetails The task details object.
 * @return {Promise<Object>} Promise resolving to the created task response (includes full task data).
 */
export async function createTaskPost( taskDetails ) {
	return apiFetch( {
		path: '/progress-planner/v1/tasks/evaluate',
		method: 'POST',
		data: {
			task_details: taskDetails,
		},
	} );
}

/**
 * Create multiple task posts in a batch.
 *
 * @param {Array<Object>} tasksDetails Array of task details objects.
 * @return {Promise<Object>} Promise resolving to batch response with tasks array.
 */
export async function createTasksBatch( tasksDetails ) {
	return apiFetch( {
		path: '/progress-planner/v1/tasks/evaluate-batch',
		method: 'POST',
		data: {
			tasks: tasksDetails,
		},
	} );
}

/**
 * Fetch data from a data collector.
 * Uses cachedApiFetch to leverage preloaded data and response caching.
 *
 * @param {string} collectorId The data collector ID (DATA_KEY).
 * @return {Promise<*>} Promise resolving to the collected data.
 */
export async function fetchDataCollector( collectorId ) {
	const response = await cachedApiFetch( {
		path: `/progress-planner/v1/data-collectors/${ collectorId }`,
	} );
	return response.data;
}
