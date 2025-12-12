/**
 * ContentBadges Widget
 *
 * Displays the content badges widget with gauge and badge grid.
 */

import { Fragment } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
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

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'badge-streak-content',
	component: ContentBadges,
	priority: 10,
	width: 1,
	forceLastColumn: true,
	title: __( 'Your content badges', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );
