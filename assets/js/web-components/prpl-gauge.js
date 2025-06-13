/* global customElements, HTMLElement */
/*
 * Web Component: prpl-gauge
 *
 * A web component that displays a gauge.
 *
 * Dependencies: progress-planner/web-components/prpl-badge
 */

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

	const gaugeElement = document.getElementById( 'prpl-gauge-ravi' );
	if ( ! gaugeElement ) {
		return;
	}

	const gaugeProps = {
		id: gaugeElement.id,
		background: gaugeElement.getAttribute( 'background' ),
		color: gaugeElement.getAttribute( 'color' ),
		max: gaugeElement.getAttribute( 'data-max' ),
		value: gaugeElement.getAttribute( 'data-value' ),
		badgeId: gaugeElement.getAttribute( 'data-badge-id' ),
	};

	if ( ! gaugeProps ) {
		return;
	}

	let newValue = parseInt( gaugeProps.value ) + pointsDiff;
	newValue = Math.round( newValue );
	newValue = Math.max( 0, newValue );
	newValue = Math.min( newValue, parseInt( gaugeProps.max ) );

	const Gauge = customElements.get( 'prpl-gauge' );
	const gauge = new Gauge(
		{
			max: parseInt( gaugeProps.max ),
			value: parseFloat( newValue / parseInt( gaugeProps.max ) ),
			background: gaugeProps.background,
			color: gaugeProps.color,
			maxDeg: '180deg',
			start: '270deg',
			cutout: '57%',
			contentFontSize: 'var(--prpl-font-size-6xl)',
			contentPadding:
				'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
			marginBottom: 'var(--prpl-padding)',
		},
		`<prpl-badge complete="true" badge-id="${ gaugeProps.badgeId }"></prpl-badge>`
	);
	gauge.id = gaugeProps.id;
	gauge.setAttribute( 'background', gaugeProps.background );
	gauge.setAttribute( 'color', gaugeProps.color );
	gauge.setAttribute( 'data-max', gaugeProps.max );
	gauge.setAttribute( 'data-value', newValue );
	gauge.setAttribute( 'data-badge-id', gaugeProps.badgeId );

	// Replace the old gauge with the new one.
	const oldGauge = document.getElementById( gaugeProps.id );
	if ( oldGauge ) {
		oldGauge.replaceWith( gauge );
	}

	const oldCounter = document.getElementById(
		'prpl-widget-content-ravi-points-number'
	);
	if ( oldCounter ) {
		oldCounter.textContent = newValue + 'pt';
	}

	// Mark badge as completed, in the a Monthly badges widgets, if we reached the max points.
	if ( newValue >= parseInt( gaugeProps.max ) ) {
		// We have multiple badges, one in widget and the other in the popover.
		const badges = document.querySelectorAll(
			'.prpl-badge-row-wrapper-inner .prpl-badge prpl-badge[complete="false"][badge-id="' +
				gaugeProps.badgeId +
				'"]'
		);

		if ( badges ) {
			badges.forEach( ( badge ) => {
				badge.setAttribute( 'complete', 'true' );
			} );
		}
	}
};
