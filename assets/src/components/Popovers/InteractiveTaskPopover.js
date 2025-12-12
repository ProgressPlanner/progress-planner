/**
 * Base Interactive Task Popover Component.
 *
 * Wraps all interactive task popovers with common functionality.
 *
 * @param {Object}   props          Component props.
 * @param {boolean}  props.isOpen   Whether the popover is open.
 * @param {string}   props.taskId   The task ID.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @param {*}        props.children The popover content.
 * @return {JSX.Element} The popover component.
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';

export default function InteractiveTaskPopover( {
	isOpen,
	taskId,
	onClose,
	children,
} ) {
	const popoverRef = useRef( null );
	const popoverId = `prpl-popover-${ taskId }`;

	/**
	 * Handle popover visibility changes.
	 */
	useEffect( () => {
		if ( ! popoverRef.current ) {
			return;
		}

		const popover = popoverRef.current;

		if ( isOpen ) {
			if ( typeof popover.showPopover === 'function' ) {
				popover.showPopover();
			}
		} else if ( typeof popover.hidePopover === 'function' ) {
			popover.hidePopover();
		}
	}, [ isOpen ] );

	/**
	 * Handle close button click.
	 */
	const handleClose = () => {
		doAction( 'prpl.popover.close', taskId );
		if ( onClose ) {
			onClose();
		}
	};

	/**
	 * Handle backdrop click (when popover is dismissed).
	 *
	 * @param {Event} event The toggle event.
	 */
	const handleToggle = ( event ) => {
		if ( event.newState === 'closed' ) {
			doAction( 'prpl.popover.close', taskId );
			if ( onClose ) {
				onClose();
			}
		}
	};

	if ( ! isOpen ) {
		return null;
	}

	return (
		<div
			id={ popoverId }
			ref={ popoverRef }
			className="prpl-popover prpl-popover-interactive"
			popover="auto"
			onToggle={ handleToggle }
		>
			<div className="prpl-columns-wrapper-flex">{ children }</div>

			<button
				className="prpl-popover-close"
				type="button"
				onClick={ handleClose }
				aria-label={ __( 'Close', 'progress-planner' ) }
			>
				<span className="dashicons dashicons-no-alt"></span>
				<span className="screen-reader-text">
					{ __( 'Close', 'progress-planner' ) }
				</span>
			</button>
		</div>
	);
}
