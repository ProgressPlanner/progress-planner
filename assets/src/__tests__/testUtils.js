/**
 * Test Utilities and Factory Functions
 *
 * Helpers for creating consistent test data.
 */

/**
 * Create a mock task object.
 *
 * @param {Object} overrides - Properties to override.
 * @return {Object} Mock task object.
 */
export function createMockTask( overrides = {} ) {
	return {
		id: Math.floor( Math.random() * 1000 ),
		title: { rendered: 'Test Task' },
		slug: 'test-task',
		status: 'publish',
		menu_order: 0,
		prpl_points: 5,
		prpl_provider: { slug: 'test-provider' },
		...overrides,
	};
}

/**
 * Create a mock activity object.
 *
 * @param {Object} overrides - Properties to override.
 * @return {Object} Mock activity object.
 */
export function createMockActivity( overrides = {} ) {
	return {
		category: 'content',
		type: 'publish',
		date: new Date().toISOString().split( 'T' )[ 0 ],
		points: 1,
		...overrides,
	};
}

/**
 * Create a mock badge object.
 *
 * @param {Object} overrides - Properties to override.
 * @return {Object} Mock badge object.
 */
export function createMockBadge( overrides = {} ) {
	return {
		id: 'test-badge',
		name: 'Test Badge',
		type: 'content',
		thresholds: { newPosts: 10 },
		...overrides,
	};
}

/**
 * Create a date range for a specific month.
 *
 * @param {number} monthsAgo - Number of months in the past (0 = current month).
 * @return {Object} Object with startDate and endDate.
 */
export function createDateRange( monthsAgo = 0 ) {
	const date = new Date();
	date.setMonth( date.getMonth() - monthsAgo );
	const startDate = new Date( date.getFullYear(), date.getMonth(), 1 );
	const endDate = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
	return { startDate, endDate };
}

/**
 * Create an array of activities over consecutive days.
 *
 * @param {number} count     - Number of activities to create.
 * @param {Date}   startDate - Start date for the first activity.
 * @param {Object} overrides - Properties to override on each activity.
 * @return {Array} Array of mock activities.
 */
export function createConsecutiveActivities(
	count,
	startDate = new Date(),
	overrides = {}
) {
	const activities = [];
	for ( let i = 0; i < count; i++ ) {
		const date = new Date( startDate );
		date.setDate( date.getDate() + i );
		activities.push(
			createMockActivity( {
				date: date.toISOString().split( 'T' )[ 0 ],
				...overrides,
			} )
		);
	}
	return activities;
}

/**
 * Create an array of weekly activities (one per week).
 *
 * @param {number} weeks     - Number of weeks of activities.
 * @param {Date}   startDate - Start date for the first activity.
 * @param {Object} overrides - Properties to override on each activity.
 * @return {Array} Array of mock activities.
 */
export function createWeeklyActivities(
	weeks,
	startDate = new Date(),
	overrides = {}
) {
	const activities = [];
	for ( let i = 0; i < weeks; i++ ) {
		const date = new Date( startDate );
		date.setDate( date.getDate() + i * 7 );
		activities.push(
			createMockActivity( {
				date: date.toISOString().split( 'T' )[ 0 ],
				...overrides,
			} )
		);
	}
	return activities;
}
