/**
 * DeactivationModal Component
 *
 * Renders a modal for collecting feedback when deactivating the plugin.
 *
 * @param {Object}   props           Component props.
 * @param {Object}   props.config    Configuration with reasons, URLs, etc.
 * @param {boolean}  props.isOpen    Whether the modal is visible.
 * @param {Function} props.onDismiss Callback to close the modal and deactivate.
 * @return {JSX.Element|null} The deactivation modal.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function DeactivationModal( { config, isOpen, onDismiss } ) {
	const [ selectedReason, setSelectedReason ] = useState( '' );
	const [ feedbackText, setFeedbackText ] = useState( '' );
	const [ isSubmitting, setIsSubmitting ] = useState( false );

	if ( ! isOpen ) {
		return null;
	}

	const { reasons, remoteServerUrl, pluginSlug, siteUrl, deactivateUrl } =
		config;

	/**
	 * Handle submit - send feedback to remote server, then deactivate.
	 */
	const handleSubmit = async () => {
		setIsSubmitting( true );

		const requestData = {
			action: 'plugin_deactivation',
			plugin: pluginSlug,
			site: siteUrl,
		};

		try {
			// Step 1: Get nonce from remote server.
			const nonceFormData = new FormData();
			Object.entries( requestData ).forEach( ( [ key, value ] ) => {
				nonceFormData.append( key, value );
			} );

			const nonceResponse = await fetch(
				`${ remoteServerUrl }/?rest_route=/deactivation-feedback-server/v1/get-nonce`,
				{ method: 'POST', body: nonceFormData }
			).then( ( res ) => res.json() );

			// Step 2: Submit feedback with nonce.
			const feedbackFormData = new FormData();
			Object.entries( {
				...requestData,
				nonce: nonceResponse?.nonce || '',
				reason: selectedReason,
				feedback: feedbackText,
			} ).forEach( ( [ key, value ] ) => {
				feedbackFormData.append( key, value );
			} );

			await fetch(
				`${ remoteServerUrl }/?rest_route=/deactivation-feedback-server/v1/submit-feedback`,
				{ method: 'POST', body: feedbackFormData }
			);
		} catch {
			// Silently fail - still deactivate.
		}

		// Redirect to deactivation URL.
		if ( onDismiss ) {
			onDismiss();
		} else {
			window.location.href = deactivateUrl;
		}
	};

	/**
	 * Handle dismiss - deactivate without feedback.
	 */
	const handleDismiss = () => {
		if ( onDismiss ) {
			onDismiss();
		} else {
			window.location.href = deactivateUrl;
		}
	};

	return (
		<div className="prpl-deactivation-modal">
			<div className="prpl-deactivation-backdrop" />
			<div className="prpl-deactivation-content">
				<h1>
					{ __( "We're sorry to see you go", 'progress-planner' ) }
				</h1>
				<p>
					{ __(
						'If you have a moment, please let us know why you are deactivating this plugin:',
						'progress-planner'
					) }
				</p>
				<form onSubmit={ ( e ) => e.preventDefault() }>
					{ reasons.map( ( reason ) => (
						<div
							key={ reason.id }
							className="reason-wrapper"
							data-reason={ reason.id }
						>
							<span className="radio-wrapper">
								<input
									id={ `deactivate-plugin-reason-${ reason.id }` }
									type="radio"
									name="reason"
									value={ reason.id }
									checked={ selectedReason === reason.id }
									onChange={ () => {
										setSelectedReason( reason.id );
										setFeedbackText( '' );
									} }
								/>
								<label
									htmlFor={ `deactivate-plugin-reason-${ reason.id }` }
								>
									{ reason.label }
								</label>
							</span>
							{ selectedReason === reason.id &&
								reason.feedback_type && (
									<div className="feedback-wrapper feedback-visible">
										{ reason.feedback_type ===
										'textarea' ? (
											<textarea
												placeholder={
													reason.feedback_placeholder
												}
												value={ feedbackText }
												onChange={ ( e ) =>
													setFeedbackText(
														e.target.value
													)
												}
											/>
										) : (
											<input
												type="text"
												placeholder={
													reason.feedback_placeholder
												}
												value={ feedbackText }
												onChange={ ( e ) =>
													setFeedbackText(
														e.target.value
													)
												}
											/>
										) }
									</div>
								) }
						</div>
					) ) }
					<div className="actions">
						<button
							type="button"
							className="submit"
							onClick={ handleSubmit }
							disabled={ isSubmitting }
						>
							{ __( 'Submit & Deactivate', 'progress-planner' ) }
						</button>
						<button
							type="button"
							className="dismiss"
							onClick={ handleDismiss }
						>
							{ __( 'Skip & Deactivate', 'progress-planner' ) }
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
