/**
 * ActivityScores Widget
 *
 * Displays the website activity score widget with gauge, bar chart,
 * and personal record.
 */

import { useState, useEffect } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';
import Gauge from '../../components/Gauge';
import BarChart from '../../components/BarChart';
import BigCounter from '../../components/BigCounter';

/**
 * Get the streak message based on the current and max streak values.
 *
 * @param {number} maxStreak     - The maximum streak value.
 * @param {number} currentStreak - The current streak value.
 * @return {string} The streak message.
 */
function getStreakMessage( maxStreak, currentStreak ) {
	if ( maxStreak === 0 ) {
		return __(
			'This is the start of your first streak! Add content to your site every week and set a personal record!',
			'progress-planner'
		);
	}

	if ( maxStreak <= currentStreak ) {
		return sprintf(
			// translators: %s: number of weeks.
			_n(
				"Congratulations! You're on a streak! You've consistently maintained your website for the past %s week! 🎉",
				"Congratulations! You're on a streak! You've consistently maintained your website for the past %s weeks! 🎉",
				currentStreak,
				'progress-planner'
			),
			currentStreak
		);
	}

	if ( currentStreak >= 1 ) {
		const weeksToGo = maxStreak - currentStreak;
		return sprintf(
			// translators: %1$s: number of weeks for current streak. %2$s: number of weeks for max streak. %3$s: weeks to go.
			_n(
				"Keep it up! You've consistently maintained your website for the past %1$s week. Your longest streak was %2$s weeks, %3$s more to go to break your record!",
				"Keep it up! You've consistently maintained your website for the past %1$s weeks. Your longest streak was %2$s weeks, %3$s more to go to break your record!",
				currentStreak,
				'progress-planner'
			),
			currentStreak,
			maxStreak,
			weeksToGo
		);
	}

	return sprintf(
		// translators: %s: number of weeks for max streak.
		_n(
			'Get back to your streak! Your longest streak was %s week. Keep working on those website maintenance tasks every week and break your record!',
			'Get back to your streak! Your longest streak was %s weeks. Keep working on those website maintenance tasks every week and break your record!',
			maxStreak,
			'progress-planner'
		),
		maxStreak
	);
}

/**
 * ActivityScores component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ActivityScores component.
 */
function ActivityScores( { config = {} } ) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ data, setData ] = useState( null );

	/**
	 * Fetch activity scores data from REST API.
	 */
	useEffect( () => {
		const fetchData = async () => {
			try {
				const response = await apiFetch( {
					path: '/progress-planner/v1/activity-scores',
				} );

				setData( response );
				setIsLoading( false );
			} catch ( err ) {
				setError( err.message || 'Failed to load activity data' );
				setIsLoading( false );
			}
		};

		fetchData();
	}, [] );

	if ( isLoading ) {
		return <p>{ __( 'Loading…', 'progress-planner' ) }</p>;
	}

	if ( error ) {
		return <p>{ error }</p>;
	}

	if ( ! data ) {
		return <p>{ __( 'No data available.', 'progress-planner' ) }</p>;
	}

	const { score, gaugeColor, chartData, personalRecord } = data;
	const streakMessage = getStreakMessage(
		personalRecord.maxStreak,
		personalRecord.currentStreak
	);

	// Get title from config or use default.
	const widgetTitle =
		config?.title ||
		__( 'Your website activity score', 'progress-planner' );

	// Get info icon SVG from config.
	const infoIconSvg = config?.infoIconSvg || '';

	return (
		<>
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
								'Your website activity score is based on the amount of website maintenance work you have done over the past 30 days.',
								'progress-planner'
							) }
						</slot>
					</prpl-tooltip>
				</div>
			</h2>

			<div style={ { '--background': 'var(--prpl-background-monthly)' } }>
				<Gauge
					value={ score }
					max={ 100 }
					backgroundColor="var(--prpl-background-activity)"
					color={ gaugeColor }
					color2={ gaugeColor }
					contentFontSize="var(--prpl-font-size-6xl)"
				>
					{ score }
				</Gauge>
			</div>

			<hr />

			<p>
				{ __(
					'Check out your website activity in the past months:',
					'progress-planner'
				) }
			</p>
			<div
				className="prpl-graph-wrapper"
				style={ { maxHeight: '300px' } }
			>
				<BarChart data={ chartData } />
			</div>

			<hr />

			<BigCounter
				number={ String( personalRecord.maxStreak ) }
				label={ __( 'personal record', 'progress-planner' ) }
				backgroundColor="var(--prpl-background-activity)"
			/>

			<div className="prpl-widget-content">{ streakMessage }</div>
		</>
	);
}

// Register widget via hook
doAction( 'prpl.dashboard.registerWidget', {
	id: 'activity-scores',
	component: ActivityScores,
	priority: 10,
} );
