/**
 * Gauge Component
 *
 * Displays a semi-circular progress gauge using CSS conic-gradient.
 */

import { useMemo } from '@wordpress/element';

/**
 * Gauge component.
 *
 * @param {Object}      props                 - Component props.
 * @param {number}      props.value           - Current progress value.
 * @param {number}      props.max             - Maximum value (default 10).
 * @param {string}      props.backgroundColor - Background color CSS variable.
 * @param {string}      props.color           - Primary progress color CSS variable.
 * @param {string}      props.color2          - Secondary progress color CSS variable.
 * @param {string}      props.contentFontSize - Font size for the content inside the gauge.
 * @param {JSX.Element} props.children        - Content to display in the gauge center.
 * @return {JSX.Element} The Gauge component.
 */
export default function Gauge( {
	value = 0,
	max = 10,
	backgroundColor = 'var(--prpl-background-monthly)',
	color = 'var(--prpl-color-monthly)',
	color2 = 'var(--prpl-color-monthly-2)',
	contentFontSize = 'var(--prpl-font-size-6xl)',
	children,
} ) {
	const maxDeg = '180deg';
	const start = '270deg';
	const cutout = '57%';

	/**
	 * Calculate the conic gradient color transitions.
	 */
	const colorTransitions = useMemo( () => {
		const progress = max > 0 ? value / max : 0;
		let transitions;

		// If progress is less than 50%, use single color (no gradient)
		if ( progress <= 0.5 ) {
			transitions = `${ color } calc(${ maxDeg } * ${ progress })`;
		} else {
			// Show first color for 0.5, then second color
			transitions = `${ color } calc(${ maxDeg } * 0.5)`;
			transitions += `, ${ color2 } calc(${ maxDeg } * ${ progress })`;
		}

		// Add remaining (unfilled) color
		transitions += `, var(--prpl-color-gauge-remain) calc(${ maxDeg } * ${ progress }) ${ maxDeg }`;

		return transitions;
	}, [ value, max, color, color2 ] );

	const containerStyle = {
		padding:
			'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
		background: backgroundColor,
		borderRadius: 'var(--prpl-border-radius-big)',
		aspectRatio: '2 / 1',
		overflow: 'hidden',
		position: 'relative',
		marginBottom: 'var(--prpl-padding)',
	};

	const gaugeStyle = {
		width: '100%',
		aspectRatio: '1 / 1',
		borderRadius: '100%',
		position: 'relative',
		background: `radial-gradient(${ backgroundColor } 0 ${ cutout }, transparent ${ cutout } 100%), conic-gradient(from ${ start }, ${ colorTransitions }, transparent ${ maxDeg })`,
		textAlign: 'center',
	};

	const labelStyle = {
		fontSize: 'var(--prpl-font-size-small)',
		position: 'absolute',
		top: '50%',
		color: 'var(--prpl-color-text)',
		width: '10%',
		textAlign: 'center',
	};

	const leftLabelStyle = {
		...labelStyle,
		left: 0,
	};

	const rightLabelStyle = {
		...labelStyle,
		right: 0,
	};

	const contentStyle = {
		fontSize: contentFontSize,
		bottom: '50%',
		display: 'block',
		fontWeight: 600,
		textAlign: 'center',
		position: 'absolute',
		color: 'var(--prpl-color-text)',
		width: '100%',
		lineHeight: 1.2,
	};

	const contentInnerStyle = {
		display: 'inline-block',
		width: '50%',
	};

	return (
		<div className="prpl-gauge" style={ containerStyle }>
			<div className="prpl-gauge__ring" style={ gaugeStyle }>
				<span
					className="prpl-gauge__label prpl-gauge__label--min"
					style={ leftLabelStyle }
				>
					0
				</span>
				<span className="prpl-gauge__content" style={ contentStyle }>
					<span
						className="prpl-gauge__content-inner"
						style={ contentInnerStyle }
					>
						{ children }
					</span>
				</span>
				<span
					className="prpl-gauge__label prpl-gauge__label--max"
					style={ rightLabelStyle }
				>
					{ max }
				</span>
			</div>
		</div>
	);
}
