/* global customElements, HTMLElement, prplEmailSending */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-email-test-popup',
	class extends HTMLElement {
		connectedCallback() {
			const popoverId = this.getAttribute( 'popover-id' );
			const providerId = this.getAttribute( 'provider-id' ); // eslint-disable-line no-unused-vars

			// Add popover close event listener.
			const popover = document.getElementById( popoverId );
			popover.addEventListener( 'beforetoggle', ( event ) => {
				if ( event.newState === 'closed' ) {
					this.resetPopover();
				}
			} );

			// Add event listeners.
			this.querySelectorAll( 'button' ).forEach( ( button ) => {
				button.addEventListener( 'click', ( e ) => {
					const action = e.target.dataset.action;
					if ( action && typeof this[ action ] === 'function' ) {
						this[ action ]();
					}
				} );
			} );
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
		 * Complete the task.
		 */
		completeTask() {
			const providerId = this.getAttribute( 'provider-id' );
			const components = document.querySelectorAll(
				'prpl-suggested-task'
			);

			components.forEach( ( component ) => {
				const liElement = component.querySelector( 'li' );
				if ( liElement.dataset.taskId === providerId ) {
					// Close popover.
					document
						.getElementById( 'prpl-popover-' + providerId )
						.hidePopover();
					// Complete task.
					component.runTaskAction(
						liElement.dataset.taskId,
						'complete'
					);
				}
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
		 * Close the popover.
		 */
		closePopover() {
			const popoverId = this.getAttribute( 'popover-id' );
			const popover = document.getElementById( popoverId );
			popover.hidePopover();
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
