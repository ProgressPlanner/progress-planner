/**
 * Task Actions Component.
 *
 * Renders action buttons for a task (complete, snooze, info, etc.).
 * Supports both:
 * - Config objects from React task providers (rendered as React components)
 * - HTML strings from PHP (rendered with dangerouslySetInnerHTML for backward compatibility)
 */

import { useEffect, useRef, useMemo, useCallback } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { getTaskProviderInstance } from '../../services/taskRegistry';
import TaskActionComplete from './TaskActionComplete';
import TaskActionSnooze from './TaskActionSnooze';
import TaskActionInfo from './TaskActionInfo';
import TaskActionLink from './TaskActionLink';
import TaskActionPopover from './TaskActionPopover';
import TaskActionDelete from './TaskActionDelete';

/**
 * Style constants - extracted to prevent recreation on each render.
 */
const STYLES = {
	actions: {
		paddingTop: '2px',
		gap: '0.4rem',
		alignItems: 'baseline',
	},
	action: {
		display: 'inline-flex',
		position: 'relative',
		textDecoration: 'none',
	},
};

/**
 * Render a single action based on its type.
 *
 * @param {Object}   action     The action config object.
 * @param {Object}   task       The task object.
 * @param {Function} onComplete Complete handler.
 * @param {Function} onSnooze   Snooze handler.
 * @param {Function} onDelete   Delete handler.
 * @return {JSX.Element|null} The rendered action component.
 */
