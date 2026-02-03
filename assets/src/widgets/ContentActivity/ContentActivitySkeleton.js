/**
 * ContentActivity Skeleton Component
 *
 * Skeleton loading state for the ContentActivity widget.
 * Composes: BigCounterSkeleton, chart skeleton, table skeleton
 */

import { SkeletonRect, SkeletonText } from '../../components/Skeleton';
import BigCounterSkeleton from '../../components/BigCounter/BigCounterSkeleton';

/**
 * LineChartSkeleton component.
 *
 * @return {JSX.Element} The LineChartSkeleton component.
 */
function LineChartSkeleton() {
	const containerStyle = {
		width: '100%',
		height: '200px',
		marginBottom: 'var(--prpl-padding)',
		position: 'relative',
	};

	// Create a simple wavy line using multiple skeleton rects at different heights.
	const points = [ 40, 60, 45, 75, 50, 80 ];

	return (
		<div style={ containerStyle }>
			{ /* Chart area background */ }
			<SkeletonRect
				width="100%"
				height="100%"
				style={ {
					opacity: 0.3,
					borderRadius: 'var(--prpl-border-radius)',
				} }
			/>
			{ /* Simulated line points */ }
			<div
				style={ {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: '20px',
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'space-around',
					padding: '10px',
				} }
			>
				{ points.map( ( height, index ) => (
					<SkeletonRect
						key={ index }
						width="4px"
						height={ `${ height }%` }
						style={ { borderRadius: '2px' } }
					/>
				) ) }
			</div>
		</div>
	);
}

/**
 * ActivityTableSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {number} props.rows - Number of rows to show.
 * @return {JSX.Element} The ActivityTableSkeleton component.
 */
function ActivityTableSkeleton( { rows = 3 } ) {
	const tableStyle = {
		width: '100%',
		marginBottom: '1em',
		borderSpacing: '6px 0',
	};

	const cellStyle = {
		border: 'none',
		padding: '0.5em',
	};

	const centeredCellStyle = {
		...cellStyle,
		textAlign: 'center',
	};

	const footerCellStyle = {
		...cellStyle,
		borderTop: '1px solid var(--prpl-color-border)',
	};

	return (
		<table style={ tableStyle }>
			<thead>
				<tr>
					<th style={ cellStyle }>
						<SkeletonRect width="8rem" height="1em" />
					</th>
					<th style={ centeredCellStyle }>
						<SkeletonRect
							width="5rem"
							height="1em"
							style={ { marginLeft: 'auto' } }
						/>
					</th>
				</tr>
			</thead>
			<tbody>
				{ Array.from( { length: rows } ).map( ( _, index ) => {
					const rowStyle = {
						backgroundColor:
							index % 2 === 0
								? 'var(--prpl-background-table)'
								: 'transparent',
					};

					return (
						<tr key={ index } style={ rowStyle }>
							<th style={ cellStyle }>
								<SkeletonRect
									width={ `${
										60 + ( ( index * 10 ) % 30 )
									}%` }
									height="1em"
								/>
							</th>
							<td style={ centeredCellStyle }>
								<SkeletonRect
									width="2rem"
									height="1em"
									style={ { marginLeft: 'auto' } }
								/>
							</td>
						</tr>
					);
				} ) }
			</tbody>
			<tfoot>
				<tr>
					<th style={ footerCellStyle }>
						<SkeletonRect width="3rem" height="1em" />
					</th>
					<td
						style={ {
							...centeredCellStyle,
							borderTop: '1px solid var(--prpl-color-border)',
						} }
					>
						<SkeletonRect
							width="2rem"
							height="1em"
							style={ { marginLeft: 'auto' } }
						/>
					</td>
				</tr>
			</tfoot>
		</table>
	);
}

/**
 * ContentActivitySkeleton component.
 *
 * @return {JSX.Element} The ContentActivitySkeleton component.
 */
export default function ContentActivitySkeleton() {
	return (
		<div className="prpl-content-activity">
			{ /* Description text */ }
			<div style={ { marginBottom: '1rem' } }>
				<SkeletonText lines={ 3 } />
			</div>

			{ /* BigCounter */ }
			<BigCounterSkeleton backgroundColor="var(--prpl-background-content)" />

			{ /* Line chart */ }
			<div style={ { marginBottom: 'var(--prpl-padding)' } }>
				<LineChartSkeleton />
			</div>

			{ /* Activity table */ }
			<ActivityTableSkeleton rows={ 3 } />
		</div>
	);
}
