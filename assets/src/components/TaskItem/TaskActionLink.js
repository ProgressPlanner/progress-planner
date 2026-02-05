/**
 * Task Link Action Component.
 *
 * Renders a generic link action (Edit, Review, etc.).
 */

import TaskActionButton from './TaskActionButton';

/**
 * Task Link Action component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.href      The link URL.
 * @param {string}   props.label     The link text.
 * @param {string}   props.target    Link target (_self, _blank). Defaults to _self.
 * @param {Function} props.onClick   Optional click handler (for inline actions).
 * @param {string}   props.className Additional CSS classes.
 * @return {JSX.Element} The link action.
 */
export default function TaskActionLink( {
	href,
	label,
	target = '_self',
	onClick,
	className = '',
} ) {
	const handleClick = ( e ) => {
		if ( onClick ) {
			e.preventDefault();
			onClick( e );
		}
	};

	return (
		<TaskActionButton
			as="a"
			className={ className || undefined }
			href={ href || '#' }
			target={ target }
			rel={ target === '_blank' ? 'noopener noreferrer' : undefined }
			onClick={ onClick ? handleClick : undefined }
		>
			{ label }
		</TaskActionButton>
	);
}
