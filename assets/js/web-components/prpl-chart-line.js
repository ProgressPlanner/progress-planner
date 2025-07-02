/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-chart-line',
	class extends HTMLElement {
		constructor( data = [], options = {} ) {
			// Get parent class properties
			super();

			// If data is empty, get the data from the contents.
			if ( 0 === data.length ) {
				data = JSON.parse( this.getAttribute( 'data' ) );
			}

			// Check if the options object is empty.
			if ( 0 === Object.keys( options ).length ) {
				options = JSON.parse( this.getAttribute( 'data-options' ) );
			}

			options = {
				...options,
				aspectRatio: 2,
				height: 300,
				axisOffset: 16,
				strokeWidth: 4,
				dataArgs: {
					...options.dataArgs,
				},
				showCharts:
					options.showCharts || Object.keys( options.dataArgs ),
				axisColor: options.axisColor || '#d1d5db',
				rulersColor: options.rulersColor || '#d1d5db',
				filtersLabel: options.filtersLabel || '',
			};

			const thisEl = this;

			const getSvg = () => {
				// Get the max value from the data.
				const getMaxValue = () => {
					let max = 0;
					Object.keys( data ).forEach( ( key ) => {
						if ( ! options.showCharts.includes( key ) ) {
							return;
						}

						data[ key ].forEach( ( item ) => {
							max = Math.max( max, item.score );
						} );
					} );
					return max;
				};

				const width = options.height * options.aspectRatio;

				// Determine the maximum value for the chart.
				const max = getMaxValue();
				const maxValue = 100 > max && 70 < max ? 100 : max;
				const maxValuePadded = Math.max(
					100 === maxValue ? 100 : parseInt( maxValue * 1.1 ),
					1
				);

				const calcYCoordinate = ( value ) => {
					const multiplier =
						( options.height - options.axisOffset * 2 ) /
						options.height;
					const yCoordinate =
						( maxValuePadded - value * multiplier ) *
							( options.height / maxValuePadded ) -
						options.axisOffset;
					return yCoordinate - options.strokeWidth / 2;
				};

				// Calculate the Y axis labels.
				// Take the maximum value and divide it by 4 to get the step.
				const yLabelsStep = maxValuePadded / 4;

				// Calculate the Y axis labels.
				const yLabels = [];
				if ( 100 === maxValuePadded || 15 > maxValuePadded ) {
					for ( let i = 0; i <= 4; i++ ) {
						yLabels.push( parseInt( yLabelsStep * i ) );
					}
				} else {
					// Round the values to the nearest 10.
					for ( let i = 0; i <= 4; i++ ) {
						yLabels.push(
							Math.min(
								maxValuePadded,
								Math.round( yLabelsStep * i, -1 )
							)
						);
					}
				}

				const dataLength = data[ Object.keys( data )[ 0 ] ].length;

				// Calculate the distance between the points in the X axis.
				const xDistanceBetweenPoints = Math.round(
					( width - 3 * options.axisOffset ) / ( dataLength - 1 )
				);

				// X-axis line.
				const xAxisLine = `<g><line x1="${
					options.axisOffset * 3
				}" x2="${ options.aspectRatio * options.height }" y1="${
					options.height - options.axisOffset
				}" y2="${ options.height - options.axisOffset }" stroke="${
					options.axisColor
				}" stroke-width="1" /></g>`;

				// Y-axis line.
				const yAxisLine = `<g><line x1="${
					options.axisOffset * 3
				}" x2="${ options.axisOffset * 3 }" y1="${
					options.axisOffset
				}" y2="${ options.height - options.axisOffset }" stroke="${
					options.axisColor
				}" stroke-width="1" /></g>`;

				// X-axis labels and rulers.
				let labelXCoordinate = 0;
				const labelsXDivider = Math.round( dataLength / 6 );
				let i = 0;
				let xAxisLabelsAndRulers = '';
				Object.keys( data ).forEach( ( key ) => {
					data[ key ].forEach( ( item ) => {
						labelXCoordinate =
							xDistanceBetweenPoints * i + options.axisOffset * 2;
						++i;

						// Only allow up to 6 labels to prevent overlapping.
						// If there are more than 6 labels, find the alternate labels.
						if (
							6 < dataLength &&
							1 !== i &&
							( i - 1 ) % labelsXDivider !== 0
						) {
							return;
						}

						xAxisLabelsAndRulers += `<g><text class="x-axis-label" x="${ labelXCoordinate }" y="${
							options.height + options.axisOffset
						}">${ item.label }</text></g>`;

						// Draw the ruler.
						if ( 1 !== i ) {
							xAxisLabelsAndRulers += `<g><line x1="${
								labelXCoordinate + options.axisOffset
							}" x2="${
								labelXCoordinate + options.axisOffset
							}" y1="${ options.axisOffset }" y2="${
								options.height - options.axisOffset
							}" stroke="${
								options.rulersColor
							}" stroke-width="1" /></g>`;
						}
					} );
				} );

				// Y-axis labels and rulers.
				let yLabelCoordinate = 0;
				let iYLabel = 0;
				let yAxisLabelsAndRulers = '';
				yLabels.forEach( ( yLabel ) => {
					yLabelCoordinate = calcYCoordinate( yLabel );

					yAxisLabelsAndRulers += `<g><text class="y-axis-label" x="0" y="${
						yLabelCoordinate + options.axisOffset / 2
					}">${ yLabel }</text></g>`;

					// Draw the ruler.
					if ( 0 !== iYLabel ) {
						yAxisLabelsAndRulers += `<g><line x1="${
							options.axisOffset * 3
						}" x2="${
							options.aspectRatio * options.height
						}" y1="${ yLabelCoordinate }" y2="${ yLabelCoordinate }" stroke="${
							options.rulersColor
						}" stroke-width="1" /></g>`;
					}

					++iYLabel;
				} );

				const getPolyLines = () => {
					const polyLines = [];
					Object.keys( data ).forEach( ( key ) => {
						if ( ! options.showCharts.includes( key ) ) {
							return;
						}

						const polylinePoints = [];
						let xCoordinate = options.axisOffset * 3;
						data[ key ].forEach( ( item ) => {
							polylinePoints.push( [
								xCoordinate,
								calcYCoordinate( item.score ),
							] );
							xCoordinate += xDistanceBetweenPoints;
						} );

						const polyLine = `<g><polyline fill="none" stroke="${
							options.dataArgs[ key ].color
						}" stroke-width="${
							options.strokeWidth
						}" points="${ polylinePoints
							.map( ( point ) => point.join( ',' ) )
							.join( ' ' ) }" /></g>`;

						polyLines.push( polyLine );
					} );

					return polyLines;
				};

				return `<svg viewBox="0 0 ${ parseInt(
					options.height * options.aspectRatio +
						options.axisOffset * 2
				) } ${ parseInt( options.height + options.axisOffset * 2 ) }">
					${ xAxisLine }
					${ yAxisLine }
					${ xAxisLabelsAndRulers }
					${ yAxisLabelsAndRulers }
					${ getPolyLines().join( '' ) }
				</svg>`;
			};

			const getCheckboxes = () => {
				if ( Object.keys( options.dataArgs ).length <= 1 ) {
					return '';
				}

				const checkboxes = [];
				Object.keys( options.dataArgs ).forEach( ( key ) => {
					// Is the checkbox checked?
					const isChecked = options.showCharts.includes( key );

					checkboxes.push(
						`<label
							style="display: flex; align-items: center; gap: 0.25em; cursor: pointer;"
							data-color="${ options.dataArgs[ key ].color }"
						>
							<span
								class="chart-line-checkbox-color"
								style="
									background-color: ${
										isChecked
											? options.dataArgs[ key ].color
											: 'transparent'
									};
									width: 1em;
									height: 1em;
									border-radius: 0.25em;
									border: 1px solid ${ options.dataArgs[ key ].color }
							"></span>
							<input
								type="checkbox"
								name="${ key }"
								value="${ key }"
								${ isChecked ? 'checked' : '' }
								style="display: none;"
							/>
							${ options.dataArgs[ key ].label }
						</label>`
					);
				} );

				const getFiltersLabel = () => {
					if ( '' === options.filtersLabel ) {
						return '';
					}

					return `<div class="chart-line-filters-label">${ options.filtersLabel }</div>`;
				};

				return `<div
					class="chart-line-checkboxes"
					style="
						display: flex;
						gap: 1em;
						margin-bottom: 1em;
						justify-content: space-between;
						font-size: 0.85rem;"
				>${ getFiltersLabel() }${ checkboxes.join( '' ) }</div>`;
			};

			const getHTML = () =>
				`${ getCheckboxes() }<div class="svg-container">${ getSvg() }</div>`;

			thisEl.innerHTML = getHTML();

			// Add event listeners to the checkboxes.
			const checkboxes = thisEl.querySelectorAll(
				'input[type="checkbox"]'
			);

			const checkboxesListeners = () => {
				checkboxes.forEach( ( checkbox ) => {
					checkbox.addEventListener( 'change', ( e ) => {
						if ( e.target.checked ) {
							options.showCharts.push(
								e.target.getAttribute( 'name' )
							);
							e.target.parentElement.querySelector(
								'.chart-line-checkbox-color'
							).style.backgroundColor =
								e.target.parentElement.dataset.color;
						} else {
							options.showCharts = options.showCharts.filter(
								( chart ) =>
									chart !== e.target.getAttribute( 'name' )
							);
							e.target.parentElement.querySelector(
								'.chart-line-checkbox-color'
							).style.backgroundColor = 'transparent';
						}

						// Update the chart.
						thisEl.querySelector( '.svg-container' ).innerHTML =
							getSvg();
					} );
				} );
			};

			checkboxesListeners();
		}
	}
);
