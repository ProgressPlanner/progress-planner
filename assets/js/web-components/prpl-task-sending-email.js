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
			fetch( prplEmailSending.ajax_url + '?action=test_email_sending' )
				.then( ( response ) => response.json() )
				// eslint-disable-next-line no-unused-vars
				.then( ( data ) => {
					form.style.display = 'none';
					results.style.display = 'block';
				} )
				.catch( ( error ) => {
					console.error( 'Error testing email:', error ); // eslint-disable-line no-console
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

		/**
		 * Runs when the popover is opening.
		 */
		popoverOpening() {
			// Calculate and set the position,
			const target = document.querySelector(
				'.prpl-widget-wrapper.prpl-suggested-tasks'
			);

			// Just in case.
			if ( ! target ) {
				return;
			}

			const rect = target.getBoundingClientRect();

			const popoverId = this.getAttribute( 'popover-id' );
			const popover = document.getElementById( popoverId );

			// Reset default popover styles.
			popover.style.margin = '0';

			// Apply the position.
			popover.style.position = 'fixed'; // This is the default popover position, but just in case.
			popover.style.left = `${ rect.left }px`;
			popover.style.top = `${ rect.top }px`;
		}
	}
);
