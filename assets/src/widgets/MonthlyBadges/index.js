/**
 * MonthlyBadges Widget
 *
 * Main widget component that displays the monthly badge gauge
 * with real-time updates on task completion.
 */

import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Gauge from '../../components/Gauge';
import Badge from '../../components/Badge';
import BadgeProgressBar from '../../components/BadgeProgressBar';
import PointsCounter from './PointsCounter';

/**
 * MonthlyBadges widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The MonthlyBadges widget.
 */
export default function MonthlyBadges( { config = {} } ) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ gaugeValue, setGaugeValue ] = useState( 0 );
	const [ maxPoints, setMaxPoints ] = useState( 10 );
	const [ currentBadge, setCurrentBadge ] = useState( null );
	const [ previousBadges, setPreviousBadges ] = useState( [] );
	const [ widgetConfig, setWidgetConfig ] = useState( {
		brandingId: config?.brandingId || 0,
		remoteServerUrl: config?.remoteServerUrl || '',
		placeholderUrl: config?.placeholderUrl || '',
	} );

	/**
	 * Calculate if the current badge is complete.
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

	/**
	 * Update progress when tasks are completed.
	 * Fills gauge first, then overflows to previous month progress bars.
	 *
	 * @param {number} amount - Points to add.
	 */
	const updateProgress = useCallback(
		( amount ) => {
			let remaining = amount;

			// First, fill the gauge
			setGaugeValue( ( prevValue ) => {
				const newValue = Math.min( prevValue + remaining, maxPoints );
				remaining -= newValue - prevValue;
				return newValue;
			} );

			// If there's overflow and previous badges exist, fill them
			if ( remaining > 0 && previousBadges.length > 0 ) {
				setPreviousBadges( ( prevBadges ) => {
					return prevBadges.map( ( badge ) => {
						if ( remaining <= 0 ) {
							return badge;
						}
						const badgeMax = badge.maxPoints || 10;
						const newPoints = Math.min(
							badge.points + remaining,
							badgeMax
						);
						remaining -= newPoints - badge.points;
						return { ...badge, points: newPoints };
					} );
				} );
			}
		},
		[ maxPoints, previousBadges.length ]
	);

	/**
	 * Fetch initial data from REST API.
	 */
	useEffect( () => {
		const fetchData = async () => {
			try {
				const response = await apiFetch( {
					path: '/progress-planner/v1/monthly-badges',
				} );

				setGaugeValue( response.score?.score || 0 );
				setMaxPoints( response.score?.target || 10 );
				setCurrentBadge( response.currentBadge || null );
				setPreviousBadges( response.previousIncompleteBadges || [] );
				setWidgetConfig( {
					brandingId: response.brandingId || config?.brandingId || 0,
					remoteServerUrl:
						response.remoteServerUrl ||
						config?.remoteServerUrl ||
						'',
					placeholderUrl:
						response.placeholderUrl || config?.placeholderUrl || '',
				} );
				setIsLoading( false );
			} catch ( err ) {
				setError(
					err.message ||
						__( 'Failed to load data', 'progress-planner' )
				);
				setIsLoading( false );
			}
		};

		fetchData();
	}, [] );

	/**
	 * Listen for task completion events.
	 */
	useEffect( () => {
		const handleTaskComplete = ( event ) => {
			const { points } = event.detail || {};
			if ( points && typeof points === 'number' ) {
				updateProgress( points );
			}
		};

		document.addEventListener( 'prpl-task-completed', handleTaskComplete );
		return () => {
			document.removeEventListener(
				'prpl-task-completed',
				handleTaskComplete
			);
		};
	}, [ updateProgress ] );

	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
	};

	const loadingStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '200px',
		color: 'var(--prpl-color-text)',
	};

	const errorStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '200px',
		color: 'var(--prpl-color-alert-error)',
	};

	// Get title from config or use default.
	const widgetTitle =
		config?.title || __( 'Your monthly badge', 'progress-planner' );

	if ( isLoading ) {
		return (
			<>
				<h2 className="prpl-widget-title">{ widgetTitle }</h2>
				<div
					className="prpl-monthly-badges prpl-monthly-badges--loading"
					style={ loadingStyle }
				>
					{ __( 'Loading…', 'progress-planner' ) }
				</div>
			</>
		);
	}

	if ( error ) {
		return (
			<>
				<h2 className="prpl-widget-title">{ widgetTitle }</h2>
				<div
					className="prpl-monthly-badges prpl-monthly-badges--error"
					style={ errorStyle }
				>
					{ error }
				</div>
			</>
		);
	}

	return (
		<>
			<h2 className="prpl-widget-title">{ widgetTitle }</h2>
			<div className="prpl-monthly-badges" style={ containerStyle }>
				{ /* Main gauge with current badge */ }
				<Gauge value={ gaugeValue } max={ maxPoints }>
					{ currentBadge && (
						<Badge
							badgeId={ currentBadge.id }
							badgeName={ currentBadge.name }
							brandingId={ widgetConfig.brandingId }
							remoteServerUrl={ widgetConfig.remoteServerUrl }
							placeholderUrl={ widgetConfig.placeholderUrl }
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
										remoteServerUrl={
											widgetConfig.remoteServerUrl
										}
										placeholderUrl={
											widgetConfig.placeholderUrl
										}
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
