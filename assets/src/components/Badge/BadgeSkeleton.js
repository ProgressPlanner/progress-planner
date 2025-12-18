/**
 * Badge Skeleton Component
 *
 * Skeleton loading state for the Badge component.
 */

import { SkeletonCircle } from '../Skeleton';

/**
 * BadgeSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {string} props.size - Size of the badge (CSS value).
 * @return {JSX.Element} The BadgeSkeleton component.
 */
export default function BadgeSkeleton( { size = '100%' } ) {
	const containerStyle = {
		maxWidth: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={ containerStyle }>
			<SkeletonCircle
				size={ size }
				style={ {
					maxWidth: '100%',
					aspectRatio: '1 / 1',
					opacity: 0.5,
				} }
			/>
		</div>
	);
}
