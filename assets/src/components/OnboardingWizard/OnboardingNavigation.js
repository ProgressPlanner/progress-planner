/**
 * OnboardingNavigation Component
 *
 * Left sidebar navigation showing wizard steps.
 * Steps are display-only indicators, not clickable buttons.
 *
 * @package
 */

/**
 * OnboardingNavigation component.
 *
 * @param {Object} props             - Component props.
 * @param {Array}  props.steps       - Array of step definitions.
 * @param {number} props.currentStep - Current step index.
 * @param {string} props.logoHtml    - Logo HTML from PHP.
 * @return {JSX.Element} Navigation component.
 */
export default function OnboardingNavigation( {
	steps,
	currentStep,
	logoHtml,
} ) {
	return (
		<div className="prpl-onboarding-navigation">
			<div>
				<div id="prpl-onboarding-mobile-step-label">
					{ steps[ currentStep ]?.title || '' }
				</div>
				<ol className="prpl-step-list">
					{ steps.map( ( step, index ) => {
						const isActive = index === currentStep;
						const isCompleted = index < currentStep;
						const stepNumber = index + 1;

						return (
							<li
								key={ step.id }
								className={ `prpl-nav-step-item ${
									isActive ? 'prpl-active' : ''
								} ${ isCompleted ? 'prpl-completed' : '' }` }
								data-step={ index }
							>
								<span className="prpl-step-icon">
									{ isCompleted ? '✓' : stepNumber }
								</span>
								<span className="prpl-step-label">
									{ step.title }
								</span>
							</li>
						);
					} ) }
				</ol>
			</div>
			<div
				className="prpl-onboarding-logo"
				dangerouslySetInnerHTML={ { __html: logoHtml || '' } }
			/>
		</div>
	);
}
