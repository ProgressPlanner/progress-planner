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
			const actions = this.querySelector( '#prpl-sending-email-actions' );
			const results = this.querySelector( '#prpl-sending-email-result' );

			// Make AJAX GET request.
			fetch( prplEmailSending.ajax_url + '?action=test_email_sending' )
				.then( ( response ) => response.json() )
				// eslint-disable-next-line no-unused-vars
				.then( ( data ) => {
					actions.style.display = 'none';
					results.style.display = 'block';
				} )
				.catch( ( error ) => {
					console.error( 'Error testing email:', error ); // eslint-disable-line no-console
					this.showTroubleshooting();
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
			const actions = this.querySelector( '#prpl-sending-email-actions' );
			const results = this.querySelector( '#prpl-sending-email-result' );
			const troubleshooting = this.querySelector(
				'#prpl-sending-email-troubleshooting'
			);

			actions.style.display = 'block';
			results.style.display = 'none';
			troubleshooting.style.display = 'none';
		}
	}
);
