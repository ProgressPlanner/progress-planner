/**
 * ContentBadges Widget
 *
 * Displays the content badges widget with gauge and badge grid.
 */

import { Fragment } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { registerWidget } from '../../utils/widgetRegistry';
import SimpleBadgeWidget from '../shared/SimpleBadgeWidget';
import WidgetHeader from '../../components/WidgetHeader';

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
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ContentBadges component.
 */
function ContentBadges( { config = {} } ) {
	// Get title and info icon from config or use defaults.
	const widgetTitle =
		config?.title || __( 'Your content badges', 'progress-planner' );
	const infoIconSvg = config?.infoIconSvg;

	return (
		<Fragment>
			<WidgetHeader
				title={ widgetTitle }
				infoIconSvg={ infoIconSvg }
				tooltipContent={ __(
					'Your content badges are based on the amount of content you have created over the past 30 days.',
					'progress-planner'
				) }
			/>
			<SimpleBadgeWidget
				badgeType="content"
				introText={ __(
					'The more you work on meaningful content, the sooner you unlock new badges.',
					'progress-planner'
				) }
				backgroundColor="var(--prpl-background-content-badge)"
				badgeGroupClass="badge-group-content"
				getRemainingText={ getRemainingText }
			/>
		</Fragment>
	);
}

// Register widget
registerWidget( {
	id: 'badge-streak-content',
	component: ContentBadges,
	priority: 6,
	width: 1,
	forceLastColumn: true,
	title: __( 'Your content badges', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );

export default ContentBadges;
