/**
 * Todo Widget Component.
 *
 * Displays a list of user-created todo tasks.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useGridMasonry } from '../../hooks/useGridMasonry';

/**
 * Fetch user tasks from API.
 *
 * @param {Object} options        Fetch options.
 * @param {Array}  options.status Task status(es).
 * @return {Promise<Array>} Promise resolving to tasks array.
 */
async function fetchUserTasks( { status = [ 'publish', 'trash' ] } = {} ) {
	const statusParam = Array.isArray( status )
		? status.map( ( s ) => `status[]=${ s }` ).join( '&' )
		: `status=${ status }`;

	return apiFetch( {
		path: `/wp/v2/prpl_recommendations?${ statusParam }&provider=user&per_page=100&_embed=true&filter[orderby]=menu_order&filter[order]=ASC`,
	} );
}

/**
 * Create a new task.
 *
 * @param {Object} data       Task data.
 * @param {string} data.title Task title.
 * @param {number} data.order Menu order.
 * @return {Promise<Object>} Promise resolving to created task.
 */
async function createTask( { title, order } ) {
	return apiFetch( {
		path: '/wp/v2/prpl_recommendations',
		method: 'POST',
		data: {
			title,
			status: 'publish',
			menu_order: order,
			prpl_recommendations_provider:
				window.prplTodoConfig?.userProviderId,
		},
	} );
}

/**
 * Update a task.
 *
 * @param {number} postId Task post ID.
 * @param {Object} data   Data to update.
 * @return {Promise<Object>} Promise resolving to updated task.
 */
