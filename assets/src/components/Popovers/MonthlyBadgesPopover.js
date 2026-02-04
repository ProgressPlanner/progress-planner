/**
 * Monthly Badges Popover Component.
 *
 * Displays all badges including monthly, writing (content), and streak (maintenance) badges.
 *
 * @param {Object}   props         Component props.
 * @param {Object}   props.task    The task object.
 * @param {Function} props.onClose Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useMemo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import Badge from '../Badge';
import { resolveTaskId } from '../../utils/taskIdResolver';
import {
	getMonthlyBadgeIdFromDate,
	CONTENT_BADGES,
	MAINTENANCE_BADGES,
} from '../../config/badges';

export default function MonthlyBadgesPopover( { task, onClose } ) {
	const [ badgeStats, setBadgeStats ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	/**
	 * Load badge stats from REST API.
	 */
	useEffect( () => {
		apiFetch( { path: '/progress-planner/v1/badge-stats' } )
			.then( ( response ) => {
				setBadgeStats( response.badges || {} );
			} )
			.catch( () => {
				setBadgeStats( {} );
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	}, [] );

	/**
	 * Get branding ID and remote server URL from config.
	 */
	const brandingId =
		window.prplDashboardConfig?.brandingId ||
		window.progressPlannerAdmin?.brandingId ||
		0;
	/**
	 * Get monthly badges grouped by year.
	 *
	 * @return {Object} Badges grouped by year.
	 */
	const monthlyBadgesByYear = useMemo( () => {
		if ( ! badgeStats ) {
			return {};
		}

		const grouped = {};
		const currentYear = new Date().getFullYear();

		// Get monthly badges from stats
		Object.keys( badgeStats )
			.filter( ( id ) => id.startsWith( 'monthly-' ) )
			.forEach( ( badgeId ) => {
				const parts = badgeId.split( '-' );
				if ( parts.length === 3 ) {
					const year = parts[ 1 ];
					if ( ! grouped[ year ] ) {
						grouped[ year ] = [];
					}
					grouped[ year ].push( {
						id: badgeId,
						...badgeStats[ badgeId ],
					} );
				}
			} );

		// Ensure current year exists with current month badge
		if ( ! grouped[ currentYear ] ) {
			grouped[ currentYear ] = [];
		}
		const currentBadgeId = getMonthlyBadgeIdFromDate( new Date() );
		if (
			! grouped[ currentYear ].find( ( b ) => b.id === currentBadgeId )
		) {
			grouped[ currentYear ].push( {
				id: currentBadgeId,
				progress: badgeStats[ currentBadgeId ]?.progress || 0,
				remaining: badgeStats[ currentBadgeId ]?.remaining || 0,
			} );
		}

		// Sort years descending and badges by month
		const sorted = {};
		Object.keys( grouped )
			.sort( ( a, b ) => parseInt( b ) - parseInt( a ) )
			.forEach( ( year ) => {
				sorted[ year ] = grouped[ year ].sort( ( a, b ) => {
					const aMonth = parseInt(
						a.id.split( '-' )[ 2 ].replace( 'm', '' )
					);
					const bMonth = parseInt(
						b.id.split( '-' )[ 2 ].replace( 'm', '' )
					);
					return aMonth - bMonth;
				} );
			} );

		return sorted;
	}, [ badgeStats ] );

	/**
	 * Get badges by category (content or maintenance).
	 *
	 * @param {Array} badgeList Array of badge definitions.
	 * @return {Array} Badges with progress data.
	 */
	const getBadgesWithProgress = useCallback(
		( badgeList ) => {
			if ( ! badgeStats ) {
				return [];
			}

			return badgeList.map( ( badge ) => ( {
				id: badge.id,
				name: badge.name,
				progress: badgeStats[ badge.id ]?.progress || 0,
				remaining: badgeStats[ badge.id ]?.remaining || 0,
			} ) );
		},
		[ badgeStats ]
	);

	const contentBadges = useMemo(
		() => getBadgesWithProgress( CONTENT_BADGES ),
		[ getBadgesWithProgress ]
	);
	const maintenanceBadges = useMemo(
		() => getBadgesWithProgress( MAINTENANCE_BADGES ),
		[ getBadgesWithProgress ]
	);

	/**
	 * Render a badge item.
	 *
	 * @param {Object} badge Badge data.
	 * @return {JSX.Element} Badge item.
	 */
	const renderBadge = ( badge ) => {
		const isComplete = badge.progress >= 100;
		return (
			<span
				key={ badge.id }
				className="prpl-badge"
				data-value={ badge.progress }
			>
				<Badge
					badgeId={ badge.id }
					badgeName={ badge.name || badge.id }
					isComplete={ isComplete }
					brandingId={ brandingId }
				/>
				{ badge.name && <p>{ badge.name }</p> }
			</span>
		);
	};

	const taskId = resolveTaskId( task, 'monthly-badges' );

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ taskId || 'monthly-badges' }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">
					{ __( 'Your badges', 'progress-planner' ) }
				</h2>
			</div>
			<div className="prpl-column">
				<div className="prpl-widgets-container in-popover">
					{ isLoading ? (
						<p>{ __( 'Loading…', 'progress-planner' ) }</p>
					) : (
						<>
							{ /* Monthly Badges */ }
							<div className="prpl-popover-column">
								{ Object.keys( monthlyBadgesByYear ).map(
									( year ) => (
										<div
											key={ year }
											className="prpl-monthly-badges-year"
										>
											<h3>{ year }</h3>
											<div className="progress-wrapper badge-group-monthly">
												{ monthlyBadgesByYear[
													year
												].map( ( badge ) =>
													renderBadge( badge )
												) }
											</div>
										</div>
									)
								) }
							</div>

							{ /* Content & Maintenance Badges */ }
							<div className="prpl-popover-column">
								{ /* Content Badges */ }
								<div className="prpl-widget-wrapper prpl-widget-wrapper-content in-popover prpl-badge-streak">
									<h3 className="prpl-widget-title">
										{ __(
											'Content badges',
											'progress-planner'
										) }
									</h3>
									<div className="prpl-badges-container-achievements">
										<div className="progress-wrapper badge-group-content">
											{ contentBadges.map( ( badge ) =>
												renderBadge( badge )
											) }
										</div>
									</div>
								</div>

								{ /* Streak (Maintenance) Badges */ }
								<div className="prpl-widget-wrapper prpl-widget-wrapper-maintenance in-popover prpl-badge-streak">
									<h3 className="prpl-widget-title">
										{ __(
											'Streak badges',
											'progress-planner'
										) }
									</h3>
									<div className="prpl-badges-container-achievements">
										<div className="progress-wrapper badge-group-maintenance">
											{ maintenanceBadges.map(
												( badge ) =>
													renderBadge( badge )
											) }
										</div>
									</div>
								</div>
							</div>
						</>
					) }
				</div>
			</div>
		</InteractiveTaskPopover>
	);
}
