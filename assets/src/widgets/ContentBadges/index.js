/**
 * ContentBadges Widget
 *
 * Displays the content badges widget with gauge and badge grid.
 */

import { __, _n, sprintf } from '@wordpress/i18n';
import SimpleBadgeWidget from '../shared/SimpleBadgeWidget';

/**
 * Get the remaining text for content badges.
 *
 * @param {number} remaining - The remaining count.
 * @return {string} The formatted remaining text.
 */
function getRemainingText( remaining ) {
	return sprintf(
		/* translators: %s: The remaining number of posts or pages to write. */
		_n(
			'Write %s new post or page and earn your next badge!',
			'Write %s new posts or pages and earn your next badge!',
			remaining,
			'progress-planner'
		),
		remaining
	);
}

/**
 * ContentBadges component.
 *
 * @return {JSX.Element} The ContentBadges component.
 */
export default function ContentBadges() {
	return (
		<SimpleBadgeWidget
			endpoint="/progress-planner/v1/content-badges"
			introText={ __(
				'The more you work on meaningful content, the sooner you unlock new badges.',
				'progress-planner'
			) }
			backgroundColor="var(--prpl-background-content-badge)"
			badgeGroupClass="badge-group-content"
			getRemainingText={ getRemainingText }
		/>
	);
}
