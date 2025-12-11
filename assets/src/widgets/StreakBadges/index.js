/**
 * StreakBadges Widget
 *
 * Displays the streak badges widget with gauge and badge grid.
 */

import { __, _n, sprintf } from '@wordpress/i18n';
import SimpleBadgeWidget from '../shared/SimpleBadgeWidget';

/**
 * Get the remaining text for streak badges.
 *
 * @param {number} remaining - The remaining count.
 * @return {string} The formatted remaining text.
 */
function getRemainingText( remaining ) {
	return sprintf(
		/* translators: %s: The remaining number of weeks. */
		_n(
			'%s week to go to complete this streak!',
			'%s weeks to go to complete this streak!',
			remaining,
			'progress-planner'
		),
		remaining
	);
}

/**
 * StreakBadges component.
 *
 * @return {JSX.Element} The StreakBadges component.
 */
export default function StreakBadges() {
	return (
		<SimpleBadgeWidget
			endpoint="/progress-planner/v1/streak-badges"
			introText={ __(
				'Execute at least one website maintenance task every week.',
				'progress-planner'
			) }
			backgroundColor="var(--prpl-background-streak)"
			badgeGroupClass="badge-group-maintenance"
			getRemainingText={ getRemainingText }
		/>
	);
}
