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
	const { wizardState } = props;
	const gaugeRef = useRef( null );

	useEffect( () => {
		// Initialize badge gauge component if available.
		if ( gaugeRef.current && window.customElements?.get( 'prpl-badge' ) ) {
			const badgeId = gaugeRef.current.getAttribute( 'data-badge-id' );
			const badgeName =
				gaugeRef.current.getAttribute( 'data-badge-name' );
			const brandingId =
				gaugeRef.current.getAttribute( 'data-branding-id' );

			if ( badgeId && badgeName ) {
				gaugeRef.current.innerHTML = `
					<prpl-badge
						complete="true"
						badge-id="${ badgeId }"
						badge-name="${ badgeName }"
						branding-id="${ brandingId || '' }"
					></prpl-badge>
				`;

				// Increment badge points after first task completion.
				setTimeout( () => {
					if (
						gaugeRef.current &&
						wizardState.data.firstTaskCompleted
					) {
						gaugeRef.current.value =
							( gaugeRef.current.value || 0 ) + 1;
					}
				}, 1500 );
			}
		}
	}, [ wizardState.data.firstTaskCompleted ] );

	return (
		<OnboardingStep { ...props } canProceed={ () => true }>
			<div className="tour-content">
				<div
					id="prpl-gauge-onboarding"
					ref={ gaugeRef }
					data-badge-id=""
					data-badge-name=""
					data-branding-id=""
				/>
				<p>
					{ __(
						'Complete tasks to earn badges and track your progress!',
						'progress-planner'
					) }
				</p>
			</div>
		</OnboardingStep>
	);
}
