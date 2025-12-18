/**
 * ActivityScores Skeleton Component
 *
 * Skeleton loading state for the ActivityScores widget.
 * Composes: GaugeSkeleton, BarChartSkeleton, BigCounterSkeleton
 */

import GaugeSkeleton from '../../components/Gauge/GaugeSkeleton';
import BarChartSkeleton from '../../components/BarChart/BarChartSkeleton';
import BigCounterSkeleton from '../../components/BigCounter/BigCounterSkeleton';
import { SkeletonText } from '../../components/Skeleton';

/**
 * ActivityScoresSkeleton component.
 *
 * @return {JSX.Element} The ActivityScoresSkeleton component.
 */
export default function ActivityScoresSkeleton() {
	return (
		<>
			<div style={ { '--background': 'var(--prpl-background-monthly)' } }>
				<GaugeSkeleton backgroundColor="var(--prpl-background-activity)" />
			</div>

			<hr />

			<SkeletonText width="80%" style={ { marginBottom: '0.5rem' } } />

			<div
				className="prpl-graph-wrapper"
				style={ { maxHeight: '300px' } }
			>
				<BarChartSkeleton bars={ 6 } />
			</div>

			<hr />

			<BigCounterSkeleton backgroundColor="var(--prpl-background-activity)" />

			<div className="prpl-widget-content">
				<SkeletonText lines={ 2 } />
			</div>
		</>
	);
}
