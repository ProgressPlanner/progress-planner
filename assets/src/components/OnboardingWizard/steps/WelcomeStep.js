/**
 * WelcomeStep Component
 *
 * First step: Privacy policy acceptance and license generation.
 *
 * @package
 */

import { useState, useEffect, Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';
import { useLicenseGenerator } from '../../../hooks/useLicenseGenerator';

/**
 * WelcomeStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Welcome step component.
 */
export default function WelcomeStep( props ) {
	const { wizardState, updateState, config } = props;
	const {
		onboardNonceURL,
		onboardAPIUrl,
		ajaxUrl,
		nonce,
		site,
		timezoneOffset,
		hasLicense,
		l10n,
		baseUrl,
		privacyPolicyUrl,
	} = config;

	const { generateLicense, isGenerating } = useLicenseGenerator( {
		onboardNonceURL,
		onboardAPIUrl,
		ajaxUrl,
		nonce,
		siteUrl: site,
		timezoneOffset,
	} );

	const [ privacyAccepted, setPrivacyAccepted ] = useState(
		wizardState.data.privacyAccepted || false
	);

	// Update wizard state when privacy acceptance changes.
	useEffect( () => {
		updateState( {
			data: {
				...wizardState.data,
				privacyAccepted,
			},
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ privacyAccepted ] );

	/**
	 * Handle next button click.
	 */
	const handleNext = async () => {
		// If no license and privacy accepted, generate license first.
		if ( ! hasLicense && privacyAccepted ) {
			try {
				await generateLicense( {
					'with-email': 'no', // Default for wizard
				} );
				// Reload page to get new license state.
				window.location.reload();
				return;
			} catch ( error ) {
				console.error( 'Failed to generate license:', error );
				return;
			}
		}

		props.onNext();
	};

	/**
	 * Check if can proceed.
	 *
	 * @return {boolean} True if can proceed.
	 */
	const canProceed = () => {
		// Sites with license can always proceed.
		if ( hasLicense ) {
			return true;
		}
		return privacyAccepted;
	};

	return (
		<OnboardingStep
			{ ...props }
			onNext={ handleNext }
			canProceed={ canProceed }
			buttonText={
				<>
					{ __( 'Start onboarding', 'progress-planner' ) }
					<span className="dashicons dashicons-arrow-right-alt2"></span>
				</>
			}
			buttonClass="prpl-btn-secondary"
		>
			<div className="tour-content">
				<div className="prpl-columns-wrapper-flex prpl-columns-2-1">
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3 className="tour-title">
								{ __(
									"Hi there! Ready to push your website forward? Let's go!",
									'progress-planner'
								) }
							</h3>
							<p>
								{ sprintf(
									/* translators: %s: Progress Planner name */
									__(
										"%s helps you set clear, focused goals for your website. Let's go through a few simple steps to get everything set up.",
										'progress-planner'
									),
									l10n?.brandingName || 'Progress Planner'
								) }
							</p>
							<p>
								{ __(
									'This will only take a few minutes.',
									'progress-planner'
								) }
							</p>
						</div>

						{ ! hasLicense && (
							<div className="prpl-privacy-checkbox-wrapper">
								<label
									htmlFor="prpl-privacy-checkbox"
									style={ {
										display: 'flex',
										alignItems: 'baseline',
									} }
								>
									<input
										id="prpl-privacy-checkbox"
										type="checkbox"
										checked={ privacyAccepted }
										onChange={ ( e ) => {
											setPrivacyAccepted(
												e.target.checked
											);
											// Remove active class from required indicator (like develop).
											const requiredIndicator =
												document.querySelector(
													'.prpl-privacy-checkbox-wrapper .prpl-required-indicator'
												);
											if ( requiredIndicator ) {
												requiredIndicator.classList.remove(
													'prpl-required-indicator-active'
												);
											}
										} }
									/>
									<span>
										{ sprintf(
											/* translators: %1$s: progressplanner.com/privacy-policy link, %2$s: required indicator */
											__(
												'I accept the %1$s and the essential data processing needed for the plugin. %2$s',
												'progress-planner'
											),
											<Fragment key="privacy-link">
												<a
													href={
														privacyPolicyUrl ||
														'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy'
													}
													target="_blank"
													rel="noopener noreferrer"
												>
													{ __(
														'privacy policy',
														'progress-planner'
													) }
												</a>
											</Fragment>,
											<Fragment key="required-indicator">
												<span className="prpl-required-indicator">
													{ __(
														'Required',
														'progress-planner'
													) }
												</span>
											</Fragment>
										) }
									</span>
								</label>
							</div>
						) }

						{ isGenerating && (
							<div className="prpl-spinner">
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							</div>
						) }
					</div>
					<div className="prpl-column prpl-hide-on-mobile">
						<div id="prpl-welcome-graphic">
							<img
								src={ `${
									baseUrl || ''
								}/assets/images/onboarding/thumbs_up_ravi_rtl.svg` }
								alt=""
								style={ {
									maxWidth: '100%',
									height: 'auto',
								} }
							/>
						</div>
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
