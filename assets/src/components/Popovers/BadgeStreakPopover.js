/**
 * Badge Streak Popover Component.
 *
 * Displays badge streak information with progress bars.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { __, sprintf } from '@wordpress/i18n';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import PopoverLoadingState from './PopoverLoadingState';
import { resolveTaskId } from '../../utils/taskIdResolver';
import { useApiData } from '../../hooks/useApiData';

export default function BadgeStreakPopover( { task, onClose } ) {
	const { data: badgeData, isLoading } = useApiData(
		'/progress-planner/v1/badge-stats'
	);
	const badgeStats = badgeData?.badges || ( badgeData ? {} : null );

	/**
	 * Get badge progress for a category.
	 *
	 * @param {string} category The badge category (maintenance or content).
	 * @return {Object} Badge progress data.
	 */
	const getBadgeProgress = ( category ) => {
		if ( ! badgeStats ) {
			return null;
		}

		// Find badges for this category
		const categoryBadges = Object.keys( badgeStats )
			.filter( ( badgeId ) => badgeId.startsWith( category + '-' ) )
			.map( ( badgeId ) => ( {
				id: badgeId,
				...badgeStats[ badgeId ],
			} ) )
			.sort( ( a, b ) => {
				// Sort by level (extract number from badge ID)
				const aLevel = parseInt( a.id.match( /\d+/ )?.[ 0 ] || '0' );
				const bLevel = parseInt( b.id.match( /\d+/ )?.[ 0 ] || '0' );
				return aLevel - bLevel;
			} );

		if ( categoryBadges.length === 0 ) {
			return null;
		}

		// Get the last badge (highest level)
		const lastBadge = categoryBadges[ categoryBadges.length - 1 ];
		const progress = lastBadge.progress || 0;
		const remaining = lastBadge.remaining || 0;

		return {
			badges: categoryBadges,
			progress,
			remaining,
		};
	};

	/**
	 * Render badge indicator.
	 *
	 * @param {Object} badge   Badge data.
	 * @param {string} context Context (maintenance or content).
	 * @return {JSX.Element} Badge indicator.
	 */
	const renderBadgeIndicator = ( badge, context ) => {
		const remaining = badge.remaining || 0;

		return (
			<div key={ badge.id } className="indicator">
				<span className="indicator-label">
					{ remaining === 0 ? (
						'✔️'
					) : (
						<span
							dangerouslySetInnerHTML={ {
								__html: ( () => {
									let formatStr;
									if ( context === 'content' ) {
										formatStr =
											remaining === 1
												? /* translators: %s: number of posts remaining */
												  '%s post to go'
												: /* translators: %s: number of posts remaining */
												  '%s posts to go';
									} else {
										formatStr =
											remaining === 1
												? /* translators: %s: number of weeks remaining */
												  '%s week to go'
												: /* translators: %s: number of weeks remaining */
												  '%s weeks to go';
									}
									return sprintf(
										formatStr,
										sprintf(
											'<span class="number">%s</span>',
											remaining
										)
									);
								} )(),
							} }
						/>
					) }
				</span>
			</div>
		);
	};

	/**
	 * Render progress bar for a category.
	 *
	 * @param {string} category The badge category.
	 * @return {JSX.Element} Progress bar component.
	 */
	const renderProgressBar = ( category ) => {
		const badgeProgress = getBadgeProgress( category );

		if ( ! badgeProgress ) {
			return null;
		}

		const { progress, badges } = badgeProgress;

		return (
			<div className="progress-badges">
				<span className="badges-popover-progress-total">
					<span style={ { width: `${ progress }%` } }></span>
				</span>
				<div className="indicators">
					{ badges.map( ( badge ) =>
						renderBadgeIndicator( badge, category )
					) }
				</div>
			</div>
		);
	};

	const maintenanceProgress = getBadgeProgress( 'maintenance' );
	const contentProgress = getBadgeProgress( 'content' );
	const taskId = resolveTaskId( task, 'badge-streak' );

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ taskId || 'badge-streak' }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">
					{ __( 'You are on the right track!', 'progress-planner' ) }
				</h2>
				<p>
					{ __(
						'Find out which badges to unlock next and become a Progress Planner Professional!',
						'progress-planner'
					) }
				</p>
			</div>
			<div className="prpl-column">
				<div className="prpl-widgets-container in-popover">
					<div className="prpl-widget-wrapper in-popover">
						<h3>
							{ __(
								"Don't break your streak and stay active every week!",
								'progress-planner'
							) }
						</h3>
						<p>
							{ __(
								'Execute at least one website maintenance task every week. That could be publishing content, adding content, updating a post, or updating a plugin.',
								'progress-planner'
							) }
						</p>
						<p>
							{ __(
								'Not able to work on your site for a week? Use your streak freeze!',
								'progress-planner'
							) }
						</p>
						{ isLoading ? (
							<PopoverLoadingState />
						) : (
							<div id="popover-badge-streak-content">
								{ maintenanceProgress && (
									<div className="badge-display">
										{ renderProgressBar( 'maintenance' ) }
									</div>
								) }
							</div>
						) }
					</div>

					<div className="prpl-widget-wrapper in-popover">
						<h3>
							{ __(
								'Keep adding posts and pages',
								'progress-planner'
							) }
						</h3>
						<p>
							{ __(
								'The more you write, the sooner you unlock new badges. You can earn level 1 of this badge immediately after installing the plugin if you have written 20 or more blog posts.',
								'progress-planner'
							) }
						</p>
						{ isLoading ? (
							<PopoverLoadingState />
						) : (
							<div id="popover-badge-streak-maintenance">
								{ contentProgress && (
									<div className="badge-display">
										{ renderProgressBar( 'content' ) }
									</div>
								) }
							</div>
						) }
					</div>
				</div>
				<div className="footer">
					<div className="string-freeze-explain">
						<h2>{ __( 'Streak freeze', 'progress-planner' ) }</h2>
						<p>
							{ __(
								"Going on a holiday? Or don't have any time this week? You can skip your website maintenance for a maximum of one week. Your streak will continue afterward.",
								'progress-planner'
							) }
						</p>
					</div>
				</div>
			</div>
		</InteractiveTaskPopover>
	);
}
