/**
 * ActivityScores Widget
 *
 * Displays the website activity score widget with gauge, bar chart,
 * and personal record.
 */

import { useMemo } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { registerWidget } from '../../utils/widgetRegistry';
import Gauge from '../../components/Gauge';
import BarChart from '../../components/BarChart';
import BigCounter from '../../components/BigCounter';
import WidgetHeader from '../../components/WidgetHeader';
import { ErrorState, EmptyState } from '../../components/WidgetStates';
import ActivityScoresSkeleton from './ActivityScoresSkeleton';
import { useApiData } from '../../hooks/useApiData';
import { useDashboardStore } from '../../stores/dashboardStore';

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
 * Get the gauge color based on score.
 *
 * @param {number} score - The score value.
 * @return {string} The color CSS variable.
 */
function getGaugeColor( score ) {
	if ( score >= 75 ) {
		return 'var(--prpl-graph-color-3)';
	}
	if ( score >= 50 ) {
		return 'var(--prpl-color-monthly)';
	}
	return 'var(--prpl-graph-color-1)';
}

/**
 * Get the color for a chart bar based on value and date label.
 *
 * @param {number} value     - The value for this period.
 * @param {string} label     - The label for this period (e.g., "Jan", "Feb" for monthly, or date string for weekly).
 * @param {string} frequency - The frequency ('monthly' or 'weekly').
 * @return {string} The color CSS variable.
 */
function getChartColor( value, label, frequency ) {
	const now = new Date();

	// If monthly and the latest month, return gray (in progress).
	if ( frequency === 'monthly' ) {
		// Chart labels are formatted as 'M' which gives month abbreviations like "Jan", "Feb"
		const currentMonth = now.toLocaleString( 'default', {
			month: 'short',
		} );
		if ( label === currentMonth ) {
			return 'var(--prpl-color-border)';
		}
	}

	// If weekly and the current week, return gray (in progress).
	if ( frequency === 'weekly' ) {
		// For weekly, labels might be in date format - we'll check if it's the current week
		// by checking if the label represents a date in the current week
		try {
			const labelDate = new Date( label );
			if ( ! isNaN( labelDate.getTime() ) ) {
				const weekStart = new Date( now );
				weekStart.setDate( now.getDate() - now.getDay() );
				weekStart.setHours( 0, 0, 0, 0 );
				const weekEnd = new Date( weekStart );
				weekEnd.setDate( weekStart.getDate() + 6 );
				weekEnd.setHours( 23, 59, 59, 999 );

				if ( labelDate >= weekStart && labelDate <= weekEnd ) {
					return 'var(--prpl-color-border)';
				}
			}
		} catch ( e ) {
			// If label parsing fails, continue with value-based colors
		}
	}

	// Value-based colors
	if ( value > 90 ) {
		return 'var(--prpl-graph-color-3)';
	}
	if ( value > 30 ) {
		return 'var(--prpl-color-monthly)';
	}
	return 'var(--prpl-graph-color-1)';
}

/**
 * ActivityScores component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ActivityScores component.
 */
function ActivityScores( { config = {} } ) {
	// Get session points from Zustand store for real-time updates.
	const sessionPoints = useDashboardStore( ( state ) => state.sessionPoints );

	// Get range and frequency from global config (set by URL params via PHP)
	const globalConfig = window.prplDashboardConfig || {};
	const range = globalConfig.currentRange || '-6 months';
	const frequency = globalConfig.currentFrequency || 'monthly';
	const apiPath = `/progress-planner/v1/widgets/activity-scores?range=${ encodeURIComponent(
		range
	) }&frequency=${ encodeURIComponent( frequency ) }`;

	const { isLoading, error, data } = useApiData(
		apiPath,
		[],
		'Failed to load activity data'
	);

	// Get title - defined early for use in loading state.
	const widgetTitle =
		config?.title ||
		__( 'Your website activity score', 'progress-planner' );

	// Calculate effective score by adding session points to API score.
	const effectiveScore = useMemo( () => {
		if ( ! data?.score ) {
			return 0;
		}
		// Cap at 100 since it's a percentage.
		return Math.min( 100, data.score + sessionPoints );
	}, [ data?.score, sessionPoints ] );

	if ( isLoading ) {
		return (
			<>
				<WidgetHeader title={ widgetTitle } />
				<ActivityScoresSkeleton />
			</>
		);
	}

	if ( error ) {
		return <ErrorState message={ error } simple />;
	}

	if ( ! data ) {
		return <EmptyState />;
	}

	const { chartData, personalRecord } = data;
	const gaugeColor = getGaugeColor( effectiveScore );

	// Add colors to chart data (presentation logic in React).
	const chartDataWithColors = chartData.map( ( item ) => ( {
		...item,
		color: getChartColor( item.score, item.label, frequency ),
	} ) );
	const streakMessage = getStreakMessage(
		personalRecord.maxStreak,
		personalRecord.currentStreak
	);

	return (
		<>
			<WidgetHeader
				title={ widgetTitle }
				tooltipContent={ __(
					'Your website activity score is based on the amount of website maintenance work you have done over the past 30 days.',
					'progress-planner'
				) }
			/>

			<div style={ { '--background': 'var(--prpl-background-monthly)' } }>
				<Gauge
					value={ effectiveScore }
					max={ 100 }
					backgroundColor="var(--prpl-background-activity)"
					color={ gaugeColor }
					color2={ gaugeColor }
					contentFontSize="var(--prpl-font-size-6xl)"
				>
					{ effectiveScore }
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
				<BarChart data={ chartDataWithColors } />
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

// Register widget
registerWidget( {
	id: 'activity-scores',
	component: ActivityScores,
	priority: 4,
	width: 1,
	forceLastColumn: false,
	title: __( 'Your website activity score', 'progress-planner' ),
} );

export default ActivityScores;
