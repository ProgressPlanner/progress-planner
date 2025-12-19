/**
 * Upgrade Tasks Popover Component.
 *
 * Displays newly added task recommendations after plugin upgrade.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { resolveTaskId } from '../../utils/taskIdResolver';

/**
 * Redirect user to the stats page after onboarding or plugin upgrade.
 * Exposed globally for upgrade-tasks.js compatibility.
 */
if ( typeof window !== 'undefined' ) {
	window.prplOnboardRedirect = () => {
		const redirectUrl = window.location.href.replace(
			'&show-tour=true',
			''
		);
		window.location.href = redirectUrl;
	};
}

export default function UpgradeTasksPopover( { task, onClose } ) {
	const [ taskProviders, setTaskProviders ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ totalPoints, setTotalPoints ] = useState( 0 );
	const [ config, setConfig ] = useState( {
		brandingId: 0,
		remoteServerUrl: 'https://progressplanner.com',
		placeholderSvg: '',
		badgeId: '',
	} );

	/**
	 * Load task providers from REST API.
	 */
	useEffect( () => {
		let isMounted = true;

		apiFetch( {
			path: '/progress-planner/v1/popover/upgrade-tasks-config',
		} )
			.then( ( response ) => {
				if ( ! isMounted ) {
					return;
				}

				const providers = response.taskProviders || [];
				setTaskProviders( providers );

				// Calculate total points
				const points = providers.reduce(
					( sum, provider ) => sum + ( provider.points || 0 ),
					0
				);
				setTotalPoints( points );

				// Set config data
				setConfig( {
					brandingId: response.brandingId || 0,
					remoteServerUrl:
						response.remoteServerUrl ||
						'https://progressplanner.com',
					placeholderSvg: response.placeholderSvg || '',
					badgeId: response.badgeId || '',
				} );
			} )
			.catch( () => {
				if ( ! isMounted ) {
					return;
				}
				// Fallback to empty on error
				setTaskProviders( [] );
			} )
			.finally( () => {
				if ( isMounted ) {
					setIsLoading( false );
				}
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	/**
	 * Handle popover close - clean up upgrade tasks.
	 */
	const handleClose = useCallback( () => {
		// Delete upgrade popover task providers when popover is closed.
		// This is done via REST API or can be handled server-side.
		if ( onClose ) {
			onClose();
		}
	}, [ onClose ] );

	// Build badge image URL from config
	const badgeImageUrl = `${ config.remoteServerUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ config.badgeId }&branding_id=${ config.brandingId }`;

	const title = __(
		"We've added new recommendations to the Progress Planner plugin",
		'progress-planner'
	);
	const subtitle = __(
		"Let's check if you've already done those tasks, this will take only a minute…",
		'progress-planner'
	);
	const taskId = resolveTaskId( task, 'upgrade-tasks' );

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ taskId || 'upgrade-tasks' }
			task={ task }
			onClose={ handleClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ title }</h2>
				{ subtitle && <p>{ subtitle }</p> }
			</div>
			<div className="prpl-column">
				{ isLoading && <p>{ __( 'Loading…', 'progress-planner' ) }</p> }
				{ ! isLoading && taskProviders.length === 0 && (
					<p>
						{ __( 'No new tasks available.', 'progress-planner' ) }
					</p>
				) }
				{ ! isLoading && taskProviders.length > 0 && (
					<div id="prpl-onboarding-tasks">
						<strong className="prpl-onboarding-tasks-title">
							{ title }
						</strong>
						{ subtitle && (
							<span className="prpl-onboarding-tasks-description">
								{ subtitle }
							</span>
						) }

						<ul className="prpl-onboarding-tasks-list">
							{ taskProviders.map( ( provider ) => {
								const wasCompleted =
									provider.completed || false;

								return (
									<li
										key={ provider.task_id }
										className="prpl-onboarding-task"
										data-prpl-task-completed={
											wasCompleted ? 'true' : 'false'
										}
									>
										<h3>
											{ provider.title ||
												provider.task_id }
										</h3>
										<span className="prpl-onboarding-task-status">
											<span className="prpl-suggested-task-points">
												+{ provider.points || 0 }
											</span>
											<span className="prpl-suggested-task-loader"></span>
											{ wasCompleted && (
												<span className="icon icon-check-circle">
													✓
												</span>
											) }
										</span>
									</li>
								);
							} ) }
						</ul>

						{ config.badgeId && (
							<div className="prpl-onboarding-tasks-footer">
								<span className="prpl-onboarding-tasks-montly-badge">
									<span className="prpl-onboarding-tasks-montly-badge-image">
										<img
											src={ badgeImageUrl }
											alt={ __(
												'Badge',
												'progress-planner'
											) }
											onError={ ( e ) => {
												e.target.onerror = null;
												e.target.src =
													config.placeholderSvg || '';
											} }
										/>
									</span>
									{ __(
										'These tasks contribute to your monthly badge. Every check completed brings you closer!',
										'progress-planner'
									) }
								</span>
								<span className="prpl-onboarding-tasks-total-points">
									{ totalPoints }pt
								</span>
							</div>
						) }

						<button
							id="prpl-onboarding-continue-button"
							className="prpl-button-primary prpl-disabled"
							onClick={ () => {
								if ( onClose ) {
									onClose();
								}
								// Redirect to dashboard
								if ( window.prplOnboardRedirect ) {
									window.prplOnboardRedirect();
								} else {
									window.location.href =
										window.location.href.split( '#' )[ 0 ];
								}
							} }
						>
							{ __( 'Continue', 'progress-planner' ) }
						</button>
					</div>
				) }
			</div>
		</InteractiveTaskPopover>
	);
}
