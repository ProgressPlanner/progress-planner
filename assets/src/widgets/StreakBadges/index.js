/**
 * StreakBadges Widget
 *
 * Displays the streak badges widget with gauge and badge grid.
 */

import { Fragment } from '@wordpress/element';
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
	// Get title and info icon from config or use defaults.
	const widgetTitle =
		window.prplStreakBadgesConfig?.title ||
		__( 'Your streak badges', 'progress-planner' );
	const infoIconSvg = window.prplStreakBadgesConfig?.infoIconSvg;

	return (
		<Fragment>
			<h2 className="prpl-widget-title">
				{ widgetTitle }
				<div className="tooltip-actions">
					<prpl-tooltip>
						<slot name="open-icon">
							<span className="icon prpl-info-icon">
								{ infoIconSvg && (
									<span
										dangerouslySetInnerHTML={ {
											__html: infoIconSvg,
										} }
									/>
								) }
								<span className="screen-reader-text">
									{ __( 'More info', 'progress-planner' ) }
								</span>
							</span>
						</slot>
						<slot name="content">
							{ __(
								'Your streak badges are based on the amount of website maintenance work you have done over the past 30 days.',
								'progress-planner'
							) }
						</slot>
					</prpl-tooltip>
				</div>
			</h2>
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
		</Fragment>
	);
}
