/**
 * TaskList Component
 *
 * Renders the list of suggested tasks with support for celebration animations.
 */

import { forwardRef } from '@wordpress/element';
import TaskItem from '../../components/TaskItem';
import { STYLES } from './styles';

/**
 * TaskList component.
 *
 * @param {Object}   props                    - Component props.
 * @param {Array}    props.tasks              - Array of task objects.
 * @param {Set}      props.celebratingTaskIds - Set of task IDs currently celebrating.
 * @param {Function} props.onComplete         - Handler for task completion.
 * @param {Function} props.onSnooze           - Handler for task snooze.
 * @param {Function} props.onDelete           - Handler for task deletion.
 * @param {Function} props.onMove             - Handler for task reordering.
 * @param {Function} props.onTitleChange      - Handler for task title change.
 * @param {Object}   ref                      - Forwarded ref for the list element.
 * @return {JSX.Element} The TaskList component.
 */
const TaskList = forwardRef( function TaskList(
	{
		tasks,
		celebratingTaskIds,
		onComplete,
		onSnooze,
		onDelete,
		onMove,
		onTitleChange,
	},
	ref
) {
	return (
		<ul
			id="prpl-suggested-tasks-list"
			className="prpl-suggested-tasks-list"
			style={ STYLES.list }
			ref={ ref }
		>
			{ tasks.map( ( task, index ) => (
				<TaskItem
					key={ task.id }
					task={ task }
					index={ index }
					isUserTask={ task.prpl_provider?.slug === 'user' }
					isCelebrating={ celebratingTaskIds.has( task.id ) }
					onComplete={ onComplete }
					onSnooze={ onSnooze }
					onDelete={ onDelete }
					onMove={ onMove }
					onTitleChange={ onTitleChange }
				/>
			) ) }
		</ul>
	);
} );

export default TaskList;
