/**
 * SimpleBadgeWidget Skeleton Component
 *
 * Skeleton loading state for the SimpleBadgeWidget component.
 * Used by ContentBadges and StreakBadges widgets.
 */

import {
	SkeletonRect,
	SkeletonText,
	SkeletonCircle,
} from '../../components/Skeleton';
import GaugeSkeleton from '../../components/Gauge/GaugeSkeleton';

/**
 * BadgeProgressInfoSkeleton component.
 *
 * Skeleton for the BadgeProgressInfo component (Gauge + progress text).
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @return {JSX.Element} The BadgeProgressInfoSkeleton component.
 */
function BadgeProgressInfoSkeleton( {
	backgroundColor = 'var(--prpl-background-content-badge)',
} ) {
	const wrapperStyle = {
		display: 'flex',
		flexDirection: 'row',
		gap: '1rem',
	};

	const gaugeContainerStyle = {
		flex: '0 0 auto',
		width: '140px',
	};

	const contentStyle = {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	};

	const progressLabelStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: '1rem',
		marginBottom: '0.5rem',
	};

	return (
		<div className="prpl-latest-badges-wrapper" style={ wrapperStyle }>
			<div style={ gaugeContainerStyle }>
				<GaugeSkeleton backgroundColor={ backgroundColor } />
			</div>
			<div className="prpl-badge-content-wrapper" style={ contentStyle }>
				<div style={ progressLabelStyle }>
					<SkeletonRect width="8rem" height="1em" />
					<SkeletonRect width="3rem" height="1.5em" />
				</div>
				<SkeletonText lines={ 1 } />
			</div>
		</div>
	);
}

/**
 * BadgeGridSkeleton component.
 *
 * Skeleton for the BadgeGrid component (3-column grid).
 *
 * @param {Object} props                 - Component props.
 * @param {number} props.count           - Number of badge placeholders.
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @return {JSX.Element} The BadgeGridSkeleton component.
 */
function BadgeGridSkeleton( {
	count = 6,
	backgroundColor = 'var(--prpl-background-content-badge)',
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
		gap: '0.25rem',
		minWidth: 0,
	};

	const labelStyle = {
		fontSize: 'var(--prpl-font-size-small)',
		textAlign: 'center',
	};

	return (
		<div className="progress-wrapper" style={ gridStyle }>
			{ Array.from( { length: count } ).map( ( _, index ) => (
				<span
					key={ index }
					className="prpl-badge"
					style={ badgeItemStyle }
				>
					<SkeletonCircle size="50px" style={ { opacity: 0.5 } } />
					<div style={ labelStyle }>
						<SkeletonRect
							width="4rem"
							height="0.75em"
							style={ { margin: '0 auto' } }
						/>
					</div>
				</span>
			) ) }
		</div>
	);
}

/**
 * SimpleBadgeWidgetSkeleton component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @return {JSX.Element} The SimpleBadgeWidgetSkeleton component.
 */
export default function SimpleBadgeWidgetSkeleton( {
	backgroundColor = 'var(--prpl-background-content-badge)',
} ) {
	return (
		<>
			{ /* Intro text */ }
			<div style={ { marginBottom: '1rem' } }>
				<SkeletonText lines={ 2 } />
			</div>

			{ /* BadgeProgressInfo skeleton */ }
			<BadgeProgressInfoSkeleton backgroundColor={ backgroundColor } />

			<hr />

			{ /* BadgeGrid skeleton */ }
			<div className="prpl-badges-container-achievements">
				<BadgeGridSkeleton
					count={ 6 }
					backgroundColor={ backgroundColor }
				/>
			</div>
		</>
	);
}