function renderAction( action, task, onComplete, onSnooze, onDelete ) {
	const taskTitle = task.title?.rendered || task.title || '';

	switch ( action.type ) {
		case 'complete':
			return (
				<TaskActionComplete
					taskId={ action.taskId }
					taskTitle={ action.taskTitle || taskTitle }
					onClick={ () => onComplete( task.id, task ) }
				/>
			);

		case 'snooze':
			return (
				<TaskActionSnooze
					taskId={ action.taskId }
					taskTitle={ action.taskTitle || taskTitle }
					onSnooze={ ( duration ) => onSnooze( task.id, duration ) }
				/>
			);

		case 'info':
			return (
				<TaskActionInfo
					taskId={ action.taskId }
					taskTitle={ action.taskTitle || taskTitle }
					externalUrl={ action.externalUrl }
					content={ action.content }
				/>
			);

		case 'link':
			// Handle special inline edit action for user tasks.
			if ( action.inlineEdit ) {
				return (
					<TaskActionLink
						href="#"
						label={ action.label }
						onClick={ ( e ) => {
							e.preventDefault();
							// Find the task title span and focus it for inline editing.
							const taskElement = e.target.closest(
								'li.prpl-suggested-task'
							);
							const titleSpan = taskElement?.querySelector(
								'.prpl-task-title span'
							);
							titleSpan?.focus();
						} }
					/>
				);
			}
			return (
				<TaskActionLink
					href={ action.href }
					label={ action.label }
					target={ action.target }
					className={ action.className }
				/>
			);

		case 'popover':
			return (
				<TaskActionPopover
					popoverId={ action.popoverId }
					label={ action.label }
					task={ task }
					taskContext={ action.taskContext }
					eventName={ action.eventName }
				/>
			);

		case 'delete':
			return (
				<TaskActionDelete
					postId={ task.id }
					taskTitle={ taskTitle }
					onClick={ () => onDelete( task.id ) }
				/>
			);

		default:
			return null;
	}
}

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
	// Store references to event handlers for proper cleanup (for HTML actions).
	const handlersRef = useRef( [] );

	/**
	 * Create memoized event handler factories for HTML-based actions.
	 */
	const createCompleteHandler = useCallback(
		( taskId, taskObj ) => ( e ) => {
			e.preventDefault();
			onComplete( taskId, taskObj );
		},
		[ onComplete ]
	);

	const createSnoozeHandler = useCallback(
		( taskId ) => ( e ) => {
			onSnooze( taskId, e.target.value );
		},
		[ onSnooze ]
	);

	const createPopoverHandler = useCallback(
		( taskId, taskObj ) => ( e ) => {
			e.preventDefault();
			doAction( 'prpl.popover.open', taskId, taskObj );
		},
		[]
	);

	const createDeleteHandler = useCallback(
		( taskId ) => ( e ) => {
			e.preventDefault();
			onDelete( taskId );
		},
		[ onDelete ]
	);

	// Get task actions from API response, or generate from task provider.
	const taskActions = useMemo( () => {
		// If actions are already provided from the API and not empty, use them.
		// PHP-generated actions are HTML strings, React-generated are objects.
		if (
			task.prpl_task_actions &&
			Array.isArray( task.prpl_task_actions ) &&
			task.prpl_task_actions.length > 0
		) {
			// Mark these as HTML strings for rendering.
			return task.prpl_task_actions.map( ( action ) =>
				typeof action === 'string'
					? { type: 'html', html: action }
					: action
			);
		}

		// Otherwise, try to generate actions from the task provider.
		let providerId =
			task.prpl_provider?.slug ||
			task.provider_id ||
			task.meta?.provider_id ||
			'';

		// Fallback: Use task slug as provider ID.
		if ( ! providerId && task.slug ) {
			providerId = task.slug;
		}

		// Fallback: Try to get provider from embedded taxonomy terms.
		if (
			! providerId &&
			task.prpl_recommendations_provider &&
			Array.isArray( task.prpl_recommendations_provider )
		) {
			const firstItem = task.prpl_recommendations_provider[ 0 ];
			if (
				firstItem &&
				typeof firstItem === 'object' &&
				firstItem.slug
			) {
				providerId = firstItem.slug;
			} else if (
				typeof firstItem === 'number' &&
				task._embedded?.[ 'wp:term' ]?.[ 0 ]
			) {
				const embeddedTerms = task._embedded[ 'wp:term' ].flat();
				const term = embeddedTerms.find(
					( t ) =>
						t?.taxonomy === 'prpl_recommendations_provider' &&
						t.id === firstItem
				);
				if ( term?.slug ) {
					providerId = term.slug;
				}
			}
		}

		if ( ! providerId ) {
			return [];
		}

		const providerInstance = getTaskProviderInstance( providerId );
		if ( ! providerInstance?.getTaskActions ) {
			return [];
		}

		try {
			return providerInstance.getTaskActions( task ) || [];
		} catch ( error ) {
			console.error(
				`Error generating actions for task provider "${ providerId }":`,
				error
			);
			return [];
		}
	}, [ task ] );

	/**
	 * Set up event handlers for HTML-based actions (backward compatibility).
	 */
	useEffect( () => {
		if ( ! actionsRef.current ) {
			return;
		}

		const container = actionsRef.current;
		handlersRef.current = [];

		// Only set up handlers for HTML-based actions.
		const hasHtmlActions = taskActions.some( ( a ) => a.type === 'html' );
		if ( ! hasHtmlActions ) {
			return;
		}

		// Handle complete button clicks.
		const completeButtons = container.querySelectorAll(
			'[data-action="complete"]'
		);
		completeButtons.forEach( ( button ) => {
			const handler = createCompleteHandler( task.id, task );
			button.addEventListener( 'click', handler );
			handlersRef.current.push( {
				element: button,
				type: 'click',
				handler,
			} );
		} );

		// Handle snooze radio changes.
		const snoozeRadios = container.querySelectorAll(
			'.prpl-snooze-duration-radio-group input[type="radio"]'
		);
		snoozeRadios.forEach( ( radio ) => {
			const handler = createSnoozeHandler( task.id );
			radio.addEventListener( 'change', handler );
			handlersRef.current.push( {
				element: radio,
				type: 'change',
				handler,
			} );
		} );

		// Handle popover triggers.
		const popoverLinks = container.querySelectorAll(
			'a[onclick*="showPopover"]'
		);
		popoverLinks.forEach( ( link ) => {
			const onclickAttr = link.getAttribute( 'onclick' );
			const match = onclickAttr?.match(
				/getElementById\(['"]([^'"]+)['"]\)/
			);
			if ( match ) {
				const popoverId = match[ 1 ];
				const taskId = popoverId.replace( 'prpl-popover-', '' );
				link.removeAttribute( 'onclick' );
				const handler = createPopoverHandler( taskId, task );
				link.addEventListener( 'click', handler );
				handlersRef.current.push( {
					element: link,
					type: 'click',
					handler,
				} );
			}
		} );

		// Handle delete buttons.
		const deleteButtons = container.querySelectorAll(
			'.prpl-suggested-task-button.trash'
		);
		deleteButtons.forEach( ( button ) => {
			const handler = createDeleteHandler( task.id );
			button.addEventListener( 'click', handler );
			handlersRef.current.push( {
				element: button,
				type: 'click',
				handler,
			} );
		} );

		// Cleanup event listeners.
		return () => {
			handlersRef.current.forEach( ( { element, type, handler } ) => {
				element.removeEventListener( type, handler );
			} );
			handlersRef.current = [];
		};
	}, [
		task,
		taskActions,
		createCompleteHandler,
		createSnoozeHandler,
		createPopoverHandler,
		createDeleteHandler,
	] );

	// If no actions and not a user task, return empty container.
	if ( taskActions.length === 0 && ! isUserTask ) {
		return <div className="tooltip-actions" style={ STYLES.actions }></div>;
	}

	return (
		<div
			className="tooltip-actions"
			style={ STYLES.actions }
			ref={ actionsRef }
		>
			{ taskActions.map( ( action, index ) => (
				<span
					key={ index }
					className="tooltip-action"
					style={ STYLES.action }
				>
					{ action.type === 'html' ? (
						// Render HTML string (backward compatibility with PHP).
						<span
							dangerouslySetInnerHTML={ { __html: action.html } }
						/>
					) : (
						// Render React component based on action type.
						renderAction(
							action,
							task,
							onComplete,
							onSnooze,
							onDelete
						)
					) }
				</span>
			) ) }

			{ /* Add delete button for user tasks */ }
			{ isUserTask && (
				<span className="tooltip-action" style={ STYLES.action }>
					<TaskActionDelete
						postId={ task.id }
						taskTitle={ task.title?.rendered || task.title }
						onClick={ () => onDelete( task.id ) }
					/>
				</span>
			) }
		</div>
	);
}
