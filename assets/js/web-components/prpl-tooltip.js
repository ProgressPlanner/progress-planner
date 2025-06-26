/* global customElements, HTMLElement, prplL10n */
/*
 * Tooltip
 *
 * A web component to display a tooltip.
 *
 * Dependencies: progress-planner/l10n
 */
/* eslint-disable camelcase */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-tooltip',
	class extends HTMLElement {
		// constructor() {
		// 	// Get parent class properties
		// 	super();
		// }

		/**
		 * Connected callback.
		 */
		connectedCallback() {
			// Find the elements inside <prpl-tooltip>
			const contentSlot = this.querySelector( 'slot[name="content"]' );
			const openSlot = this.querySelector( 'slot[name="open"]' );
			const openIconSlot = this.querySelector( 'slot[name="open-icon"]' );
			const closeSlot = this.querySelector( 'slot[name="close"]' );
			const closeIconSlot = this.querySelector(
				'slot[name="close-icon"]'
			);

			// Create tooltip container
			const tooltipContent = document.createElement( 'div' );
			tooltipContent.className = 'prpl-tooltip';
			tooltipContent.setAttribute( 'data-tooltip-content', '' );

			// Move content inside the tooltip container
			while ( contentSlot?.childNodes.length ) {
				tooltipContent.appendChild( contentSlot.childNodes[ 0 ] );
			}
			contentSlot?.remove(); // Remove slot element

			// Find the open button (or create a default one)
			let openButton = openSlot?.firstElementChild;
			if ( ! openButton ) {
				openButton = document.createElement( 'button' );
				openButton.type = 'button';
				openButton.className = 'prpl-info-icon';
				openButton.setAttribute(
					'data-tooltip-action',
					'open-tooltip'
				);
				openButton.innerHTML =
					openIconSlot?.innerHTML ||
					`
					<span class="icon prpl-info-icon">
						<span class="dashicons dashicons-info"></span>
						<span class="screen-reader-text">${ prplL10n( 'info' ) }</span>
					</span>
				`;
			}
			openSlot?.remove(); // Remove slot element
			openIconSlot?.remove(); // Remove slot element

			// Find the close button (or create a default one)
			let closeButton = closeSlot?.firstElementChild;
			if ( ! closeButton ) {
				closeButton = document.createElement( 'button' );
				closeButton.type = 'button';
				closeButton.className = 'prpl-tooltip-close';
				closeButton.setAttribute(
					'data-tooltip-action',
					'close-tooltip'
				);
				closeButton.innerHTML =
					closeIconSlot?.innerHTML ||
					`
					<span class="dashicons dashicons-no-alt"></span>
					<span class="screen-reader-text">${ prplL10n( 'close' ) }</span>
				`;
			}
			closeSlot?.remove(); // Remove slot element
			closeIconSlot?.remove(); // Remove slot element

			// Append elements to the component
			this.appendChild( openButton );
			tooltipContent.appendChild( closeButton );
			this.appendChild( tooltipContent );

			// Add event listeners
			this.addListeners();
		}

		/**
		 * Add listeners to the item.
		 */
		addListeners = () => {
			const thisObj = this,
				openTooltipButton = thisObj.querySelector(
					'button[data-tooltip-action="open-tooltip"]'
				),
				closeTooltipButton = thisObj.querySelector(
					'button[data-tooltip-action="close-tooltip"]'
				);

			// Open the tooltip.
			openTooltipButton?.addEventListener( 'click', () => {
				thisObj
					.querySelector( '[data-tooltip-content]' )
					.setAttribute( 'data-tooltip-visible', 'true' );
			} );

			// Close the tooltip.
			closeTooltipButton?.addEventListener( 'click', () => {
				thisObj
					.querySelector( '[data-tooltip-content]' )
					.removeAttribute( 'data-tooltip-visible' );
			} );
		};
	}
);

/* eslint-enable camelcase */
