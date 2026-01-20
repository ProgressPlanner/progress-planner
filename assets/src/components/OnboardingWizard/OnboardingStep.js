/**
 * OnboardingStep Base Component
 *
 * Base component for all onboarding wizard steps.
 * Provides common functionality like canProceed, updateNextButton, etc.
 *
 * @package
 */

import NextButton from './NextButton';

/**
 * Base step component.
 *
 * This is a utility component that provides common step functionality.
 * Individual step components should use these utilities.
 *
 * @param {Object}   props             - Component props.
 * @param {Object}   props.wizardState - Current wizard state.
 * @param {Function} props.onNext      - Callback when next is clicked.
 * @param {Function} props.canProceed  - Function to check if step can proceed.
 * @param {string}   props.buttonText  - Custom button text (defaults to "Next").
 * @param {string}   props.buttonClass - Custom button class (defaults to "prpl-btn-primary").
 * @param {boolean}  props.isLoading   - Whether to show loading spinner.
 * @param {boolean}  props.hideFooter  - If true, don't render the footer (step will render its own button).
 * @param {Object}   props.children    - Step content.
 * @return {JSX.Element} Step component.
 */
export default function OnboardingStep( {
	wizardState,
	onNext,
	canProceed = () => true,
	buttonText,
	buttonClass = 'prpl-btn-primary',
	isLoading = false,
	hideFooter = false,
	children,
} ) {
	return (
		<div className="onboarding-step">
			{ children }
			{ ! hideFooter && (
				<NextButton
					onNext={ onNext }
					canProceed={ canProceed }
					wizardState={ wizardState }
					buttonText={ buttonText }
					buttonClass={ buttonClass }
					isLoading={ isLoading }
				/>
			) }
		</div>
	);
}
