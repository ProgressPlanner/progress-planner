/**
 * WhatsWhatStep Component
 *
 * Step explaining what Progress Planner does.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';

/**
 * WhatsWhatStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} WhatsWhat step component.
 */
export default function WhatsWhatStep( props ) {
	const { config } = props;
	const brandingName = config?.l10n?.brandingName || 'Progress Planner';

	return (
		<OnboardingStep { ...props } canProceed={ () => true }>
			<div className="tour-content">
				<div className="prpl-columns-wrapper-flex prpl-columns-2-1">
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3 className="tour-title">
								{ __( "What's what?", 'progress-planner' ) }
							</h3>
							<p>
								{ sprintf(
									/* translators: %s: Progress Planner name */
									__(
										"%s helps you set clear, focused goals for your website. Let's go through a few simple steps to get everything set up.",
										'progress-planner'
									),
									brandingName
								) }
							</p>
							<p>
								{ __(
									'This will only take a few minutes.',
									'progress-planner'
								) }
							</p>
						</div>
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
