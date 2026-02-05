/**
 * Reusable action button/link component for task actions.
 *
 * Renders a styled button or anchor with hover-underline behavior.
 * Used by TaskActionComplete, TaskActionDelete, TaskActionPopover,
 * TaskActionLink, and TaskActionInfo.
 */

import { useState } from '@wordpress/element';

/**
 * Base styles shared by all action buttons/links.
 */
const BASE_STYLE = {
	fontSize: 'var(--prpl-font-size-small)',
	color: 'var(--prpl-color-link)',
	lineHeight: 1,
	textDecoration: 'none',
	padding: 0,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
};

/**
 * TaskActionButton component.
 *
 * @param {Object} props          Component props.
 * @param {string} props.as       Element type: 'button' (default) or 'a'.
 * @param {Object} props.style    Additional styles (merged with base).
 * @param {*}      props.children Button/link text content.
 * @return {JSX.Element} The rendered action element.
 */
export default function TaskActionButton( {
	as: Tag = 'button',
	style,
	children,
	...rest
} ) {
	const [ isHovered, setIsHovered ] = useState( false );

	const mergedStyle = {
		...BASE_STYLE,
		textDecoration: isHovered ? 'underline' : 'none',
		...style,
	};

	// Add type="button" for button elements to prevent form submission.
	const extraProps = Tag === 'button' ? { type: 'button' } : {};

	return (
		<Tag
			{ ...extraProps }
			{ ...rest }
			style={ mergedStyle }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
		>
			{ children }
		</Tag>
	);
}
