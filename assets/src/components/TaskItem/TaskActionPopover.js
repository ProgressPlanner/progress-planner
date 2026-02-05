/**
 * Task Popover Action Component.
 *
 * Renders a button that opens a popover for interactive tasks.
 */

import { doAction } from '@wordpress/hooks';
import TaskActionButton from './TaskActionButton';

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
		<TaskActionButton onClick={ handleClick }>{ label }</TaskActionButton>
	);
}
