/**
 * MonthlyBadges Widget
 *
 * Main widget component that displays the monthly badge gauge
 * with real-time updates on task completion.
 */

import { useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { useBadgeData } from '../../hooks/useBadgeData';
import { useBadgeProgress } from '../../hooks/useBadgeProgress';
import { useBadgeProgressSave } from '../../hooks/useBadgeProgressSave';
import {
	getMonthlyBadgeIdFromDate,
	getMonthlyBadgeNameFromDate,
	MONTHLY_BADGE_CONFIG,
} from '../../config/badges';
import Gauge from '../../components/Gauge';
import Badge from '../../components/Badge';
import BadgeProgressBar from '../../components/BadgeProgressBar';
import PointsCounter from './PointsCounter';
import { LoadingState, ErrorState } from '../../components/WidgetStates';
import WidgetHeader from '../../components/WidgetHeader';
import { useDashboard } from '../../context/DashboardContext';

/**
 * MonthlyBadges widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The MonthlyBadges widget.
 */
function MonthlyBadges( { config = {} } ) {
	// Get session points from context for real-time updates.
	const { sessionPoints } = useDashboard();

	const { isLoading, error, data } = useBadgeData();

	// Get monthly badge date range function.
	const getMonthlyBadgeDateRange = useCallback( ( badgeId ) => {
		if ( ! badgeId.startsWith( 'monthly-' ) ) {
			return null;
		}

		const parts = badgeId.split( '-' );
		if ( parts.length !== 3 ) {
			return null;
		}

		const year = parseInt( parts[ 1 ], 10 );
		const monthStr = parts[ 2 ].replace( 'm', '' );
		const month = parseInt( monthStr, 10 );

		if ( ! year || month < 1 || month > 12 ) {
			return null;
		}

		const startDate = new Date( year, month - 1, 1 );
		startDate.setHours( 0, 0, 0, 0 );

		const endDate = new Date( year, month, 0 );
		endDate.setHours( 23, 59, 59, 999 );

		return { startDate, endDate };
	}, [] );

	// Calculate badge progress.
	const badgeProgress = useBadgeProgress( {
		activities: data?.activities || [],
		savedStats: data?.savedStats || {},
		totalPostsCount: data?.totalPostsCount || 0,
		activationDate: data?.activationDate
			? new Date( data.activationDate )
			: null,
		getMonthlyBadgeDateRange,
	} );

	// Automatically save progress when it changes.
	useBadgeProgressSave( badgeProgress, data?.savedStats || {} );

	// Get current month badge.
	const currentBadge = useMemo( () => {
		const now = new Date();
		const badgeId = getMonthlyBadgeIdFromDate( now );
		const badgeName = getMonthlyBadgeNameFromDate( now );
		const progress = badgeProgress[ badgeId ] || {
			progress: 0,
			remaining: 10,
			points: 0,
		};

		return {
			id: badgeId,
			name: badgeName,
			progress,
		};
	}, [ badgeProgress ] );

	// Get previous incomplete badges.
	const previousBadges = useMemo( () => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		const incomplete = [];

		// Check previous 12 months.
		for ( let i = 1; i <= 12; i++ ) {
			const checkDate = new Date( currentYear, currentMonth - i, 1 );
			const badgeId = getMonthlyBadgeIdFromDate( checkDate );
			const progress = badgeProgress[ badgeId ];

			if ( progress && progress.progress < 100 ) {
				const badgeName = getMonthlyBadgeNameFromDate( checkDate );
				incomplete.push( {
					id: badgeId,
					name: badgeName,
					points: progress.points || 0,
					maxPoints: MONTHLY_BADGE_CONFIG.targetPoints,
				} );
			}
		}

		return incomplete;
	}, [ badgeProgress ] );

	// Calculate effective gauge value by adding session points.
	const baseGaugeValue = currentBadge?.progress?.points || 0;
	const gaugeValue = baseGaugeValue + sessionPoints;
	const maxPoints = MONTHLY_BADGE_CONFIG.targetPoints;
	const widgetConfig = data?.config || {
		brandingId: config?.brandingId || 0,
	};

	/**
	 * Calculate if the current badge is complete (including session points).
	 */
	const isComplete = gaugeValue >= maxPoints;

	/**
	 * Calculate remaining points and days remaining for previous badges.
	 */
	const previousBadgesData = useMemo( () => {
		if ( previousBadges.length === 0 ) {
			return [];
		}

		// Calculate current month remaining points
		const currentMonthRemaining = Math.max( 0, maxPoints - gaugeValue );

		// Calculate accumulated remaining points
		let accumulatedRemaining = currentMonthRemaining;
		const badgesWithRemaining = previousBadges.map( ( badge ) => {
			const badgeRemaining = Math.max(
				0,
				( badge.maxPoints || 10 ) - badge.points
			);
			accumulatedRemaining += badgeRemaining;
			return {
				...badge,
				remaining: badgeRemaining,
				accumulatedRemaining,
			};
		} );

		// Calculate days remaining in current month
		const now = new Date();
		const daysInMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0
		).getDate();
		const daysRemaining = daysInMonth - now.getDate();

		return badgesWithRemaining.map( ( badge ) => ( {
			...badge,
			daysRemaining,
		} ) );
	}, [ previousBadges, maxPoints, gaugeValue ] );

	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
	};

	// Get title from config or use default.
	const widgetTitle =
		config?.title || __( 'Your monthly badge', 'progress-planner' );

	if ( isLoading ) {
		return (
			<>
				<WidgetHeader title={ widgetTitle } />
				<LoadingState
					className="prpl-monthly-badges prpl-monthly-badges--loading"
					style={ { minHeight: '200px' } }
				/>
			</>
		);
	}

	if ( error ) {
		return (
			<>
				<WidgetHeader title={ widgetTitle } />
				<ErrorState
					message={ error }
					className="prpl-monthly-badges prpl-monthly-badges--error"
					style={ {
						minHeight: '200px',
						backgroundColor: 'transparent',
						color: 'var(--prpl-color-alert-error)',
					} }
				/>
			</>
		);
	}

	return (
		<>
			<WidgetHeader title={ widgetTitle } />
			<div className="prpl-monthly-badges" style={ containerStyle }>
				{ /* Main gauge with current badge */ }
				<Gauge value={ gaugeValue } max={ maxPoints }>
					{ currentBadge && (
						<Badge
							badgeId={ currentBadge.id }
							badgeName={ currentBadge.name }
							brandingId={ widgetConfig.brandingId }
							isComplete={ isComplete }
						/>
					) }
				</Gauge>

				{ /* Points counter */ }
				<PointsCounter
					points={ gaugeValue }
					label={ __( 'Progress monthly badge', 'progress-planner' ) }
				/>

				{ /* Progress bars for previous incomplete months */ }
				{ previousBadges.length > 0 && (
					<>
						<hr />
						<div className="prpl-previous-month-badge-progress-bars-wrapper">
							<h3>
								{ __(
									'Oh no! You missed the previous monthly badge!',
									'progress-planner'
								) }
							</h3>
							<p
								className="prpl-previous-month-badge-progress-bars-wrapper-description"
								dangerouslySetInnerHTML={ {
									__html: __(
										'No worries though! <strong>Collect the surplus of points</strong> you earn, and get your badge!',
										'progress-planner'
									),
								} }
							/>
							{ previousBadgesData.map( ( badge ) => (
								<div
									key={ badge.id }
									className="prpl-previous-month-badge-progress-bar-wrapper"
									style={ {
										borderRadius: '0.5rem',
										padding: '0.75rem 1rem 1.25rem 1rem',
									} }
									data-badge-id={ badge.id }
								>
									<BadgeProgressBar
										badgeId={ badge.id }
										badgeName={ badge.name }
										points={ badge.points }
										maxPoints={ badge.maxPoints || 10 }
										remaining={ badge.remaining }
										accumulatedRemaining={
											badge.accumulatedRemaining
										}
										daysRemaining={ badge.daysRemaining }
										brandingId={ widgetConfig.brandingId }
									/>
								</div>
							) ) }
						</div>
					</>
				) }
			</div>
		</>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'monthly-badges',
	component: MonthlyBadges,
	priority: 10,
	width: 1,
	forceLastColumn: false,
	title: __( 'Your monthly badge', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );
