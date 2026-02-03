/**
 * BadgeProgressBar Component
 *
 * Displays a progress bar with a badge icon for incomplete previous months.
 */

import { useMemo } from '@wordpress/element';
import { _n, sprintf } from '@wordpress/i18n';
import Badge from '../Badge';

/**
 * Style constants - extracted to prevent recreation on each render.
 * Note: Some styles require computed values and are created in useMemo.
 */
const STYLES = {
	container: {
		padding: '1rem 0',
	},
	bar: {
		width: '100%',
		height: '1rem',
		backgroundColor: 'var(--prpl-color-gauge-remain)',
		borderRadius: '0.5rem',
		position: 'relative',
	},
	progressBase: {
		height: '100%',
		backgroundColor: 'var(--prpl-color-monthly)',
		borderRadius: '0.5rem',
		transition: 'width 0.4s ease',
	},
	badgeWrapperBase: {
		display: 'flex',
		width: '7.5rem',
		height: 'auto',
		position: 'absolute',
		top: '-2.5rem',
		transition: 'left 0.4s ease',
	},
	alertIndicator: {
		content: '"!"',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '20px',
		height: '20px',
		backgroundColor: 'var(--prpl-color-alert-error)',
		border: '2px solid #fff',
		borderRadius: '50%',
		position: 'absolute',
		top: '10%',
		right: '25%',
		color: '#fff',
		fontSize: '12px',
		fontWeight: 'bold',
	},
	pointsContainer: {
		display: 'flex',
		justifyContent: 'flex-start',
		gap: '1rem',
	},
	pointsNumber: {
		fontSize: 'var(--prpl-font-size-3xl)',
		fontWeight: 600,
	},
	remainingText: {
		display: 'flex',
		alignItems: 'center',
	},
};

/**
 * BadgeProgressBar component.
 *
 * @param {Object} props                      - Component props.
 * @param {string} props.badgeId              - The badge ID.
 * @param {string} props.badgeName            - The badge name.
 * @param {number} props.points               - Current points.
 * @param {number} props.maxPoints            - Maximum points (default 10).
 * @param {number} props.accumulatedRemaining - Accumulated remaining points across all badges.
 * @param {number} props.daysRemaining        - Days remaining in current month.
 * @param {number} props.brandingId           - Branding ID.
 * @return {JSX.Element} The BadgeProgressBar component.
 */
export default function BadgeProgressBar( {
	badgeId,
	badgeName,
	points = 0,
	maxPoints = 10,
	accumulatedRemaining = 0,
	daysRemaining = 0,
	brandingId = 0,
} ) {
	/**
	 * Calculate progress percentage and derive dynamic styles.
	 */
	const progressPercent = useMemo( () => {
		if ( maxPoints === 0 ) {
			return 0;
		}
		return ( points / maxPoints ) * 100;
	}, [ points, maxPoints ] );

	// Dynamic styles that depend on progressPercent - memoized to prevent recreation.
	const progressStyle = useMemo(
		() => ( {
			...STYLES.progressBase,
			width: `${ progressPercent }%`,
		} ),
		[ progressPercent ]
	);

	const badgeWrapperStyle = useMemo(
		() => ( {
			...STYLES.badgeWrapperBase,
			left: `calc(${ progressPercent }% - 3.75rem)`,
		} ),
		[ progressPercent ]
	);

	const isComplete = points >= maxPoints;
	const className = `prpl-badge-progress-bar${
		isComplete ? ' prpl-badge-progress-bar--complete' : ''
	}`;

	return (
		<div className={ className } style={ STYLES.container }>
			<div className="prpl-badge-progress-bar__bar" style={ STYLES.bar }>
				<div
					className="prpl-badge-progress-bar__progress"
					style={ progressStyle }
				/>
				<div
					className="prpl-badge-progress-bar__badge-wrapper"
					style={ badgeWrapperStyle }
				>
					<Badge
						badgeId={ badgeId }
						badgeName={ badgeName }
						brandingId={ brandingId }
					/>
					{ ! isComplete && (
						<span
							className="prpl-badge-progress-bar__alert"
							style={ STYLES.alertIndicator }
						>
							!
						</span>
					) }
				</div>
			</div>
			<div
				className="prpl-widget-content-points"
				style={ STYLES.pointsContainer }
			>
				<span
					className="prpl-widget-previous-ravi-points-number"
					style={ STYLES.pointsNumber }
				>
					{ points }pt
				</span>
				{ accumulatedRemaining > 0 && (
					<span
						className="prpl-previous-month-badge-progress-bar-remaining"
						style={ STYLES.remainingText }
						dangerouslySetInnerHTML={ {
							__html: sprintf(
								/* translators: %1$s: The number of points. %2$d: The number of days. */
								_n(
									'%1$s more points to go - %2$d day left',
									'%1$s more points to go - %2$d days left',
									daysRemaining,
									'progress-planner'
								),
								sprintf(
									'<span class="number">%d</span>',
									accumulatedRemaining
								),
								daysRemaining
							),
						} }
					/>
				) }
			</div>
		</div>
	);
}