async function updateTask( postId, data ) {
	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }`,
		method: 'POST',
		data,
	} );
}

/**
 * Delete a task.
 *
 * @param {number} postId Task post ID.
 * @return {Promise<Object>} Promise resolving to deletion response.
 */
async function deleteTask( postId ) {
	return apiFetch( {
		path: `/wp/v2/prpl_recommendations/${ postId }?force=true`,
		method: 'DELETE',
	} );
}

/**
 * Todo Item Component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.task          The task object.
 * @param {boolean}  props.isGolden      Whether this is the golden task.
 * @param {boolean}  props.isCompleted   Whether the task is completed.
 * @param {number}   props.index         The index of the task in the list.
 * @param {Function} props.onToggle      Callback for toggling completion.
 * @param {Function} props.onDelete      Callback for deleting task.
 * @param {Function} props.onMove        Callback for moving task.
 * @param {Function} props.onTitleChange Callback for title change.
 * @return {JSX.Element} The todo item component.
 */
function TodoItem( {
	task,
	isGolden,
	isCompleted,
	index = 0,
	onToggle,
	onDelete,
	onMove,
	onTitleChange,
} ) {
	const titleRef = useRef( null );
	const debounceRef = useRef( null );

	const handleTitleInput = useCallback( () => {
		if ( debounceRef.current ) {
			clearTimeout( debounceRef.current );
		}
		debounceRef.current = setTimeout( () => {
			if ( titleRef.current ) {
				const newTitle = titleRef.current.textContent.replace(
					/\n/g,
					''
				);
				onTitleChange( task.id, newTitle );
			}
		}, 300 );
	}, [ task.id, onTitleChange ] );

	const handleKeyDown = useCallback( ( e ) => {
		if ( e.key === 'Enter' ) {
			e.preventDefault();
			e.target.blur();
		}
	}, [] );

	// Inline styles for the task item.
	const taskItemStyle = {
		margin: 0,
		padding: '0.75rem 0.5rem 0.625rem 0.5rem',
		display: 'grid',
		gridTemplateColumns: '1.5rem 1fr 3.5rem',
		gap: '0.25rem 0.5rem',
		position: 'relative',
		lineHeight: 1,
		backgroundColor:
			index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent',
	};

	const checkboxWrapperStyle = {
		display: 'flex',
		width: '100%',
		gap: 0,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const titleWrapperStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		justifyContent: 'space-between',
	};

	const titleStyle = {
		width: '100%',
		color: 'var(--prpl-color-text)',
		fontSize: '1rem',
		margin: 0,
		fontWeight: 500,
		...(isCompleted ? { textDecoration: 'line-through' } : {}),
	};

	const pointsWrapperStyle = {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gridRowEnd: 'span 2',
	};

	const pointsBadgeStyle = {
		fontSize: 'var(--prpl-font-size-xs)',
		fontWeight: 700,
		color: 'var(--prpl-text-point)',
		backgroundColor: 'var(--prpl-background-point)',
		width: '1.5rem',
		height: '1.5rem',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const buttonStyle = {
		padding: '0.1rem',
		lineHeight: 0,
		margin: 0,
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		color: 'var(--prpl-color-ui-icon)',
	};

	const moveButtonsWrapperStyle = {
		position: 'absolute',
		left: 'calc(-8px - 0.5rem)',
		top: '50%',
		transform: 'translateY(-50%)',
		padding: '10px 10px 10px 0',
		display: 'flex',
		width: '100%',
		gap: 0,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const moveButtonStyle = {
		...buttonStyle,
		padding: 0,
		height: '0.75rem',
		boxShadow: 'none',
		marginTop: '1px',
	};

	return (
		<li
			className={ `prpl-suggested-task${
				isGolden ? ' prpl-golden-task' : ''
			}` }
			style={ taskItemStyle }
			data-task-id={ task.slug || task.id }
			data-post-id={ task.id }
			data-task-action={ isCompleted ? 'completed' : 'publish' }
			data-task-provider-id="user"
			data-task-points={ task.prpl_points || 0 }
			data-task-order={ task.menu_order || 0 }
		>
			<div
				className="prpl-suggested-task-checkbox-wrapper"
				style={ checkboxWrapperStyle }
			>
				{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
				<label style={ checkboxWrapperStyle }>
					<input
						type="checkbox"
						className="prpl-suggested-task-checkbox"
						style={ { margin: 0, flexShrink: 0 } }
						checked={ isCompleted }
						onChange={ () => onToggle( task.id ) }
					/>
					<span className="screen-reader-text">
						{ task.title?.rendered || task.title }:{ ' ' }
						{ __( 'Mark as completed', 'progress-planner' ) }
					</span>
				</label>
			</div>

			<div
				className="prpl-suggested-task-title-wrapper"
				style={ titleWrapperStyle }
			>
				<h3 className="prpl-task-title" style={ titleStyle }>
					<span
						ref={ titleRef }
						contentEditable
						suppressContentEditableWarning
						onInput={ handleTitleInput }
						onKeyDown={ handleKeyDown }
						data-post-id={ task.id }
						tabIndex={ 0 }
						role="textbox"
						aria-label={ __(
							'Edit task title',
							'progress-planner'
						) }
					>
						{ task.title?.rendered || task.title }
					</span>
				</h3>
			</div>

			<div
				className="prpl-suggested-task-points-wrapper"
				style={ pointsWrapperStyle }
			>
				{ ( task.prpl_points || 0 ) > 0 && (
					<span
						className="prpl-suggested-task-points"
						style={ pointsBadgeStyle }
					>
						+{ task.prpl_points }
					</span>
				) }
				<button
					type="button"
					className="prpl-suggested-task-delete"
					style={ buttonStyle }
					onClick={ () => onDelete( task.id ) }
					aria-label={ __( 'Delete task', 'progress-planner' ) }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						width="16"
						height="16"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Z"
						/>
					</svg>
				</button>
			</div>

			{ ! isCompleted && (
				<div
					className="tooltip-actions prpl-move-buttons-wrapper"
					style={ moveButtonsWrapperStyle }
				>
					<button
						type="button"
						className="prpl-move-up"
						style={ moveButtonStyle }
						onClick={ () => onMove( task.id, 'up' ) }
						aria-label={ __( 'Move up', 'progress-planner' ) }
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="16"
							height="16"
							aria-hidden="true"
						>
							<path
								fill="currentColor"
								d="M12 4l-8 8h6v8h4v-8h6z"
							/>
						</svg>
					</button>
					<button
						type="button"
						className="prpl-move-down"
						style={ moveButtonStyle }
						onClick={ () => onMove( task.id, 'down' ) }
						aria-label={ __( 'Move down', 'progress-planner' ) }
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="16"
							height="16"
							aria-hidden="true"
						>
							<path
								fill="currentColor"
								d="M12 20l8-8h-6v-8h-4v8h-6z"
							/>
						</svg>
					</button>
				</div>
			) }
		</li>
	);
}

/**
 * Todo Widget main component.
 *
 * @return {JSX.Element} The widget component.
 */
export default function TodoWidget() {
	const [ pendingTasks, setPendingTasks ] = useState( [] );
	const [ completedTasks, setCompletedTasks ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ newTaskTitle, setNewTaskTitle ] = useState( '' );
	const [ showDeletePopover, setShowDeletePopover ] = useState( false );
	const inputRef = useRef( null );

	// Initialize grid masonry layout.
	useGridMasonry();

	/**
	 * Load tasks on mount.
	 */
	useEffect( () => {
		const loadTasks = async () => {
			try {
				const tasks = await fetchUserTasks();
				const pending = tasks.filter( ( t ) => t.status === 'publish' );
				const completed = tasks.filter( ( t ) => t.status === 'trash' );

				// Sort by menu_order
				pending.sort(
					( a, b ) => ( a.menu_order || 0 ) - ( b.menu_order || 0 )
				);
				completed.sort(
					( a, b ) => ( a.menu_order || 0 ) - ( b.menu_order || 0 )
				);

				setPendingTasks( pending );
				setCompletedTasks( completed );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error loading tasks:', error );
			} finally {
				setIsLoading( false );
				// Trigger grid resize
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}
		};

		loadTasks();
	}, [] );

	/**
	 * Create a new task.
	 */
	const handleCreateTask = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! newTaskTitle.trim() ) {
				return;
			}

			try {
				const highestOrder = pendingTasks.reduce(
					( max, t ) => Math.max( max, t.menu_order || 0 ),
					0
				);

				const newTask = await createTask( {
					title: newTaskTitle,
					order: highestOrder + 1,
				} );

				setPendingTasks( ( prev ) => [ ...prev, newTask ] );
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
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error creating task:', error );
			}
		},
		[ newTaskTitle, pendingTasks ]
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
					setPendingTasks( ( prev ) => [
						...prev,
						{ ...task, status: 'publish' },
					] );
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
					if ( task.prpl_points > 0 ) {
						if (
							typeof window.prplUpdateRaviGauge === 'function'
						) {
							window.prplUpdateRaviGauge( task.prpl_points );
						}
						document.dispatchEvent(
							new CustomEvent( 'prpl/celebrateTasks', {
								detail: {},
							} )
						);
					}
				}

				// Trigger grid resize
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error toggling task:', error );
			}
		},
		[ pendingTasks, completedTasks ]
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
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
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

			setPendingTasks( updates );

			// Save order changes to server
			try {
				await Promise.all(
					updates.map( ( t ) =>
						updateTask( t.id, { menu_order: t.menu_order } )
					)
				);
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error saving task order:', error );
			}

			// Trigger grid resize
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		},
		[ pendingTasks ]
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
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error deleting completed tasks:', error );
		}
	}, [ completedTasks ] );

	if ( isLoading ) {
		return (
			<p id="prpl-todo-list-loading">
				{ __( 'Loading items…', 'progress-planner' ) }
			</p>
		);
	}

	// Inline styles
	const listStyle = {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	};

	const formStyle = {
		display: 'flex',
		gap: '0.5rem',
		marginTop: 'var(--prpl-padding)',
	};

	const inputStyle = {
		flex: 1,
		minWidth: 0,
	};

	const addButtonStyle = {
		padding: '0.5rem',
		background: 'var(--prpl-color-button-secondary-background)',
		border: '1px solid var(--prpl-color-button-secondary-border)',
		borderRadius: 'var(--prpl-border-radius)',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const detailsStyle = {
		marginTop: 'var(--prpl-padding)',
		borderTop: '1px solid var(--prpl-color-border)',
		paddingTop: 'var(--prpl-padding)',
	};

	const summaryStyle = {
		cursor: 'pointer',
		fontWeight: 500,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0.5rem 0',
	};

	const summaryIconStyle = {
		marginLeft: '0.5rem',
		transition: 'transform 0.2s',
		width: '1rem',
		height: '1rem',
	};

	const deleteAllWrapperStyle = {
		marginTop: '0.5rem',
		marginBottom: '0.5rem',
		borderBottom: '1px solid var(--prpl-color-border)',
		paddingBottom: '0.5rem',
	};

	const deleteAllButtonStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		padding: '0.5rem',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		color: 'var(--prpl-color-text)',
		fontSize: 'var(--prpl-font-size-small)',
	};

	return (
		<>
			<div
				id="todo-aria-live-region"
				aria-live="polite"
				style={ { position: 'absolute', left: '-9999px' } }
			></div>

			<ul
				id="todo-list"
				className="prpl-todo-list prpl-suggested-tasks-list"
				style={ listStyle }
			>
				{ pendingTasks.map( ( task, index ) => (
					<TodoItem
						key={ task.id }
						task={ task }
						index={ index }
						isGolden={ index === 0 && task.prpl_points > 0 }
						isCompleted={ false }
						onToggle={ handleToggle }
						onDelete={ handleDelete }
						onMove={ handleMove }
						onTitleChange={ handleTitleChange }
					/>
				) ) }
			</ul>

			<form
				id="create-todo-item"
				style={ formStyle }
				onSubmit={ handleCreateTask }
			>
				<input
					ref={ inputRef }
					type="text"
					id="new-todo-content"
					style={ inputStyle }
					placeholder={ __( 'Add a new task', 'progress-planner' ) }
					aria-label={ __( 'Add a new task', 'progress-planner' ) }
					required
					value={ newTaskTitle }
					onChange={ ( e ) => setNewTaskTitle( e.target.value ) }
				/>
				<button
					type="submit"
					style={ addButtonStyle }
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
				<details id="todo-list-completed-details" style={ detailsStyle }>
					<summary style={ summaryStyle }>
						{ __( 'Completed tasks', 'progress-planner' ) }
						<span
							className="prpl-todo-list-completed-summary-icon"
							style={ summaryIconStyle }
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
						style={ deleteAllWrapperStyle }
					>
						<button
							id="todo-list-completed-delete-all"
							style={ deleteAllButtonStyle }
							onClick={ () => setShowDeletePopover( true ) }
						>
							<span
								style={ {
									display: 'inline-block',
									width: '18px',
									height: '18px',
								} }
							>
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
						style={ listStyle }
					>
						{ completedTasks.map( ( task, index ) => (
							<TodoItem
								key={ task.id }
								task={ task }
								index={ index }
								isGolden={ false }
								isCompleted={ true }
								onToggle={ handleToggle }
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
					style={ {
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 10000,
						background: 'white',
						padding: '20px',
						borderRadius: '8px',
						boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
					} }
				>
					<div className="prpl-note">
						<span className="prpl-note-text">
							{ __(
								'Are you sure you want to delete all completed tasks? This action cannot be undone.',
								'progress-planner'
							) }
						</span>
					</div>

					<div
						className="prpl-buttons-wrapper"
						style={ {
							display: 'flex',
							gap: '10px',
							marginTop: '15px',
						} }
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
					style={ {
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(0,0,0,0.3)',
						zIndex: 9999,
					} }
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
