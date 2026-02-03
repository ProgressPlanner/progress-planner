/**
 * StreakBadges Widget
 *
 * Displays the streak badges widget with gauge and badge grid.
 */

import { Fragment } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import SimpleBadgeWidget from '../shared/SimpleBadgeWidget';
import WidgetHeader from '../../components/WidgetHeader';

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
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The StreakBadges component.
 */
function StreakBadges( { config = {} } ) {
	// Get title and info icon from config or use defaults.
	const widgetTitle =
		config?.title || __( 'Your streak badges', 'progress-planner' );
	const infoIconSvg = config?.infoIconSvg;

	return (
		<Fragment>
			<WidgetHeader
				title={ widgetTitle }
				infoIconSvg={ infoIconSvg }
				tooltipContent={ __(
					'Your streak badges are based on the amount of website maintenance work you have done over the past 30 days.',
					'progress-planner'
				) }
			/>
			<SimpleBadgeWidget
				badgeType="maintenance"
				introText={ __(
					'Execute at least one website maintenance task every week.',
					'progress-planner'
				) }
				backgroundColor="var(--prpl-background-streak)"
				badgeGroupClass="badge-group-maintenance"
				getRemainingText={ getRemainingText }
			/>
		</Fragment>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'badge-streak-maintenance',
	component: StreakBadges,
	priority: 7,
	width: 1,
	forceLastColumn: true,
	title: __( 'Your streak badges', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );

export default StreakBadges;
