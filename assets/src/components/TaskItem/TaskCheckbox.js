/**
 * Task Checkbox Component.
 *
 * Renders either a checkbox (for user tasks) or an arrow icon (for suggested tasks).
 *
 * @param {Object}   props                 Component props.
 * @param {boolean}  props.isUserTask      Whether this is a user task.
 * @param {boolean}  props.taskIsCompleted Whether the task is completed.
 * @param {boolean}  props.isCelebrating   Whether the task is being celebrated.
 * @param {Object}   props.task            The task object.
 * @param {Function} props.onChange        Callback for checkbox change.
 * @return {JSX.Element} The checkbox component.
 */

import { __ } from '@wordpress/i18n';
import ArrowIcon from './icons/ArrowIcon';
import { checkboxWrapperStyle, checkboxInputStyle } from './styles';

export default function TaskCheckbox( {
	isUserTask,
	taskIsCompleted,
	isCelebrating,
	task,
	onChange,
} ) {
	if ( isUserTask ) {
		return (
			<div
				className="prpl-suggested-task-checkbox-wrapper"
				style={ checkboxWrapperStyle }
			>
				{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control -- Checkbox is nested inside label. */ }
				<label style={ checkboxWrapperStyle }>
					<input
						type="checkbox"
						className="prpl-suggested-task-checkbox"
						onChange={ onChange }
						style={ checkboxInputStyle }
						checked={ taskIsCompleted }
						disabled={ isCelebrating }
					/>
					<span className="screen-reader-text">
						{ task.title?.rendered || task.title }:{ ' ' }
						{ __( 'Mark as complete', 'progress-planner' ) }
					</span>
				</label>
			</div>
		);
	}

	return (
		<div
			className="prpl-suggested-task-checkbox-wrapper"
			style={ checkboxWrapperStyle }
		>
			<ArrowIcon />
		</div>
	);
}
