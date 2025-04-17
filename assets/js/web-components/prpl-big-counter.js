/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-big-counter',
	class extends HTMLElement {
		constructor( number, content, backgroundColor, inline = false ) {
			// Get parent class properties
			super();
			number = number || this.getAttribute( 'number' );
			content = content || this.getAttribute( 'content' );
			backgroundColor =
				backgroundColor || this.getAttribute( 'background-color' );
			backgroundColor =
				backgroundColor || 'var(--prpl-background-purple)';
			inline = inline || this.getAttribute( 'inline' );
			inline = true === inline || 'true' === inline;

			this.innerHTML = `
				<div style="
					background-color: ${ backgroundColor };
					padding: var(--prpl-padding);
					border-radius: var(--prpl-border-radius-big);
					display: flex;
					flex-direction: ${ inline ? 'row' : 'column' };
					align-items: center;
					text-align: center;
					align-content: center;
					justify-content: ${ inline ? 'flex-start' : 'center' };
					height: ${
						inline
							? 'auto'
							: 'calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2)'
					};
					margin-bottom: var(--prpl-padding);
					gap: ${ inline ? '1rem' : '0' };
				">
					<span style="
						font-size: var(--prpl-font-size-5xl);
						line-height: 1;
						font-weight: 600;
					">${ number }</span>
					<span style="font-size: var(--prpl-font-size-2xl);">${ content }</span>
				</div>
			`;
		}
	}
);
