/**
 * TaskItem Skeleton Component
 *
 * Skeleton loading state for the TaskItem component.
 */

import { SkeletonRect, SkeletonCircle } from '../Skeleton';

/**
 * TaskItemSkeleton component.
 *
 * @param {Object}  props             - Component props.
 * @param {number}  props.index       - Index for alternating background.
 * @param {boolean} props.showActions - Whether to show actions placeholder.
 * @return {JSX.Element} The TaskItemSkeleton component.
 */
export default function TaskItemSkeleton( { index = 0, showActions = true } ) {
	const containerStyle = {
		margin: 0,
		padding: '0.75rem 0.5rem 0.625rem 0.5rem',
		display: 'grid',
		gridTemplateColumns: '1.5rem 1fr 3.5rem',
		gap: '0.25rem 0.5rem',
		position: 'relative',
		lineHeight: 1,
		backgroundColor:
			index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent',
	};

	const checkboxWrapperStyle = {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const titleWrapperStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
	};

	const pointsWrapperStyle = {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gridRowEnd: 'span 2',
	};

	const actionsWrapperStyle = {
		gridColumn: '2 / span 1',
		display: 'flex',
		gap: '0.5rem',
		paddingTop: '0.25rem',
	};

	return (
		<li style={ containerStyle }>
			{ /* Checkbox placeholder */ }
			<div style={ checkboxWrapperStyle }>
				<SkeletonRect
					width="1rem"
					height="1rem"
					style={ { borderRadius: '3px' } }
				/>
			</div>

			{ /* Title placeholder */ }
			<div style={ titleWrapperStyle }>
				<SkeletonRect
					width={ `${ 60 + Math.random() * 30 }%` }
					height="1rem"
				/>
			</div>

			{ /* Points placeholder */ }
			<div style={ pointsWrapperStyle }>
				<SkeletonCircle size="1.5rem" />
			</div>

			{ /* Actions placeholder */ }
			{ showActions && (
				<div style={ actionsWrapperStyle }>
					<SkeletonRect width="4rem" height="1.5rem" />
					<SkeletonRect width="4rem" height="1.5rem" />
				</div>
			) }
		</li>
	);
}

/**
 * TaskListSkeleton component - renders multiple task item skeletons.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of skeleton items to render.
 * @return {JSX.Element} The TaskListSkeleton component.
 */
export function TaskListSkeleton( { count = 4 } ) {
	const listStyle = {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	};

	return (
		<ul style={ listStyle }>
			{ Array.from( { length: count } ).map( ( _, i ) => (
				<TaskItemSkeleton key={ i } index={ i } />
			) ) }
		</ul>
	);
}
