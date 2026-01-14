/**
 * Subscribe Form Popover Component.
 *
 * Handles subscription form for weekly emails.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { resolveTaskId } from '../../utils/taskIdResolver';

export default function SubscribeFormPopover( { task, onSubmit, onClose } ) {
	const [ name, setName ] = useState( '' );
	const [ email, setEmail ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ success, setSuccess ] = useState( false );

	/**
	 * Load initial data from current user.
	 */
	useEffect( () => {
		// Get current user data from WordPress
		const currentUser = window.wp?.data
			?.select( 'core' )
			?.getCurrentUser?.();

		if ( currentUser ) {
			if ( currentUser.first_name ) {
				setName( currentUser.first_name );
			}
			if ( currentUser.email ) {
				setEmail( currentUser.email );
			}
		}
	}, [] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! name.trim() || ! email.trim() ) {
				setError(
					__( 'Please fill in all fields.', 'progress-planner' )
				);
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				// Get site URL and timezone offset
				const siteUrl = window.location.origin;
				const timezoneOffset = new Date().getTimezoneOffset() / -60; // Convert to hours

				const response = await apiFetch( {
					path: '/progress-planner/v1/popover/subscribe',
					method: 'POST',
					data: {
						name: name.trim(),
						email: email.trim(),
						site: siteUrl,
						timezone_offset: timezoneOffset,
						with_email: 'yes',
					},
				} );

				if ( response.success ) {
					setSuccess( true );

					// Save license key locally via WordPress AJAX and reload page.
					if ( response.license_key ) {
						const { ajaxUrl = '', nonce = '' } =
							window.prplDashboardConfig || {};

						if ( ajaxUrl && nonce ) {
							const saveFormData = new FormData();
							saveFormData.append(
								'action',
								'progress_planner_save_onboard_data'
							);
							saveFormData.append( '_ajax_nonce', nonce );
							saveFormData.append( 'key', response.license_key );

							await fetch( ajaxUrl, {
								method: 'POST',
								body: saveFormData,
							} );
						}

						// Reload page to reflect the new license state.
						window.location.reload();
					}
				} else {
					throw new Error(
						response.message ||
							__(
								'Failed to submit subscription.',
								'progress-planner'
							)
					);
				}
			} catch ( err ) {
				setError(
					err.message ||
						__(
							'Something went wrong. Please try again.',
							'progress-planner'
						)
				);
			} finally {
				setIsLoading( false );
			}
		},
		[ name, email, task, onSubmit ]
	);

	const taskTitle = decodeEntities(
		task.title?.rendered ||
			task.title ||
			__( 'Subscribe to weekly emails', 'progress-planner' )
	);
	const taskId = resolveTaskId( task, 'subscribe-form' );

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ taskId || 'subscribe-form' }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ taskTitle }</h2>
				<p
					dangerouslySetInnerHTML={ {
						__html: sprintf(
							/* translators: %s: progressplanner.com link */
							__(
								"We can send you weekly emails with your own to-dos, your activity stats and nudges to keep you working on your site. To do this, we'll create an account for you on %s.",
								'progress-planner'
							),
							'<a href="https://prpl.fyi/home" target="_blank">progressplanner.com</a>'
						),
					} }
				/>
			</div>
			<div className="prpl-column">
				{ success ? (
					<div className="prpl-note prpl-note-success">
						<p>
							{ __(
								'Subscription successful! You will receive weekly emails.',
								'progress-planner'
							) }
						</p>
					</div>
				) : (
					<form
						id="prpl-settings-license-form"
						onSubmit={ handleSubmit }
					>
						<div className="prpl-form-fields">
							<label htmlFor="prpl-subscribe-name">
								<span className="prpl-label-content">
									{ __( 'First name', 'progress-planner' ) }
								</span>
								<input
									id="prpl-subscribe-name"
									type="text"
									name="name"
									className="prpl-input"
									value={ name }
									onChange={ ( e ) =>
										setName( e.target.value )
									}
									disabled={ isLoading }
									required
								/>
							</label>
							<label htmlFor="prpl-subscribe-email">
								<span className="prpl-label-content">
									{ __( 'Email', 'progress-planner' ) }
								</span>
								<input
									id="prpl-subscribe-email"
									type="email"
									name="email"
									className="prpl-input"
									value={ email }
									onChange={ ( e ) =>
										setEmail( e.target.value )
									}
									disabled={ isLoading }
									required
								/>
							</label>
						</div>
						{ error && (
							<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
								{ error }
							</p>
						) }
						<button
							id="submit-license-key"
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={
								isLoading || ! name.trim() || ! email.trim()
							}
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__( 'Subscribe', 'progress-planner' )
							) }
						</button>
					</form>
				) }
			</div>
		</InteractiveTaskPopover>
	);
}
