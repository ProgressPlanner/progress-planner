/**
 * ContentBadges Widget
 *
 * Displays the content badges widget with gauge and badge grid.
 */

import { useState, useEffect } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Gauge from '../../components/Gauge';
import Badge from '../../components/Badge';

/**
 * ContentBadges component.
 *
 * @return {JSX.Element} The ContentBadges component.
 */
export default function ContentBadges() {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ currentBadge, setCurrentBadge ] = useState( null );
	const [ allBadges, setAllBadges ] = useState( [] );
	const [ config, setConfig ] = useState( {
		brandingId: 0,
		remoteServerUrl: '',
		placeholderUrl: '',
	} );

	/**
	 * Fetch badge data from REST API.
	 */
	useEffect( () => {
		const fetchData = async () => {
			try {
				const response = await apiFetch( {
					path: '/progress-planner/v1/content-badges',
				} );

				setCurrentBadge( response.currentBadge );
				setAllBadges( response.allBadges || [] );
				setConfig( {
					brandingId: response.brandingId,
					remoteServerUrl: response.remoteServerUrl,
					placeholderUrl: response.placeholderUrl,
				} );
				setIsLoading( false );
			} catch ( err ) {
				setError( err.message || 'Failed to load badge data' );
				setIsLoading( false );
			}
		};

		fetchData();
	}, [] );

	if ( isLoading ) {
		return <p>{ __( 'Loading…', 'progress-planner' ) }</p>;
	}

	if ( error ) {
		return <p>{ error }</p>;
	}

	if ( ! currentBadge ) {
		return <p>{ __( 'No badge data available.', 'progress-planner' ) }</p>;
	}

	// Inline styles.
	const progressWrapperStyle = {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: 'calc(var(--prpl-gap) / 4)',
		padding: 'calc(var(--prpl-padding) / 2)',
		borderRadius: 'var(--prpl-border-radius-big)',
		background: 'var(--prpl-background-content-badge)',
	};

	const badgeStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
		minWidth: 0,
	};

	const badgeLabelStyle = {
		margin: 0,
		fontSize: 'var(--prpl-font-size-small)',
		textAlign: 'center',
		lineHeight: 1.2,
	};

	return (
		<>
			<p>
				{ __(
					'The more you work on meaninful content, the sooner you unlock new badges.',
					'progress-planner'
				) }
			</p>

			<div className="prpl-latest-badges-wrapper">
				<Gauge
					value={ currentBadge.progress }
					max={ 100 }
					backgroundColor={
						currentBadge.background ||
						'var(--prpl-background-content-badge)'
					}
					color="var(--prpl-color-monthly)"
					color2="var(--prpl-color-monthly-2)"
				>
					<Badge
						badgeId={ currentBadge.id }
						badgeName={ currentBadge.name }
						brandingId={ config.brandingId }
						remoteServerUrl={ config.remoteServerUrl }
						placeholderUrl={ config.placeholderUrl }
						isComplete={ true }
					/>
				</Gauge>
				<div className="prpl-badge-content-wrapper">
					<p
						style={ {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: '1rem',
							marginBottom: 0,
						} }
					>
						<span>
							{ sprintf(
								/* translators: %s: The badge name. */
								__( 'Progress %s', 'progress-planner' ),
								currentBadge.name
							) }
						</span>
						<span
							style={ {
								fontWeight: 600,
								fontSize: 'var(--prpl-font-size-3xl)',
							} }
						>
							{ currentBadge.progress }%
						</span>
					</p>
					<p style={ { marginTop: 0 } }>
						{ sprintf(
							/* translators: %s: The remaining number of posts or pages to write. */
							_n(
								'Write %s new post or page and earn your next badge!',
								'Write %s new posts or pages and earn your next badge!',
								currentBadge.remaining,
								'progress-planner'
							),
							currentBadge.remaining
						) }
					</p>
				</div>
			</div>

			<hr />

			<div className="prpl-badges-container-achievements">
				<div
					className="progress-wrapper badge-group-content"
					style={ progressWrapperStyle }
				>
					{ allBadges.map( ( badge ) => (
						<span
							key={ badge.id }
							className="prpl-badge"
							style={ badgeStyle }
							data-value={ badge.progress }
						>
							<Badge
								badgeId={ badge.id }
								badgeName={ badge.name }
								brandingId={ config.brandingId }
								remoteServerUrl={ config.remoteServerUrl }
								placeholderUrl={ config.placeholderUrl }
								isComplete={ badge.isComplete }
							/>
							<p style={ badgeLabelStyle }>{ badge.name }</p>
						</span>
					) ) }
				</div>
			</div>
		</>
	);
}
