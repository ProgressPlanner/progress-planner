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
			this.repositionPopover = this.repositionPopover.bind( this ); // So this is available in the event listener.
		}

		/**
		 * Repositions the popover relative to the target element.
		 * @private
		 */
		repositionPopover() {
			const horizontalTarget = document.querySelector( '.prpl-wrap' );
			const verticalTarget = document.querySelector(
				'.prpl-widget-wrapper.prpl-suggested-tasks'
			);

			// Just in case.
			if ( ! horizontalTarget || ! verticalTarget ) {
				return;
			}

			const horizontalRect = horizontalTarget.getBoundingClientRect();
			const verticalRect = verticalTarget.getBoundingClientRect();
			const popoverId = this.getAttribute( 'popover-id' );
			const popover = document.getElementById( popoverId );

			// Reset default popover styles.
			popover.style.margin = '0';

			// Calculate target's center
			const horizontalTargetCenter =
				horizontalRect.left + horizontalRect.width / 2;

			// Apply the position.
			popover.style.position = 'fixed';
			popover.style.left = `${ horizontalTargetCenter }px`;
			popover.style.top = `${ Math.round(
				Math.abs( verticalRect.top )
			) }px`;
			popover.style.transform = 'translateX(-50%)';
		}

		/**
		 * Runs when the popover is opening.
		 */
		popoverOpening() {
			this.repositionPopover();
			window.addEventListener( 'resize', this.repositionPopover );
		}

		/**
		 * Runs when the popover is closing.
		 */
		popoverClosing() {
			window.removeEventListener( 'resize', this.repositionPopover );
		}

		/**
		 * Show the results.
		 */
		showResults() {
			const nextButton = this.querySelector(
				'#prpl-sending-email-result .prpl-steps-nav-wrapper .prpl-button'
			);
			const form = this.querySelector( '#prpl-sending-email-form' );
			const results = this.querySelector( '#prpl-sending-email-result' );

			// Make AJAX GET request.
			fetch(
				prplEmailSending.ajax_url + '?action=prpl_test_email_sending'
			)
				.then( ( response ) => response.json() )
				// eslint-disable-next-line no-unused-vars
				.then( ( response ) => {
					if ( true === response.success ) {
						form.style.display = 'none';
						results.style.display = 'flex';
					} else {
						this.showErrorOccurred( response.data );
					}
				} )
				.catch( ( error ) => {
					console.error( 'Error testing email:', error ); // eslint-disable-line no-console
					this.showErrorOccurred( error.message );
				} );

			// Add event listener to radio buttons.
			this.querySelectorAll(
				'input[name="prpl-sending-email-result"]'
			).forEach( ( input ) => {
				input.addEventListener( 'change', ( event ) => {
					console.log( event.target.getAttribute( 'data-action' ) );
					nextButton.setAttribute(
						'data-action',
						event.target.getAttribute( 'data-action' )
					);
				} );
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

			const form = this.querySelector( '#prpl-sending-email-form' );
			const errorOccurred = this.querySelector(
				'#prpl-sending-email-error-occurred'
			);

			const emailAddress = this.querySelector(
				'#prpl-sending-email-address'
			).value;

			// Get the error message text.
			let errorMessageText = errorOccurred
				.querySelector( '#prpl-sending-email-error-occurred-message' )
				.getAttribute( 'data-email-error-message' );

			// Replace the placeholder with the email address.
			errorMessageText = errorMessageText.replace(
				'[EMAIL_ADDRESS]',
				emailAddress
			);

			// Replace the placeholder with the error message.
			errorOccurred.querySelector(
				'#prpl-sending-email-error-occurred-message'
			).textContent = errorMessageText.replace(
				'[ERROR_MESSAGE]',
				errorMessageReason
			);

			// Hide form step.
			form.style.display = 'none';

			// Show error occurred step.
			errorOccurred.style.display = 'flex';
		}

		/**
		 * Show the form (first step).
		 */
		showForm() {
			this.querySelectorAll( '.prpl-sending-email-step' ).forEach(
				( step ) => {
					step.style.display = 'none';
				}
			);

			this.querySelector( '#prpl-sending-email-form' ).style.display =
				'flex';
		}

		/**
		 * Show the troubleshooting.
		 */
		showSuccess() {
			this.querySelectorAll( '.prpl-sending-email-step' ).forEach(
				( step ) => {
					step.style.display = 'none';
				}
			);

			this.querySelector( '#prpl-sending-email-success' ).style.display =
				'flex';
		}

		/**
		 * Show the troubleshooting.
		 */
		showTroubleshooting() {
			this.querySelectorAll( '.prpl-sending-email-step' ).forEach(
				( step ) => {
					step.style.display = 'none';
				}
			);

			this.querySelector(
				'#prpl-sending-email-troubleshooting'
			).style.display = 'flex';
		}

		/**
		 * Reset the popover.
		 */
		resetPopover() {
			this.querySelectorAll( '.prpl-sending-email-step' ).forEach(
				( step ) => {
					step.style.display = 'none';
				}
			);

			this.querySelector( '#prpl-sending-email-form' ).style.display =
				'flex';

			// Reset radio buttons.
			this.querySelectorAll(
				'input[name="prpl-sending-email-result"]'
			).forEach( ( input ) => {
				input.checked = false;
			} );
		}
	}
);
