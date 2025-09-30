/* global customElements, PrplInteractiveTask, prplEmailSending */
/*
 * Web Component: prpl-email-test-popup
 *
 * A web component that displays a gauge.
 *
 * Dependencies: progress-planner/web-components/prpl-interactive-task
 */
/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-email-test-popup',
	class extends PrplInteractiveTask {
		// eslint-disable-next-line no-useless-constructor
		constructor() {
			// Get parent class properties
			super();

			// First step.
			this.formStep = this.querySelector(
				'#prpl-sending-email-form-step'
			);
		}

		/**
		 * Runs when the popover is added to the DOM.
		 */
		popoverAddedToDOM() {
			super.popoverAddedToDOM();

			// For the results step, add event listener to radio buttons.
			const nextButton = this.querySelector(
				'#prpl-sending-email-result-step .prpl-steps-nav-wrapper .prpl-button'
			);

			if ( nextButton ) {
				this.querySelectorAll(
					'input[name="prpl-sending-email-result"]'
				).forEach( ( input ) => {
					input.addEventListener( 'change', ( event ) => {
						nextButton.setAttribute(
							'data-action',
							event.target.getAttribute( 'data-action' )
						);
					} );
				} );
			}
		}

		/**
		 * Hide all steps.
		 */
		hideAllSteps() {
			this.querySelectorAll( '.prpl-sending-email-step' ).forEach(
				( step ) => {
					step.style.display = 'none';
				}
			);
		}

		/**
		 * Show the form (first step).
		 */
		showForm() {
			this.hideAllSteps();

			this.formStep.style.display = 'flex';
		}

		/**
		 * Show the results.
		 */
		showResults() {
			const resultsStep = this.querySelector(
				'#prpl-sending-email-result-step'
			);

			const emailAddress = this.querySelector(
				'#prpl-sending-email-address'
			);

			// Update result message with the email address.
			let resultMessageText = resultsStep
				.querySelector( '#prpl-sending-email-sent-message' )
				.getAttribute( 'data-email-message' );

			// Replace the placeholder with the email address.
			resultMessageText = resultMessageText.replace(
				'[EMAIL_ADDRESS]',
				emailAddress.value
			);

			// Replace the placeholder with the error message.
			resultsStep.querySelector(
				'#prpl-sending-email-sent-message'
			).textContent = resultMessageText;

			// Make AJAX GET request.
			fetch(
				prplEmailSending.ajax_url +
					'?action=prpl_test_email_sending&_wpnonce=' +
					prplEmailSending.nonce +
					'&email_address=' +
					emailAddress.value
			)
				.then( ( response ) => response.json() )
				// eslint-disable-next-line no-unused-vars
				.then( ( response ) => {
					if ( true === response.success ) {
						this.formStep.style.display = 'none';
						resultsStep.style.display = 'flex';
					} else {
						this.showErrorOccurred( response.data );
					}
				} )
				.catch( ( error ) => {
					console.error( 'Error testing email:', error ); // eslint-disable-line no-console
					this.showErrorOccurred( error.message );
				} );
		}

		/**
		 * Show the error occurred.
		 * @param {string} errorMessageReason
		 */
		showErrorOccurred( errorMessageReason = '' ) {
			if ( ! errorMessageReason ) {
				errorMessageReason = prplEmailSending.unknown_error;
			}

			const errorOccurredStep = this.querySelector(
				'#prpl-sending-email-error-occurred-step'
			);

			// Replace the placeholder with the email address (text in the left column).
			const emailAddress = this.querySelector(
				'#prpl-sending-email-address'
			).value;

			// Get the error message text.
			const errorMessageText = errorOccurredStep
				.querySelector( '#prpl-sending-email-error-occurred-message' )
				.getAttribute( 'data-email-message' );

			// Replace the placeholder with the email address.
			errorOccurredStep.querySelector(
				'#prpl-sending-email-error-occurred-message'
			).textContent = errorMessageText.replace(
				'[EMAIL_ADDRESS]',
				emailAddress
			);

			// Replace the placeholder with the error message (text in the right column).
			const errorMessageNotification = errorOccurredStep.querySelector(
				'.prpl-note.prpl-note-error .prpl-note-text'
			);
			const errorMessageNotificationText =
				errorMessageNotification.getAttribute( 'data-email-message' );

			errorMessageNotification.textContent =
				errorMessageNotificationText.replace(
					'[ERROR_MESSAGE]',
					errorMessageReason
				);

			// Hide form step.
			this.formStep.style.display = 'none';

			// Show error occurred step.
			errorOccurredStep.style.display = 'flex';
		}

		/**
		 * Show the troubleshooting.
		 */
		showSuccess() {
			this.hideAllSteps();

			this.querySelector(
				'#prpl-sending-email-success-step'
			).style.display = 'flex';
		}

		/**
		 * Show the troubleshooting.
		 */
		showTroubleshooting() {
			this.hideAllSteps();

			this.querySelector(
				'#prpl-sending-email-troubleshooting-step'
			).style.display = 'flex';
		}

		/**
		 * Open the troubleshooting guide.
		 */
		openTroubleshootingGuide() {
			// Open the troubleshooting guide in a new tab.
			window.open( prplEmailSending.troubleshooting_guide_url, '_blank' );

			// Close the popover.
			this.closePopover();
		}

		/**
		 * Popover closing, reset the layout, values, etc.
		 */
		popoverClosing() {
			// Hide all steps and show the first step.
			this.showForm();

			// Reset radio buttons.
			this.querySelectorAll(
				'input[name="prpl-sending-email-result"]'
			).forEach( ( input ) => {
				input.checked = false;
			} );
		}
	}
);
