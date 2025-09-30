/* global HTMLElement, prplSuggestedTask, customElements */

/**
 * Register the custom web component.
 */
// eslint-disable-next-line no-unused-vars
class PrplInteractiveTask extends HTMLElement {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		// Get parent class properties
		super();

		this.repositionPopover = this.repositionPopover.bind( this ); // So this is available in the event listener.
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
	popoverAddedToDOM() {
		window.addEventListener( 'resize', this.repositionPopover );
	}

	/**
	 * Runs when the popover is opening.
	 */
	popoverOpening() {
		this.repositionPopover();
	}

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

		// Ensure that the popover is not too far from the top of the screen on small screens.
		const MARGIN_TOP = 12; // minimum gap from top
		const MARGIN_BOTTOM = 12; // minimum gap from bottom
		const MOBILE_TOP_CAP = 100; // max starting offset on small screens
		const isSmallScreen = window.matchMedia( '(max-width: 768px)' ).matches;
		const MAX_TOP_CAP = isSmallScreen
			? MOBILE_TOP_CAP
			: Number.POSITIVE_INFINITY;

		const desiredTop = Math.round( verticalRect.top );

		const clampedTop = Math.max(
			MARGIN_TOP,
			Math.min( desiredTop, MAX_TOP_CAP )
		);

		// Apply the position.
		popover.style.position = 'fixed';
		popover.style.left = `${ horizontalTargetCenter }px`;
		popover.style.top = `${ Math.round( clampedTop ) }px`;
		popover.style.transform = 'translateX(-50%)';

		// Make sure popover content can scroll if needed
		popover.style.maxHeight = '80vh'; // adjustable
		popover.style.overflowY = 'auto';
		popover.style.maxHeight = `calc(100vh - ${
			clampedTop + MARGIN_BOTTOM
		}px)`;
	}
}

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-interactive-task-popover',
	class extends PrplInteractiveTask {
		// eslint-disable-next-line no-useless-constructor
		constructor() {
			// Get parent class properties
			super();
		}
	}
);
