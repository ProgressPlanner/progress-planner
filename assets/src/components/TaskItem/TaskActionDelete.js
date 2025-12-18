/**
 * Task Delete Action Component.
 *
 * Renders the delete button for user-created tasks.
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
		<button
			type="button"
			className="prpl-suggested-task-button trash"
			style={ STYLES.button }
			data-post-id={ postId }
			title={ `${ __( 'Delete', 'progress-planner' ) }: ${ taskTitle }` }
			onClick={ handleClick }
		>
			<span
				className="prpl-tooltip-action-text"
				style={ STYLES.actionText }
			>
				{ __( 'Delete', 'progress-planner' ) }
			</span>
		</button>
	);
}
