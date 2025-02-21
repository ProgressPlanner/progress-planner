/* global HTMLElement */

/**
 * Register the custom web component.
 */
// eslint-disable-next-line no-unused-vars
class PrplInteractiveTask extends HTMLElement {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		// Get parent class properties
		super();
	}

	connectedCallback() {
		const popoverId = this.getAttribute( 'popover-id' );

		// Add popover close event listener.
		const popover = document.getElementById( popoverId );
		popover.addEventListener( 'beforetoggle', ( event ) => {
			if ( event.newState === 'closed' ) {
				this.resetPopover();
			}
		} );

		// Add event listeners.
		this.querySelectorAll( 'button' ).forEach( ( buttonElement ) => {
			buttonElement.addEventListener( 'click', ( e ) => {
				const button = e.target.closest( 'button' );
				const action = button?.dataset.action;
				if ( action && typeof this[ action ] === 'function' ) {
					this[ action ]();
				}
			} );
		} );
	}

	/**
	 * Complete the task.
	 */
	completeTask() {
		const providerId = this.getAttribute( 'provider-id' );
		const components = document.querySelectorAll( 'prpl-suggested-task' );

		components.forEach( ( component ) => {
			const liElement = component.querySelector( 'li' );
			if ( liElement.dataset.taskId === providerId ) {
				// Close popover.
				document
					.getElementById( 'prpl-popover-' + providerId )
					.hidePopover();
				// Complete task.
				component.runTaskAction( liElement.dataset.taskId, 'complete' );
			}
		} );
	}

	/**
	 * Close the popover.
	 */
	closePopover() {
		const popoverId = this.getAttribute( 'popover-id' );
		const popover = document.getElementById( popoverId );
		popover.hidePopover();
	}
}
