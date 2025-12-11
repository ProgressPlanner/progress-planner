/**
 * ContentBadges Widget
 *
 * Displays the content badges widget with gauge and badge grid.
 */

import { Fragment } from '@wordpress/element';
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
	// Get title and info icon from config or use defaults.
	const widgetTitle =
		window.prplContentBadgesConfig?.title ||
		__( 'Your content badges', 'progress-planner' );
	const infoIconSvg = window.prplContentBadgesConfig?.infoIconSvg;

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
								'Your content badges are based on the amount of content you have created over the past 30 days.',
								'progress-planner'
							) }
						</slot>
					</prpl-tooltip>
				</div>
			</h2>
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
		</Fragment>
	);
}
