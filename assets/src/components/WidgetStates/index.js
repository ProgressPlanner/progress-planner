/**
 * Widget State Components
 *
 * Shared components for loading, error, and empty states across widgets.
 */

import { __ } from '@wordpress/i18n';

/**
 * Default loading style.
 */
const defaultLoadingStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '2em',
};

/**
 * Default error style.
 */
const defaultErrorStyle = {
	padding: '1em',
	backgroundColor: 'var(--prpl-color-error-background, #fee)',
	color: 'var(--prpl-color-error, #c00)',
	borderRadius: 'var(--prpl-border-radius)',
};

/**
 * LoadingState component.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.message   - Loading message.
 * @param {string}  props.className - Optional CSS class.
 * @param {Object}  props.style     - Optional inline styles.
 * @param {boolean} props.simple    - If true, renders simple <p> tag.
 * @return {JSX.Element} The loading state component.
 */
export function LoadingState( {
	message = __( 'Loading…', 'progress-planner' ),
	className = '',
	style = {},
	simple = false,
} ) {
	if ( simple ) {
		return <p className={ className || undefined }>{ message }</p>;
	}

	return (
		<div
			className={ `prpl-widget-loading${
				className ? ` ${ className }` : ''
			}` }
			style={ { ...defaultLoadingStyle, ...style } }
		>
			{ message }
		</div>
	);
}

/**
 * ErrorState component.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.message   - Error message.
 * @param {string}  props.className - Optional CSS class.
 * @param {Object}  props.style     - Optional inline styles.
 * @param {boolean} props.simple    - If true, renders simple <p> tag.
 * @return {JSX.Element} The error state component.
 */
export function ErrorState( {
	message = __( 'An error occurred.', 'progress-planner' ),
	className = '',
	style = {},
	simple = false,
} ) {
	if ( simple ) {
		return <p className={ className || undefined }>{ message }</p>;
	}

	return (
		<div
			className={ `prpl-widget-error${
				className ? ` ${ className }` : ''
			}` }
			style={ { ...defaultErrorStyle, ...style } }
		>
			{ message }
		</div>
	);
}

/**
 * EmptyState component.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.message   - Empty state message.
 * @param {string} props.className - Optional CSS class.
 * @return {JSX.Element} The empty state component.
 */
export function EmptyState( {
	message = __( 'No data available.', 'progress-planner' ),
	className = '',
} ) {
	return <p className={ className || undefined }>{ message }</p>;
}
