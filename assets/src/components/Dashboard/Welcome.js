/**
 * Welcome Component
 *
 * Welcome/onboarding component for users who haven't accepted privacy policy.
 * Migrated from welcome.php with onboard.js and upgrade-tasks.js functionality.
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Welcome component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration.
 * @return {JSX.Element} The Welcome component.
 */
export default function Welcome( { config } ) {
	const {
		onboardNonceURL = '',
		onboardAPIUrl = '',
		ajaxUrl = '',
		nonce = '',
		userFirstName = '',
		userEmail = '',
		siteUrl = '',
		timezoneOffset = 0,
		branding = {},
	} = config;

	const [ withEmail, setWithEmail ] = useState( 'yes' );
	const [ name, setName ] = useState( userFirstName );
	const [ email, setEmail ] = useState( userEmail );
	const [ privacyPolicyAccepted, setPrivacyPolicyAccepted ] =
		useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const formRef = useRef( null );

	/**
	 * Load upgrade tasks on mount.
	 */
	useEffect( () => {
		const loadUpgradeTasks = async () => {
			try {
				// Check if upgrade tasks popover exists in DOM (from PHP)
				const upgradeTasksElement = document.getElementById(
					'prpl-popover-upgrade-tasks'
				);
				if ( upgradeTasksElement ) {
					// Process upgrade tasks animation
					await processUpgradeTasks();
				}
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error loading upgrade tasks:', error );
			}
		};

		loadUpgradeTasks();
	}, [] );

	/**
	 * Process upgrade tasks animation.
	 */
	const processUpgradeTasks = async () => {
		const tasksElement = document.getElementById( 'prpl-onboarding-tasks' );
		if ( ! tasksElement ) {
			return;
		}

		tasksElement.style.display = 'block';
		const listItems = tasksElement.querySelectorAll( 'li' );
		const timeToWait = 1000;

		const tasks = Array.from( listItems ).map( ( li, index ) => {
			return new Promise( ( resolveTask ) => {
				li.classList.add( 'prpl-onboarding-task-loading' );

				setTimeout(
					() => {
						const taskCompleted =
							'true' === li.dataset.prplTaskCompleted;
						const classToAdd = taskCompleted
							? 'prpl-onboarding-task-completed'
							: 'prpl-onboarding-task-not-completed';
						li.classList.remove( 'prpl-onboarding-task-loading' );
						li.classList.add( classToAdd );

						// Update total points
						if ( taskCompleted ) {
							const totalPointsElement = document.querySelector(
								'#prpl-onboarding-tasks .prpl-onboarding-tasks-total-points'
							);
							if ( totalPointsElement ) {
								const totalPoints = parseInt(
									totalPointsElement.textContent
								);
								const taskPointsElement = li.querySelector(
									'.prpl-suggested-task-points'
								);
								if ( taskPointsElement ) {
									const taskPoints = parseInt(
										taskPointsElement.textContent
									);
									totalPointsElement.textContent =
										totalPoints + taskPoints + 'pt';
								}
							}
						}

						resolveTask();
					},
					( index + 1 ) * timeToWait
				);
			} );
		} );

		await Promise.all( tasks );

		// Enable continue button
		const continueButton = document.getElementById(
			'prpl-onboarding-continue-button'
		);
		if ( continueButton ) {
			continueButton.classList.remove( 'prpl-disabled' );
		}
	};

	/**
	 * Handle form submission.
	 * @param {Event} e - Form submit event.
	 */
	const handleSubmit = async ( e ) => {
		e.preventDefault();

		if ( ! privacyPolicyAccepted ) {
			return;
		}

		setIsSubmitting( true );

		try {
			// Get nonce first using fetch (onboardNonceURL is external)
			const nonceResponse = await fetch( onboardNonceURL, {
				method: 'GET',
			} ).then( ( res ) => res.json() );

			if ( nonceResponse.status === 'ok' ) {
				// Prepare form data
				const formData = new FormData();
				formData.append( 'nonce', nonceResponse.nonce );
				formData.append( 'name', withEmail === 'yes' ? name : '' );
				formData.append( 'email', withEmail === 'yes' ? email : '' );
				formData.append( 'site', siteUrl );
				formData.append( 'timezone_offset', timezoneOffset.toString() );
				formData.append( 'with-email', withEmail );

				// Make API request to external URL
				const response = await fetch( onboardAPIUrl, {
					method: 'POST',
					body: formData,
				} ).then( ( res ) => res.json() );

				// Save license key locally via WordPress AJAX
				if ( response.license_key ) {
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

					// Reload page
					window.location.reload();
				}
			}
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error submitting form:', error );
			setIsSubmitting( false );
		}
	};

	/**
	 * Handle email preference change.
	 * @param {string} value - Email preference value.
	 */
	const handleEmailPreferenceChange = ( value ) => {
		setWithEmail( value );
	};

	// Wrapper styles (migrated from .prpl-wrap.prpl-pp-not-accepted in welcome.css)
	const wrapperStyle = {
		padding: 0,
		backgroundColor: 'var(--prpl-background-paper)',
		border: '1px solid var(--prpl-color-border)',
		borderRadius: 'var(--prpl-border-radius)',
	};

	return (
		<div className="prpl-welcome" style={ wrapperStyle }>
			{ /* Inline CSS for SVG sizing - can't be done with React inline styles */ }
			<style>{ `.prpl-welcome-icon svg { height: 100px; }` }</style>
			<div
				className="welcome-header"
				style={ {
					background: 'var(--prpl-background-banner)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					borderTopLeftRadius: 'var(--prpl-border-radius)',
					borderTopRightRadius: 'var(--prpl-border-radius)',
					overflow: 'hidden',
				} }
			>
				<h1
					style={ {
						fontSize: 'var(--prpl-font-size-3xl)',
						padding:
							'var(--prpl-padding) calc(var(--prpl-gap) * 1.5)',
						fontWeight: 600,
					} }
				>
					{ __(
						'Welcome to the Progress Planner plugin!',
						'progress-planner'
					) }
				</h1>
				<span
					className="welcome-header-icon"
					style={ {
						background:
							'linear-gradient(105deg, var(--prpl-background-banner) 25%, var(--prpl-background-monthly) 25%)',
						padding: 'var(--prpl-padding)',
						paddingLeft: '100px',
						paddingRight: 'calc(var(--prpl-gap) * 1.5)',
					} }
				>
					<span className="slant"></span>
					{ branding.progressIconHtml && (
						<span
							dangerouslySetInnerHTML={ {
								__html: branding.progressIconHtml,
							} }
							className="prpl-welcome-icon"
							style={ {
								display: 'block',
								height: '100px',
							} }
						/>
					) }
				</span>
			</div>
			<div
				className="inner-content"
				style={ {
					padding: 'calc(var(--prpl-gap) * 1.5)',
					paddingBottom: 0,
					marginBottom: 'calc(var(--prpl-gap) * 1.5)',
					display: 'flex',
					gap: 'calc(var(--prpl-gap) * 2)',
				} }
			>
				<div
					className="left"
					style={ {
						flexGrow: 1,
					} }
				>
					<form
						id="prpl-onboarding-form"
						ref={ formRef }
						onSubmit={ handleSubmit }
					>
						<div className="prpl-form-notice">
							<strong
								className="prpl-form-notice-title"
								style={ {
									fontSize: 'var(--prpl-font-size-lg)',
								} }
							>
								{ __(
									'Stay on track with weekly updates',
									'progress-planner'
								) }
							</strong>
							<ul
								style={ {
									listStyle: 'disc',
									marginLeft: '1rem',
								} }
							>
								<li>
									{ sprintf(
										/* translators: %1$s: <strong> tag, %2$s: </strong> tag */
										__(
											'%1$s Personalized to-dos %2$s to keep your site in great shape.',
											'progress-planner'
										),
										'<strong>',
										'</strong>'
									)
										.split( '<strong>' )
										.map( ( part, i ) => {
											if ( i === 0 ) {
												return part;
											}
											const [ before, after ] =
												part.split( '</strong>' );
											return (
												<span key={ i }>
													<strong>{ before }</strong>
													{ after }
												</span>
											);
										} ) }
								</li>
								<li>
									{ sprintf(
										/* translators: %1$s: <strong> tag, %2$s: </strong> tag */
										__(
											'%1$s Activity stats %2$s so you can track your progress.',
											'progress-planner'
										),
										'<strong>',
										'</strong>'
									)
										.split( '<strong>' )
										.map( ( part, i ) => {
											if ( i === 0 ) {
												return part;
											}
											const [ before, after ] =
												part.split( '</strong>' );
											return (
												<span key={ i }>
													<strong>{ before }</strong>
													{ after }
												</span>
											);
										} ) }
								</li>
								<li>
									{ sprintf(
										/* translators: %1$s: <strong> tag, %2$s: </strong> tag */
										__(
											'%1$s Helpful nudges %2$s to stay consistent with your website goals.',
											'progress-planner'
										),
										'<strong>',
										'</strong>'
									)
										.split( '<strong>' )
										.map( ( part, i ) => {
											if ( i === 0 ) {
												return part;
											}
											const [ before, after ] =
												part.split( '</strong>' );
											return (
												<span key={ i }>
													<strong>{ before }</strong>
													{ after }
												</span>
											);
										} ) }
								</li>
							</ul>
							<p>
								{ sprintf(
									/* translators: %s: progressplanner.com link */
									__(
										'To send these updates, we will create an account for you on %s.',
										'progress-planner'
									),
									'<a href="' +
										( branding.homeUrl ||
											'https://prpl.fyi/home' ) +
										'" target="_blank">progressplanner.com</a>'
								)
									.split( '<a' )
									.map( ( part, i ) => {
										if ( i === 0 ) {
											return part;
										}
										const [ , rest ] = part.split( '</a>' );
										return (
											<span key={ i }>
												<a
													href={
														branding.homeUrl ||
														'https://prpl.fyi/home'
													}
													target="_blank"
													rel="noopener noreferrer"
												>
													{ part.split( '>' )[ 1 ] }
												</a>
												{ rest }
											</span>
										);
									} ) }
							</p>
						</div>
						<br />
						<strong>
							{ __(
								'Choose your preference:',
								'progress-planner'
							) }
						</strong>
						<div
							className="prpl-onboard-form-radio-select"
							style={ {
								marginTop: '0.75rem',
							} }
						>
							<label
								htmlFor="prpl-with-email-yes"
								style={ {
									display: 'block',
									marginTop: '0.5rem',
								} }
							>
								<input
									id="prpl-with-email-yes"
									type="radio"
									name="with-email"
									value="yes"
									checked={ withEmail === 'yes' }
									onChange={ () =>
										handleEmailPreferenceChange( 'yes' )
									}
								/>
								<span className="prpl-label-content">
									{ __(
										'Yes, send me weekly updates!',
										'progress-planner'
									) }
								</span>
							</label>
							<label
								htmlFor="prpl-with-email-no"
								style={ {
									display: 'block',
									marginTop: '0.5rem',
								} }
							>
								<input
									id="prpl-with-email-no"
									type="radio"
									name="with-email"
									value="no"
									checked={ withEmail === 'no' }
									onChange={ () =>
										handleEmailPreferenceChange( 'no' )
									}
								/>
								<span className="prpl-label-content">
									{ __(
										'No, I do not want emails right now.',
										'progress-planner'
									) }
								</span>
							</label>
						</div>
						<br />
						<div
							className={ `prpl-form-fields ${
								withEmail === 'no' ? 'prpl-hidden' : ''
							}` }
						>
							<label
								htmlFor="prpl-name"
								style={ {
									display: 'grid',
									gridTemplateColumns: '1fr 3fr',
									marginBottom: '0.5em',
									gap: 'var(--prpl-padding)',
								} }
							>
								<span className="prpl-label-content">
									{ __( 'First name', 'progress-planner' ) }
								</span>
								<input
									id="prpl-name"
									type="text"
									name="name"
									className="prpl-input"
									required={ withEmail === 'yes' }
									value={ name }
									onChange={ ( e ) =>
										setName( e.target.value )
									}
								/>
							</label>
							<label
								htmlFor="prpl-email"
								style={ {
									display: 'grid',
									gridTemplateColumns: '1fr 3fr',
									marginBottom: '0.5em',
									gap: 'var(--prpl-padding)',
								} }
							>
								<span className="prpl-label-content">
									{ __( 'Email', 'progress-planner' ) }
								</span>
								<input
									id="prpl-email"
									type="email"
									name="email"
									className="prpl-input"
									required={ withEmail === 'yes' }
									value={ email }
									onChange={ ( e ) =>
										setEmail( e.target.value )
									}
								/>
							</label>
							<input
								type="hidden"
								name="site"
								value={ siteUrl }
							/>
							<input
								type="hidden"
								name="timezone_offset"
								value={ timezoneOffset }
							/>
						</div>
						<br />
						<div className="prpl-form-notice">
							<label
								htmlFor="prpl-privacy-policy"
								style={ {
									display: 'flex',
									alignItems: 'baseline',
								} }
							>
								<input
									id="prpl-privacy-policy"
									type="checkbox"
									name="privacy-policy"
									className="prpl-input"
									required
									checked={ privacyPolicyAccepted }
									onChange={ ( e ) =>
										setPrivacyPolicyAccepted(
											e.target.checked
										)
									}
								/>
								{ sprintf(
									/* translators: %s: progressplanner.com/privacy-policy link */
									__(
										'I agree to the %s.',
										'progress-planner'
									),
									'<a href="' +
										( branding.privacyPolicyUrl ||
											'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ) +
										'" target="_blank">Privacy policy</a>'
								)
									.split( '<a' )
									.map( ( part, i ) => {
										if ( i === 0 ) {
											return part;
										}
										const [ , rest ] = part.split( '</a>' );
										return (
											<span key={ i }>
												<a
													href={
														branding.privacyPolicyUrl ||
														'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy'
													}
													target="_blank"
													rel="noopener noreferrer"
												>
													{ __(
														'Privacy policy',
														'progress-planner'
													) }
												</a>
												{ rest }
											</span>
										);
									} ) }
							</label>
						</div>
						<br />
						<div
							id="prpl-onboarding-submit-wrapper"
							className={
								privacyPolicyAccepted ? '' : 'prpl-disabled'
							}
							style={ {
								display: 'flex',
								alignItems: 'center',
							} }
						>
							<div id="prpl-onboarding-submit-grid-wrapper">
								<span>
									<input
										type="submit"
										value={ __(
											'Get going and send me weekly emails',
											'progress-planner'
										) }
										className={ `prpl-button-primary ${
											withEmail === 'no'
												? 'prpl-hidden'
												: ''
										}` }
										disabled={ isSubmitting }
									/>
								</span>
							</div>
							<input
								type="submit"
								value={ __(
									'Continue without emailing me',
									'progress-planner'
								) }
								className={ `prpl-button-secondary prpl-button-secondary--no-email ${
									withEmail === 'yes' ? 'prpl-hidden' : ''
								}` }
								disabled={ isSubmitting }
							/>
							{ isSubmitting && (
								<span className="prpl-spinner">
									<span
										className="spinner"
										style={ { visibility: 'visible' } }
									></span>
								</span>
							) }
						</div>
					</form>
				</div>
				<div
					className="right"
					style={
						{
							// Right column styles - hidden on mobile via CSS
						}
					}
				>
					<img
						src={ `${
							config.baseUrl || ''
						}/assets/images/image_onboaring_block.png` }
						alt=""
						className="onboarding"
						style={ {
							maxWidth: '100%',
							width: '550px',
							height: 'auto',
						} }
					/>
				</div>
			</div>
		</div>
	);
}
