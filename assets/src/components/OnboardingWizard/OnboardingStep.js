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
 * @param {Function} props.canProceed  - Function to check if step can proceed.
 * @param {string}   props.buttonText  - Custom button text (defaults to "Next").
 * @param {string}   props.buttonClass - Custom button class (defaults to "prpl-btn-primary").
 * @param {boolean}  props.isLoading   - Whether to show loading spinner.
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
	children,
} ) {
	const nextButtonRef = useRef( null );
	const footerRef = useRef( null );

	/**
	 * Update next button state based on canProceed.
	 * Note: We only use CSS class, not HTML disabled attribute,
	 * so click events still fire and we can show error messages.
	 */
	const updateNextButton = () => {
		if ( ! nextButtonRef.current ) {
			return;
		}

		const canAdvance = canProceed( wizardState );
		if ( canAdvance ) {
			nextButtonRef.current.classList.remove( 'prpl-btn-disabled' );
		} else {
			nextButtonRef.current.classList.add( 'prpl-btn-disabled' );
		}
	};

	// Update button state when canProceed changes.
	useEffect( () => {
		updateNextButton();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ wizardState ] );

	/**
	 * Handle disabled button click (show error indicator).
	 *
	 * @param {Event} e - Click event.
	 */
	const handleDisabledClick = ( e ) => {
		if (
			nextButtonRef.current?.classList.contains( 'prpl-btn-disabled' )
		) {
			e.preventDefault();
			e.stopPropagation();
			// Show error indicator (used by WelcomeStep for privacy checkbox).
			const requiredIndicator = document.querySelector(
				'.prpl-privacy-checkbox-wrapper .prpl-required-indicator'
			);
			if ( requiredIndicator ) {
				requiredIndicator.classList.add(
					'prpl-required-indicator-active'
				);
			}
		}
	};

	return (
		<div className="onboarding-step">
			{ children }
			<div ref={ footerRef } className="tour-footer">
				<div className="prpl-tour-next-wrapper">
					{ isLoading && (
						<span
							className="spinner"
							style={ { visibility: 'visible' } }
						></span>
					) }
					<button
						ref={ nextButtonRef }
						type="button"
						className={ `prpl-btn ${ buttonClass } prpl-tour-next` }
						onClick={ ( e ) => {
							handleDisabledClick( e );
							if (
								! nextButtonRef.current?.classList.contains(
									'prpl-btn-disabled'
								)
							) {
								onNext();
							}
						} }
						disabled={ isLoading }
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
