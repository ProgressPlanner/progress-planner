/**
 * ActivityTable Component
 *
 * Displays a table with weekly activity breakdown.
 */

import { __ } from '@wordpress/i18n';

/**
 * ActivityTable component.
 *
 * @param {Object} props                - Component props.
 * @param {Object} props.activityTypes  - Activity types with labels.
 * @param {Object} props.weeklyActivity - Weekly activity counts per type.
 * @param {number} props.totalCount     - Total count of all activities.
 * @return {JSX.Element} The ActivityTable component.
 */
export default function ActivityTable( {
	activityTypes,
	weeklyActivity,
	totalCount,
} ) {
	const tableStyle = {
		width: '100%',
		marginBottom: '1em',
		borderSpacing: '6px 0',
	};

	const cellStyle = {
		border: 'none',
		padding: '0.5em',
	};

	const bodyCellStyle = {
		...cellStyle,
		fontWeight: 400,
	};

	const centeredCellStyle = {
		...cellStyle,
		textAlign: 'center',
	};

	const footerCellStyle = {
		...cellStyle,
		borderTop: '1px solid var(--prpl-color-border)',
	};

	const footerCenteredCellStyle = {
		...centeredCellStyle,
		borderTop: '1px solid var(--prpl-color-border)',
	};

	return (
		<table className="prpl-content-activity__table" style={ tableStyle }>
			<thead className="prpl-content-activity__table-head">
				<tr className="prpl-content-activity__table-row">
					<th
						className="prpl-content-activity__table-header"
						style={ cellStyle }
					>
						{ __( 'Content managed', 'progress-planner' ) }
					</th>
					<th
						className="prpl-content-activity__table-header"
						style={ centeredCellStyle }
					>
						{ __( 'Last week', 'progress-planner' ) }
					</th>
				</tr>
			</thead>
			<tbody className="prpl-content-activity__table-body">
				{ Object.keys( activityTypes ).map( ( key, index ) => {
					const rowStyle = {
						backgroundColor:
							index % 2 === 0
								? 'var(--prpl-background-table)'
								: 'transparent',
					};

					return (
						<tr
							key={ key }
							className={ `prpl-content-activity__table-row prpl-content-activity__table-row--${ key }` }
							style={ rowStyle }
						>
							<th
								className="prpl-content-activity__table-cell"
								style={ bodyCellStyle }
							>
								{ activityTypes[ key ].label }
							</th>
							<td
								className="prpl-content-activity__table-cell"
								style={ centeredCellStyle }
							>
								{ weeklyActivity[ key ] || 0 }
							</td>
						</tr>
					);
				} ) }
			</tbody>
			<tfoot className="prpl-content-activity__table-foot">
				<tr className="prpl-content-activity__table-row prpl-content-activity__table-row--total">
					<th
						className="prpl-content-activity__table-cell"
						style={ footerCellStyle }
					>
						{ __( 'Total', 'progress-planner' ) }
					</th>
					<td
						className="prpl-content-activity__table-cell"
						style={ footerCenteredCellStyle }
					>
						{ totalCount }
					</td>
				</tr>
			</tfoot>
		</table>
	);
}
