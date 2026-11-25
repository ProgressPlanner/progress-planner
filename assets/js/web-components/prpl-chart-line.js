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
				axisColor: 'var(--prpl-color-border)',
				rulersColor: 'var(--prpl-color-border)',
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
		getCheckboxesHTML = () =>
			1 >= Object.keys( this.options.dataArgs ).length
				? ''
				: `<div
				class="chart-line-checkboxes"
				style="
					display: flex;
					flex-wrap: wrap;
					align-items: flex-start;
					gap: 0.5em 1em;
					margin-bottom: 1em;
					font-size: 0.85rem;"
			>${ this.getCheckboxesFiltersLabel() }<div
				class="chart-line-checkboxes-items"
				style="
					display: flex;
					flex: 1 1 auto;
					flex-wrap: wrap;
					gap: 0.5em 1em;
					justify-content: space-between;"
			>${ Object.keys( this.options.dataArgs )
				.map( ( key ) => this.getCheckboxHTML( key ) )
				.join( '' ) }</div></div>`;

		/**
		 * Get the HTML for a single checkbox.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The checkbox HTML.
		 */
		getCheckboxHTML = ( key ) =>
			`<label
				style="position: relative; display: flex; align-items: center; gap: 0.25em; padding-bottom: 0.5em; cursor: pointer;"
				data-color="${ this.options.dataArgs[ key ].color }"
			>
				<span
					class="prpl-chart-line-checkbox-color"
					style="
						background-color: ${
							this.options.showCharts.includes( key )
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
					${ this.options.showCharts.includes( key ) ? 'checked' : '' }
					style="display: none;"
				/>
				${ this.options.dataArgs[ key ].label }
				${ this.getLegendLineHTML( key ) }
			</label>`;

		/**
		 * Get the line style of a data series.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The line style: solid, dotted or dashed.
		 */
		getLineStyle = ( key ) =>
			[ 'dotted', 'dashed' ].includes(
				this.options.dataArgs[ key ]?.lineStyle
			)
				? this.options.dataArgs[ key ].lineStyle
				: 'solid';

		/**
		 * Get the SVG stroke attributes for a line style.
		 *
		 * Dots are zero-length dashes with round caps, so each one is a circle.
		 * A thin dotted line reads lighter than a solid one, so dots are 1.5
		 * line-widths wide and sit close together. Dashes are three
		 * line-widths long.
		 *
		 * @param {string} key         - The key of the data.
		 * @param {number} strokeWidth - The width of the line.
		 *
		 * @return {string} The stroke attributes, including stroke-width.
		 */
		getStrokeStyleAttributes = ( key, strokeWidth ) => {
			switch ( this.getLineStyle( key ) ) {
				case 'dotted': {
					const dotWidth = strokeWidth * 1.5;
					return `stroke-width="${ dotWidth }" stroke-dasharray="0 ${
						dotWidth * 1.75
					}" stroke-linecap="round" stroke-linejoin="round"`;
				}
				case 'dashed':
					return `stroke-width="${ strokeWidth }" stroke-dasharray="${
						strokeWidth * 3
					} ${ strokeWidth * 2 }" stroke-linejoin="round"`;
				default:
					return `stroke-width="${ strokeWidth }"`;
			}
		};

		/**
		 * Get the line sample shown under a legend label.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The line sample SVG.
		 */
		getLegendLineHTML = ( key ) =>
			`<svg
				class="prpl-chart-line-legend-line"
				width="100%"
				height="3"
				aria-hidden="true"
				focusable="false"
				style="position: absolute; left: 0; bottom: 0; overflow: visible; opacity: ${
					this.options.showCharts.includes( key ) ? 1 : 0.35
				};"
			><line x1="2" x2="100%" y1="1.5" y2="1.5" stroke="${
				this.options.dataArgs[ key ].color
			}" ${ this.getStrokeStyleAttributes( key, 2 ) } /></svg>`;

		/**
		 * Get the filters label.
		 *
		 * @return {string} The filters label.
		 */
		getCheckboxesFiltersLabel = () =>
			'' === this.options.filtersLabel
				? ''
				: `<span>${ this.options.filtersLabel }</span>`;

		/**
		 * Generate the SVG for the chart.
		 *
		 * @return {string} The SVG HTML for the chart.
		 */
		getSvgHTML = () =>
			`<svg viewBox="0 0 ${ parseInt(
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

		/**
		 * Get the poly lines for the SVG.
		 *
		 * @return {string} The poly lines.
		 */
		getPolyLinesHTML = () =>
			Object.keys( this.data )
				.map( ( key ) => this.getPolylineHTML( key ) )
				.join( '' );

		/**
		 * Get a single polyline.
		 *
		 * @param {string} key - The key of the data.
		 *
		 * @return {string} The polyline.
		 */
		getPolylineHTML = ( key ) => {
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
			}" ${ this.getStrokeStyleAttributes(
				key,
				this.options.strokeWidth
			) } points="${ polylinePoints
				.map( ( point ) => point.join( ',' ) )
				.join( ' ' ) }" /></g>`;
		};

		/**
		 * Get the number of steps for the Y axis.
		 *
		 * Choose between 3, 4, or 5 steps.
		 * The result should be the number that when used as a divisor,
		 * produces integer values for the Y labels - or at least as close as possible.
		 *
		 * @return {number} The number of steps.
		 */
		getYLabelsStepsDivider = () => {
			const maxValuePadded = this.getMaxValuePadded();

			const stepsRemainders = {
				4: maxValuePadded % 4,
				5: maxValuePadded % 5,
				3: maxValuePadded % 3,
			};
			// Get the smallest remainder.
			const smallestRemainder = Math.min(
				...Object.values( stepsRemainders )
			);

			// Get the key of the smallest remainder.
			const smallestRemainderKey = Object.keys( stepsRemainders ).find(
				( key ) => stepsRemainders[ key ] === smallestRemainder
			);
			return smallestRemainderKey;
		};

		/**
		 * Get the Y labels.
		 *
		 * @return {number[]} The Y labels.
		 */
		getYLabels = () => {
			const maxValuePadded = this.getMaxValuePadded();
			const yLabelsStepsDivider = this.getYLabelsStepsDivider();
			const yLabelsStep = maxValuePadded / yLabelsStepsDivider;
			const yLabels = [];
			if ( 100 === maxValuePadded || 15 > maxValuePadded ) {
				for ( let i = 0; i <= yLabelsStepsDivider; i++ ) {
					yLabels.push( parseInt( yLabelsStep * i ) );
				}
			} else {
				// Round the values to the nearest 10.
				for ( let i = 0; i <= yLabelsStepsDivider; i++ ) {
					yLabels.push(
						Math.min(
							maxValuePadded,
							Math.round( yLabelsStep * i, -1 )
						)
					);
				}
			}

			return yLabels;
		};

		/**
		 * Get the X axis line.
		 *
		 * @return {string} The X axis line.
		 */
		getXAxisLineHTML = () =>
			`<g><line x1="${ this.options.axisOffset * 3 }" x2="${
				this.options.aspectRatio * this.options.height
			}" y1="${ this.options.height - this.options.axisOffset }" y2="${
				this.options.height - this.options.axisOffset
			}" stroke="${ this.options.axisColor }" stroke-width="1" /></g>`;

		/**
		 * Get the Y axis line.
		 *
		 * @return {string} The Y axis line.
		 */
		getYAxisLineHTML = () =>
			`<g><line x1="${ this.options.axisOffset * 3 }" x2="${
				this.options.axisOffset * 3
			}" y1="${ this.options.axisOffset }" y2="${
				this.options.height - this.options.axisOffset
			}" stroke="${ this.options.axisColor }" stroke-width="1" /></g>`;

		/**
		 * Get the X axis labels and rulers.
		 *
		 * @return {string} The X axis labels and rulers.
		 */
		getXAxisLabelsAndRulersHTML = () => {
			let html = '';
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

					html += `<g><text x="${ labelXCoordinate }" y="${
						this.options.height + this.options.axisOffset
					}">${ item.label }</text></g>`;

					// Draw the ruler.
					if ( 1 !== i ) {
						html += `<g><line x1="${
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

			return html;
		};

		/**
		 * Get the distance between the points in the X axis.
		 *
		 * @return {number} The distance between the points in the X axis.
		 */
		getXDistanceBetweenPoints = () =>
			Math.round(
				( this.options.height * this.options.aspectRatio -
					3 * this.options.axisOffset ) /
					( this.data[ Object.keys( this.data )[ 0 ] ].length - 1 )
			);

		/**
		 * Get the Y axis labels and rulers.
		 *
		 * @return {string} The Y axis labels and rulers.
		 */
		getYAxisLabelsAndRulersHTML = () => {
			// Y-axis labels and rulers.
			let yLabelCoordinate = 0;
			let iYLabel = 0;
			let html = '';
			this.getYLabels().forEach( ( yLabel ) => {
				yLabelCoordinate = this.calcYCoordinate( yLabel );

				html += `<g><text x="0" y="${
					yLabelCoordinate + this.options.axisOffset / 2
				}">${ yLabel }</text></g>`;

				// Draw the ruler.
				if ( 0 !== iYLabel ) {
					html += `<g><line x1="${
						this.options.axisOffset * 3
					}" x2="${
						this.options.aspectRatio * this.options.height
					}" y1="${ yLabelCoordinate }" y2="${ yLabelCoordinate }" stroke="${
						this.options.rulersColor
					}" stroke-width="1" /></g>`;
				}

				++iYLabel;
			} );

			return html;
		};

		/**
		 * Get the max value from the data.
		 *
		 * @return {number} The max value.
		 */
		getMaxValue = () =>
			Object.keys( this.data ).reduce( ( max, key ) => {
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

		/**
		 * Get the max value padded.
		 *
		 * @return {number} The max value padded.
		 */
		getMaxValuePadded = () => {
			const max = this.getMaxValue();
			const maxValue = 100 > max && 70 < max ? 100 : max;
			return Math.max(
				100 === maxValue ? 100 : parseInt( maxValue * 1.1 ),
				1
			);
		};

		/**
		 * Add event listeners to the checkboxes.
		 */
		addCheckboxesEventListeners = () =>
			// Add event listeners to the checkboxes.
			this.querySelectorAll( 'input[type="checkbox"]' ).forEach(
				( checkbox ) => {
					checkbox.addEventListener( 'change', ( e ) => {
						const el = e.target;
						const labelEl = el.closest( 'label' );
						const checkboxColorEl = labelEl.querySelector(
							'.prpl-chart-line-checkbox-color'
						);
						const legendLineEl = labelEl.querySelector(
							'.prpl-chart-line-legend-line'
						);
						if ( el.checked ) {
							this.options.showCharts.push(
								el.getAttribute( 'name' )
							);
							checkboxColorEl.style.backgroundColor =
								labelEl.dataset.color;
							legendLineEl.style.opacity = 1;
						} else {
							this.options.showCharts =
								this.options.showCharts.filter(
									( chart ) =>
										chart !== el.getAttribute( 'name' )
								);
							checkboxColorEl.style.backgroundColor =
								'transparent';
							legendLineEl.style.opacity = 0.35;
						}

						// Update the chart.
						this.querySelector( '.svg-container' ).innerHTML =
							this.getSvgHTML();
					} );
				}
			);

		/**
		 * Calculate the Y coordinate for a given value.
		 *
		 * @param {number} value - The value.
		 *
		 * @return {number} The Y coordinate.
		 */
		calcYCoordinate = ( value ) => {
			const maxValuePadded = this.getMaxValuePadded();
			const multiplier =
				( this.options.height - this.options.axisOffset * 2 ) /
				this.options.height;
			const yCoordinate =
				( maxValuePadded - value * multiplier ) *
					( this.options.height / maxValuePadded ) -
				this.options.axisOffset;
			return yCoordinate - this.options.strokeWidth / 2;
		};
	}
);
