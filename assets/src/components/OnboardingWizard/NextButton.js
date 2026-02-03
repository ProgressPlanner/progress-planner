/**
 * NextButton Component
 *
 * Reusable Next button for onboarding wizard steps.
 * Can be placed anywhere within a step for custom layouts.
 *
 * @package
 */

import { useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * NextButton component for use inside steps.
 *
 * @param {Object}   props              - Component props.
 * @param {Function} props.onNext       - Callback when next is clicked.
 * @param {Function} props.canProceed   - Function to check if step can proceed.
 * @param {Object}   props.wizardState  - Current wizard state.
 * @param {string}   props.buttonText   - Custom button text.
 * @param {string}   props.buttonClass  - Custom button class.
 * @param {boolean}  props.isLoading    - Whether to show loading spinner.
 * @param {boolean}  props.wrapInFooter - Whether to wrap in .tour-footer div.
 * @return {JSX.Element} Next button component.
 */
export default function NextButton( {
	onNext,
	canProceed = () => true,
	wizardState,
	buttonText,
	buttonClass = 'prpl-btn-primary',
	isLoading = false,
	wrapInFooter = true,
} ) {
	const nextButtonRef = useRef( null );

	/**
	 * Update next button state based on canProceed.
	 */
	const updateNextButton = useCallback( () => {
		if ( ! nextButtonRef.current ) {
			return;
		}

		const canAdvance = canProceed( wizardState );
		if ( canAdvance ) {
			nextButtonRef.current.classList.remove( 'prpl-btn-disabled' );
		} else {
			nextButtonRef.current.classList.add( 'prpl-btn-disabled' );
		}
	}, [ canProceed, wizardState ] );

	// Update button state when canProceed changes.
	useEffect( () => {
		updateNextButton();
	}, [ updateNextButton ] );

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

	const buttonContent = (
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
	);

	if ( wrapInFooter ) {
		return <div className="tour-footer">{ buttonContent }</div>;
	}

	return buttonContent;
}
