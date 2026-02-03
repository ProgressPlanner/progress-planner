/**
 * BadgesStep Component
 *
 * Step explaining the badge system.
 *
 * @package
 */

import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';
import Gauge from '../../Gauge';
import Badge from '../../Badge';

/**
 * BadgesStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Badges step component.
 */
export default function BadgesStep( props ) {
	const { wizardState, stepData } = props;
	const badgeData = useMemo( () => stepData?.data || {}, [ stepData?.data ] );

	// State for animated gauge value.
	const initialValue = badgeData.currentValue || 0;
	const [ gaugeValue, setGaugeValue ] = useState( initialValue );

	// Increment badge points after first task completion (with delay for animation).
	useEffect( () => {
		if ( wizardState.data.firstTaskCompleted && badgeData.badgeId ) {
			const timer = setTimeout( () => {
				setGaugeValue( ( prev ) => prev + 1 );
			}, 1500 );

			return () => clearTimeout( timer );
		}
	}, [ wizardState.data.firstTaskCompleted, badgeData.badgeId ] );

	return (
		<OnboardingStep
			{ ...props }
			canProceed={ () => true }
			buttonText={ __( 'Got it', 'progress-planner' ) }
			buttonClass="prpl-btn-secondary"
		>
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
									"You're off to a great start!",
									'progress-planner'
								) }
							</p>
						</div>
					</div>
					<div className="prpl-column">
						<div className="prpl-gauge-wrapper">
							{ badgeData.badgeId && badgeData.badgeName ? (
								<Gauge
									value={ gaugeValue }
									max={ badgeData.maxPoints || 10 }
									backgroundColor="#fff"
									color="var(--prpl-color-monthly)"
									color2="var(--prpl-color-monthly)"
									contentFontSize="3rem"
								>
									<Badge
										badgeId={ badgeData.badgeId }
										badgeName={ badgeData.badgeName }
										brandingId={ badgeData.brandingId || 0 }
										isComplete={ true }
									/>
								</Gauge>
							) : (
								<Gauge
									value={ gaugeValue }
									max={ 10 }
									backgroundColor="#fff"
									color="var(--prpl-color-monthly)"
									color2="var(--prpl-color-monthly)"
									contentFontSize="3rem"
								>
									{ gaugeValue }
								</Gauge>
							) }
							<p
								style={ {
									textAlign: 'center',
									marginTop: '0',
								} }
							>
								{ __( 'Monthly badge', 'progress-planner' ) }
							</p>
						</div>
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
