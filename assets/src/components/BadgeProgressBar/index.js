/**
 * BadgeProgressBar Component
 *
 * Displays a progress bar with a badge icon for incomplete previous months.
 */

import { useMemo } from '@wordpress/element';
import Badge from '../Badge';

/**
 * BadgeProgressBar component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.badgeId         - The badge ID.
 * @param {string} props.badgeName       - The badge name.
 * @param {number} props.points          - Current points.
 * @param {number} props.maxPoints       - Maximum points (default 10).
 * @param {number} props.brandingId      - Branding ID.
 * @param {string} props.remoteServerUrl - Remote server URL for badge SVGs.
 * @param {string} props.placeholderUrl  - Placeholder image URL.
 * @return {JSX.Element} The BadgeProgressBar component.
 */
export default function BadgeProgressBar( {
	badgeId,
	badgeName,
	points = 0,
	maxPoints = 10,
	brandingId = 0,
	remoteServerUrl,
	placeholderUrl,
} ) {
	/**
	 * Calculate progress percentage.
	 */
	const progressPercent = useMemo( () => {
		if ( maxPoints === 0 ) {
			return 0;
		}
		return ( points / maxPoints ) * 100;
	}, [ points, maxPoints ] );

	const containerStyle = {
		padding: '1rem 0',
	};

	const barStyle = {
		width: '100%',
		height: '1rem',
		backgroundColor: 'var(--prpl-color-gauge-remain)',
		borderRadius: '0.5rem',
		position: 'relative',
	};

	const progressStyle = {
		height: '100%',
		backgroundColor: 'var(--prpl-color-monthly)',
		borderRadius: '0.5rem',
		transition: 'width 0.4s ease',
		width: `${ progressPercent }%`,
	};

	const badgeWrapperStyle = {
		display: 'flex',
		width: '7.5rem',
		height: 'auto',
		position: 'absolute',
		top: '-2.5rem',
		transition: 'left 0.4s ease',
		left: `calc(${ progressPercent }% - 3.75rem)`,
	};

	const alertIndicatorStyle = {
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
	};

	const isComplete = points >= maxPoints;
	const className = `prpl-badge-progress-bar${
		isComplete ? ' prpl-badge-progress-bar--complete' : ''
	}`;

	return (
		<div className={ className } style={ containerStyle }>
			<div className="prpl-badge-progress-bar__bar" style={ barStyle }>
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
						remoteServerUrl={ remoteServerUrl }
						placeholderUrl={ placeholderUrl }
					/>
					{ ! isComplete && (
						<span
							className="prpl-badge-progress-bar__alert"
							style={ alertIndicatorStyle }
						>
							!
						</span>
					) }
				</div>
			</div>
		</div>
	);
}
