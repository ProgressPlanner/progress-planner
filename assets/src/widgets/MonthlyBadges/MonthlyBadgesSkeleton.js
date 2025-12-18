/**
 * MonthlyBadges Skeleton Component
 *
 * Skeleton loading state for the MonthlyBadges widget.
 * Composes: GaugeSkeleton, BadgeSkeleton
 */

import GaugeSkeleton from '../../components/Gauge/GaugeSkeleton';
import BadgeSkeleton from '../../components/Badge/BadgeSkeleton';
import { SkeletonRect } from '../../components/Skeleton';

/**
 * PointsCounterSkeleton component - skeleton for points counter.
 *
 * @return {JSX.Element} The PointsCounterSkeleton component.
 */
function PointsCounterSkeleton() {
	const containerStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		justifyContent: 'center',
	};

	return (
		<div style={ containerStyle }>
			<SkeletonRect
				width="2rem"
				height="1.5rem"
				style={ { borderRadius: '4px' } }
			/>
			<SkeletonRect width="8rem" height="1rem" />
		</div>
	);
}

/**
 * MonthlyBadgesSkeleton component.
 *
 * @return {JSX.Element} The MonthlyBadgesSkeleton component.
 */
export default function MonthlyBadgesSkeleton() {
	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
	};

	return (
		<div style={ containerStyle }>
			{ /* Gauge with badge placeholder */ }
			<div style={ { position: 'relative' } }>
				<GaugeSkeleton />
				<div
					style={ {
						position: 'absolute',
						top: '25%',
						left: '50%',
						transform: 'translateX(-50%)',
						width: '40%',
					} }
				>
					<BadgeSkeleton />
				</div>
			</div>

			{ /* Points counter */ }
			<PointsCounterSkeleton />
		</div>
	);
}
