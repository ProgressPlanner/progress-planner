/**
 * Badge Calculation Utilities
 *
 * Port of PHP badge progress_callback logic to JavaScript.
 * Calculates badge progress based on activities and other data.
 */

/**
 * Calculate content badge progress.
 *
 * @param {Object} badge - Badge definition.
 * @param {Array}  activities - Array of activity objects.
 * @param {number} totalPostsCount - Total number of published posts/pages.
 * @param {Date}   activationDate - Plugin activation date.
 * @return {Object} Progress object with progress and remaining.
 */
export function calculateContentBadgeProgress(
	badge,
	activities,
	totalPostsCount,
	activationDate
) {
	const { thresholds } = badge;

	// Content Curator has special logic: 20 existing OR 10 new.
	if ( badge.id === 'content-curator' ) {
		const existingRemaining = Math.max(
			0,
			thresholds.existingPosts - Math.min( thresholds.existingPosts, totalPostsCount )
		);

		if ( existingRemaining === 0 ) {
			return {
				progress: 100,
				remaining: 0,
			};
		}

		// Count new posts since activation.
		// Compare dates at day level (ignore time).
		const activationDateDay = new Date( activationDate );
		activationDateDay.setHours( 0, 0, 0, 0 );

		const newCount = activities.filter( ( activity ) => {
			if (
				activity.category !== 'content' ||
				activity.type !== 'publish'
			) {
				return false;
			}
			const activityDate = new Date( activity.date );
			activityDate.setHours( 0, 0, 0, 0 );
			return activityDate >= activationDateDay;
		} ).length;

		const newRemaining = Math.max(
			0,
			thresholds.newPosts - Math.min( thresholds.newPosts, newCount )
		);

		const finalPercent = Math.max(
			Math.min( 100, Math.floor( totalPostsCount / 2 ) ),
			Math.min( 100, Math.floor( newCount * 10 ) )
		);
		const finalRemaining = Math.min( existingRemaining, newRemaining );

		return {
			progress: finalPercent,
			remaining: finalRemaining,
		};
	}

	// Other content badges: count new posts since activation.
	// Compare dates at day level (ignore time).
	const activationDateDay = new Date( activationDate );
	activationDateDay.setHours( 0, 0, 0, 0 );

	const newCount = activities.filter( ( activity ) => {
		if (
			activity.category !== 'content' ||
			activity.type !== 'publish'
		) {
			return false;
		}
		const activityDate = new Date( activity.date );
		activityDate.setHours( 0, 0, 0, 0 );
		return activityDate >= activationDateDay;
	} ).length;

	const threshold = thresholds.newPosts;
	const percent = Math.min( 100, Math.floor( ( newCount / threshold ) * 100 ) );
	const remaining = Math.max( 0, threshold - Math.min( threshold, newCount ) );

	return {
		progress: percent,
		remaining,
	};
}

/**
 * Calculate weekly streak from activities.
 *
 * @param {Array}  activities - Array of activity objects.
 * @param {Date}   startDate - Start date for streak calculation.
 * @param {number} allowedBreak - Number of allowed breaks in streak.
 * @return {Object} Streak object with max_streak and current_streak.
 */
export function calculateWeeklyStreak( activities, startDate, allowedBreak = 1 ) {
	// Group activities by week.
	const weeks = new Map();

	activities.forEach( ( activity ) => {
		const activityDate = new Date( activity.date );
		activityDate.setHours( 0, 0, 0, 0 );
		const startDateDay = new Date( startDate );
		startDateDay.setHours( 0, 0, 0, 0 );
		if ( activityDate < startDateDay ) {
			return;
		}

		// Get week start (Monday).
		const weekStart = getWeekStart( activityDate );
		const weekKey = weekStart.toISOString().split( 'T' )[ 0 ];

		if ( ! weeks.has( weekKey ) ) {
			weeks.set( weekKey, [] );
		}
		weeks.get( weekKey ).push( activity );
	} );

	// Generate all weeks from start date to today.
	const allWeeks = [];
	const currentDate = new Date( startDate );
	const today = new Date();
	today.setHours( 0, 0, 0, 0 );

	while ( currentDate <= today ) {
		const weekStart = getWeekStart( currentDate );
		const weekKey = weekStart.toISOString().split( 'T' )[ 0 ];
		allWeeks.push( {
			weekKey,
			weekStart: new Date( weekStart ),
			hasActivity: weeks.has( weekKey ) && weeks.get( weekKey ).length > 0,
		} );
		currentDate.setDate( currentDate.getDate() + 7 );
	}

	// Calculate streak.
	let streakNr = 0;
	let maxStreak = 0;
	let remainingBreaks = allowedBreak;

	// Process weeks in chronological order.
	for ( const week of allWeeks ) {
		if ( week.hasActivity ) {
			streakNr++;
			maxStreak = Math.max( maxStreak, streakNr );
		} else {
			if ( remainingBreaks > 0 ) {
				remainingBreaks--;
				continue;
			}
			streakNr = 0;
		}
	}

	return {
		max_streak: maxStreak,
		current_streak: streakNr,
	};
}

