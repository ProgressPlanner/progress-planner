/* global HTMLElement, prplSuggestedTask */

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

	/**
	 * Runs when the component is added to the DOM.
	 */
	connectedCallback() {
		const popoverId = this.getAttribute( 'popover-id' );

		// Add default event listeners.
		this.attachDefaultEventListeners();

		// Allow child components to add event listeners when the popover is added to the DOM.
		this.popoverAddedToDOM();

		// Add popover close event listener.
		const popover = document.getElementById( popoverId );
		popover.addEventListener( 'beforetoggle', ( event ) => {
			if ( event.newState === 'open' ) {
				this.popoverOpening();
			}

			if ( event.newState === 'closed' ) {
				this.popoverClosing();
			}
		} );
	}

	/**
	 * Attach button event listeners.
	 * Every button with a data-action attribute will be handled by the component.
	 */
	attachDefaultEventListeners() {
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
	 * Runs when the popover is added to the DOM.
	 */
	popoverAddedToDOM() {}

	/**
	 * Runs when the popover is opening.
	 */
	popoverOpening() {}

	/**
	 * Runs when the popover is closing.
	 */
	popoverClosing() {}

	/**
	 * Complete the task.
	 */
	completeTask() {
		const providerId = this.getAttribute( 'provider-id' );
		const tasks = document.querySelectorAll(
			'#prpl-suggested-tasks-list .prpl-suggested-task'
		);

		tasks.forEach( ( taskElement ) => {
			if ( taskElement.dataset.taskId === providerId ) {
				// Close popover.
				document
					.getElementById( 'prpl-popover-' + providerId )
					.hidePopover();

				const postId = parseInt( taskElement.dataset.postId );

				if ( postId ) {
					prplSuggestedTask.maybeComplete( postId );
				}
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
