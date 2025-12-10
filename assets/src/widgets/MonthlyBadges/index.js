/**
 * MonthlyBadges Widget
 *
 * Main widget component that displays the monthly badge gauge
 * with real-time updates on task completion.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Gauge from '../../components/Gauge';
import Badge from '../../components/Badge';
import BadgeProgressBar from '../../components/BadgeProgressBar';
import PointsCounter from './PointsCounter';

/**
 * MonthlyBadges widget component.
 *
 * @return {JSX.Element} The MonthlyBadges widget.
 */
export default function MonthlyBadges() {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ gaugeValue, setGaugeValue ] = useState( 0 );
	const [ maxPoints, setMaxPoints ] = useState( 10 );
	const [ currentBadge, setCurrentBadge ] = useState( null );
	const [ previousBadges, setPreviousBadges ] = useState( [] );
	const [ config, setConfig ] = useState( {
		brandingId: 0,
		remoteServerUrl: '',
		placeholderUrl: '',
	} );

	/**
	 * Calculate if the current badge is complete.
	 */
	const isComplete = gaugeValue >= maxPoints;

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
				setConfig( {
					brandingId: response.brandingId || 0,
					remoteServerUrl: response.remoteServerUrl || '',
					placeholderUrl: response.placeholderUrl || '',
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

	const progressBarsContainerStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
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

	if ( isLoading ) {
		return (
			<div
				className="prpl-monthly-badges prpl-monthly-badges--loading"
				style={ loadingStyle }
			>
				{ __( 'Loading…', 'progress-planner' ) }
			</div>
		);
	}

	if ( error ) {
		return (
			<div
				className="prpl-monthly-badges prpl-monthly-badges--error"
				style={ errorStyle }
			>
				{ error }
			</div>
		);
	}

	return (
		<div className="prpl-monthly-badges" style={ containerStyle }>
			{ /* Progress bars for previous incomplete months */ }
			{ previousBadges.length > 0 && (
				<div
					className="prpl-monthly-badges__previous-badges"
					style={ progressBarsContainerStyle }
				>
					{ previousBadges.map( ( badge ) => (
						<BadgeProgressBar
							key={ badge.id }
							badgeId={ badge.id }
							badgeName={ badge.name }
							points={ badge.points }
							maxPoints={ badge.maxPoints || 10 }
							brandingId={ config.brandingId }
							remoteServerUrl={ config.remoteServerUrl }
							placeholderUrl={ config.placeholderUrl }
						/>
					) ) }
				</div>
			) }

			{ /* Main gauge with current badge */ }
			<Gauge value={ gaugeValue } max={ maxPoints }>
				{ currentBadge && (
					<Badge
						badgeId={ currentBadge.id }
						badgeName={ currentBadge.name }
						brandingId={ config.brandingId }
						remoteServerUrl={ config.remoteServerUrl }
						placeholderUrl={ config.placeholderUrl }
						isComplete={ isComplete }
					/>
				) }
			</Gauge>

			{ /* Points counter */ }
			<PointsCounter
				points={ gaugeValue }
				label={ __( 'Progress monthly badge', 'progress-planner' ) }
			/>
		</div>
	);
}
