/**
 * Task Actions Component.
 *
 * Renders action buttons for a task (complete, snooze, info, etc.).
 * Uses the prpl_task_actions array from the API which contains pre-rendered HTML.
 * If prpl_task_actions is missing, generates actions from the task provider.
 */

import { useEffect, useRef, useMemo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { getTaskProviderInstance } from '../../services/taskRegistry';

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
	actionText: {
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	},
	button: {
		textDecoration: 'none',
		padding: 0,
		lineHeight: 1,
		background: 'none',
		border: 'none',
		cursor: 'pointer',
	},
};

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
	// Store references to event handlers for proper cleanup.
	const handlersRef = useRef( [] );

	/**
	 * Create memoized event handler factories to ensure stable references.
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

	/**
	 * Set up event handlers for the rendered HTML actions.
	 */
	useEffect( () => {
		if ( ! actionsRef.current ) {
			return;
		}

		const container = actionsRef.current;
		// Clear previous handlers array.
		handlersRef.current = [];

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
				const handler = createPopoverHandler( taskId, task );
				link.addEventListener( 'click', handler );
				handlersRef.current.push( {
					element: link,
					type: 'click',
					handler,
				} );
			}
		} );

		// Handle delete buttons for user tasks.
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

		// Cleanup: properly remove all event listeners on unmount.
		return () => {
			handlersRef.current.forEach( ( { element, type, handler } ) => {
				element.removeEventListener( type, handler );
			} );
			handlersRef.current = [];
		};
	}, [
		task,
		createCompleteHandler,
		createSnoozeHandler,
		createPopoverHandler,
		createDeleteHandler,
	] );

	// Get task actions from API response, or generate from task provider if missing.
	const taskActions = useMemo( () => {
		// If actions are already provided from the API and not empty, use them.
		// Note: Empty array means we should generate actions client-side.
		if (
			task.prpl_task_actions &&
			Array.isArray( task.prpl_task_actions ) &&
			task.prpl_task_actions.length > 0
		) {
			return task.prpl_task_actions;
		}

		// Otherwise, try to generate actions from the task provider.
		// Try multiple ways to get the provider ID:
		// 1. From prpl_provider object (if embedded in REST response)
		// 2. From provider_id field
		// 3. From meta.provider_id
		// 4. From task slug (often matches provider ID for React tasks)
		// 5. Fetch term from prpl_recommendations_provider if it's an array of IDs
		let providerId =
			task.prpl_provider?.slug ||
			task.provider_id ||
			task.meta?.provider_id ||
			'';

		// Fallback: Use task slug as provider ID (common pattern for React tasks)
		if ( ! providerId && task.slug ) {
			providerId = task.slug;
		}

		// Fallback: Try to get provider from embedded taxonomy terms or fetch it
		if (
			! providerId &&
			task.prpl_recommendations_provider &&
			Array.isArray( task.prpl_recommendations_provider )
		) {
			// If it's an array of term objects (from _embed)
			const firstItem = task.prpl_recommendations_provider[ 0 ];
			if (
				firstItem &&
				typeof firstItem === 'object' &&
				firstItem.slug
			) {
				providerId = firstItem.slug;
			} else if (
				typeof firstItem === 'number' &&
				task._embedded &&
				task._embedded[ 'wp:term' ] &&
				task._embedded[ 'wp:term' ][ 0 ]
			) {
				// Try to find the term in embedded data
				const embeddedTerms = task._embedded[ 'wp:term' ].flat();
				const term = embeddedTerms.find(
					( t ) =>
						t &&
						t.taxonomy === 'prpl_recommendations_provider' &&
						t.id === firstItem
				);
				if ( term && term.slug ) {
					providerId = term.slug;
				}
			}
		}

		if ( ! providerId ) {
			console.warn( 'TaskActions: No providerId found for task:', {
				...task,
				prpl_provider: task.prpl_provider,
				provider_id: task.provider_id,
				slug: task.slug,
				prpl_recommendations_provider:
					task.prpl_recommendations_provider,
			} );
			return [];
		}

		const providerInstance = getTaskProviderInstance( providerId );
		if ( ! providerInstance ) {
			console.warn(
				`TaskActions: Provider instance not found for providerId "${ providerId }"`,
				{ task }
			);
			return [];
		}
		if ( ! providerInstance.getTaskActions ) {
			console.warn(
				`TaskActions: Provider "${ providerId }" does not have getTaskActions method`
			);
			return [];
		}

		try {
			const actions = providerInstance.getTaskActions( task );
			if ( ! actions || actions.length === 0 ) {
				console.warn(
					`TaskActions: No actions generated for provider "${ providerId }"`,
					{ task, providerInstance }
				);
			}
			return actions || [];
		} catch ( error ) {
			console.error(
				`Error generating actions for task provider "${ providerId }":`,
				error
			);
			return [];
		}
	}, [ task ] );

	// If no actions and not a user task, return empty.
	if ( taskActions.length === 0 && ! isUserTask ) {
		return <div className="tooltip-actions" style={ STYLES.actions }></div>;
	}

	return (
		<div
			className="tooltip-actions"
			style={ STYLES.actions }
			ref={ actionsRef }
		>
			{ /* Render pre-built HTML actions from the API */ }
			{ taskActions.map( ( actionHTML, actionIndex ) => (
				<span
					key={ actionIndex }
					className="tooltip-action"
					style={ STYLES.action }
					dangerouslySetInnerHTML={ { __html: actionHTML } }
				/>
			) ) }

			{ /* Add delete button for user tasks */ }
			{ isUserTask && (
				<span className="tooltip-action" style={ STYLES.action }>
					<button
						type="button"
						className="prpl-suggested-task-button trash"
						style={ STYLES.button }
						data-post-id={ task.id }
						title={ __( 'Delete', 'progress-planner' ) }
						onClick={ () => onDelete( task.id ) }
					>
						<span
							className="prpl-tooltip-action-text"
							style={ STYLES.actionText }
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
