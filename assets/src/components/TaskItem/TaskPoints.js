/**
 * Task Points Component.
 *
 * Renders the points badge and trash button (for user tasks).
 *
 * @param {Object}   props            Component props.
 * @param {Object}   props.task       The task object.
 * @param {boolean}  props.isUserTask Whether this is a user task.
 * @param {Function} props.onDelete   Callback for deleting a task.
 * @return {JSX.Element} The points component.
 */
import { __ } from '@wordpress/i18n';
import TrashIcon from './icons/TrashIcon';
import {
	pointsWrapperStyle,
	pointsBadgeStyle,
	trashButtonStyle,
} from './styles';
import { getTaskPoints } from '../../utils/taskUtils';

export default function TaskPoints( { task, isUserTask, onDelete } ) {
	const points = getTaskPoints( task );

	return (
		<div
			className="prpl-suggested-task-points-wrapper"
			style={ pointsWrapperStyle }
		>
			{ points > 0 && (
				<span
					className="prpl-suggested-task-points"
					style={ pointsBadgeStyle }
				>
					+{ points }
				</span>
			) }

			{ isUserTask && (
				<button
					type="button"
					className="prpl-suggested-task-button trash"
					style={ trashButtonStyle }
					data-post-id={ task.id }
					title={ __( 'Delete', 'progress-planner' ) }
					onClick={ onDelete }
				>
					<TrashIcon />
					<span className="screen-reader-text">
						{ __( 'Delete', 'progress-planner' ) }
					</span>
				</button>
			) }
		</div>
	);
}
