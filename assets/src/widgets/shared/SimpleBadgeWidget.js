/**
 * SimpleBadgeWidget Component
 *
 * Configurable badge widget used by ContentBadges and StreakBadges.
 * Provides a consistent layout with gauge, progress info, and badge grid.
 */

import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useBadgeData } from '../../hooks/useBadgeData';
import { useBadgeProgress } from '../../hooks/useBadgeProgress';
import { useBadgeProgressSave } from '../../hooks/useBadgeProgressSave';
import { CONTENT_BADGES, MAINTENANCE_BADGES } from '../../config/badges';
import BadgeProgressInfo from '../../components/BadgeProgressInfo';
import BadgeGrid from '../../components/BadgeGrid';
import { ErrorState, EmptyState } from '../../components/WidgetStates';
import SimpleBadgeWidgetSkeleton from './SimpleBadgeWidgetSkeleton';

/**
 * SimpleBadgeWidget component.
 *
 * @param {Object}   props                  - Component props.
 * @param {string}   props.badgeType        - Badge type: 'content' or 'maintenance'.
 * @param {string}   props.introText        - Introduction/description text.
 * @param {string}   props.backgroundColor  - Background color CSS variable.
 * @param {string}   props.badgeGroupClass  - CSS class for badge group.
 * @param {Function} props.getRemainingText - Function that returns remaining text for a given count.
 * @return {JSX.Element} The SimpleBadgeWidget component.
 */
export default function SimpleBadgeWidget( {
	badgeType,
	introText,
	backgroundColor,
	badgeGroupClass = '',
	getRemainingText,
} ) {
	const { isLoading, error, data } = useBadgeData();

	// Calculate badge progress.
	const badgeProgress = useBadgeProgress( {
		activities: data?.activities || [],
		savedStats: data?.savedStats || {},
		totalPostsCount: data?.totalPostsCount || 0,
		activationDate: data?.activationDate
			? new Date( data.activationDate )
			: null,
	} );

	// Automatically save progress when it changes.
	useBadgeProgressSave( badgeProgress, data?.savedStats || {} );

	// Get badges for this type.
	const badges = useMemo( () => {
		return badgeType === 'content' ? CONTENT_BADGES : MAINTENANCE_BADGES;
	}, [ badgeType ] );

	// Get current badge (first incomplete).
	const currentBadge = useMemo( () => {
		for ( const badge of badges ) {
			const progress = badgeProgress[ badge.id ];
			if ( progress && progress.progress < 100 ) {
				return {
					id: badge.id,
					name: badge.name,
					background: badge.background,
					progress: progress.progress,
					remaining: progress.remaining,
				};
			}
		}
		return null;
	}, [ badges, badgeProgress ] );

	// Get all badges with progress.
	const allBadges = useMemo( () => {
		return badges.map( ( badge ) => {
			const progress = badgeProgress[ badge.id ] || {
				progress: 0,
				remaining: 0,
			};
			return {
				id: badge.id,
				name: badge.name,
				progress: progress.progress,
				isComplete: progress.progress >= 100,
			};
		} );
	}, [ badges, badgeProgress ] );

	if ( isLoading ) {
		return (
			<SimpleBadgeWidgetSkeleton backgroundColor={ backgroundColor } />
		);
	}

	if ( error ) {
		return <ErrorState message={ error } simple />;
	}

	if ( ! currentBadge ) {
		return (
			<EmptyState
				message={ __( 'No badge data available.', 'progress-planner' ) }
			/>
		);
	}

	return (
		<>
			<p>{ introText }</p>

			<BadgeProgressInfo
				badge={ currentBadge }
				config={ data?.config || {} }
				backgroundColor={ backgroundColor }
				getRemainingText={ getRemainingText }
			/>

			<hr />

			<div className="prpl-badges-container-achievements">
				<BadgeGrid
					badges={ allBadges }
					config={ data?.config || {} }
					backgroundColor={ backgroundColor }
					className={ badgeGroupClass }
				/>
			</div>
		</>
	);
}
