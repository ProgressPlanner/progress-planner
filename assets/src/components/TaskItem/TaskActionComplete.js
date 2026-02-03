/**
 * Task Complete Action Component.
 *
 * Renders the "Mark as complete" button for dismissable tasks.
 */

import { __ } from '@wordpress/i18n';

/**
 * Button styles.
 */
const STYLES = {
	button: {
		textDecoration: 'none',
		padding: 0,
		lineHeight: 1,
		background: 'none',
		border: 'none',
		cursor: 'pointer',
	},
	actionText: {
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	},
};

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
		<button
			type="button"
			className="prpl-suggested-task-button"
			style={ STYLES.button }
			data-task-id={ taskId }
			data-task-title={ taskTitle }
			data-action="complete"
			data-target="complete"
			title={ __( 'Mark as complete', 'progress-planner' ) }
			onClick={ handleClick }
		>
			<span
				className="prpl-tooltip-action-text"
				style={ STYLES.actionText }
			>
				{ __( 'Mark as complete', 'progress-planner' ) }
			</span>
		</button>
	);
}
