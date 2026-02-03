/**
 * BarChart Component
 *
 * Displays a bar chart with labels.
 */

import { useEffect, useRef } from '@wordpress/element';

/**
 * BarChart component.
 *
 * @param {Object} props      - Component props.
 * @param {Array}  props.data - Array of data points with label, score, and color.
 * @return {JSX.Element} The BarChart component.
 */
export default function BarChart( { data = [] } ) {
	const chartRef = useRef( null );

	// Calculate how many labels to show (max 6)
	const labelsDivider = data.length > 6 ? Math.floor( data.length / 6 ) : 1;

	/**
	 * Adjust label positioning when there are many items.
	 */
	useEffect( () => {
		if ( ! chartRef.current ) {
			return;
		}

		const invisibleLabels =
			chartRef.current.querySelectorAll( '.label.invisible' );

		if ( invisibleLabels.length === 0 ) {
			return;
		}

		const labelContainers =
			chartRef.current.querySelectorAll( '.label-container' );
		const chartBar = chartRef.current.querySelector( '.chart-bar' );

		labelContainers.forEach( ( container ) => {
			const labelElement = container.querySelector( '.label' );
			if ( ! labelElement ) {
				return;
			}

			const labelWidth = labelElement.offsetWidth;
			labelElement.style.display = 'block';
			labelElement.style.width = '0';

			const marginLeft = ( container.offsetWidth - labelWidth ) / 2;
			if ( labelElement.classList.contains( 'visible' ) ) {
				labelElement.style.marginLeft = `${ marginLeft }px`;
			}
		} );

		// Reduce gap between items to avoid overflows
		const firstLabel = chartRef.current.querySelector( '.label' );
		if ( firstLabel && chartBar ) {
			const newGap = Math.max( firstLabel.offsetWidth / 4, 1 );
			chartBar.style.gap = `${ Math.floor( newGap ) }px`;
		}
	}, [ data ] );

	const containerStyle = {
		display: 'flex',
		maxWidth: '600px',
		height: '200px',
		width: '100%',
		alignItems: 'flex-end',
		gap: '5px',
		margin: '1rem 0',
	};

	const barContainerStyle = {
		flex: 'auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		height: '100%',
	};

	const labelContainerStyle = {
		height: '1rem',
		overflow: 'visible',
		textAlign: 'center',
		display: 'block',
		width: '100%',
		fontSize: '0.75em',
	};

	return (
		<div className="prpl-bar-chart" ref={ chartRef }>
			<div className="chart-bar" style={ containerStyle }>
				{ data.map( ( item, index ) => {
					const barStyle = {
						display: 'block',
						width: '100%',
						height: `${ item.score }%`,
						background: item.color,
					};

					const isLabelVisible = index % labelsDivider === 0;
					const labelClass = isLabelVisible
						? 'label visible'
						: 'label invisible';
					const labelStyle = isLabelVisible
						? {}
						: { visibility: 'hidden' };

					return (
						<div
							key={ index }
							className="prpl-bar-chart__bar-container"
							style={ barContainerStyle }
						>
							<div
								className="prpl-bar-chart__bar"
								style={ barStyle }
								title={ `${ item.label } - ${ item.score }%` }
							/>
							<span
								className="label-container"
								style={ labelContainerStyle }
							>
								<span
									className={ labelClass }
									style={ labelStyle }
								>
									{ item.label }
								</span>
							</span>
						</div>
					);
				} ) }
			</div>
		</div>
	);
}
