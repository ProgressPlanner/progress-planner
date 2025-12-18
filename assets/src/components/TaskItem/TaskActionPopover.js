/**
 * Task Popover Action Component.
 *
 * Renders a button that opens a popover for interactive tasks.
 */

import { doAction } from '@wordpress/hooks';

/**
 * Link styles.
 */
const STYLES = {
	link: {
		textDecoration: 'none',
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		padding: 0,
	},
};

/**
 * Task Popover Action component.
 *
 * @param {Object} props             Component props.
 * @param {string} props.popoverId   The popover element ID (with prpl-popover- prefix).
 * @param {string} props.label       The action label text.
 * @param {Object} props.task        The task object (for action hook).
 * @param {Object} props.taskContext Optional context data for custom events.
 * @param {string} props.eventName   Optional custom event name to dispatch.
 * @return {JSX.Element} The popover trigger action.
 */
export default function TaskActionPopover( {
	popoverId,
	label,
	task,
	taskContext,
	eventName,
} ) {
	const handleClick = ( e ) => {
		e.preventDefault();

		// Open the popover element.
		const popoverElement = document.getElementById( popoverId );
		if ( popoverElement?.showPopover ) {
			popoverElement.showPopover();
		}

		// Fire WordPress action hook for React handlers.
		if ( task ) {
			doAction( 'prpl.popover.open', popoverId, task );
		}

		// Dispatch custom event if specified (for task-specific handlers).
		if ( eventName && taskContext ) {
			const event = new CustomEvent( eventName, {
				bubbles: true,
				detail: taskContext,
			} );
			e.target.dispatchEvent( event );
		}
	};

	return (
		<button
			type="button"
			className="prpl-tooltip-action-text"
			style={ STYLES.link }
			onClick={ handleClick }
		>
			{ label }
		</button>
	);
}
