/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-big-counter',
	class extends HTMLElement {
		constructor( number, content, backgroundColor ) {
			// Get parent class properties
			super();
			number = number || this.getAttribute( 'number' );
			content = content || this.getAttribute( 'content' );
			backgroundColor =
				backgroundColor || this.getAttribute( 'background-color' );
			backgroundColor =
				backgroundColor || 'var(--prpl-background-purple)';

			const el = this;

			this.innerHTML = `
				<div style="
					background-color: ${ backgroundColor };
					padding: var(--prpl-padding);
					border-radius: var(--prpl-border-radius-big);
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					align-content: center;
					justify-content: center;
					height: calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2);
					margin-bottom: var(--prpl-padding);
				">
					<div class="container-width" style="width: 100%;"></div>
					<span style="
						font-size: var(--prpl-font-size-5xl);
						line-height: 1;
						font-weight: 600;
					">${ number }</span>
					<span style="font-size: var(--prpl-font-size-2xl);">
						<span class="resize" style="font-size: 100%; display: inline-block; width: max-content;">${ content }</span>
					</span>
				</div>
			`;

			const resizeFont = () => {
				const element = el.querySelector( '.resize' );
				if ( ! element ) {
					return;
				}

				element.style.fontSize = '100%';

				let size = 100;
				while (
					element.clientWidth >
					el.querySelector( '.container-width' ).clientWidth
				) {
					if ( size < 80 ) {
						element.style.fontSize = size + '%';
						element.style.width = '100%';
						break;
					}
					size -= 1;
					element.style.fontSize = size + '%';
				}
			};

			resizeFont();
			window.addEventListener( 'resize', resizeFont );
		}
	}
);
