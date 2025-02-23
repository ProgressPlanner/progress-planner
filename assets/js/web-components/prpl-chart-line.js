/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-chart-line',
	class extends HTMLElement {
		constructor( data = [] ) {
			// Get parent class properties
			super();

			// If data is empty, get the data from the contents.
			if ( 0 === data.length ) {
				data = JSON.parse( this.getAttribute( 'data' ) );
			}

			const aspectRatio = 2;
			const height = 300;
			const axisOffset = 16;
			const width = height * aspectRatio;
			const strokeWidth = 4;

			// Determine the maximum value for the chart.
			const max = Math.max( ...data.map( ( item ) => item.score ) );
			const maxValue = 100 > max && 70 < max ? 100 : max;
			const maxValuePadded = Math.max(
				100 === maxValue ? 100 : parseInt( maxValue * 1.1 ),
				1
			);

			const calcYCoordinate = ( value ) => {
				const multiplier = ( height - axisOffset * 2 ) / height;
				const yCoordinate =
					( maxValuePadded - value * multiplier ) *
						( height / maxValuePadded ) -
					axisOffset;
				return yCoordinate - strokeWidth / 2;
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

			// Calculate the distance between the points in the X axis.
			const xDistanceBetweenPoints = Math.round(
				( width - 3 * axisOffset ) / ( data.length - 1 )
			);

			// X-axis line.
			const xAxisLine = `<g><line x1="${ axisOffset * 3 }" x2="${
				aspectRatio * height
			}" y1="${ height - axisOffset }" y2="${
				height - axisOffset
			}" stroke="var(--prpl-color-gray-2)" stroke-width="1" /></g>`;

			// Y-axis line.
			const yAxisLine = `<g><line x1="${ axisOffset * 3 }" x2="${
				axisOffset * 3
			}" y1="${ axisOffset }" y2="${
				height - axisOffset
			}" stroke="var(--prpl-color-gray-2)" stroke-width="1" /></g>`;

			// X-axis labels and rulers.
			let labelXCoordinate = 0;
			const labelsXDivider = Math.round( data.length / 6 );
			let i = 0;
			let xAxisLabelsAndRulers = '';
			data.forEach( ( item ) => {
				labelXCoordinate = xDistanceBetweenPoints * i + axisOffset * 2;
				++i;

				// Only allow up to 6 labels to prevent overlapping.
				// If there are more than 6 labels, find the alternate labels.
				if (
					6 < data.length &&
					1 !== i &&
					( i - 1 ) % labelsXDivider !== 0
				) {
					return;
				}

				xAxisLabelsAndRulers += `<g><text class="x-axis-label" x="${ labelXCoordinate }" y="${
					height + axisOffset
				}">${ item.label }</text></g>`;

				// Draw the ruler.
				if ( 1 !== i ) {
					xAxisLabelsAndRulers += `<g><line x1="${
						labelXCoordinate + axisOffset
					}" x2="${
						labelXCoordinate + axisOffset
					}" y1="${ axisOffset }" y2="${
						height - axisOffset
					}" stroke="var(--prpl-color-gray-1)" stroke-width="1" /></g>`;
				}
			} );

			// Y-axis labels and rulers.
			let yLabelCoordinate = 0;
			let iYLabel = 0;
			let yAxisLabelsAndRulers = '';
			yLabels.forEach( ( yLabel ) => {
				yLabelCoordinate = calcYCoordinate( yLabel );

				yAxisLabelsAndRulers += `<g><text class="y-axis-label" x="0" y="${
					yLabelCoordinate + axisOffset / 2
				}">${ yLabel }</text></g>`;

				// Draw the ruler.
				if ( 0 !== iYLabel ) {
					yAxisLabelsAndRulers += `<g><line x1="${
						axisOffset * 3
					}" x2="${
						aspectRatio * height
					}" y1="${ yLabelCoordinate }" y2="${ yLabelCoordinate }" stroke="var(--prpl-color-gray-2)" stroke-width="1" /></g>`;
				}

				++iYLabel;
			} );

			// Line chart.
			const polylinePoints = [];
			let xCoordinate = axisOffset * 3;
			data.forEach( ( item ) => {
				polylinePoints.push( [
					xCoordinate,
					calcYCoordinate( item.score ),
				] );
				xCoordinate += xDistanceBetweenPoints;
			} );

			const polyLine = `<g><polyline fill="none" stroke="${
				data[ 0 ].color
			}" stroke-width="${ strokeWidth }" points="${ polylinePoints
				.map( ( point ) => point.join( ',' ) )
				.join( ' ' ) }" /></g>`;

			this.innerHTML = `<svg viewBox="0 0 ${ parseInt(
				height * aspectRatio + axisOffset * 2
			) } ${ parseInt( height + axisOffset * 2 ) }">
				${ xAxisLine }
				${ yAxisLine }
				${ xAxisLabelsAndRulers }
				${ yAxisLabelsAndRulers }
				${ polyLine }
			</svg>`;
		}
	}
);
