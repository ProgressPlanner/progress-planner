/**
 * ContentActivity Widget
 *
 * Main widget component for displaying content activity statistics.
 */

import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import BigCounter from '../../components/BigCounter';
import LineChart from '../../components/LineChart';
import ActivityTable from './ActivityTable';
import { LoadingState, ErrorState } from '../../components/WidgetStates';
import { useApiData } from '../../hooks/useApiData';

/**
 * ContentActivity widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ContentActivity widget.
 */
function ContentActivity( { config = {} } ) {
	const range = '-6 months';
	const frequency = 'monthly';
	const apiPath = `/progress-planner/v1/widgets/content-activity?range=${ encodeURIComponent(
		range
	) }&frequency=${ encodeURIComponent( frequency ) }`;

	const { isLoading, error, data } = useApiData(
		apiPath,
		[],
		__( 'Failed to load content activity data.', 'progress-planner' )
	);

	if ( isLoading ) {
		return <LoadingState className="prpl-content-activity__loading" />;
	}

	if ( error ) {
		return (
			<ErrorState
				message={ error }
				className="prpl-content-activity__error"
			/>
		);
	}

	if ( ! data ) {
		return null;
	}

	// Get title - will come from widget registry metadata
	const widgetTitle =
		config?.title || __( 'Content activity', 'progress-planner' );

	const graphWrapperStyle = {
		marginBottom: 'var(--prpl-padding)',
	};

	return (
		<div className="prpl-content-activity">
			<h2 className="prpl-widget-title">{ widgetTitle }</h2>
			<p>
				{ data.i18n?.description ||
					__(
						'Here are the updates you made to your content last week. Whether you published something new, updated an existing post, or removed outdated content, it all helps you stay on top of your site!',
						'progress-planner'
					) }
			</p>
			<BigCounter
				number={ data.totalCount }
				label={
					data.i18n?.piecesOfContentManaged ||
					__( 'pieces of content managed', 'progress-planner' )
				}
				backgroundColor="var(--prpl-background-content)"
			/>
			<div className="prpl-graph-wrapper" style={ graphWrapperStyle }>
				<LineChart
					data={ data.chartData }
					options={ data.chartOptions }
				/>
			</div>
			<ActivityTable
				activityTypes={ data.activityTypes }
				weeklyActivity={ data.weeklyActivity }
				totalCount={ data.weeklyTotalCount }
			/>
		</div>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'content-activity',
	component: ContentActivity,
	priority: 10,
	width: 1,
	forceLastColumn: false,
	title: __( 'Content activity', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );
