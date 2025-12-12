/**
 * Popover Hooks Custom Hook.
 *
 * Manages WordPress hook registration and cleanup for popover open/close events.
 * Prevents stale closures by using refs to store the latest callbacks.
 * Handles errors during hook registration/cleanup gracefully.
 *
 * @module hooks/usePopoverHooks
 */

import { useEffect, useCallback, useRef } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';

/**
 * Custom hook to manage popover hooks.
 *
 * Registers WordPress actions for 'prpl.popover.open' and 'prpl.popover.close'.
 * Uses refs to prevent stale closures when callbacks change.
 * Automatically cleans up hooks on unmount.
 *
 * @param {Function} onPopoverOpen  Callback when popover opens.
 *                                  Signature: (taskId: string, task: Object) => void
 * @param {Function} onPopoverClose Callback when popover closes.
 *                                  Signature: (taskId: string) => void
 * @return {void}
 */
export function usePopoverHooks( onPopoverOpen, onPopoverClose ) {
	const hookNamespace = 'prpl/popover-manager';
	const openAction = 'prpl.popover.open';
	const closeAction = 'prpl.popover.close';

	// Use refs to store the latest callbacks to avoid stale closures
	const onOpenRef = useRef( onPopoverOpen );
	const onCloseRef = useRef( onPopoverClose );

	// Update refs when callbacks change
	useEffect( () => {
		onOpenRef.current = onPopoverOpen;
		onCloseRef.current = onPopoverClose;
	}, [ onPopoverOpen, onPopoverClose ] );

	// Wrapper functions that use refs to get latest callbacks
	const handleOpen = useCallback( ( taskId, task ) => {
		onOpenRef.current( taskId, task );
	}, [] );

	const handleClose = useCallback( ( taskId ) => {
		onCloseRef.current( taskId );
	}, [] );

	// Register hooks
	useEffect( () => {
		try {
			addAction( openAction, hookNamespace, handleOpen );
			addAction( closeAction, hookNamespace, handleClose );
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Failed to register popover hooks:', error );
		}

		return () => {
			try {
				removeAction( openAction, hookNamespace );
				removeAction( closeAction, hookNamespace );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Failed to remove popover hooks:', error );
			}
		};
	}, [ handleOpen, handleClose ] );
}
