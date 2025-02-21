/* global customElements, HTMLElement, prplEmailSending */

/**
 * Register the custom web component.
 */
customElements.define( 'prpl-email-test-popup', class extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const popoverId = this.getAttribute( 'popover-id' );
		const providerId = this.getAttribute( 'provider-id' );

		// Add popover close event listener.
		const popover = document.getElementById( popoverId );
		popover.addEventListener( 'beforetoggle', (event) => {
			if ( event.newState === 'closed' ) {
				this.resetPopover();
			}
		});

		this.innerHTML = `
			<div>
				<h2>` + prplEmailSending.l10n.popoverHeading + `</h2>
				<p>` + prplEmailSending.l10n.popoverDescription + `</p>
				<div id="prpl-sending-email-actions">
					<button class="prpl-button" data-action="showResults">` + prplEmailSending.l10n.popoverButtonYes + `</button>
					<button class="prpl-button" data-action="closePopover">` + prplEmailSending.l10n.popoverButtonNo + `</button>
				</div>
				<div id="prpl-sending-email-result" style="display: none;">
					<p>Was it successful?</p>
					<p>
						<button class="prpl-button" data-action="completeTask">` + prplEmailSending.l10n.popoverButtonYes + `</button>
						<button class="prpl-button" data-action="showTroubleshooting">` + prplEmailSending.l10n.popoverButtonNo + `</button>
					</p>
				</div>
				<div id="prpl-sending-email-troubleshooting" style="display: none;">
					<h2>Email Troubleshooting</h2>
					<p>Here are some steps to fix email sending issues:</p>
					<ul>
						<li>Check your SMTP settings are correct</li>
						<li>Verify your email provider credentials</li>
						<li>Ensure your domain's SPF records are properly configured</li>
						<li>Try sending from a different email address</li>
					</ul>
					<button class="prpl-button" data-action="closePopover">` + prplEmailSending.l10n.popoverButtonClose + `</button>
				</div>

				<button class="prpl-popover-close" data-action="closePopover">
					<span class="dashicons dashicons-no-alt"></span>
					<span class="screen-reader-text">` + prplEmailSending.l10n.popoverButtonClose + `</span>
				</button>
			</div>
		`;

		// Add event listeners.
		this.querySelectorAll('button').forEach(button => {
			button.addEventListener('click', (e) => {
				const action = e.target.dataset.action;
				if (action && typeof this[action] === 'function') {
					this[action]();
				}
			});
		});
	}

	/**
	 * Show the results.
	 */
	showResults() {
		const actions = this.querySelector('#prpl-sending-email-actions');
		const results = this.querySelector('#prpl-sending-email-result');

		// Make AJAX GET request.
		fetch( prplEmailSending.ajax_url + '?action=test_email_sending' )
			.then( response => response.json() )
			.then( data => {
				actions.style.display = 'none';
				results.style.display = 'block';
			} )
			.catch(error => {
				console.error( 'Error testing email:', error );
				this.showTroubleshooting();
			} );
	}

	/**
	 * Complete the task.
	 */
	completeTask() {
		const providerId = this.getAttribute( 'provider-id' );
		const components = document.querySelectorAll( 'prpl-suggested-task' );

		components.forEach(component => {
			const liElement = component.querySelector( 'li' );
			if ( liElement.dataset.taskId === providerId ) {
				// Close popover.
				document.getElementById( 'prpl-popover-' + providerId ).hidePopover();
				// Complete task.
				component.runTaskAction( liElement.dataset.taskId, 'complete' );
			}
		});
	}

	/**
	 * Show the troubleshooting.
	 */
	showTroubleshooting() {
		const results = this.querySelector( '#prpl-sending-email-result' );
		const troubleshooting = this.querySelector( '#prpl-sending-email-troubleshooting' );
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
		const troubleshooting = this.querySelector( '#prpl-sending-email-troubleshooting' );

		actions.style.display = 'block';
		results.style.display = 'none';
		troubleshooting.style.display = 'none';
	}
} );
