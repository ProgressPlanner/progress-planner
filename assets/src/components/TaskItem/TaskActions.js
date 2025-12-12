/**
 * Task Actions Component.
 *
 * Renders action buttons for a task (complete, snooze, info, etc.).
 * Uses the prpl_task_actions array from the API which contains pre-rendered HTML.
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';

/**
 * Task Actions component.
 *
 * @param {Object}   props            Component props.
 * @param {Object}   props.task       The task object.
 * @param {boolean}  props.isUserTask Whether this is a user task.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Function} props.onSnooze   Callback for snoozing a task.
 * @param {Function} props.onDelete   Callback for deleting a task.
 * @return {JSX.Element} The task actions component.
 */
export default function TaskActions( {
	task,
	isUserTask,
	onComplete,
	onSnooze,
	onDelete,
} ) {
	const actionsRef = useRef( null );

	/**
	 * Set up event handlers for the rendered HTML actions.
	 */
	useEffect( () => {
		if ( ! actionsRef.current ) {
			return;
		}

		const container = actionsRef.current;

		// Handle complete button clicks.
		const completeButtons = container.querySelectorAll(
			'[data-action="complete"]'
		);
		completeButtons.forEach( ( button ) => {
			button.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				onComplete( task.id, task );
			} );
		} );

		// Handle snooze radio changes.
		const snoozeRadios = container.querySelectorAll(
			'.prpl-snooze-duration-radio-group input[type="radio"]'
		);
		snoozeRadios.forEach( ( radio ) => {
			radio.addEventListener( 'change', () => {
				onSnooze( task.id, radio.value );
			} );
		} );

		// Handle popover triggers - intercept onclick and use doAction.
		const popoverLinks = container.querySelectorAll(
			'a[onclick*="showPopover"]'
		);
		popoverLinks.forEach( ( link ) => {
			// Extract popover ID from onclick attribute.
			const onclickAttr = link.getAttribute( 'onclick' );
			const match = onclickAttr?.match(
				/getElementById\(['"]([^'"]+)['"]\)/
			);
			if ( match ) {
				const popoverId = match[ 1 ];
				// Extract task ID from popover ID (format: prpl-popover-{taskId})
				const taskId = popoverId.replace( 'prpl-popover-', '' );
				link.removeAttribute( 'onclick' );
				link.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					// Trigger popover open via hook
					doAction( 'prpl.popover.open', taskId, task );
				} );
			}
		} );

		// Handle delete buttons for user tasks.
		const deleteButtons = container.querySelectorAll(
			'.prpl-suggested-task-button.trash'
		);
		deleteButtons.forEach( ( button ) => {
			button.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				onDelete( task.id );
			} );
		} );

		// Cleanup event listeners on unmount.
		return () => {
			completeButtons.forEach( ( button ) => {
				button.replaceWith( button.cloneNode( true ) );
			} );
			snoozeRadios.forEach( ( radio ) => {
				radio.replaceWith( radio.cloneNode( true ) );
			} );
		};
	}, [ task, onComplete, onSnooze, onDelete ] );

	// Get task actions from API response.
	const taskActions = task.prpl_task_actions || [];

	// Inline styles.
	const actionsStyle = {
		paddingTop: '2px',
		gap: '0.4rem',
		alignItems: 'baseline',
	};

	const actionStyle = {
		display: 'inline-flex',
		position: 'relative',
		textDecoration: 'none',
	};

	const actionTextStyle = {
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	};

	const buttonStyle = {
		textDecoration: 'none',
		padding: 0,
		lineHeight: 1,
		background: 'none',
		border: 'none',
		cursor: 'pointer',
	};

	// If no actions and not a user task, return empty.
	if ( taskActions.length === 0 && ! isUserTask ) {
		return <div className="tooltip-actions" style={ actionsStyle }></div>;
	}

	return (
		<div
			className="tooltip-actions"
			style={ actionsStyle }
			ref={ actionsRef }
		>
			{ /* Render pre-built HTML actions from the API */ }
			{ taskActions.map( ( actionHTML, actionIndex ) => (
				<span
					key={ actionIndex }
					className="tooltip-action"
					style={ actionStyle }
					dangerouslySetInnerHTML={ { __html: actionHTML } }
				/>
			) ) }

			{ /* Add delete button for user tasks */ }
			{ isUserTask && (
				<span className="tooltip-action" style={ actionStyle }>
					<button
						type="button"
						className="prpl-suggested-task-button trash"
						style={ buttonStyle }
						data-post-id={ task.id }
						title={ __( 'Delete', 'progress-planner' ) }
						onClick={ () => onDelete( task.id ) }
					>
						<span
							className="prpl-tooltip-action-text"
							style={ actionTextStyle }
						>
							{ __( 'Delete', 'progress-planner' ) }
						</span>
						<span className="screen-reader-text">
							{ __( 'Delete', 'progress-planner' ) }:{ ' ' }
							{ task.title?.rendered || task.title }
						</span>
					</button>
				</span>
			) }
		</div>
	);
}
