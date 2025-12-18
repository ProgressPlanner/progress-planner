/**
 * SuggestedTasks Skeleton Component
 *
 * Skeleton loading state for the SuggestedTasks widget.
 * Composes: TaskListSkeleton
 */

import { TaskListSkeleton } from '../../components/TaskItem/TaskItemSkeleton';
import { SkeletonText } from '../../components/Skeleton';

/**
 * SuggestedTasksSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of task skeletons to show.
 * @return {JSX.Element} The SuggestedTasksSkeleton component.
 */
export default function SuggestedTasksSkeleton( { count = 4 } ) {
	return (
		<>
			<div style={ { marginBottom: '1rem' } }>
				<SkeletonText lines={ 2 } />
			</div>
			<TaskListSkeleton count={ count } />
		</>
	);
}
