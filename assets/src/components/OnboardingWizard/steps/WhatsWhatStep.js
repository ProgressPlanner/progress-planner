/**
 * WhatsWhatStep Component
 *
 * Step explaining what Progress Planner does.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';

/**
 * WhatsWhatStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} WhatsWhat step component.
 */
export default function WhatsWhatStep( props ) {
	return (
		<OnboardingStep { ...props } canProceed={ () => true }>
			<div className="tour-content">
				<div className="prpl-columns-wrapper-flex">
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3>
								{ __( 'Recommendations', 'progress-planner' ) }
							</h3>
							<p>
								{ __(
									'Tasks that show you what to work on next.',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'These actions help you improve your site step by step, without having to guess where to start.',
									'progress-planner'
								) }
							</p>
						</div>
					</div>
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3>{ __( 'Badges', 'progress-planner' ) }</h3>
							<p>
								<span className="prpl-suggested-task-points">
									+1
								</span>{ ' ' }
								{ __(
									'You earn points for every completed task.',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'Collect badges as you make progress, which keeps things fun and helps you stay motivated!',
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
