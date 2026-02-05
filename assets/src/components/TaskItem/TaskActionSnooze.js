/**
 * Task Snooze Action Component.
 *
 * Renders the snooze button with duration picker tooltip.
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Tooltip from '../Tooltip';
import { taskActionTooltipStyle, taskActionArrowStyle } from './styles';

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
 * Style constants for the snooze form.
 */
const STYLES = {
	fieldset: {
		border: 'none',
		padding: 0,
		margin: 0,
	},
	legend: {
		display: 'block',
		width: '100%',
	},
	legendTitle: {
		display: 'block',
		fontWeight: 500,
		marginBottom: '0.25rem',
	},
	toggleButton: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: '0.5rem',
		padding: '0.5rem',
		backgroundColor: '#fff',
		border: '1px solid #dcdcde',
		borderRadius: 'var(--prpl-border-radius)',
		lineHeight: 1,
		textAlign: 'start',
		cursor: 'pointer',
	},
	radioInput: {
		display: 'none',
	},
};

/**
 * Get arrow indicator style based on expanded state.
 *
 * @param {boolean} expanded Whether the duration picker is expanded.
 * @return {Object} Style object for the arrow.
 */
function getArrowStyle( expanded ) {
	return {
		transform: expanded ? 'rotate(270deg)' : 'rotate(90deg)',
		transition: 'transform 0.2s ease',
	};
}

/**
 * Get duration group visibility style.
 *
 * @param {boolean} expanded Whether the duration picker is expanded.
 * @return {Object} Style object for the duration group.
 */
function getDurationGroupStyle( expanded ) {
	return {
		display: expanded ? 'block' : 'none',
		marginTop: '0.75rem',
	};
}

/**
 * Get label style with index-based borders.
 *
 * @param {number}  index     The label index.
 * @param {number}  total     Total number of labels.
 * @param {boolean} isHovered Whether this label is hovered.
 * @return {Object} Style object for the label.
 */
function getLabelStyle( index, total, isHovered ) {
	const style = {
		display: 'block',
		padding: '0.5rem',
		cursor: 'pointer',
		backgroundColor: isHovered ? 'var(--prpl-color-gauge-remain)' : '#fff',
	};

	if ( index > 0 ) {
		style.borderTop = '1px solid #dcdcde';
	}

	if ( index === 0 ) {
		style.borderTopLeftRadius = 'var(--prpl-border-radius)';
		style.borderTopRightRadius = 'var(--prpl-border-radius)';
	}

	if ( index === total - 1 ) {
		style.borderBottomLeftRadius = 'var(--prpl-border-radius)';
		style.borderBottomRightRadius = 'var(--prpl-border-radius)';
	}

	return style;
}

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
	const [ hoveredLabel, setHoveredLabel ] = useState( null );

	const handleTooltipClose = useCallback( () => {
		setIsExpanded( false );
		setHoveredLabel( null );
	}, [] );

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
		<Tooltip
			triggerContent={ __( 'Snooze', 'progress-planner' ) }
			tooltipStyle={ taskActionTooltipStyle }
			arrowStyle={ taskActionArrowStyle }
			onClose={ handleTooltipClose }
		>
			<fieldset style={ STYLES.fieldset }>
				<legend style={ STYLES.legend }>
					<span style={ STYLES.legendTitle }>
						{ __( 'Snooze this task?', 'progress-planner' ) }
					</span>
					<button
						type="button"
						className="prpl-toggle-radio-group"
						style={ STYLES.toggleButton }
						onClick={ toggleExpanded }
					>
						<span>{ __( 'How long?', 'progress-planner' ) }</span>
						<span style={ getArrowStyle( isExpanded ) }>
							&rsaquo;
						</span>
					</button>
				</legend>
				<div style={ getDurationGroupStyle( isExpanded ) }>
					{ SNOOZE_DURATIONS.map( ( duration, index ) => {
						const inputId = `snooze-${ taskId }-${ duration.key }`;
						return (
							<label
								key={ duration.key }
								htmlFor={ inputId }
								style={ getLabelStyle(
									index,
									SNOOZE_DURATIONS.length,
									hoveredLabel === duration.key
								) }
								onMouseEnter={ () =>
									setHoveredLabel( duration.key )
								}
								onMouseLeave={ () => setHoveredLabel( null ) }
							>
								<input
									type="radio"
									id={ inputId }
									name={ `snooze-duration-${ taskId }` }
									value={ duration.key }
									style={ STYLES.radioInput }
									onChange={ handleDurationChange }
								/>
								{ duration.label }
							</label>
						);
					} ) }
				</div>
			</fieldset>
		</Tooltip>
	);
}
