/**
 * SimpleBadgeWidget Component
 *
 * Configurable badge widget used by ContentBadges and StreakBadges.
 * Provides a consistent layout with gauge, progress info, and badge grid.
 */

import { __ } from '@wordpress/i18n';
import { useBadgeData } from '../../hooks/useBadgeData';
import BadgeProgressInfo from '../../components/BadgeProgressInfo';
import BadgeGrid from '../../components/BadgeGrid';

/**
 * SimpleBadgeWidget component.
 *
 * @param {Object}   props                  - Component props.
 * @param {string}   props.endpoint         - REST API endpoint path.
 * @param {string}   props.introText        - Introduction/description text.
 * @param {string}   props.backgroundColor  - Background color CSS variable.
 * @param {string}   props.badgeGroupClass  - CSS class for badge group.
 * @param {Function} props.getRemainingText - Function that returns remaining text for a given count.
 * @return {JSX.Element} The SimpleBadgeWidget component.
 */
export default function SimpleBadgeWidget( {
	endpoint,
	introText,
	backgroundColor,
	badgeGroupClass = '',
	getRemainingText,
} ) {
	const { isLoading, error, data } = useBadgeData( endpoint );

	if ( isLoading ) {
		return <p>{ __( 'Loading…', 'progress-planner' ) }</p>;
	}

	if ( error ) {
		return <p>{ error }</p>;
	}

	if ( ! data?.currentBadge ) {
		return <p>{ __( 'No badge data available.', 'progress-planner' ) }</p>;
	}

	const { currentBadge, allBadges, config } = data;

	return (
		<>
			<p>{ introText }</p>

			<BadgeProgressInfo
				badge={ currentBadge }
				config={ config }
				backgroundColor={ backgroundColor }
				getRemainingText={ getRemainingText }
			/>

			<hr />

			<div className="prpl-badges-container-achievements">
				<BadgeGrid
					badges={ allBadges }
					config={ config }
					backgroundColor={ backgroundColor }
					className={ badgeGroupClass }
				/>
			</div>
		</>
	);
}
