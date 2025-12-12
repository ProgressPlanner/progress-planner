/**
 * BadgeProgressInfo Component
 *
 * Displays current badge progress with a Gauge visualization.
 * Used by ContentBadges, StreakBadges, and other badge widgets.
 */

import { __, sprintf } from '@wordpress/i18n';
import Gauge from '../Gauge';
import Badge from '../Badge';

/**
 * BadgeProgressInfo component.
 *
 * @param {Object}   props                  - Component props.
 * @param {Object}   props.badge            - Current badge object.
 * @param {Object}   props.config           - Badge config (brandingId).
 * @param {string}   props.backgroundColor  - Background color CSS variable for gauge.
 * @param {Function} props.getRemainingText - Function to get remaining text based on badge.remaining.
 * @return {JSX.Element} The BadgeProgressInfo component.
 */
export default function BadgeProgressInfo( {
	badge,
	config,
	backgroundColor = 'var(--prpl-background-content-badge)',
	getRemainingText,
} ) {
	const progressLabelStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: '1rem',
		marginBottom: 0,
	};

	const percentStyle = {
		fontWeight: 600,
		fontSize: 'var(--prpl-font-size-3xl)',
	};

	return (
		<div className="prpl-latest-badges-wrapper">
			<Gauge
				value={ badge.progress }
				max={ 100 }
				backgroundColor={ badge.background || backgroundColor }
				color="var(--prpl-color-monthly)"
				color2="var(--prpl-color-monthly-2)"
			>
				<Badge
					badgeId={ badge.id }
					badgeName={ badge.name }
					brandingId={ config.brandingId }
					isComplete={ true }
				/>
			</Gauge>
			<div className="prpl-badge-content-wrapper">
				<p style={ progressLabelStyle }>
					<span>
						{ sprintf(
							/* translators: %s: The badge name. */
							__( 'Progress %s', 'progress-planner' ),
							badge.name
						) }
					</span>
					<span style={ percentStyle }>{ badge.progress }%</span>
				</p>
				<p style={ { marginTop: 0 } }>
					{ getRemainingText( badge.remaining ) }
				</p>
			</div>
		</div>
	);
}
