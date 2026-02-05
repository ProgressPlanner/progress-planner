/**
 * Task Complete Action Component.
 *
 * Renders the "Mark as complete" button for dismissable tasks.
 */

import { __ } from '@wordpress/i18n';
import TaskActionButton from './TaskActionButton';

/**
 * Task Complete Action component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.taskId    The task ID (slug or post ID).
 * @param {string}   props.taskTitle The task title for accessibility.
 * @param {Function} props.onClick   Click handler.
 * @return {JSX.Element} The complete action button.
 */
export default function TaskActionComplete( { taskId, taskTitle, onClick } ) {
	const handleClick = ( e ) => {
		e.preventDefault();
		onClick?.();
	};

	return (
		<TaskActionButton
			data-task-id={ taskId }
			data-task-title={ taskTitle }
			data-action="complete"
			data-target="complete"
			title={ __( 'Mark as complete', 'progress-planner' ) }
			onClick={ handleClick }
		>
			{ __( 'Mark as complete', 'progress-planner' ) }
		</TaskActionButton>
	);
}
