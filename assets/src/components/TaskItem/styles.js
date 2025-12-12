/**
 * Style objects and functions for TaskItem component.
 */

/**
 * Get the task item container style.
 *
 * @param {number} index The index of the task in the list.
 * @return {Object} Style object.
 */
export function getTaskItemStyle( index ) {
	return {
		margin: 0,
		padding: '0.75rem 0.5rem 0.625rem 0.5rem',
		display: 'grid',
		gridTemplateColumns: '1.5rem 1fr 3.5rem',
		gap: '0.25rem 0.5rem',
		position: 'relative',
		lineHeight: 1,
		// nth-child(odd) background - using index prop
		backgroundColor:
			index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent',
	};
}

/**
 * Checkbox wrapper style.
 */
export const checkboxWrapperStyle = {
	display: 'flex',
	width: '100%',
	gap: 0,
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
};

/**
 * Title wrapper style.
 */
export const titleWrapperStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	justifyContent: 'space-between',
};

/**
 * Get the title style.
 *
 * @param {boolean} isCompleted Whether the task is completed.
 * @return {Object} Style object.
 */
export function getTitleStyle( isCompleted ) {
	return {
		width: '100%',
		color: 'var(--prpl-color-text)',
		fontSize: '1rem',
		margin: 0,
		fontWeight: 500,
		...( isCompleted ? { textDecoration: 'line-through' } : {} ),
	};
}

/**
 * Get the title span style.
 *
 * @param {boolean} isCelebrating Whether the task is being celebrated.
 * @return {Object} Style object.
 */
export function getTitleSpanStyle( isCelebrating ) {
	return {
		textDecoration: 'none',
		backgroundImage: 'linear-gradient(#000, #000)',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center left',
		backgroundSize: isCelebrating ? '100% 1px' : '0% 1px',
		transition: 'background-size 500ms ease-in-out',
	};
}

/**
 * Points wrapper style.
 */
export const pointsWrapperStyle = {
	display: 'flex',
	gap: '0.5rem',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gridRowEnd: 'span 2',
};

/**
 * Points badge style.
 */
export const pointsBadgeStyle = {
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

/**
 * Base button style.
 */
export const buttonStyle = {
	padding: '0.1rem',
	lineHeight: 0,
	margin: 0,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
};

/**
 * Trash button style.
 */
export const trashButtonStyle = {
	...buttonStyle,
	padding: 0,
	color: 'var(--prpl-color-ui-icon)',
	boxShadow: 'none',
	marginTop: '1px',
};

/**
 * Move buttons wrapper style.
 */
export const moveButtonsWrapperStyle = {
	position: 'absolute',
	left: 'calc(-8px - 0.5rem)',
	top: '50%',
	transform: 'translateY(-50%)',
	padding: '10px 10px 10px 0',
};

/**
 * Move buttons container style.
 */
export const moveButtonsStyle = {
	display: 'flex',
	width: '100%',
	gap: 0,
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
};

/**
 * Move button style.
 */
export const moveButtonStyle = {
	...buttonStyle,
	padding: 0,
	height: '0.75rem',
	color: 'var(--prpl-color-ui-icon)',
	boxShadow: 'none',
	marginTop: '1px',
};

/**
 * Actions wrapper style.
 */
export const actionsWrapperStyle = {
	gridColumn: '2 / span 1',
	display: 'flex',
};

/**
 * Checkbox input style.
 */
export const checkboxInputStyle = {
	margin: 0,
	flexShrink: 0,
};
