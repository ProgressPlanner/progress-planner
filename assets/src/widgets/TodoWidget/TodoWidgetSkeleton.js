/**
 * TodoWidget Skeleton Component
 *
 * Skeleton loading state for the TodoWidget.
 * Composes: TaskListSkeleton
 */

import { TaskListSkeleton } from '../../components/TaskItem/TaskItemSkeleton';
import { SkeletonText, SkeletonRect } from '../../components/Skeleton';

/**
 * TodoWidgetSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of task skeletons to show.
 * @return {JSX.Element} The TodoWidgetSkeleton component.
 */
export default function TodoWidgetSkeleton( { count = 3 } ) {
	const formStyle = {
		display: 'flex',
		gap: '0.5rem',
		marginTop: 'var(--prpl-padding)',
	};

	return (
		<>
			<div style={ { marginBottom: '1rem' } }>
				<SkeletonText lines={ 2 } />
			</div>
			<TaskListSkeleton count={ count } />
			<div style={ formStyle }>
				<SkeletonRect
					width="100%"
					height="40px"
					style={ { flex: 1 } }
				/>
				<SkeletonRect
					width="40px"
					height="40px"
					style={ { borderRadius: 'var(--prpl-border-radius)' } }
				/>
			</div>
		</>
	);
}
