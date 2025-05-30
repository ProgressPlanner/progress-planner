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
				.then( ( data ) => {
					if ( true === data.success ) {
						form.style.display = 'none';
						results.style.display = 'block';
					} else {
						form.style.display = 'none';
						this.showTroubleshooting();
					}
				} )
				.catch( ( error ) => {
					console.error( 'Error testing email:', error ); // eslint-disable-line no-console
					form.style.display = 'none';
					this.showTroubleshooting();
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
		 * Show the troubleshooting.
		 */
		showTroubleshooting() {
			const results = this.querySelector( '#prpl-sending-email-result' );
			const troubleshooting = this.querySelector(
				'#prpl-sending-email-troubleshooting'
			);
			results.style.display = 'none';
			troubleshooting.style.display = 'block';
		}

		/**
		 * Reset the popover.
		 */
		resetPopover() {
			const form = this.querySelector( '#prpl-sending-email-form' );
			const results = this.querySelector( '#prpl-sending-email-result' );
			const troubleshooting = this.querySelector(
				'#prpl-sending-email-troubleshooting'
			);

			form.style.display = 'block';
			results.style.display = 'none';
			troubleshooting.style.display = 'none';

			// Reset radio buttons.
			this.querySelectorAll(
				'input[name="prpl-sending-email-result"]'
			).forEach( ( input ) => {
				input.checked = false;
			} );
		}
	}
);
