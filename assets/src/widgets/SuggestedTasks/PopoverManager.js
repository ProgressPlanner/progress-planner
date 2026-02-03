/**
 * Popover Manager Component.
 *
 * Manages React popover components using @wordpress/hooks for communication.
 * Listens for popover open/close events and renders the appropriate React component.
 *
 * @param {Object}   props            Component props.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Object}   props.config     Widget configuration.
 * @return {JSX.Element} The popover manager component.
 */

import { useState, useCallback, Suspense } from '@wordpress/element';
import { usePopoverHooks } from '../../hooks/usePopoverHooks';
import { useCustomSubmitHandlers } from '../../hooks/useCustomSubmitHandlers';
import { resolveTaskId } from '../../utils/taskIdResolver';
import { getPopoverComponent } from '../../components/Popovers/popoverRegistry';
import PopoverLoadingState from '../../components/Popovers/PopoverLoadingState';

export default function PopoverManager( { onComplete, config = {} } ) {
	const [ openPopoverId, setOpenPopoverId ] = useState( null );
	const [ openTask, setOpenTask ] = useState( null );

	/**
	 * Handle popover open event.
	 *
	 * @param {string} taskId The task ID.
	 * @param {Object} task   The task object.
	 */
	const handlePopoverOpen = useCallback( ( taskId, task ) => {
		if ( ! taskId || ! task ) {
			// eslint-disable-next-line no-console
			console.warn(
				'PopoverManager: Invalid popover open event - missing taskId or task'
			);
			return;
		}
		setOpenPopoverId( taskId );
		setOpenTask( task );
	}, [] );

	/**
	 * Handle popover close event.
	 *
	 * @param {string} taskId The task ID to close.
	 */
	const handlePopoverClose = useCallback(
		( taskId ) => {
			// Only close if the task ID matches the currently open popover
			if ( taskId === openPopoverId || ! taskId ) {
				setOpenPopoverId( null );
				setOpenTask( null );
			}
		},
		[ openPopoverId ]
	);

	// Set up WordPress hooks for popover communication
	usePopoverHooks( handlePopoverOpen, handlePopoverClose );

	/**
	 * Handle popover form submission completion.
	 *
	 * @param {string|number} taskId The task ID.
	 * @param {Object}        task   The task object.
	 */
	const handlePopoverSubmit = useCallback(
		async ( taskId, task ) => {
			if ( ! onComplete ) {
				// eslint-disable-next-line no-console
				console.warn(
					'PopoverManager: onComplete callback not provided'
				);
				return;
			}

			try {
				const finalTaskId = task?.id || taskId;
				if ( ! finalTaskId ) {
					throw new Error( 'Invalid task ID for submission' );
				}

				await onComplete( finalTaskId, task );
				setOpenPopoverId( null );
				setOpenTask( null );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error(
					'PopoverManager: Error submitting popover form:',
					error
				);
				// Don't close popover on error - let user retry
			}
		},
		[ onComplete ]
	);

	// Get custom submit handler for the current task
	const handleCustomSubmit = useCustomSubmitHandlers( openTask );

	// Resolve task ID for popover lookup
	const taskIdForLookup = resolveTaskId( openTask, openPopoverId );

	// Get the popover component for the open popover
	const PopoverComponent = taskIdForLookup
		? getPopoverComponent( taskIdForLookup )
		: null;

	// Error handling: If we have a task but no component, log a warning
	if ( openTask && ! PopoverComponent ) {
		// eslint-disable-next-line no-console
		console.warn(
			'PopoverManager: No popover component found for task ID:',
			taskIdForLookup
		);
		return null;
	}

	// Render the popover if one is open and component is found
	if ( ! PopoverComponent || ! openTask ) {
		return null;
	}

	// Wrap in Suspense for lazy-loaded popover components
	return (
		<Suspense fallback={ <PopoverLoadingState /> }>
			<PopoverComponent
				task={ openTask }
				onSubmit={ handlePopoverSubmit }
				onClose={ () => handlePopoverClose( openPopoverId ) }
				onCustomSubmit={ handleCustomSubmit }
				config={ config }
			/>
		</Suspense>
	);
}
