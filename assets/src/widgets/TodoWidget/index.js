/**
 * Todo Widget Component.
 *
 * Displays a list of user-created todo tasks.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import TaskItem from '../../components/TaskItem';
import {
	fetchTasks,
	createTask,
	updateTask,
	deleteTask,
} from '../../hooks/useTasksApi';
import { useGridMasonry } from '../../hooks/useGridMasonry';
import { useCelebration } from '../../hooks/useCelebration';
import { dispatchGridResize } from '../../utils/gridResize';
import { getTaskPoints } from '../../utils/taskUtils';
import WidgetHeader from '../../components/WidgetHeader';
import TodoWidgetSkeleton from './TodoWidgetSkeleton';
import { useDashboardStore } from '../../stores/dashboardStore';

/**
 * Style constants - extracted to prevent recreation on each render.
 */
const STYLES = {
	list: {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	},
	form: {
		display: 'flex',
		gap: '0.5rem',
		marginTop: 'var(--prpl-padding)',
	},
	input: {
		flex: 1,
		minWidth: 0,
	},
	addButton: {
		padding: '0.5rem',
		background: 'var(--prpl-color-button-secondary-background)',
		border: '1px solid var(--prpl-color-button-secondary-border)',
		borderRadius: 'var(--prpl-border-radius)',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	details: {
		marginTop: 'var(--prpl-padding)',
		borderTop: '1px solid var(--prpl-color-border)',
		paddingTop: 'var(--prpl-padding)',
	},
	summary: {
		cursor: 'pointer',
		fontWeight: 500,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0.5rem 0',
	},
	summaryIcon: {
		marginLeft: '0.5rem',
		transition: 'transform 0.2s',
		width: '1rem',
		height: '1rem',
	},
	deleteAllWrapper: {
		marginTop: '0.5rem',
		marginBottom: '0.5rem',
		borderBottom: '1px solid var(--prpl-color-border)',
		paddingBottom: '0.5rem',
	},
	deleteAllButton: {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		padding: '0.5rem',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		color: 'var(--prpl-color-text)',
		fontSize: 'var(--prpl-font-size-small)',
	},
	deleteAllIcon: {
		display: 'inline-block',
		width: '18px',
		height: '18px',
	},
	tooltipActions: {
		display: 'inline-flex',
		verticalAlign: 'text-top',
	},
	srOnly: {
		position: 'absolute',
		left: '-9999px',
	},
	popover: {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 10000,
		background: 'white',
		padding: '20px',
		borderRadius: '8px',
		boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
	},
	popoverButtons: {
		display: 'flex',
		gap: '2rem',
		marginTop: '15px',
	},
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(0,0,0,0.3)',
		zIndex: 9999,
	},
};

/**
 * Todo Widget main component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The widget component.
 */
