/**
 * Badge Definitions
 *
 * Configuration for all badge types: content, maintenance, and monthly badges.
 * This replaces the PHP badge classes with JavaScript configuration.
 */

/**
 * Content badge definitions.
 */
export const CONTENT_BADGES = [
	{
		id: 'content-curator',
		name: 'Content Curator',
		description: '20 existing posts/pages, or 10 new posts/pages',
		type: 'content',
		background: 'var(--prpl-background-content-badge)',
		thresholds: {
			existingPosts: 20,
			newPosts: 10,
		},
	},
	{
		id: 'revision-ranger',
		name: 'Revision Ranger',
		description: 'Write 30 new posts or pages',
		type: 'content',
		background: 'var(--prpl-background-content-badge)',
		thresholds: {
			newPosts: 30,
		},
	},
	{
		id: 'purposeful-publisher',
		name: 'Purposeful Publisher',
		description: 'Write 50 new posts or pages',
		type: 'content',
		background: 'var(--prpl-background-content-badge)',
		thresholds: {
			newPosts: 50,
		},
	},
];

/**
 * Maintenance badge definitions.
 */
export const MAINTENANCE_BADGES = [
	{
		id: 'progress-padawan',
		name: 'Progress Padawan',
		description: '6 weeks streak',
		type: 'maintenance',
		background: 'var(--prpl-background-streak)',
		thresholds: {
			weeks: 6,
		},
	},
	{
		id: 'maintenance-maniac',
		name: 'Maintenance Maniac',
		description: '26 weeks streak',
		type: 'maintenance',
		background: 'var(--prpl-background-streak)',
		thresholds: {
			weeks: 26,
		},
	},
	{
		id: 'super-site-specialist',
		name: 'Super Site Specialist',
		description: '52 weeks streak',
		type: 'maintenance',
		background: 'var(--prpl-background-streak)',
		thresholds: {
			weeks: 52,
		},
	},
];

/**
 * Monthly badge configuration.
 */
export const MONTHLY_BADGE_CONFIG = {
	targetPoints: 10,
	months: {
		m1: 'Jack January',
		m2: 'Felix February',
		m3: 'Mary March',
		m4: 'Avery April',
		m5: 'Matteo May',
		m6: 'Jasmine June',
		m7: 'Joey July',
		m8: 'Abed August',
		m9: 'Sam September',
		m10: 'Oksana October',
		m11: 'Noah November',
		m12: 'Daisy December',
	},
};

/**
 * Generate monthly badge ID from date.
 *
 * @param {Date} date - The date.
 * @return {string} Badge ID.
 */
export function getMonthlyBadgeIdFromDate( date ) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return `monthly-${ year }-m${ month }`;
}

/**
 * Generate monthly badge name from date.
 *
 * @param {Date} date - The date.
 * @return {string} Badge name.
 */
export function getMonthlyBadgeNameFromDate( date ) {
	const month = date.getMonth() + 1;
	const monthKey = `m${ month }`;
	return MONTHLY_BADGE_CONFIG.months[ monthKey ] || '';
}

/**
 * Get all badge definitions.
 *
 * @return {Array} All badge definitions.
 */
export function getAllBadges() {
	return [ ...CONTENT_BADGES, ...MAINTENANCE_BADGES ];
}

/**
 * Get badge by ID.
 *
 * @param {string} badgeId - The badge ID.
 * @return {Object|null} Badge definition or null.
 */
export function getBadgeById( badgeId ) {
	// Check content badges.
	const contentBadge = CONTENT_BADGES.find( ( badge ) => badge.id === badgeId );
	if ( contentBadge ) {
		return contentBadge;
	}

	// Check maintenance badges.
	const maintenanceBadge = MAINTENANCE_BADGES.find(
		( badge ) => badge.id === badgeId
	);
	if ( maintenanceBadge ) {
		return maintenanceBadge;
	}

	// Check if it's a monthly badge.
	if ( badgeId.startsWith( 'monthly-' ) ) {
		const parts = badgeId.split( '-' );
		if ( parts.length === 3 ) {
			const year = parseInt( parts[1], 10 );
			const monthStr = parts[2].replace( 'm', '' );
			const month = parseInt( monthStr, 10 );
			if ( year && month >= 1 && month <= 12 ) {
				const date = new Date( year, month - 1, 1 );
				return {
					id: badgeId,
					name: getMonthlyBadgeNameFromDate( date ),
					description: '',
					type: 'monthly',
					background: 'var(--prpl-background-content-badge)',
					thresholds: {
						points: MONTHLY_BADGE_CONFIG.targetPoints,
					},
				};
			}
		}
	}

	return null;
}

