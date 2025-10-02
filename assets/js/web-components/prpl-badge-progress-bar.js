/* global customElements, HTMLElement */
/*
 * Badge Progress Bar
 *
 * A web component to display a badge progress bar.
 *
 * Dependencies: progress-planner/l10n, progress-planner/web-components/prpl-badge
 */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-badge-progress-bar',
	class extends HTMLElement {
		/**
		 * Observed attributes, defined the attributes that will trigger the attributeChangedCallback.
		 */
		static get observedAttributes() {
			return [ 'data-badge-id', 'data-points', 'data-max-points' ];
		}

		/**
		 * Constructor, ran when the element is instantiated.
		 */
		constructor() {
			super();
			this.attachShadow( { mode: 'open' } );
			this.state = {
				badgeId: this.getAttribute( 'data-badge-id' ) || '',
				points: parseInt( this.getAttribute( 'data-points' ) || 0 ),
				maxPoints: parseInt(
					this.getAttribute( 'data-max-points' ) || 10
				),
			};
		}

		/**
		 * Get the points.
		 */
		get points() {
			return parseInt( this.state.points );
		}

		/**
		 * Set the points.
		 */
		set points( v ) {
			v = Math.max( 0, Math.min( v, this.maxPoints ) );
			this.state.points = v;
			this.setAttribute( 'data-points', v );
		}

		/**
		 * Get the max points.
		 */
		get maxPoints() {
			return parseInt( this.state.maxPoints );
		}

		/**
		 * Set the max points.
		 */
		set maxPoints( v ) {
			this.state.maxPoints = v;
			this.setAttribute( 'data-max-points', v );
		}

		/**
		 * Get the progress percent.
		 */
		get progressPercent() {
			return ( this.points / this.maxPoints ) * 100;
		}

		/**
		 * Connected callback, ran after the element is connected to the DOM.
		 */
		connectedCallback() {
			this.render();
		}

		/**
		 * Attribute changed callback, ran on page load and when an observed attribute is changed.
		 *
		 * @param {string} name   The name of the attribute that was changed.
		 * @param {string} oldVal The old value of the attribute.
		 * @param {string} newVal The new value of the attribute.
		 */
		attributeChangedCallback( name, oldVal, newVal ) {
			if ( oldVal === newVal ) {
				return;
			}

			// Update state.
			if ( name === 'data-points' || name === 'data-max-points' ) {
				this.state[ name === 'data-points' ? 'points' : 'maxPoints' ] =
					parseInt( newVal );
			} else {
				this.state[ name.replace( '-', '' ) ] = newVal;
			}

			this.updateProgress();

			this.dispatchEvent(
				new CustomEvent( 'prlp-badge-progress-bar-update', {
					detail: {
						points: this.state.points,
						maxPoints: this.state.maxPoints,
						badgeId: this.state.badgeId,
						element: this,
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
			this.shadowRoot.innerHTML = `
				<style>
				.container {
					padding: 1rem 0;
				}
				.bar {
					width: 100%;
					height: 1rem;
					background-color: var(--prpl-color-gauge-remain);
					border-radius: 0.5rem;
					position: relative;
				}
				.progress {
					height: 100%;
					background-color: var(--prpl-color-monthly);
					border-radius: 0.5rem;
					transition: width 0.4s ease;
				}
				prpl-badge {
					display: flex;
					width: 7.5rem;
					height: auto;
					position: absolute;
					top: -2.5rem;
					transition: left 0.4s ease;

					&::after {
						content: "!";
						display: flex;
						align-items: center;
						justify-content: center;
						width: 20px;
						height: 20px;
						background-color: var(--prpl-color-alert-error);
						border: 2px solid #fff;
						border-radius: 50%;
						position: absolute;
						top: 10%;
						right: 25%;
						color: #fff;
				}
				</style>
				<div class="container">
				<div class="bar">
					<div class="progress"></div>
					<prpl-badge
					badge-id="${ this.state.badgeId }"
					branding-id="${ this.state.brandingId }">
					</prpl-badge>
				</div>
				</div>
			`;

			this.progressEl = this.shadowRoot.querySelector( '.progress' );
			this.badgeEl = this.shadowRoot.querySelector( 'prpl-badge' );

			this.updateProgress();
		}

		/**
		 * Update the progress.
		 */
		updateProgress() {
			if ( ! this.progressEl || ! this.badgeEl ) {
				return;
			}

			this.progressEl.style.width = `${ this.progressPercent }%`;
			this.badgeEl.style.left = `calc(${ this.progressPercent }% - 3.75rem)`;
		}
	}
);
