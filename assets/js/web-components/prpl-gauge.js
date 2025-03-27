/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-gauge',
	class extends HTMLElement {
		constructor(
			props = {
				max: 100,
				value: 0,
				maxDeg: '180deg',
				background: 'var(--prpl-background-orange)',
				color: 'var(--prpl-color-accent-orange)',
				start: '270deg',
				cutout: '57%',
				contentFontSize: 'var(--prpl-font-size-6xl)',
				contentPadding:
					'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
				marginBottom: 'var(--prpl-padding)',
			},
			content = ''
		) {
			// Get parent class properties
			super();

			if ( this.querySelector( 'progress' ) ) {
				props.max = parseFloat(
					this.querySelector( 'progress' ).getAttribute( 'max' )
				);
				props.value =
					parseFloat(
						this.querySelector( 'progress' ).getAttribute( 'value' )
					) / props.max;

				content = this.querySelector( 'progress' ).innerHTML;
			}

			props.background =
				this.getAttribute( 'background' ) || props.background;
			props.color = this.getAttribute( 'color' ) || props.color;
			props.start = this.getAttribute( 'start' ) || props.start;
			props.cutout = this.getAttribute( 'cutout' ) || props.cutout;
			props.contentFontSize =
				this.getAttribute( 'contentFontSize' ) || props.contentFontSize;
			props.contentPadding =
				this.getAttribute( 'contentPadding' ) || props.contentPadding;
			props.marginBottom =
				this.getAttribute( 'marginBottom' ) || props.marginBottom;

			this.innerHTML = `
			<div style="padding: ${ props.contentPadding };
			background: ${
				props.background
			}; border-radius:var(--prpl-border-radius-big); aspect-ratio: 2 / 1; overflow: hidden; position: relative; margin-bottom: ${
				props.marginBottom
			};">
				<div style="width: 100%; aspect-ratio: 1 / 1; border-radius: 100%; position: relative; background: radial-gradient(${
					props.background
				} 0 ${ props.cutout }, transparent ${
					props.cutout
				} 100%), conic-gradient(from ${ props.start }, ${
					props.color
				} calc(${ props.maxDeg } * ${
					props.value
				}), var(--prpl-color-gray-1) calc(${ props.maxDeg } * ${
					props.value
				}) ${ props.maxDeg }, transparent ${
					props.maxDeg
				}); text-align: center;">
					<span style="font-size: var(--prpl-font-size-small); position: absolute; top: 50%; color: var(--prpl-color-gray-5); width: 10%; text-align: center; left:0;">0</span>
						<span style="font-size: ${
							props.contentFontSize
						}; top: -1em; display: block; padding-top: 50%; font-weight: 600; text-align: center; position: absolute; color: var(--prpl-color-gray-5); width: 100%; line-height: 1.2;">
							<span style="display:inline-block;width: 50%; ${
								content.includes( '<prpl-badge' )
									? 'margin-top: -1em;'
									: ''
							}">
								${ content }
							</span>
						</span>
					<span style="font-size: var(--prpl-font-size-small); position: absolute; top: 50%; color: var(--prpl-color-gray-5); width: 10%; text-align: center; right:0;">${
						props.max
					}</span>
				</div>
			</div>
			`;
		}
	}
);