/**
 * Get the start of the week (Monday) for a given date.
 *
 * @param {Date} date - The date.
 * @return {Date} Start of week (Monday).
 */
function getWeekStart( date ) {
	const d = new Date( date );
	const day = d.getDay();
	const diff = d.getDate() - day + ( day === 0 ? -6 : 1 ); // Adjust when day is Sunday.
	d.setDate( diff );
	d.setHours( 0, 0, 0, 0 );
	return d;
}

/**
 * Calculate maintenance badge progress.
 *
 * @param {Object} badge - Badge definition.
 * @param {Array}  activities - Array of activity objects.
 * @param {Date}   activationDate - Plugin activation date.
 * @return {Object} Progress object with progress and remaining.
 */
export function calculateMaintenanceBadgeProgress(
	badge,
	activities,
	activationDate
) {
	const { thresholds } = badge;
	const weeks = thresholds.weeks;

	// Filter maintenance activities.
	const maintenanceActivities = activities.filter(
		( activity ) => activity.category === 'maintenance'
	);

	const streak = calculateWeeklyStreak(
		maintenanceActivities,
		activationDate,
		1 // Allowed break for maintenance badges.
	);

	const maxStreak = streak.max_streak;
	const percent = Math.min( 100, Math.floor( ( maxStreak / weeks ) * 100 ) );
	const remaining = Math.max( 0, weeks - Math.min( weeks, maxStreak ) );

	return {
		progress: percent,
		remaining,
	};
}

/**
 * Calculate monthly badge progress.
 *
 * @param {Object} badge - Badge definition (monthly).
 * @param {Array}  activities - Array of activity objects with points.
 * @param {Date}   monthStart - Start date of the month.
 * @param {Date}   monthEnd - End date of the month.
 * @param {number} targetPoints - Target points for the month.
 * @param {Object} options - Calculation options.
 * @param {boolean} options.noNextBadgePoints - If true, don't include excess from next badges.
 * @return {Object} Progress object with progress, remaining, and points.
 */
export function calculateMonthlyBadgeProgress(
	badge,
	activities,
	monthStart,
	monthEnd,
	targetPoints = 10,
	options = {}
) {
	// Filter activities for this month.
	// Normalize dates for comparison.
	const monthStartDay = new Date( monthStart );
	monthStartDay.setHours( 0, 0, 0, 0 );
	const monthEndDay = new Date( monthEnd );
	monthEndDay.setHours( 23, 59, 59, 999 );

	const monthActivities = activities.filter( ( activity ) => {
		const activityDate = new Date( activity.date );
		return activityDate >= monthStartDay && activityDate <= monthEndDay;
	} );

	// Sum points from activities.
	let points = 0;
	monthActivities.forEach( ( activity ) => {
		if ( activity.points && typeof activity.points === 'number' ) {
			points += activity.points;
		}
	} );

	const progress = Math.max(
		0,
		Math.min( 100, Math.floor( ( points / targetPoints ) * 100 ) )
	);
	const remaining = Math.max(
		0,
		Math.min( targetPoints - points, targetPoints )
	);

	const result = {
		progress,
		remaining,
		points,
	};

	// If badge is complete or noNextBadgePoints is set, return as is.
	if ( points >= targetPoints || options.noNextBadgePoints ) {
		return result;
	}

	// Add excess points from next badges (up to 2 months forward).
	const excessPoints = getNextBadgesExcessPoints(
		activities,
		monthEnd,
		targetPoints,
		2
	);

	if ( excessPoints > 0 ) {
		const totalPoints = points + excessPoints;
		return {
			progress: Math.max(
				0,
				Math.min( 100, Math.floor( ( totalPoints / targetPoints ) * 100 ) )
			),
			remaining: Math.max( 0, Math.min( targetPoints - totalPoints, targetPoints ) ),
			points: totalPoints,
		};
	}

	return result;
}

