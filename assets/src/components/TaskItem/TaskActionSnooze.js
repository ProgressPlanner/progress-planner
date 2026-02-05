/**
 * Task Snooze Action Component.
 *
 * Renders the snooze button with duration picker tooltip.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Tooltip from '../Tooltip';

/**
 * Button styles.
 */
const STYLES = {
	actionText: {
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	},
};

/**
 * Snooze duration options.
 */
const SNOOZE_DURATIONS = [
	{ key: '1-week', label: __( '1 week', 'progress-planner' ) },
	{ key: '1-month', label: __( '1 month', 'progress-planner' ) },
	{ key: '3-months', label: __( '3 months', 'progress-planner' ) },
	{ key: '6-months', label: __( '6 months', 'progress-planner' ) },
	{ key: '1-year', label: __( '1 year', 'progress-planner' ) },
	{ key: 'forever', label: __( 'forever', 'progress-planner' ) },
];

/**
 * Task Snooze Action component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.taskId   The task ID.
 * @param {Function} props.onSnooze Snooze handler (receives duration key).
 * @return {JSX.Element} The snooze action with tooltip.
 */
export default function TaskActionSnooze( { taskId, onSnooze } ) {
	const [ isExpanded, setIsExpanded ] = useState( false );

	const wrapperClassName = `prpl-suggested-task-snooze${
		isExpanded ? ' prpl-toggle-radio-group-open' : ''
	}`;

	const handleDurationChange = ( e ) => {
		const duration = e.target.value;
		onSnooze?.( duration );
	};

	const toggleExpanded = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		setIsExpanded( ! isExpanded );
	};

	return (
		<span className={ wrapperClassName }>
			<Tooltip
				triggerContent={
					<span
						className="prpl-tooltip-action-text"
						style={ STYLES.actionText }
					>
						{ __( 'Snooze', 'progress-planner' ) }
					</span>
				}
			>
				<fieldset>
					<legend>
						<span>
							{ __( 'Snooze this task?', 'progress-planner' ) }
						</span>
						<button
							type="button"
							className="prpl-toggle-radio-group"
							onClick={ toggleExpanded }
						>
							<span className="prpl-toggle-radio-group-text">
								{ __( 'How long?', 'progress-planner' ) }
							</span>
							<span className="prpl-toggle-radio-group-arrow">
								&rsaquo;
							</span>
						</button>
					</legend>
					<div className="prpl-snooze-duration-radio-group">
						{ SNOOZE_DURATIONS.map( ( duration ) => {
							const inputId = `snooze-${ taskId }-${ duration.key }`;
							return (
								<label key={ duration.key } htmlFor={ inputId }>
									<input
										type="radio"
										id={ inputId }
										name={ `snooze-duration-${ taskId }` }
										value={ duration.key }
										onChange={ handleDurationChange }
									/>
									{ duration.label }
								</label>
							);
						} ) }
					</div>
				</fieldset>
			</Tooltip>
		</span>
	);
}
