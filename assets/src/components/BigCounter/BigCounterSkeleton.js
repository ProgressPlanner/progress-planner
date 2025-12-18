/**
 * BigCounter Skeleton Component
 *
 * Skeleton loading state for the BigCounter component.
 */

import { SkeletonRect } from '../Skeleton';

/**
 * BigCounterSkeleton component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color (CSS value).
 * @return {JSX.Element} The BigCounterSkeleton component.
 */
export default function BigCounterSkeleton( {
	backgroundColor = 'var(--prpl-background-content)',
} ) {
	const containerStyle = {
		backgroundColor,
		padding: 'var(--prpl-padding)',
		borderRadius: 'var(--prpl-border-radius-big)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		height: 'calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2)',
		marginBottom: 'var(--prpl-padding)',
		gap: '0.5rem',
	};

	return (
		<div style={ containerStyle }>
			{ /* Number placeholder */ }
			<SkeletonRect
				width="3rem"
				height="var(--prpl-font-size-5xl)"
				style={ { borderRadius: '8px' } }
			/>
			{ /* Label placeholder */ }
			<SkeletonRect
				width="8rem"
				height="var(--prpl-font-size-2xl)"
				style={ { borderRadius: '4px' } }
			/>
		</div>
	);
}
