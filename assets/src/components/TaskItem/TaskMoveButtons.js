/**
 * Task Move Buttons Component.
 *
 * Renders move up/down buttons for user tasks.
 *
 * @param {Object}   props         Component props.
 * @param {Object}   props.task     The task object.
 * @param {string}   props.taskId  The task ID for data attributes.
 * @param {Function} props.onMoveUp   Callback for moving up.
 * @param {Function} props.onMoveDown Callback for moving down.
 * @return {JSX.Element} The move buttons component.
 */
import { __ } from '@wordpress/i18n';
import {
	moveButtonsWrapperStyle,
	moveButtonsStyle,
	moveButtonStyle,
} from './styles';

export default function TaskMoveButtons( {
	task,
	taskId,
	onMoveUp,
	onMoveDown,
} ) {
	const taskTitle = task.title?.rendered || task.title;

	return (
		<div
			className="tooltip-actions prpl-move-buttons-wrapper"
			style={ moveButtonsWrapperStyle }
		>
			<span className="prpl-move-buttons" style={ moveButtonsStyle }>
				<button
					type="button"
					className="prpl-suggested-task-button move-up"
					style={ moveButtonStyle }
					data-task-id={ taskId }
					data-task-title={ taskTitle }
					data-action="move-up"
					data-target="move-up"
					title={ __( 'Move up', 'progress-planner' ) }
					onClick={ onMoveUp }
				>
					<span className="dashicons dashicons-arrow-up-alt2"></span>
					<span className="screen-reader-text">
						{ __( 'Move up', 'progress-planner' ) }
					</span>
				</button>
				<button
					type="button"
					className="prpl-suggested-task-button move-down"
					style={ moveButtonStyle }
					data-task-id={ taskId }
					data-task-title={ taskTitle }
					data-action="move-down"
					data-target="move-down"
					title={ __( 'Move down', 'progress-planner' ) }
					onClick={ onMoveDown }
				>
					<span className="dashicons dashicons-arrow-down-alt2"></span>
					<span className="screen-reader-text">
						{ __( 'Move down', 'progress-planner' ) }
					</span>
				</button>
			</span>
		</div>
	);
}
