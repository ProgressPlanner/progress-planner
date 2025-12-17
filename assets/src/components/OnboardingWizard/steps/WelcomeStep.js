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
	const { wizardState, updateState, onNext, config } = props;
	const {
		onboardNonceURL,
		onboardAPIUrl,
		ajaxUrl,
		nonce,
		site,
		timezoneOffset,
		hasLicense,
		l10n,
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

		onNext();
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
										onChange={ ( e ) =>
											setPrivacyAccepted(
												e.target.checked
											)
										}
									/>
									<span>
										{ sprintf(
											/* translators: %s: Privacy policy link */
											__(
												'I agree to the %s.',
												'progress-planner'
											),
											<Fragment key="privacy-link">
												<a
													href={
														config.privacyPolicyUrl ||
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
							{ /* Graphic would be rendered here - thumbs_up_ravi_rtl.svg */ }
							<div
								style={ {
									width: '100%',
									height: '200px',
									backgroundColor: '#f0f0f0',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#999',
								} }
							>
								{ __(
									'Graphic placeholder',
									'progress-planner'
								) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
