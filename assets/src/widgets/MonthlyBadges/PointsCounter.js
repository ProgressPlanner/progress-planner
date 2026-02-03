/**
 * PointsCounter Component
 *
 * Displays the current points and remaining points needed.
 */

import { __ } from '@wordpress/i18n';

/**
 * PointsCounter component.
 *
 * @param {Object}  props          - Component props.
 * @param {number}  props.points   - Current points.
 * @param {string}  props.label    - Label text.
 * @param {boolean} props.showUnit - Whether to show "pt" unit.
 * @return {JSX.Element} The PointsCounter component.
 */
export default function PointsCounter( {
	points,
	label = __( 'Progress monthly badge', 'progress-planner' ),
	showUnit = true,
} ) {
	const containerStyle = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	};

	const numberStyle = {
		fontSize: 'var(--prpl-font-size-3xl)',
		fontWeight: 600,
	};

	return (
		<div
			className="prpl-monthly-badges__points-counter"
			style={ containerStyle }
		>
			<span className="prpl-monthly-badges__points-label">{ label }</span>
			<span
				className="prpl-monthly-badges__points-number"
				style={ numberStyle }
			>
				{ points }
				{ showUnit && 'pt' }
			</span>
		</div>
	);
}
