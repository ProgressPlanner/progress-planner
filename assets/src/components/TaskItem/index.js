/**
 * Task Item Component.
 *
 * Renders a single task item with its controls.
 * Shared between SuggestedTasks and TodoWidget.
 */

import { useRef, useCallback, useEffect } from '@wordpress/element';
import TaskActions from './TaskActions';
import TaskCheckbox from './TaskCheckbox';
import TaskTitle from './TaskTitle';
import TaskPoints from './TaskPoints';
import TaskMoveButtons from './TaskMoveButtons';
import { getTaskItemStyle, actionsWrapperStyle } from './styles';

/**
 * Task Item component.
 *
 * @param {Object}   props                 Component props.
 * @param {Object}   props.task            The task object.
 * @param {boolean}  props.isUserTask      Whether this is a user task.
 * @param {boolean}  props.isCelebrating   Whether the task is being celebrated.
 * @param {boolean}  props.isCompleted     Whether the task is completed (for TodoWidget).
 * @param {number}   props.index           The index of the task in the list.
 * @param {boolean}  props.showMoveButtons Whether to show move up/down buttons.
 * @param {boolean}  props.showActions     Whether to show task actions row.
 * @param {Function} props.onComplete      Callback for completing a task.
 * @param {Function} props.onSnooze        Callback for snoozing a task.
 * @param {Function} props.onDelete        Callback for deleting a task.
 * @param {Function} props.onMove          Callback for moving a task.
 * @param {Function} props.onTitleChange   Callback for changing the title.
 * @return {JSX.Element} The task item component.
 */
export default function TaskItem( {
	task,
	isUserTask,
	isCelebrating,
	isCompleted = false,
	index = 0,
	showMoveButtons = true,
	showActions = true,
	onComplete,
	onSnooze,
	onDelete,
	onMove,
	onTitleChange,
} ) {
	const titleRef = useRef( null );
	const debounceTimeoutRef = useRef( null );

	/**
	 * Determine task action based on status.
	 *
	 * @return {string} The task action.
	 */
	const getTaskAction = () => {
		if ( task.status === 'pending' ) {
			return 'celebrate';
		}
		if ( isCelebrating ) {
			return 'celebrate';
		}
		if ( isCompleted ) {
			return 'completed';
		}
		return '';
	};

	/**
	 * Check if task is completed (for user tasks).
	 */
	const taskIsCompleted =
		isCompleted || task.status === 'trash' || task.status === 'pending';

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
				const newTitle = titleRef.current.textContent.replace( /\n/g, '' );
				onTitleChange( task.id, newTitle );
			}
		}, 300 );
	}, [ task.id, onTitleChange ] );

	/**
	 * Cleanup debounce timeout on unmount.
	 */
	useEffect( () => {
		return () => {
			if ( debounceTimeoutRef.current ) {
				clearTimeout( debounceTimeoutRef.current );
			}
		};
	}, [] );

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
	const providerSlug =
		task.prpl_provider?.slug || ( isUserTask ? 'user' : '' );

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
			style={ getTaskItemStyle( index ) }
			data-task-id={ taskId }
			data-post-id={ task.id }
			data-task-action={ getTaskAction() }
			data-task-provider-id={ providerSlug }
			data-task-points={ task.prpl_points || 0 }
			data-task-order={ task.menu_order || 0 }
		>
			<TaskCheckbox
				isUserTask={ isUserTask }
				taskIsCompleted={ taskIsCompleted }
				isCelebrating={ isCelebrating }
				task={ task }
				onChange={ handleCheckboxChange }
			/>

			<TaskTitle
				task={ task }
				isUserTask={ isUserTask }
				isCompleted={ isCompleted }
				isCelebrating={ isCelebrating }
				titleRef={ titleRef }
				onKeyDown={ handleTitleKeyDown }
				onInput={ handleTitleInput }
			/>

			<TaskPoints
				task={ task }
				isUserTask={ isUserTask }
				onDelete={ handleTrash }
			/>

			{ isUserTask && showMoveButtons && ! isCompleted && (
				<TaskMoveButtons
					task={ task }
					taskId={ taskId }
					onMoveUp={ handleMoveUp }
					onMoveDown={ handleMoveDown }
				/>
			) }

			{ showActions && (
				<div
					className="prpl-suggested-task-actions-wrapper"
					style={ actionsWrapperStyle }
				>
					<TaskActions
						task={ task }
						isUserTask={ isUserTask }
						onComplete={ onComplete }
						onSnooze={ onSnooze }
						onDelete={ onDelete }
					/>
				</div>
			) }
		</li>
	);
}
