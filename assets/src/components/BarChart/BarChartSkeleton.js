/**
 * BarChart Skeleton Component
 *
 * Skeleton loading state for the BarChart component.
 */

import { SkeletonRect } from '../Skeleton';

/**
 * BarChartSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {number} props.bars - Number of bars to show.
 * @return {JSX.Element} The BarChartSkeleton component.
 */
export default function BarChartSkeleton( { bars = 6 } ) {
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
		marginTop: '0.25rem',
	};

	// Generate random-ish heights for visual variety.
	const barHeights = Array.from( { length: bars } ).map(
		( _, i ) => 30 + ( ( i * 17 ) % 50 )
	);

	return (
		<div>
			<div style={ containerStyle }>
				{ barHeights.map( ( height, index ) => (
					<div key={ index } style={ barContainerStyle }>
						<SkeletonRect
							width="100%"
							height={ `${ height }%` }
							style={ { borderRadius: '4px 4px 0 0' } }
						/>
						<span style={ labelContainerStyle }>
							<SkeletonRect
								width="80%"
								height="0.75em"
								style={ { margin: '0 auto' } }
							/>
						</span>
					</div>
				) ) }
			</div>
		</div>
	);
}