/**
 * Get excess points from next badges (for monthly badge overflow).
 *
 * Port of PHP get_next_badges_excess_points() logic.
 * Looks forward up to 2 months and calculates excess points that can overflow
 * to the current month badge.
 *
 * @param {Array}  activities - Array of activity objects.
 * @param {Date}   currentMonthEnd - End date of current month.
 * @param {number} targetPoints - Target points per month.
 * @param {number} monthsForward - Number of months to look forward (typically 2).
 * @return {number} Excess points.
 */
function getNextBadgesExcessPoints(
	activities,
	currentMonthEnd,
	targetPoints,
	monthsForward
) {
	let next1BadgePoints = 0;
	let next2BadgePoints = 0;
	let badge1ExcessPoints = 0;
	let badge2ExcessPoints = 0;

	// Get next month (i=1).
	const next1MonthStart = new Date( currentMonthEnd );
	next1MonthStart.setMonth( next1MonthStart.getMonth() + 1 );
	next1MonthStart.setDate( 1 );
	next1MonthStart.setHours( 0, 0, 0, 0 );

	const next1MonthEnd = new Date( next1MonthStart );
	next1MonthEnd.setMonth( next1MonthEnd.getMonth() + 1 );
	next1MonthEnd.setDate( 0 );
	next1MonthEnd.setHours( 23, 59, 59, 999 );

	const next1Activities = activities.filter( ( activity ) => {
		const activityDate = new Date( activity.date );
		return activityDate >= next1MonthStart && activityDate <= next1MonthEnd;
	} );

	next1Activities.forEach( ( activity ) => {
		if ( activity.points && typeof activity.points === 'number' ) {
			next1BadgePoints += activity.points;
		}
	} );

	// Get month after next (i=2).
	if ( monthsForward >= 2 ) {
		const next2MonthStart = new Date( currentMonthEnd );
		next2MonthStart.setMonth( next2MonthStart.getMonth() + 2 );
		next2MonthStart.setDate( 1 );
		next2MonthStart.setHours( 0, 0, 0, 0 );

		const next2MonthEnd = new Date( next2MonthStart );
		next2MonthEnd.setMonth( next2MonthEnd.getMonth() + 1 );
		next2MonthEnd.setDate( 0 );
		next2MonthEnd.setHours( 23, 59, 59, 999 );

		const next2Activities = activities.filter( ( activity ) => {
			const activityDate = new Date( activity.date );
			return activityDate >= next2MonthStart && activityDate <= next2MonthEnd;
		} );

		next2Activities.forEach( ( activity ) => {
			if ( activity.points && typeof activity.points === 'number' ) {
				next2BadgePoints += activity.points;
			}
		} );
	}

	// If next1 has more than target points, calculate excess.
	if ( next1BadgePoints > targetPoints ) {
		badge1ExcessPoints = Math.max( 0, next1BadgePoints - targetPoints );
	}

	// If next2 has more than target points, calculate excess.
	if ( next2BadgePoints > targetPoints ) {
		badge2ExcessPoints = Math.max( 0, next2BadgePoints - targetPoints );

		// Does next1 need more points to reach target?
		if ( next1BadgePoints < targetPoints ) {
			// Use next2 excess to fill next1 first, then calculate remaining excess.
			const neededForNext1 = targetPoints - next1BadgePoints;
			badge2ExcessPoints = Math.max(
				0,
				next1BadgePoints + badge2ExcessPoints - targetPoints
			);
		}
	}

	return badge1ExcessPoints + badge2ExcessPoints;
}

