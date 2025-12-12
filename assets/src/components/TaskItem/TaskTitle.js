/**
 * Task Title Component.
 *
 * Renders the task title, either as editable (for user tasks) or read-only.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.task          The task object.
 * @param {boolean}  props.isUserTask    Whether this is a user task.
 * @param {boolean}  props.isCompleted   Whether the task is completed.
 * @param {boolean}  props.isCelebrating Whether the task is being celebrated.
 * @param {Object}   props.titleRef      Ref for the title element.
 * @param {Function} props.onKeyDown     Callback for keydown events.
 * @param {Function} props.onInput       Callback for input events.
 * @return {JSX.Element} The title component.
 */
import { __ } from '@wordpress/i18n';
import { titleWrapperStyle, getTitleStyle, getTitleSpanStyle } from './styles';

export default function TaskTitle( {
	task,
	isUserTask,
	isCompleted,
	isCelebrating,
	titleRef,
	onKeyDown,
	onInput,
} ) {
	const titleText = task.title?.rendered || task.title;
	const titleSpanStyle = getTitleSpanStyle( isCelebrating );

	return (
		<div
			className="prpl-suggested-task-title-wrapper"
			style={ titleWrapperStyle }
		>
			<h3
				className="prpl-task-title"
				style={ getTitleStyle( isCompleted ) }
			>
				{ isUserTask && ! isCompleted ? (
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
						onKeyDown={ onKeyDown }
						onInput={ onInput }
						suppressContentEditableWarning
						style={ titleSpanStyle }
						dangerouslySetInnerHTML={ { __html: titleText } }
					/>
				) : (
					<span
						style={ titleSpanStyle }
						dangerouslySetInnerHTML={ { __html: titleText } }
					/>
				) }
			</h3>
		</div>
	);
}

