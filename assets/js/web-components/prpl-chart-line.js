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

			// Set the object data.
			this.data =
				0 === data.length
					? JSON.parse( this.getAttribute( 'data' ) )
					: data;

			// Set the object options.
			this.options =
				0 === Object.keys( options ).length
					? JSON.parse( this.getAttribute( 'data-options' ) )
					: options;

			// Add default values to the options object.
			this.options = {
				aspectRatio: 2,
				height: 300,
				axisOffset: 16,
				strokeWidth: 4,
				dataArgs: {},
				showCharts: Object.keys( this.options.dataArgs ),
				axisColor: '#d1d5db',
				rulersColor: '#d1d5db',
				filtersLabel: '',
				...this.options,
			};

			// Add the HTML to the element.
			this.innerHTML = `${ this.getCheckboxesHTML() }<div class="svg-container">${ this.getSvgHTML() }</div>`;

			// Add event listeners for the checkboxes.
			this.addCheckboxesEventListeners();
		}

		/**
		 * Get the checkboxes.
		 *
		 * @return {string} The checkboxes.
		 */
		getCheckboxesHTML() {
			// Don't show checkboxes if there is only one dataset.
			if ( 1 >= Object.keys( this.options.dataArgs ).length ) {
				return '';
			}

			const checkboxesHTML = Object.keys( this.options.dataArgs ).map(
				( key ) => this.getCheckboxHTML( key )
			);

			return `<div
				class="chart-line-checkboxes"
				style="
					display: flex;
					gap: 1em;
					margin-bottom: 1em;
					justify-content: space-between;
					font-size: 0.85rem;"
			>${ this.getCheckboxesFiltersLabel() }${ checkboxesHTML.join( '' ) }</div>`;
		}

		/**
		 * Get the HTML for a single checkbox.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The checkbox HTML.
		 */
		getCheckboxHTML( key ) {
			// Is the checkbox checked?
			const isChecked = this.options.showCharts.includes( key );
			return `<label
				style="display: flex; align-items: center; gap: 0.25em; cursor: pointer;"
				data-color="${ this.options.dataArgs[ key ].color }"
			>
				<span
					class="prpl-chart-line-checkbox-color"
					style="
						background-color: ${
							isChecked
								? this.options.dataArgs[ key ].color
								: 'transparent'
						};
						width: 1em;
						height: 1em;
						border-radius: 0.25em;
						outline: 1px solid ${ this.options.dataArgs[ key ].color };
						border: 1px solid #fff;
				"></span>
				<input
					type="checkbox"
					name="${ key }"
					value="${ key }"
					${ isChecked ? 'checked' : '' }
					style="display: none;"
				/>
				${ this.options.dataArgs[ key ].label }
			</label>`;
		}

		/**
		 * Get the filters label.
		 *
		 * @return {string} The filters label.
		 */
		getCheckboxesFiltersLabel() {
			return '' === this.options.filtersLabel
				? ''
				: `<span>${ this.options.filtersLabel }</span>`;
		}

		/**
		 * Generate the SVG for the chart.
		 *
		 * @return {string} The SVG HTML for the chart.
		 */
		getSvgHTML() {
			return `<svg viewBox="0 0 ${ parseInt(
				this.options.height * this.options.aspectRatio +
					this.options.axisOffset * 2
			) } ${ parseInt(
				this.options.height + this.options.axisOffset * 2
			) }">
				${ this.getXAxisLineHTML() }
				${ this.getYAxisLineHTML() }
				${ this.getXAxisLabelsAndRulersHTML() }
				${ this.getYAxisLabelsAndRulersHTML() }
				${ this.getPolyLinesHTML() }
			</svg>`;
		}

		/**
		 * Get the poly lines for the SVG.
		 *
		 * @return {string} The poly lines.
		 */
		getPolyLinesHTML() {
			let polyLinesHTML = '';
			Object.keys( this.data ).forEach( ( key ) => {
				polyLinesHTML += this.getPolylineHTML( key );
			} );

			return polyLinesHTML;
		}

		/**
		 * Get a single polyline.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The polyline.
		 */
		getPolylineHTML( key ) {
			if ( ! this.options.showCharts.includes( key ) ) {
				return '';
			}

			const polylinePoints = [];
			let xCoordinate = this.options.axisOffset * 3;
			this.data[ key ].forEach( ( item ) => {
				polylinePoints.push( [
					xCoordinate,
					this.calcYCoordinate( item.score ),
				] );
				xCoordinate += this.getXDistanceBetweenPoints();
			} );

			return `<g><polyline fill="none" stroke="${
				this.options.dataArgs[ key ].color
			}" stroke-width="${
				this.options.strokeWidth
			}" points="${ polylinePoints
				.map( ( point ) => point.join( ',' ) )
				.join( ' ' ) }" /></g>`;
		}

		/**
		 * Get the Y labels.
		 *
		 * @return {number[]} The Y labels.
		 */
		getYLabels() {
			const maxValuePadded = this.getMaxValuePadded();
			// Take the maximum value and divide it by 4 to get the step.
			const yLabelsStep = maxValuePadded / 4;
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

			return yLabels;
		}

		/**
		 * Get the X axis line.
		 *
		 * @return {string} The X axis line.
		 */
		getXAxisLineHTML() {
			return `<g><line x1="${ this.options.axisOffset * 3 }" x2="${
				this.options.aspectRatio * this.options.height
			}" y1="${ this.options.height - this.options.axisOffset }" y2="${
				this.options.height - this.options.axisOffset
			}" stroke="${ this.options.axisColor }" stroke-width="1" /></g>`;
		}

		/**
		 * Get the Y axis line.
		 *
		 * @return {string} The Y axis line.
		 */
		getYAxisLineHTML() {
			return `<g><line x1="${ this.options.axisOffset * 3 }" x2="${
				this.options.axisOffset * 3
			}" y1="${ this.options.axisOffset }" y2="${
				this.options.height - this.options.axisOffset
			}" stroke="${ this.options.axisColor }" stroke-width="1" /></g>`;
		}

		/**
		 * Get the X axis labels and rulers.
		 *
		 * @return {string} The X axis labels and rulers.
		 */
		getXAxisLabelsAndRulersHTML() {
			let xAxisLabelsAndRulersHTML = '';
			let labelXCoordinate = 0;
			const dataLength =
				this.data[ Object.keys( this.data )[ 0 ] ].length;
			const labelsXDivider = Math.round( dataLength / 6 );
			let i = 0;
			Object.keys( this.data ).forEach( ( key ) => {
				this.data[ key ].forEach( ( item ) => {
					labelXCoordinate =
						this.getXDistanceBetweenPoints() * i +
						this.options.axisOffset * 2;
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

					xAxisLabelsAndRulersHTML += `<g><text x="${ labelXCoordinate }" y="${
						this.options.height + this.options.axisOffset
					}">${ item.label }</text></g>`;

					// Draw the ruler.
					if ( 1 !== i ) {
						xAxisLabelsAndRulersHTML += `<g><line x1="${
							labelXCoordinate + this.options.axisOffset
						}" x2="${
							labelXCoordinate + this.options.axisOffset
						}" y1="${ this.options.axisOffset }" y2="${
							this.options.height - this.options.axisOffset
						}" stroke="${
							this.options.rulersColor
						}" stroke-width="1" /></g>`;
					}
				} );
			} );

			return xAxisLabelsAndRulersHTML;
		}

		/**
		 * Get the distance between the points in the X axis.
		 *
		 * @return {number} The distance between the points in the X axis.
		 */
		getXDistanceBetweenPoints() {
			return Math.round(
				( this.options.height * this.options.aspectRatio -
					3 * this.options.axisOffset ) /
					( this.data[ Object.keys( this.data )[ 0 ] ].length - 1 )
			);
		}

		/**
		 * Get the Y axis labels and rulers.
		 *
		 * @return {string} The Y axis labels and rulers.
		 */
		getYAxisLabelsAndRulersHTML() {
			// Y-axis labels and rulers.
			let yLabelCoordinate = 0;
			let iYLabel = 0;
			let yAxisLabelsAndRulersHTML = '';
			this.getYLabels().forEach( ( yLabel ) => {
				yLabelCoordinate = this.calcYCoordinate( yLabel );

				yAxisLabelsAndRulersHTML += `<g><text x="0" y="${
					yLabelCoordinate + this.options.axisOffset / 2
				}">${ yLabel }</text></g>`;

				// Draw the ruler.
				if ( 0 !== iYLabel ) {
					yAxisLabelsAndRulersHTML += `<g><line x1="${
						this.options.axisOffset * 3
					}" x2="${
						this.options.aspectRatio * this.options.height
					}" y1="${ yLabelCoordinate }" y2="${ yLabelCoordinate }" stroke="${
						this.options.rulersColor
					}" stroke-width="1" /></g>`;
				}

				++iYLabel;
			} );

			return yAxisLabelsAndRulersHTML;
		}

		/**
		 * Get the max value from the data.
		 *
		 * @return {number} The max value.
		 */
		getMaxValue() {
			const maxValue = Object.keys( this.data ).reduce( ( max, key ) => {
				if ( this.options.showCharts.includes( key ) ) {
					return Math.max(
						max,
						this.data[ key ].reduce(
							( _max, item ) => Math.max( _max, item.score ),
							0
						)
					);
				}
				return max;
			}, 0 );
			return maxValue;
		}

		/**
		 * Get the max value padded.
		 *
		 * @return {number} The max value padded.
		 */
		getMaxValuePadded() {
			const max = this.getMaxValue();
			const maxValue = 100 > max && 70 < max ? 100 : max;
			return Math.max(
				100 === maxValue ? 100 : parseInt( maxValue * 1.1 ),
				1
			);
		}

		/**
		 * Add event listeners to the checkboxes.
		 */
		addCheckboxesEventListeners() {
			// Add event listeners to the checkboxes.
			this.querySelectorAll( 'input[type="checkbox"]' ).forEach(
				( checkbox ) => {
					checkbox.addEventListener( 'change', ( e ) => {
						const el = e.target;
						const parentEl = el.parentElement;
						const checkboxColorEl = parentEl.querySelector(
							'.prpl-chart-line-checkbox-color'
						);
						if ( el.checked ) {
							this.options.showCharts.push(
								el.getAttribute( 'name' )
							);
							checkboxColorEl.style.backgroundColor =
								parentEl.dataset.color;
						} else {
							this.options.showCharts =
								this.options.showCharts.filter(
									( chart ) =>
										chart !== el.getAttribute( 'name' )
								);
							checkboxColorEl.style.backgroundColor =
								'transparent';
						}

						// Update the chart.
						this.querySelector( '.svg-container' ).innerHTML =
							this.getSvgHTML();
					} );
				}
			);
		}

		/**
		 * Calculate the Y coordinate for a given value.
		 *
		 * @param {number} value - The value.
		 *
		 * @return {number} The Y coordinate.
		 */
		calcYCoordinate( value ) {
			const maxValuePadded = this.getMaxValuePadded();
			const multiplier =
				( this.options.height - this.options.axisOffset * 2 ) /
				this.options.height;
			const yCoordinate =
				( maxValuePadded - value * multiplier ) *
					( this.options.height / maxValuePadded ) -
				this.options.axisOffset;
			return yCoordinate - this.options.strokeWidth / 2;
		}
	}
);
