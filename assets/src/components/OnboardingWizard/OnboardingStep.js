/**
 * OnboardingStep Base Component
 *
 * Base component for all onboarding wizard steps.
 * Provides common functionality like canProceed, updateNextButton, etc.
 *
 * @package
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Base step component.
 *
 * This is a utility component that provides common step functionality.
 * Individual step components should use these utilities.
 *
 * @param {Object}   props             - Component props.
 * @param {Object}   props.wizardState - Current wizard state.
 * @param {Function} props.onNext      - Callback when next is clicked.
 * @param {Function} props.onBack      - Callback when back is clicked.
 * @param {Function} props.canProceed  - Function to check if step can proceed.
 * @param {string}   props.buttonText  - Custom button text (defaults to "Next").
 * @param {string}   props.buttonClass - Custom button class (defaults to "prpl-btn-primary").
 * @param {Object}   props.children    - Step content.
 * @return {JSX.Element} Step component.
 */
export default function OnboardingStep( {
	wizardState,
	onNext,
	onBack,
	canProceed = () => true,
	buttonText,
	buttonClass = 'prpl-btn-primary',
	children,
} ) {
	const nextButtonRef = useRef( null );
	const footerRef = useRef( null );

	/**
	 * Update next button state based on canProceed.
	 */
	const updateNextButton = () => {
		if ( ! nextButtonRef.current ) {
			return;
		}

		const canAdvance = canProceed( wizardState );
		if ( canAdvance ) {
			nextButtonRef.current.classList.remove( 'prpl-btn-disabled' );
			nextButtonRef.current.disabled = false;
		} else {
			nextButtonRef.current.classList.add( 'prpl-btn-disabled' );
			nextButtonRef.current.disabled = true;
		}
	};

	// Update button state when canProceed changes.
	useEffect( () => {
		updateNextButton();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ wizardState ] );

	return (
		<div className="onboarding-step">
			{ children }
			<div ref={ footerRef } className="tour-footer">
				<div className="prpl-tour-next-wrapper">
					{ onBack && (
						<button
							type="button"
							className="prpl-btn prpl-btn-secondary"
							onClick={ onBack }
						>
							{ /* translators: Back button */ }←{ ' ' }
							{ __( 'Back', 'progress-planner' ) }
						</button>
					) }
					<button
						ref={ nextButtonRef }
						type="button"
						className={ `prpl-btn ${ buttonClass } prpl-tour-next` }
						onClick={ onNext }
					>
						{ buttonText || (
							<>
								{ /* translators: Next button */ }
								{ __( 'Next', 'progress-planner' ) } →
							</>
						) }
					</button>
				</div>
			</div>
		</div>
	);
}
