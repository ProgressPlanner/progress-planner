/**
 * BadgeGrid Component
 *
 * Displays a grid of badges with consistent styling.
 * Used by ContentBadges, StreakBadges, and other badge widgets.
 */

import Badge from '../Badge';

/**
 * BadgeGrid component.
 *
 * @param {Object} props                 - Component props.
 * @param {Array}  props.badges          - Array of badge objects.
 * @param {Object} props.config          - Badge config (brandingId).
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @param {string} props.className       - Additional CSS class name.
 * @return {JSX.Element} The BadgeGrid component.
 */
export default function BadgeGrid( {
	badges,
	config,
	backgroundColor = 'var(--prpl-background-content-badge)',
	className = '',
} ) {
	const gridStyle = {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: 'calc(var(--prpl-gap) / 4)',
		background: backgroundColor,
		padding: 'calc(var(--prpl-padding) / 2)',
		borderRadius: 'var(--prpl-border-radius-big)',
	};

	const badgeItemStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
		minWidth: 0,
	};

	const labelStyle = {
		margin: 0,
		fontSize: 'var(--prpl-font-size-small)',
		textAlign: 'center',
		lineHeight: 1.2,
	};

	return (
		<div
			className={ `progress-wrapper ${ className }`.trim() }
			style={ gridStyle }
		>
			{ badges.map( ( badge ) => (
				<span
					key={ badge.id }
					className="prpl-badge"
					style={ badgeItemStyle }
					data-value={ badge.progress }
				>
					<Badge
						badgeId={ badge.id }
						badgeName={ badge.name }
						brandingId={ config.brandingId }
						isComplete={ badge.isComplete }
					/>
					<p style={ labelStyle }>{ badge.name }</p>
				</span>
			) ) }
		</div>
	);
}
