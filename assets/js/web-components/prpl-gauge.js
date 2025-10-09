/* global customElements, HTMLElement, PrplGaugeProgressController */
/*
 * Web Component: prpl-gauge
 *
 * A web component that displays a gauge.
 *
 * Dependencies: progress-planner/web-components/prpl-badge, progress-planner/web-components/prpl-badge-progress-bar, progress-planner/web-components/prpl-guage-progress-controller
 */

/**
 * Register the custom web component.
 */

customElements.define(
	'prpl-gauge',
	class extends HTMLElement {
		/**
		 * Observed attributes, defined the attributes that will trigger the attributeChangedCallback.
		 */
		static get observedAttributes() {
			return [
				'data-value',
				'data-max',
				'maxdeg',
				'background',
				'color',
				'start',
				'cutout',
				'contentfontsize',
				'contentpadding',
				'marginbottom',
				'branding-id',
				'data-badge-id',
			];
		}

		/**
		 * Constructor, ran when the element is instantiated.
		 */
		constructor() {
			super();
			this.attachShadow( { mode: 'open' } );
			this.state = {
				max: 10,
				value: 0,
				maxDeg: '180deg',
				background: 'var(--prpl-background-monthly)',
				color: 'var(--prpl-color-monthly)',
				color2: 'var(--prpl-color-monthly-2)',
				start: '270deg',
				cutout: '57%',
				contentFontSize: 'var(--prpl-font-size-6xl)',
				contentPadding:
					'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
				marginBottom: 'var(--prpl-padding)',
				brandingId: 0,
				content: '',
			};
		}

		/**
		 * Get the value of the gauge.
		 */
		get value() {
			return parseInt( this.state.value );
		}

		/**
		 * Set the value of the gauge.
		 */
		set value( v ) {
			v = Math.max( 0, Math.min( v, this.max ) );
			this.state.value = v;
			this.setAttribute( 'data-value', v );
		}

		/**
		 * Get the max of the gauge.
		 */
		get max() {
			return parseInt( this.state.max );
		}

		/**
		 * Set the max of the gauge.
		 */
		set max( v ) {
			this.state.max = v;
			this.setAttribute( 'data-max', v );
		}

		/**
		 * Connected callback, ran after the element is connected to the DOM.
		 */
		connectedCallback() {
			// Wait for slot to be populated, wait for the next 'tick' - this will be executed last.
			setTimeout( () => {
				const slot = this.shadowRoot.querySelector( 'slot' );
				const nodes = slot.assignedElements();

				if ( 0 < nodes.length ) {
					const hasPrplBadge = nodes.some(
						( node ) =>
							node.tagName.toLowerCase() === 'prpl-badge' ||
							node.innerHTML.includes( '<prpl-badge' )
					);
					this.state.content = hasPrplBadge ? '<prpl-badge' : '';
				}

				// Render the gauge.
				this.render();
			}, 0 );
		}

		/**
		 * Attribute changed callback, ran on page load and when an observed attribute is changed.
		 *
		 * @param {string} name   The name of the attribute that was changed.
		 * @param {string} oldVal The old value of the attribute.
		 * @param {string} newVal The new value of the attribute.
		 */
		attributeChangedCallback( name, oldVal, newVal ) {
			if ( newVal === oldVal ) {
				return;
			}

			switch ( name ) {
				case 'data-value':
					this.state.value = parseInt( newVal );
					break;
				case 'data-max':
					this.state.max = parseInt( newVal );
					break;
				case 'maxdeg':
					this.state.maxDeg = newVal;
					break;
				case 'background':
					this.state.background = newVal;
					break;
				case 'color':
					this.state.color = newVal;
					break;
				case 'start':
					this.state.start = newVal;
					break;
				case 'cutout':
					this.state.cutout = newVal;
					break;
				case 'contentfontsize':
					this.state.contentFontSize = newVal;
					break;
				case 'contentpadding':
					this.state.contentPadding = newVal;
					break;
				case 'marginbottom':
					this.state.marginBottom = newVal;
					break;
				case 'branding-id':
					this.state.brandingId = newVal;
					break;
				case 'data-badge-id':
					this.state.badgeId = newVal;
					break;
			}

			this.render();

			this.dispatchEvent(
				new CustomEvent( 'prpl-gauge-update', {
					detail: {
						value: this.state.value,
						max: this.state.max,
						element: this,
						badgeId: this.state.badgeId,
					},
					bubbles: true,
					composed: true,
				} )
			);
		}

		/**
		 * Render the gauge.
		 */
		render() {
			const {
				max,
				value,
				maxDeg,
				background,
				color,
				color2,
				start,
				cutout,
				contentFontSize,
				contentPadding,
				marginBottom,
				content,
			} = this.state;

			const contentSpecificStyles = content.includes( '<prpl-badge' )
				? 'bottom: 50%;'
				: 'top: -1em; padding-top: 50%;';

			let colorTransitions;

			// If the progress is less than 50%, we have only one color, no gradient.
			if ( value / max <= 0.5 ) {
				colorTransitions = `${ color } calc(${ maxDeg } * ${
					value / max
				})`;
			} else {
				// Otherwise we show first color for 0.5 and then the second color.
				colorTransitions = `${ color } calc(${ maxDeg } * ${ 0.5 })`;
				colorTransitions += `, ${ color2 } calc(${ maxDeg } * ${
					value / max
				})`;
			}

			// Add the remaining color.
			colorTransitions += `,var(--prpl-color-gauge-remain) calc(${ maxDeg } * ${
				value / max
			}) ${ maxDeg }`;

			this.shadowRoot.innerHTML = `
		<div style="padding: ${ contentPadding }; background: ${ background }; border-radius:var(--prpl-border-radius-big); aspect-ratio: 2 / 1; overflow: hidden; position: relative; margin-bottom: ${ marginBottom };">
			<div style="width: 100%; aspect-ratio: 1 / 1; border-radius: 100%; position: relative; background: radial-gradient(${ background } 0 ${ cutout }, transparent ${ cutout } 100%), conic-gradient(from ${ start }, ${ colorTransitions }, transparent ${ maxDeg }); text-align: center;">
			<span style="font-size: var(--prpl-font-size-small); position: absolute; top: 50%; color: var(--prpl-color-text); width: 10%; text-align: center; left:0;">0</span>
			<span style="font-size: ${ contentFontSize }; ${ contentSpecificStyles } display: block; font-weight: 600; text-align: center; position: absolute; color: var(--prpl-color-text); width: 100%; line-height: 1.2;">
				<span style="display:inline-block;width: 50%;">
				<slot></slot>
				</span>
			</span>
			<span style="font-size: var(--prpl-font-size-small); position: absolute; top: 50%; color: var(--prpl-color-text); width: 10%; text-align: center; right:0;">${ max }</span>
			</div>
		</div>
		`;
		}
	}
);

/**
 * Update the Ravi gauge.
 *
 * @param {number} pointsDiff The points difference.
 *
 * @return {void}
 */
// eslint-disable-next-line no-unused-vars
const prplUpdateRaviGauge = ( pointsDiff ) => {
	if ( ! pointsDiff ) {
		return;
	}

	// Get the gauge.
	const controllerGauge = document.getElementById( 'prpl-gauge-ravi' );

	if ( ! controllerGauge ) {
		return;
	}

	// Get the progress bars, if any.
	const controlProgressBars = [];

	if (
		document.querySelectorAll(
			'.prpl-previous-month-badge-progress-bars-wrapper prpl-badge-progress-bar'
		).length
	) {
		controlProgressBars.push(
			...document.querySelectorAll(
				'.prpl-previous-month-badge-progress-bars-wrapper prpl-badge-progress-bar'
			)
		);
	}

	// Create the controller.
	const controller = new PrplGaugeProgressController(
		controllerGauge,
		...controlProgressBars
	);

	// Handle points difference.
	if ( 0 < pointsDiff ) {
		controller.increase( pointsDiff );
	} else {
		controller.decrease( pointsDiff );
	}
};