function TodoWidget( { config = {} } ) {
	const [ pendingTasks, setPendingTasks ] = useState( [] );
	const [ completedTasks, setCompletedTasks ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ showDeletePopover, setShowDeletePopover ] = useState( false );
	const [ isCreatingTask, setIsCreatingTask ] = useState( false );
	const inputRef = useRef( null );

	// Initialize grid masonry layout.
	useGridMasonry();

	// Get celebration functions.
	const { celebrate } = useCelebration();

	// Get onTaskCompleted from Zustand store for cross-widget communication.
	const onTaskCompleted = useDashboardStore(
		( state ) => state.onTaskCompleted
	);

	// Get terms functionality from dashboardStore (mirrors develop branch's prplTerms).
	const userProviderId = useDashboardStore( ( state ) =>
		state.getProviderTermId( 'user' )
	);
	const fetchProviderTerms = useDashboardStore(
		( state ) => state.fetchProviderTerms
	);

	/**
	 * Sort tasks: golden tasks first, then by menu_order.
	 *
	 * @param {Array} tasks Array of task objects.
	 * @return {Array} Sorted array of tasks.
	 */
	const sortTasksWithGoldenFirst = useCallback( ( tasks ) => {
		return [ ...tasks ].sort( ( a, b ) => {
			const aIsGolden = getTaskPoints( a ) === 1;
			const bIsGolden = getTaskPoints( b ) === 1;

			// Golden tasks come first
			if ( aIsGolden && ! bIsGolden ) {
				return -1;
			}
			if ( ! aIsGolden && bIsGolden ) {
				return 1;
			}
			// Both golden or both not golden - sort by menu_order
			return ( a.menu_order || 0 ) - ( b.menu_order || 0 );
		} );
	}, [] );

	/**
	 * Load tasks on mount.
	 */
	useEffect( () => {
		const loadTasks = async () => {
			try {
				// Fetch pending user tasks
				const pendingResult = await fetchTasks( {
					status: 'publish',
					provider: 'user',
					perPage: 100,
				} );

				// Fetch completed user tasks
				const completedResult = await fetchTasks( {
					status: 'trash',
					provider: 'user',
					perPage: 100,
				} );

				// Sort pending tasks: golden tasks (prpl_points === 1) first, then by menu_order
				const sortedPending = sortTasksWithGoldenFirst(
					pendingResult.tasks
				);
				completedResult.tasks.sort(
					( a, b ) => ( a.menu_order || 0 ) - ( b.menu_order || 0 )
				);

				setPendingTasks( sortedPending );
				setCompletedTasks( completedResult.tasks );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error loading tasks:', error );
			} finally {
				setIsLoading( false );
				// Trigger grid resize
				dispatchGridResize();
			}
		};

		loadTasks();
	}, [ sortTasksWithGoldenFirst ] );

	/**
	 * Fetch provider terms on mount.
	 * This ensures we have the 'user' term ID for creating tasks.
	 */
	useEffect( () => {
		fetchProviderTerms();
	}, [ fetchProviderTerms ] );

	/**
	 * Create a new task.
	 */
	const handleCreateTask = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! newTaskTitle.trim() ) {
				return;
			}

			setIsCreatingTask( true );

			try {
				const highestOrder = pendingTasks.reduce(
					( max, t ) => Math.max( max, t.menu_order || 0 ),
					0
				);

				const newTask = await createTask( {
					title: newTaskTitle,
					menuOrder: highestOrder + 1,
					providerId: userProviderId,
					points: 0,
				} );

				setPendingTasks( ( prev ) =>
					sortTasksWithGoldenFirst( [ ...prev, newTask ] )
				);
				setNewTaskTitle( '' );

				// Announce to screen readers
				if ( window.wp?.a11y?.speak ) {
					window.wp.a11y.speak(
						__( 'Task added successfully', 'progress-planner' ),
						'polite'
					);
				}

				// Focus input
				inputRef.current?.focus();

				// Trigger grid resize
				dispatchGridResize();
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error creating task:', error );
			} finally {
				setIsCreatingTask( false );
			}
		},
		[ newTaskTitle, pendingTasks, sortTasksWithGoldenFirst, userProviderId ]
	);

	/**
	 * Toggle task completion.
	 */
	const handleToggle = useCallback(
		async ( taskId ) => {
			const task =
				pendingTasks.find( ( t ) => t.id === taskId ) ||
				completedTasks.find( ( t ) => t.id === taskId );

			if ( ! task ) {
				return;
			}

			const isCurrentlyCompleted = task.status === 'trash';
			const newStatus = isCurrentlyCompleted ? 'publish' : 'trash';

			try {
				await updateTask( taskId, { status: newStatus } );

				if ( isCurrentlyCompleted ) {
					// Move from completed to pending
					setCompletedTasks( ( prev ) =>
						prev.filter( ( t ) => t.id !== taskId )
					);
					setPendingTasks( ( prev ) =>
						sortTasksWithGoldenFirst( [
							...prev,
							{ ...task, status: 'publish' },
						] )
					);
				} else {
					// Move from pending to completed
					setPendingTasks( ( prev ) =>
						prev.filter( ( t ) => t.id !== taskId )
					);
					setCompletedTasks( ( prev ) => [
						...prev,
						{ ...task, status: 'trash' },
					] );

					// Trigger celebration if has points
					const points = getTaskPoints( task );
					if ( points > 0 ) {
						// Notify context about task completion.
						onTaskCompleted( task, points );
						// Trigger celebration confetti.
						celebrate();
					}
				}

				// Trigger grid resize
				dispatchGridResize();
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error toggling task:', error );
			}
		},
		[
			pendingTasks,
			completedTasks,
			sortTasksWithGoldenFirst,
			celebrate,
			onTaskCompleted,
		]
	);

	/**
	 * Delete a task.
	 */
	const handleDelete = useCallback( async ( taskId ) => {
		try {
			await deleteTask( taskId );
			setPendingTasks( ( prev ) =>
				prev.filter( ( t ) => t.id !== taskId )
			);
			setCompletedTasks( ( prev ) =>
				prev.filter( ( t ) => t.id !== taskId )
			);

			// Trigger grid resize
			dispatchGridResize();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error deleting task:', error );
		}
	}, [] );

	/**
	 * Move a task up or down.
	 */
	const handleMove = useCallback(
		async ( taskId, direction ) => {
			const index = pendingTasks.findIndex( ( t ) => t.id === taskId );
			if ( index === -1 ) {
				return;
			}

			const newIndex = direction === 'up' ? index - 1 : index + 1;
			if ( newIndex < 0 || newIndex >= pendingTasks.length ) {
				return;
			}

			// Swap tasks
			const newTasks = [ ...pendingTasks ];
			[ newTasks[ index ], newTasks[ newIndex ] ] = [
				newTasks[ newIndex ],
				newTasks[ index ],
			];

			// Update menu_order for all tasks
			const updates = newTasks.map( ( t, i ) => ( {
				...t,
				menu_order: i,
			} ) );

			// Re-sort to maintain golden tasks first
			const sortedUpdates = sortTasksWithGoldenFirst( updates );
			setPendingTasks( sortedUpdates );

			// Save order changes to server
			try {
				await Promise.all(
					sortedUpdates.map( ( t ) =>
						updateTask( t.id, { menu_order: t.menu_order } )
					)
				);
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error saving task order:', error );
			}

			// Trigger grid resize
			dispatchGridResize();
		},
		[ pendingTasks, sortTasksWithGoldenFirst ]
	);

	/**
	 * Update task title.
	 */
	const handleTitleChange = useCallback( async ( taskId, newTitle ) => {
		try {
			await updateTask( taskId, { title: newTitle } );

			// Update local state
			setPendingTasks( ( prev ) =>
				prev.map( ( t ) =>
					t.id === taskId
						? { ...t, title: { rendered: newTitle } }
						: t
				)
			);
			setCompletedTasks( ( prev ) =>
				prev.map( ( t ) =>
					t.id === taskId
						? { ...t, title: { rendered: newTitle } }
						: t
				)
			);
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error updating task title:', error );
		}
	}, [] );

	/**
	 * Delete all completed tasks.
	 */
	const handleDeleteAllCompleted = useCallback( async () => {
		try {
			await Promise.all(
				completedTasks.map( ( t ) => deleteTask( t.id ) )
			);
			setCompletedTasks( [] );
			setShowDeletePopover( false );

			// Announce to screen readers
			if ( window.wp?.a11y?.speak ) {
				window.wp.a11y.speak(
					__( 'All completed tasks deleted', 'progress-planner' ),
					'assertive'
				);
			}

			// Trigger grid resize
			dispatchGridResize();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error deleting completed tasks:', error );
		}
	}, [ completedTasks ] );

	// Get title - defined early for use in loading state.
	const widgetTitle =
		config?.title || __( 'My to-do list', 'progress-planner' );

	if ( isLoading ) {
		return (
			<>
				<WidgetHeader title={ widgetTitle } />
				<TodoWidgetSkeleton count={ 3 } />
			</>
		);
	}
	const goldenTaskDescription =
		config?.goldenTaskDescription ||
		__(
			"Write down all your tasks you want to get done on your website! You'll earn points for your 'golden task'.",
			'progress-planner'
		);
	const silverTaskDescription =
		config?.silverTaskDescription ||
		__(
			"Write down all your tasks you want to get done on your website! The top task will become your 'golden task' next week.",
			'progress-planner'
		);
	const infoIconSvg = config?.infoIconSvg;
	const tooltipContent =
		config?.tooltipContent ||
		__(
			'Every Monday, your top task becomes the golden task for the week. Complete it anytime this week to earn points toward your monthly total! Once done, the next task is highlighted to become your golden task next week.',
			'progress-planner'
		);

	return (
		<>
			<WidgetHeader title={ widgetTitle } />
			<p className="prpl-widget-description">
				<span className="prpl-todo-golden-task-description">
					{ goldenTaskDescription }
				</span>
				<span className="prpl-todo-silver-task-description">
					{ silverTaskDescription }
				</span>
				<span
					className="tooltip-actions"
					style={ STYLES.tooltipActions }
				>
					<prpl-tooltip>
						<slot name="open-icon">
							<span className="icon prpl-info-icon">
								{ infoIconSvg && (
									<span
										dangerouslySetInnerHTML={ {
											__html: infoIconSvg,
										} }
									/>
								) }
								<span className="screen-reader-text">
									{ __( 'More info', 'progress-planner' ) }
								</span>
							</span>
						</slot>
						<slot name="content">{ tooltipContent }</slot>
					</prpl-tooltip>
				</span>
			</p>

			<div
				id="todo-aria-live-region"
				aria-live="polite"
				style={ STYLES.srOnly }
			></div>

			<ul
				id="todo-list"
				className="prpl-todo-list prpl-suggested-tasks-list"
				style={ STYLES.list }
			>
				{ pendingTasks.map( ( task, index ) => (
					<TaskItem
						key={ task.id }
						task={ task }
						index={ index }
						isUserTask={ true }
						isCelebrating={ false }
						isCompleted={ false }
						showMoveButtons={ true }
						showActions={ false }
						onComplete={ handleToggle }
						onDelete={ handleDelete }
						onMove={ handleMove }
						onTitleChange={ handleTitleChange }
					/>
				) ) }
				{ isCreatingTask && (
					<li
						className="prpl-loader"
						role="status"
						aria-live="polite"
					>
						<span className="screen-reader-text">
							{ __( 'Loading tasks…', 'progress-planner' ) }
						</span>
					</li>
				) }
			</ul>

			<form
				id="create-todo-item"
				style={ STYLES.form }
				onSubmit={ handleCreateTask }
			>
				<input
					ref={ inputRef }
					type="text"
					id="new-todo-content"
					style={ STYLES.input }
					placeholder={ __( 'Add a new task', 'progress-planner' ) }
					aria-label={ __( 'Add a new task', 'progress-planner' ) }
					required
					value={ newTaskTitle }
					onChange={ ( e ) => setNewTaskTitle( e.target.value ) }
				/>
				<button
					type="submit"
					style={ STYLES.addButton }
					aria-label={ __( 'Add task', 'progress-planner' ) }
				>
					<span
						className="dashicons dashicons-plus-alt2"
						aria-hidden="true"
					></span>
					<span className="screen-reader-text">
						{ __( 'Add task', 'progress-planner' ) }
					</span>
				</button>
			</form>

			{ completedTasks.length > 0 && (
				<details
					id="todo-list-completed-details"
					style={ STYLES.details }
				>
					<summary style={ STYLES.summary }>
						{ __( 'Completed tasks', 'progress-planner' ) }
						<span
							className="prpl-todo-list-completed-summary-icon"
							style={ STYLES.summaryIcon }
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m19.5 8.25-7.5 7.5-7.5-7.5"
								/>
							</svg>
						</span>
					</summary>
					<div
						id="todo-list-completed-delete-all-wrapper"
						style={ STYLES.deleteAllWrapper }
					>
						<button
							id="todo-list-completed-delete-all"
							style={ STYLES.deleteAllButton }
							onClick={ () => setShowDeletePopover( true ) }
						>
							<span style={ STYLES.deleteAllIcon }>
								<svg
									role="img"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 48 48"
								>
									<path
										fill="#9ca3af"
										d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Z"
									/>
								</svg>
							</span>
							{ __(
								'Delete all completed tasks',
								'progress-planner'
							) }
						</button>
					</div>
					<ul
						id="todo-list-completed"
						className="prpl-todo-list prpl-suggested-tasks-list"
						style={ STYLES.list }
					>
						{ completedTasks.map( ( task, index ) => (
							<TaskItem
								key={ task.id }
								task={ task }
								index={ index }
								isUserTask={ true }
								isCelebrating={ false }
								isCompleted={ true }
								showMoveButtons={ false }
								showActions={ false }
								onComplete={ handleToggle }
								onDelete={ handleDelete }
								onMove={ handleMove }
								onTitleChange={ handleTitleChange }
							/>
						) ) }
					</ul>
				</details>
			) }

			{ showDeletePopover && (
				<div
					id="todo-list-completed-delete-all-popover"
					className="prpl-popover"
					style={ STYLES.popover }
				>
					<div className="prpl-note">
						<span className="prpl-note-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						<span className="prpl-note-text">
							{ __(
								'Are you sure you want to delete all completed tasks? This action cannot be undone.',
								'progress-planner'
							) }
						</span>
					</div>

					<div
						className="prpl-buttons-wrapper"
						style={ STYLES.popoverButtons }
					>
						<button
							id="todo-list-completed-delete-all-cancel"
							onClick={ () => setShowDeletePopover( false ) }
						>
							<strong>{ __( 'No', 'progress-planner' ) }</strong>
							{ ', ' }
							{ __( 'keep this list', 'progress-planner' ) }
						</button>
						<button
							id="todo-list-completed-delete-all-confirm"
							onClick={ handleDeleteAllCompleted }
						>
							<strong>{ __( 'Yes', 'progress-planner' ) }</strong>
							{ ', ' }
							{ __(
								'delete all completed tasks',
								'progress-planner'
							) }
						</button>
					</div>
				</div>
			) }
			{ showDeletePopover && (
				<div
					role="button"
					tabIndex={ 0 }
					aria-label={ __( 'Close dialog', 'progress-planner' ) }
					style={ STYLES.overlay }
					onClick={ () => setShowDeletePopover( false ) }
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' || e.key === ' ' ) {
							setShowDeletePopover( false );
						}
					} }
				/>
			) }
		</>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'todo',
	component: TodoWidget,
	priority: 10,
	width: 2,
	forceLastColumn: false,
	title: __( 'My to-do list', 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );

export default TodoWidget;
