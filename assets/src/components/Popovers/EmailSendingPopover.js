/**
 * Email Sending Popover Component.
 *
 * Multi-step popover for testing email sending functionality.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useCallback, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';

const STEP_FORM = 'form';
const STEP_RESULT = 'result';
const STEP_ERROR = 'error';
const STEP_SUCCESS = 'success';
const STEP_TROUBLESHOOTING = 'troubleshooting';

export default function EmailSendingPopover( { task, onSubmit, onClose } ) {
	const [ currentStep, setCurrentStep ] = useState( STEP_FORM );
	const [ emailAddress, setEmailAddress ] = useState( '' );
	const [ isSending, setIsSending ] = useState( false );
	const [ emailError, setEmailError ] = useState( null );
	const [ emailSubject, setEmailSubject ] = useState( '' );
	const [ troubleshootingGuideUrl, setTroubleshootingGuideUrl ] =
		useState( '' );
	const [ hasEmailOverride, setHasEmailOverride ] = useState( false );

	/**
	 * Load initial data from REST API.
	 * This effect runs once on mount to fetch configuration.
	 */
	useEffect( () => {
		// Track if component is still mounted
		let isMounted = true;

		// Fetch config from REST API (lazy-loaded when popover opens)
		apiFetch( {
			path: '/progress-planner/v1/popover/email-sending-config',
		} )
			.then( ( response ) => {
				if ( ! isMounted ) {
					return;
				}
				if ( response.email_subject ) {
					setEmailSubject( response.email_subject );
				}
				if ( response.troubleshooting_guide_url ) {
					setTroubleshootingGuideUrl(
						response.troubleshooting_guide_url
					);
				}
				if ( response.has_email_override !== undefined ) {
					setHasEmailOverride( response.has_email_override );
				}
				if ( response.default_email ) {
					// Only set default email if not already set by WP data store
					setEmailAddress( ( prev ) =>
						prev ? prev : response.default_email
					);
				}
			} )
			.catch( () => {
				if ( ! isMounted ) {
					return;
				}
				// Fallback to defaults on error
				setEmailSubject(
					__(
						'Your Progress Planner test message!',
						'progress-planner'
					)
				);
			} );

		// Also try to get current user email from WordPress data store
		const currentUser = window.wp?.data
			?.select( 'core' )
			?.getCurrentUser?.();
		if ( currentUser?.email ) {
			setEmailAddress( currentUser.email );
		}

		// Cleanup function
		return () => {
			isMounted = false;
		};
	}, [] );

	/**
	 * Send test email.
	 */
	const sendTestEmail = useCallback( async () => {
		if ( ! emailAddress ) {
			return;
		}

		setIsSending( true );
		setEmailError( null );

		try {
			const taskId = task.slug || task.id || 'sending-email';

			// Use REST API instead of AJAX
			const response = await apiFetch( {
				path: '/progress-planner/v1/popover/test-email',
				method: 'POST',
				data: {
					email_address: emailAddress,
					task_id: taskId,
				},
			} );

			if ( response.success ) {
				setCurrentStep( STEP_RESULT );
			} else {
				setEmailError(
					response.message ||
						__( 'Unknown error', 'progress-planner' )
				);
				setCurrentStep( STEP_ERROR );
			}
		} catch ( err ) {
			// Handle WP_Error from REST API
			const errorMessage =
				err?.message ||
				err?.data?.message ||
				__( 'Unknown error', 'progress-planner' );
			setEmailError( errorMessage );
			setCurrentStep( STEP_ERROR );
		} finally {
			setIsSending( false );
		}
	}, [ emailAddress, task ] );

	/**
	 * Handle form submission.
	 */
	const handleFormSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();
			await sendTestEmail();
		},
		[ sendTestEmail ]
	);

	/**
	 * Handle result radio change.
	 */
	const handleResultChange = useCallback( ( e ) => {
		const action = e.target.getAttribute( 'data-action' );
		if ( action === 'showSuccess' ) {
			setCurrentStep( STEP_SUCCESS );
		} else if ( action === 'showTroubleshooting' ) {
			setCurrentStep( STEP_TROUBLESHOOTING );
		}
	}, [] );

	/**
	 * Handle complete task.
	 */
	const handleComplete = useCallback( async () => {
		if ( onSubmit ) {
			await onSubmit( task.id, task );
		}
	}, [ task, onSubmit ] );

	/**
	 * Open troubleshooting guide.
	 */
	const handleOpenTroubleshootingGuide = useCallback( () => {
		if ( troubleshootingGuideUrl ) {
			window.open( troubleshootingGuideUrl, '_blank' );
		}
		if ( onClose ) {
			onClose();
		}
	}, [ troubleshootingGuideUrl, onClose ] );

	// Render current step
	const renderStep = () => {
		switch ( currentStep ) {
			case STEP_FORM:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'Test if your site can send emails',
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									'Your WordPress site sometimes needs to send emails. For example, to reset a password, send a comment notification, or warn you when something breaks. Contact forms also use email.',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'It is important to check if these emails are actually sent. Enter your email address on the right to get a test email.',
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'Where should we send the test email?',
									'progress-planner'
								) }
							</p>
							<div className="prpl-note">
								<span className="prpl-note-icon">
									<span className="dashicons dashicons-warning"></span>
								</span>
								<span className="prpl-note-text">
									{ __(
										'You should get the email in a few minutes. In rare cases, it might take a few hours.',
										'progress-planner'
									) }
								</span>
							</div>
							<form onSubmit={ handleFormSubmit }>
								<label htmlFor="prpl-sending-email-address">
									<span className="screen-reader-text">
										{ __(
											'Email address',
											'progress-planner'
										) }
									</span>
									<input
										type="email"
										id="prpl-sending-email-address"
										placeholder={ __(
											'Enter your e-mail address',
											'progress-planner'
										) }
										value={ emailAddress }
										onChange={ ( e ) =>
											setEmailAddress( e.target.value )
										}
										disabled={ isSending }
										required
									/>
								</label>
								<div className="prpl-steps-nav-wrapper">
									<button
										type="submit"
										className="prpl-button prpl-button-step"
										disabled={ isSending || ! emailAddress }
									>
										{ isSending ? (
											<>
												<span
													className="spinner"
													style={ {
														visibility: 'visible',
													} }
												></span>
												{ __(
													'Sending…',
													'progress-planner'
												) }
											</>
										) : (
											<>
												{ __(
													'Next step',
													'progress-planner'
												) }
												<span className="dashicons dashicons-arrow-right-alt2"></span>
											</>
										) }
									</button>
								</div>
							</form>
						</div>
					</>
				);

			case STEP_ERROR:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'We tried to send a test email',
									'progress-planner'
								) }
							</h2>
							<p>
								{ sprintf(
									// translators: %1$s is the email subject, %2$s is the email address.
									__(
										'We just tried to send the email "%1$s" to %2$s, but unfortunately it didn\'t work.',
										'progress-planner'
									),
									emailSubject,
									emailAddress
								) }
							</p>
						</div>
						<div className="prpl-column">
							<div className="prpl-note prpl-note-error">
								<span className="prpl-note-icon">
									<span className="dashicons dashicons-warning"></span>
								</span>
								<span className="prpl-note-text">
									{ sprintf(
										// translators: %s is the error message.
										__(
											'The test email did not work. The error message was: %s',
											'progress-planner'
										),
										emailError ||
											__(
												'Unknown error',
												'progress-planner'
											)
									) }
								</span>
							</div>
							{ troubleshootingGuideUrl && (
								<p>
									{ __(
										'There are a few common reasons why your email might not be sending. Check the',
										'progress-planner'
									) }{ ' ' }
									<a
										href={ troubleshootingGuideUrl }
										target="_blank"
										rel="noopener noreferrer"
									>
										{ __(
											'troubleshooting guide',
											'progress-planner'
										) }
									</a>{ ' ' }
									{ __(
										'to find out what is causing the issue and how to fix it.',
										'progress-planner'
									) }
								</p>
							) }
							<div className="prpl-steps-nav-wrapper">
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ () =>
										setCurrentStep( STEP_FORM )
									}
								>
									<span className="dashicons dashicons-arrow-left-alt2"></span>
									{ __( 'Try again', 'progress-planner' ) }
								</button>
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ onClose }
								>
									{ __( 'Retry later', 'progress-planner' ) }
								</button>
							</div>
						</div>
					</>
				);

			case STEP_RESULT:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'We sent a test email',
									'progress-planner'
								) }
							</h2>
							<p>
								{ sprintf(
									// translators: %1$s is the email subject, %2$s is the email address.
									__(
										'We just sent the email "%1$s" to %2$s.',
										'progress-planner'
									),
									emailSubject,
									emailAddress
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'Did you get the test email?',
									'progress-planner'
								) }
							</p>
							<div className="prpl-note">
								<span className="prpl-note-icon">
									<span className="dashicons dashicons-warning"></span>
								</span>
								<span className="prpl-note-text">
									{ __(
										'You should get the email in a few minutes. In rare cases, it might take a few hours.',
										'progress-planner'
									) }
								</span>
							</div>
							<div className="radios">
								<div className="prpl-radio-wrapper">
									<label
										htmlFor="prpl-sending-email-result-yes"
										className="prpl-custom-radio"
									>
										<input
											type="radio"
											id="prpl-sending-email-result-yes"
											name="prpl-sending-email-result"
											data-action="showSuccess"
											onChange={ handleResultChange }
										/>
										<span className="prpl-custom-control"></span>
										{ __( 'Yes', 'progress-planner' ) }
									</label>
								</div>
								<div className="prpl-radio-wrapper">
									<label
										htmlFor="prpl-sending-email-result-no"
										className="prpl-custom-radio"
									>
										<input
											type="radio"
											id="prpl-sending-email-result-no"
											name="prpl-sending-email-result"
											data-action="showTroubleshooting"
											onChange={ handleResultChange }
										/>
										<span className="prpl-custom-control"></span>
										{ __( 'No', 'progress-planner' ) }
									</label>
								</div>
							</div>
						</div>
					</>
				);

			case STEP_SUCCESS:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'Your email is set up properly!',
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									'Great, you received the test email! This indicates email is set up properly on your website.',
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'Celebrate this achievement!',
									'progress-planner'
								) }
							</p>
							<div className="prpl-steps-nav-wrapper">
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ handleComplete }
								>
									{ __(
										'Collect your point!',
										'progress-planner'
									) }
								</button>
							</div>
						</div>
					</>
				);

			case STEP_TROUBLESHOOTING:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'Your email might not be working well',
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									"We're sorry to hear you did not receive our confirmation email yet. On some websites, it make take up to a few hours to send email. That's why we strongly advise you to check back in a few hours from now.",
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									"If you already waited a couple of hours and you still didn't get our email, your email might not be working well.",
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							{ hasEmailOverride ? (
								<>
									<p>
										{ __(
											'What can you do next? Well, it looks like you are already running an SMTP plugin on your website, but it might not be configured correctly.',
											'progress-planner'
										) }
									</p>
									<p>
										{ __(
											'You can find more information about running an SMTP plugin in our troubleshooting guide.',
											'progress-planner'
										) }
									</p>
								</>
							) : (
								<>
									<p>
										{ __(
											"What can you do next? If you haven't already, you may need to install a plugin to handle email for you (an SMTP plugin).",
											'progress-planner'
										) }
									</p>
									<p>
										{ __(
											'You can find more information about installing an SMTP plugin in our troubleshooting guide.',
											'progress-planner'
										) }
									</p>
								</>
							) }
							<div className="prpl-steps-nav-wrapper">
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ handleOpenTroubleshootingGuide }
								>
									{ __(
										'Take me to your troubleshooting guide',
										'progress-planner'
									) }
								</button>
							</div>
						</div>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ task.slug || task.id }
			task={ task }
			onClose={ onClose }
		>
			{ renderStep() }
		</InteractiveTaskPopover>
	);
}
