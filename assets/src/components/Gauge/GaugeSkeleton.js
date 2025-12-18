/**
 * Gauge Skeleton Component
 *
 * Skeleton loading state for the Gauge component.
 */

import { SkeletonCircle, SkeletonRect } from '../Skeleton';

/**
 * GaugeSkeleton component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @return {JSX.Element} The GaugeSkeleton component.
 */
export default function GaugeSkeleton( {
	backgroundColor = 'var(--prpl-background-monthly)',
} ) {
	const containerStyle = {
		padding:
			'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
		background: backgroundColor,
		borderRadius: 'var(--prpl-border-radius-big)',
		aspectRatio: '2 / 1',
		overflow: 'hidden',
		position: 'relative',
		marginBottom: 'var(--prpl-padding)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
	};

	const gaugeWrapperStyle = {
		width: '100%',
		aspectRatio: '1 / 1',
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	const centerContentStyle = {
		position: 'absolute',
		top: '35%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '0.5em',
	};

	return (
		<div style={ containerStyle }>
			<div style={ gaugeWrapperStyle }>
				{ /* Outer ring skeleton */ }
				<SkeletonCircle
					size="100%"
					style={ {
						position: 'absolute',
						opacity: 0.3,
					} }
				/>
				{ /* Center content placeholder */ }
				<div style={ centerContentStyle }>
					<SkeletonRect
						width="3em"
						height="2.5em"
						style={ { borderRadius: '8px' } }
					/>
				</div>
			</div>
		</div>
	);
}
