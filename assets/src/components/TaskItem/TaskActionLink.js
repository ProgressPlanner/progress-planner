/**
 * Task Link Action Component.
 *
 * Renders a generic link action (Edit, Review, etc.).
 */

/**
 * Link styles.
 */
const STYLES = {
	link: {
		textDecoration: 'none',
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	},
};

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
		<a
			className={ `prpl-tooltip-action-text${
				className ? ` ${ className }` : ''
			}` }
			style={ STYLES.link }
			href={ href || '#' }
			target={ target }
			rel={ target === '_blank' ? 'noopener noreferrer' : undefined }
			onClick={ onClick ? handleClick : undefined }
		>
			{ label }
		</a>
	);
}
