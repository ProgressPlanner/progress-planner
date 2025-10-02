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
		static get observedAttributes() {
			return [
				'data-badge-id',
				'data-points',
				'data-max-points',
				// 'data-branding-id',
			];
		}

		constructor() {
			super();
			this.attachShadow( { mode: 'open' } );
			this.state = {
				badgeId: this.getAttribute( 'data-badge-id' ) || '',
				points: parseInt( this.getAttribute( 'data-points' ) || '0' ),
				maxPoints: parseInt(
					this.getAttribute( 'data-max-points' ) || '10'
				),
				// brandingId: this.getAttribute( 'branding-id' ) || 0,
			};
		}

		get points() {
			return parseInt( this.getAttribute( 'data-points' ) || '0' );
		}
		set points( v ) {
			this.setAttribute( 'data-points', v );
		}

		connectedCallback() {
			this.render();
		}

		attributeChangedCallback( name, oldVal, newVal ) {
			if ( oldVal === newVal ) return;
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
						elementId: this.getAttribute( 'id' ),
						badgeId: this.state.badgeId,
						element: this,
					},
					bubbles: true,
					composed: true,
				} )
			);
		}

		get progressPercent() {
			return ( this.state.points / this.state.maxPoints ) * 100;
		}

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

		updateProgress() {
			if ( ! this.progressEl || ! this.badgeEl ) return;
			const progress = this.progressPercent;
			this.progressEl.style.width = `${ progress }%`;
			this.badgeEl.style.left = `calc(${ progress }% - 3.75rem)`;
		}
	}
);
