/**
 * LineChart Component
 *
 * Displays an SVG line chart with multiple series and filter checkboxes.
 */

import { useState, useMemo, useCallback } from '@wordpress/element';
import ChartFilters from './ChartFilters';

/**
 * Default options for the chart.
 */
const DEFAULT_OPTIONS = {
	aspectRatio: 2,
	height: 300,
	axisOffset: 16,
	strokeWidth: 4,
	dataArgs: {},
	axisColor: 'var(--prpl-color-border)',
	rulersColor: 'var(--prpl-color-border)',
	filtersLabel: '',
};

/**
 * LineChart component.
 *
 * @param {Object} props         - Component props.
 * @param {Object} props.data    - Chart data object with series keys.
 * @param {Object} props.options - Chart options.
 * @return {JSX.Element} The LineChart component.
 */
export default function LineChart( { data, options: propOptions } ) {
	const options = useMemo(
		() => ( {
			...DEFAULT_OPTIONS,
			...propOptions,
		} ),
		[ propOptions ]
	);

	const [ visibleSeries, setVisibleSeries ] = useState( () =>
		Object.keys( options.dataArgs )
	);

	/**
	 * Toggle series visibility.
	 *
	 * @param {string} key - The series key to toggle.
	 */
	const toggleSeries = useCallback( ( key ) => {
		setVisibleSeries( ( prev ) =>
			prev.includes( key )
				? prev.filter( ( k ) => k !== key )
				: [ ...prev, key ]
		);
	}, [] );

	/**
	 * Get the maximum value from visible series data.
	 *
	 * @return {number} The maximum value.
	 */
	const getMaxValue = useCallback( () => {
		return Object.keys( data ).reduce( ( max, key ) => {
			if ( visibleSeries.includes( key ) ) {
				return Math.max(
					max,
					data[ key ].reduce(
						( _max, item ) => Math.max( _max, item.score ),
						0
					)
				);
			}
			return max;
		}, 0 );
	}, [ data, visibleSeries ] );

	/**
	 * Get padded maximum value for axis scaling.
	 *
	 * @return {number} The padded maximum value.
	 */
	const getMaxValuePadded = useCallback( () => {
		const max = getMaxValue();
		const maxValue = 100 > max && 70 < max ? 100 : max;
		return Math.max(
			100 === maxValue ? 100 : parseInt( maxValue * 1.1, 10 ),
			1
		);
	}, [ getMaxValue ] );

	/**
	 * Get the optimal Y-axis step divider (3, 4, or 5).
	 *
	 * @return {number} The step divider.
	 */
	const getYLabelsStepsDivider = useCallback( () => {
		const maxValuePadded = getMaxValuePadded();
		const stepsRemainders = {
			4: maxValuePadded % 4,
			5: maxValuePadded % 5,
			3: maxValuePadded % 3,
		};
		const smallestRemainder = Math.min(
			...Object.values( stepsRemainders )
		);
		return parseInt(
			Object.keys( stepsRemainders ).find(
				( key ) => stepsRemainders[ key ] === smallestRemainder
			),
			10
		);
	}, [ getMaxValuePadded ] );

	/**
	 * Get Y-axis labels.
	 *
	 * @return {number[]} Array of Y-axis label values.
	 */
	const getYLabels = useCallback( () => {
		const maxValuePadded = getMaxValuePadded();
		const yLabelsStepsDivider = getYLabelsStepsDivider();
		const yLabelsStep = maxValuePadded / yLabelsStepsDivider;
		const yLabels = [];

		if ( 100 === maxValuePadded || 15 > maxValuePadded ) {
			for ( let i = 0; i <= yLabelsStepsDivider; i++ ) {
				yLabels.push( parseInt( yLabelsStep * i, 10 ) );
			}
		} else {
			for ( let i = 0; i <= yLabelsStepsDivider; i++ ) {
				yLabels.push(
					Math.min( maxValuePadded, Math.round( yLabelsStep * i ) )
				);
			}
		}

		return yLabels;
	}, [ getMaxValuePadded, getYLabelsStepsDivider ] );

	/**
	 * Calculate Y coordinate for a value.
	 *
	 * @param {number} value - The data value.
	 * @return {number} The Y coordinate.
	 */
	const calcYCoordinate = useCallback(
		( value ) => {
			const maxValuePadded = getMaxValuePadded();
			const multiplier =
				( options.height - options.axisOffset * 2 ) / options.height;
			const yCoordinate =
				( maxValuePadded - value * multiplier ) *
					( options.height / maxValuePadded ) -
				options.axisOffset;
			return yCoordinate - options.strokeWidth / 2;
		},
		[
			getMaxValuePadded,
			options.height,
			options.axisOffset,
			options.strokeWidth,
		]
	);

	/**
	 * Get distance between X-axis points.
	 *
	 * @return {number} The distance.
	 */
	const getXDistanceBetweenPoints = useCallback( () => {
		const firstKey = Object.keys( data )[ 0 ];
		if ( ! firstKey || ! data[ firstKey ] ) {
			return 0;
		}
		return Math.round(
			( options.height * options.aspectRatio - 3 * options.axisOffset ) /
				( data[ firstKey ].length - 1 )
		);
	}, [ data, options.height, options.aspectRatio, options.axisOffset ] );

	// Calculate SVG viewBox dimensions
	const svgWidth = parseInt(
		options.height * options.aspectRatio + options.axisOffset * 2,
		10
	);
	const svgHeight = parseInt( options.height + options.axisOffset * 2, 10 );

	// Get X-axis labels data
	const firstSeriesKey = Object.keys( data )[ 0 ];
	const firstSeriesData = firstSeriesKey ? data[ firstSeriesKey ] : [];
	const dataLength = firstSeriesData.length;
	const labelsXDivider = Math.max( 1, Math.round( dataLength / 6 ) );

	const containerStyle = {
		width: '100%',
	};

	const svgContainerStyle = {
		width: '100%',
	};

	return (
		<div className="prpl-line-chart" style={ containerStyle }>
			{ Object.keys( options.dataArgs ).length > 1 && (
				<ChartFilters
					dataArgs={ options.dataArgs }
					visibleSeries={ visibleSeries }
					filtersLabel={ options.filtersLabel }
					onToggle={ toggleSeries }
				/>
			) }
			<div
				className="prpl-line-chart__svg-container"
				style={ svgContainerStyle }
			>
				<svg
					className="prpl-line-chart__svg"
					viewBox={ `0 0 ${ svgWidth } ${ svgHeight }` }
				>
					{ /* X Axis Line */ }
					<g className="prpl-line-chart__x-axis">
						<line
							x1={ options.axisOffset * 3 }
							x2={ options.aspectRatio * options.height }
							y1={ options.height - options.axisOffset }
							y2={ options.height - options.axisOffset }
							stroke={ options.axisColor }
							strokeWidth="1"
						/>
					</g>

					{ /* Y Axis Line */ }
					<g className="prpl-line-chart__y-axis">
						<line
							x1={ options.axisOffset * 3 }
							x2={ options.axisOffset * 3 }
							y1={ options.axisOffset }
							y2={ options.height - options.axisOffset }
							stroke={ options.axisColor }
							strokeWidth="1"
						/>
					</g>

					{ /* X Axis Labels and Rulers */ }
					{ firstSeriesData.map( ( item, index ) => {
						const labelXCoordinate =
							getXDistanceBetweenPoints() * index +
							options.axisOffset * 2;

						// Only show up to 6 labels
						if (
							dataLength > 6 &&
							index !== 0 &&
							index % labelsXDivider !== 0
						) {
							return null;
						}

						return (
							<g
								key={ `x-label-${ index }` }
								className="prpl-line-chart__x-label"
							>
								<text
									x={ labelXCoordinate }
									y={ options.height + options.axisOffset }
								>
									{ item.label }
								</text>
								{ index !== 0 && (
									<line
										x1={
											labelXCoordinate +
											options.axisOffset
										}
										x2={
											labelXCoordinate +
											options.axisOffset
										}
										y1={ options.axisOffset }
										y2={
											options.height - options.axisOffset
										}
										stroke={ options.rulersColor }
										strokeWidth="1"
									/>
								) }
							</g>
						);
					} ) }

					{ /* Y Axis Labels and Rulers */ }
					{ getYLabels().map( ( yLabel, index ) => {
						const yLabelCoordinate = calcYCoordinate( yLabel );

						return (
							<g
								key={ `y-label-${ index }` }
								className="prpl-line-chart__y-label"
							>
								<text
									x="0"
									y={
										yLabelCoordinate +
										options.axisOffset / 2
									}
								>
									{ yLabel }
								</text>
								{ index !== 0 && (
									<line
										x1={ options.axisOffset * 3 }
										x2={
											options.aspectRatio * options.height
										}
										y1={ yLabelCoordinate }
										y2={ yLabelCoordinate }
										stroke={ options.rulersColor }
										strokeWidth="1"
									/>
								) }
							</g>
						);
					} ) }

					{ /* Polylines for each series */ }
					{ Object.keys( data ).map( ( key ) => {
						if ( ! visibleSeries.includes( key ) ) {
							return null;
						}

						const points = data[ key ]
							.map( ( item, index ) => {
								const xCoordinate =
									options.axisOffset * 3 +
									getXDistanceBetweenPoints() * index;
								const yCoordinate = calcYCoordinate(
									item.score
								);
								return `${ xCoordinate },${ yCoordinate }`;
							} )
							.join( ' ' );

						return (
							<g
								key={ `series-${ key }` }
								className={ `prpl-line-chart__series prpl-line-chart__series--${ key }` }
							>
								<polyline
									fill="none"
									stroke={ options.dataArgs[ key ]?.color }
									strokeWidth={ options.strokeWidth }
									points={ points }
								/>
							</g>
						);
					} ) }
				</svg>
			</div>
		</div>
	);
}
