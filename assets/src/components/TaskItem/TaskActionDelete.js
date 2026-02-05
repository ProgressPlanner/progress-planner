/**
 * Task Delete Action Component.
 *
 * Renders the delete button for user-created tasks.
 */

import { __ } from '@wordpress/i18n';
import TaskActionButton from './TaskActionButton';

/**
 * Task Delete Action component.
 *
 * @param {Object}   props           Component props.
 * @param {number}   props.postId    The task post ID.
 * @param {string}   props.taskTitle The task title for accessibility.
 * @param {Function} props.onClick   Click handler.
 * @return {JSX.Element} The delete action button.
 */
export default function TaskActionDelete( { postId, taskTitle, onClick } ) {
	const handleClick = ( e ) => {
		e.preventDefault();
		onClick?.();
	};

	return (
		<TaskActionButton
			className="prpl-suggested-task-button trash"
			data-post-id={ postId }
			title={ `${ __( 'Delete', 'progress-planner' ) }: ${ taskTitle }` }
			onClick={ handleClick }
		>
			{ __( 'Delete', 'progress-planner' ) }
		</TaskActionButton>
	);
}
