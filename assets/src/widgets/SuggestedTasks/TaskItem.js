/**
 * Task Item Component.
 *
 * Renders a single task item with its controls.
 */

import { useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import TaskActions from './TaskActions';

/**
 * Arrow icon SVG for non-user tasks.
 *
 * @return {JSX.Element} The arrow SVG.
 */
function ArrowIcon() {
	return (
		<span
			style={ {
				width: '0.75rem',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			} }
		>
			<svg
				role="img"
				aria-hidden="true"
				focusable="false"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 17"
			>
				<path
					fill="#6b7280"
					d="M19.92 8.12c-.05-.12-.12-.23-.22-.33L12.21.29A.996.996 0 1 0 10.8 1.7l5.79 5.79H1c-.55 0-1 .45-1 1s.45 1 1 1h15.59l-5.79 5.79a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l7.5-7.5c.1-.1.17-.21.22-.33.05-.12.07-.24.08-.38 0-.14-.03-.27-.08-.38Z"
				/>
			</svg>
		</span>
	);
}

/**
 * Trash icon SVG.
 *
 * @return {JSX.Element} The trash SVG.
 */
function TrashIcon() {
	return (
		<svg
			role="img"
			aria-hidden="true"
			focusable="false"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 48"
		>
			<path
				fill="#9ca3af"
				d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"
			></path>
		</svg>
	);
}

/**
 * Task Item component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.task          The task object.
 * @param {boolean}  props.isUserTask    Whether this is a user task.
 * @param {boolean}  props.isCelebrating Whether the task is being celebrated.
 * @param {Function} props.onComplete    Callback for completing a task.
 * @param {Function} props.onSnooze      Callback for snoozing a task.
 * @param {Function} props.onDelete      Callback for deleting a task.
 * @param {Function} props.onMove        Callback for moving a task.
 * @param {Function} props.onTitleChange Callback for changing the title.
 * @return {JSX.Element} The task item component.
 */
export default function TaskItem( {
	task,
	isUserTask,
	isCelebrating,
	onComplete,
	onSnooze,
	onDelete,
	onMove,
	onTitleChange,
} ) {
	const titleRef = useRef( null );
	const debounceTimeoutRef = useRef( null );

	// Determine task action based on status.
	const getTaskAction = () => {
		if ( task.status === 'pending' ) {
			return 'celebrate';
		}
		if ( isCelebrating ) {
			return 'celebrate';
		}
		return '';
	};

	// Check if task is completed (for user tasks).
	const isCompleted = task.status === 'trash' || task.status === 'pending';

	/**
	 * Handle checkbox change for user tasks.
	 */
	const handleCheckboxChange = useCallback( () => {
		onComplete( task.id, task );
	}, [ task, onComplete ] );

	/**
	 * Handle title keydown to prevent enter key.
	 *
	 * @param {KeyboardEvent} event The keyboard event.
	 */
	const handleTitleKeyDown = useCallback( ( event ) => {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			event.stopPropagation();
			event.target.blur();
			return false;
		}
	}, [] );

	/**
	 * Handle title input with debounce.
	 */
	const handleTitleInput = useCallback( () => {
		clearTimeout( debounceTimeoutRef.current );
		debounceTimeoutRef.current = setTimeout( () => {
			if ( titleRef.current ) {
				const newTitle = titleRef.current.textContent.replace(
					/\n/g,
					''
				);
				onTitleChange( task.id, newTitle );
			}
		}, 300 );
	}, [ task.id, onTitleChange ] );

	/**
	 * Handle move up.
	 */
	const handleMoveUp = useCallback( () => {
		onMove( task.id, 'up' );
	}, [ task.id, onMove ] );

	/**
	 * Handle move down.
	 */
	const handleMoveDown = useCallback( () => {
		onMove( task.id, 'down' );
	}, [ task.id, onMove ] );

	/**
	 * Handle trash click for user tasks.
	 */
	const handleTrash = useCallback( () => {
		onDelete( task.id );
	}, [ task.id, onDelete ] );

	// Get the task ID for the data attribute.
	const taskId = task.slug || task.id;

	// Get the provider slug.
	const providerSlug = task.prpl_provider?.slug || '';

	// Build the class name.
	const className = [
		'prpl-suggested-task',
		isCelebrating ? 'prpl-suggested-task-celebrated' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<li
			className={ className }
			data-task-id={ taskId }
			data-post-id={ task.id }
			data-task-action={ getTaskAction() }
			data-task-provider-id={ providerSlug }
			data-task-points={ task.prpl_points || 0 }
			data-task-order={ task.menu_order || 0 }
		>
			<div className="prpl-suggested-task-checkbox-wrapper">
				{ isUserTask ? (
					// eslint-disable-next-line jsx-a11y/label-has-associated-control -- Checkbox is nested inside label.
					<label>
						<input
							type="checkbox"
							className="prpl-suggested-task-checkbox"
							onChange={ handleCheckboxChange }
							style={ { margin: 0 } }
							checked={ isCompleted }
							disabled={ isCelebrating }
						/>
						<span className="screen-reader-text">
							{ task.title?.rendered || task.title }:{ ' ' }
							{ __( 'Mark as complete', 'progress-planner' ) }
						</span>
					</label>
				) : (
					<ArrowIcon />
				) }
			</div>

			<div className="prpl-suggested-task-title-wrapper">
				<h3 className="prpl-task-title">
					{ isUserTask ? (
						<span
							ref={ titleRef }
							contentEditable="plaintext-only"
							role="textbox"
							tabIndex={ 0 }
							aria-label={ __(
								'Edit task title',
								'progress-planner'
							) }
							aria-multiline="false"
							onKeyDown={ handleTitleKeyDown }
							onInput={ handleTitleInput }
							suppressContentEditableWarning
							dangerouslySetInnerHTML={ {
								__html: task.title?.rendered || task.title,
							} }
						/>
					) : (
						<span
							dangerouslySetInnerHTML={ {
								__html: task.title?.rendered || task.title,
							} }
						/>
					) }
				</h3>
			</div>

			<div className="prpl-suggested-task-points-wrapper">
				{ task.prpl_points > 0 && (
					<span className="prpl-suggested-task-points">
						+{ task.prpl_points }
					</span>
				) }

				{ isUserTask && (
					<button
						type="button"
						className="prpl-suggested-task-button trash"
						data-post-id={ task.id }
						title={ __( 'Delete', 'progress-planner' ) }
						onClick={ handleTrash }
					>
						<TrashIcon />
						<span className="screen-reader-text">
							{ __( 'Delete', 'progress-planner' ) }
						</span>
					</button>
				) }
			</div>

			{ isUserTask && (
				<div className="tooltip-actions prpl-move-buttons-wrapper">
					<span className="prpl-move-buttons">
						<button
							type="button"
							className="prpl-suggested-task-button move-up"
							data-task-id={ taskId }
							data-task-title={
								task.title?.rendered || task.title
							}
							data-action="move-up"
							data-target="move-up"
							title={ __( 'Move up', 'progress-planner' ) }
							onClick={ handleMoveUp }
						>
							<span className="dashicons dashicons-arrow-up-alt2"></span>
							<span className="screen-reader-text">
								{ __( 'Move up', 'progress-planner' ) }
							</span>
						</button>
						<button
							type="button"
							className="prpl-suggested-task-button move-down"
							data-task-id={ taskId }
							data-task-title={
								task.title?.rendered || task.title
							}
							data-action="move-down"
							data-target="move-down"
							title={ __( 'Move down', 'progress-planner' ) }
							onClick={ handleMoveDown }
						>
							<span className="dashicons dashicons-arrow-down-alt2"></span>
							<span className="screen-reader-text">
								{ __( 'Move down', 'progress-planner' ) }
							</span>
						</button>
					</span>
				</div>
			) }

			<div className="prpl-suggested-task-actions-wrapper">
				<TaskActions
					task={ task }
					isUserTask={ isUserTask }
					onComplete={ onComplete }
					onSnooze={ onSnooze }
					onDelete={ onDelete }
				/>
			</div>
		</li>
	);
}
