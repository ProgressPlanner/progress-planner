/**
 * BadgesStep Component
 *
 * Step explaining the badge system.
 *
 * @package
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';

/**
 * BadgesStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Badges step component.
 */
export default function BadgesStep( props ) {
	const { wizardState, stepData } = props;
	const gaugeRef = useRef( null );
	const badgeData = stepData?.data || {};

	useEffect( () => {
		// Initialize badge gauge component if available.
		if ( gaugeRef.current && window.customElements?.get( 'prpl-gauge' ) ) {
			const gauge = gaugeRef.current.querySelector( 'prpl-gauge' );
			if ( gauge && badgeData.badgeId && badgeData.badgeName ) {
				// Increment badge points after first task completion.
				setTimeout( () => {
					if (
						gauge &&
						wizardState.data.firstTaskCompleted
					) {
						gauge.setAttribute(
							'data-value',
							( parseFloat( gauge.getAttribute( 'data-value' ) ) || 0 ) + 1
						);
					}
				}, 1500 );
			}
		}
	}, [ wizardState.data.firstTaskCompleted, badgeData ] );

	return (
		<OnboardingStep { ...props } canProceed={ () => true }>
			<div className="tour-content">
				<div className="prpl-columns-wrapper-flex prpl-columns-2-1">
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3>
								{ __(
									'Whoohoo, nice one! You just earned your first point!',
									'progress-planner'
								) }
							</h3>
							<p>
								{ __(
									'Gather ten points this month to unlock your special badge.',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'You're off to a great start!',
									'progress-planner'
								) }
							</p>
						</div>
					</div>
					<div className="prpl-column">
						<div className="prpl-gauge-wrapper" ref={ gaugeRef }>
							{ badgeData.badgeId && badgeData.badgeName && (
								<prpl-gauge
									id="prpl-gauge-onboarding"
									background="#fff"
									color="var(--prpl-color-monthly)"
									contentFontSize="3rem"
									contentPadding="20px"
									marginBottom="0"
									data-max={ badgeData.maxPoints || 10 }
									data-value={ badgeData.currentValue || 0 }
									data-badge-id={ badgeData.badgeId }
									data-badge-name={ badgeData.badgeName }
									data-branding-id={ badgeData.brandingId || '' }
								>
									{ /* Badge will be loaded dynamically */ }
								</prpl-gauge>
							) }
							{ __( 'Monthly badge', 'progress-planner' ) }
						</div>
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
