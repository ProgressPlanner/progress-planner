/**
 * ContentActivity Widget
 *
 * Main widget component for displaying content activity statistics.
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import BigCounter from '../../components/BigCounter';
import LineChart from '../../components/LineChart';
import ActivityTable from './ActivityTable';

/**
 * Loading spinner component.
 *
 * @return {JSX.Element} The loading spinner.
 */
function LoadingSpinner() {
	const spinnerStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '2em',
	};

	return (
		<div className="prpl-content-activity__loading" style={ spinnerStyle }>
			{ __( 'Loading…', 'progress-planner' ) }
		</div>
	);
}

/**
 * Error display component.
 *
 * @param {Object} props         - Component props.
 * @param {string} props.message - Error message.
 * @return {JSX.Element} The error display.
 */
function ErrorDisplay( { message } ) {
	const errorStyle = {
		padding: '1em',
		backgroundColor: 'var(--prpl-color-error-background, #fee)',
		color: 'var(--prpl-color-error, #c00)',
		borderRadius: 'var(--prpl-border-radius)',
	};

	return (
		<div className="prpl-content-activity__error" style={ errorStyle }>
			{ message }
		</div>
	);
}

/**
 * ContentActivity widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ContentActivity widget.
 */
export default function ContentActivity( { config = {} } ) {
	const [ data, setData ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/progress-planner/v1/content-activity' } )
			.then( ( response ) => {
				setData( response );
				setError( null );
			} )
			.catch( ( err ) => {
				setError(
					err.message ||
						__(
							'Failed to load content activity data.',
							'progress-planner'
						)
				);
			} )
			.finally( () => {
				setLoading( false );
			} );
	}, [] );

	if ( loading ) {
		return <LoadingSpinner />;
	}

	if ( error ) {
		return <ErrorDisplay message={ error } />;
	}

	if ( ! data ) {
		return null;
	}

	// Get title from config or use default.
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
