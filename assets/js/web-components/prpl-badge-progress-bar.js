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
		constructor( badgeId, points, maxPoints ) {
			// Get parent class properties
			super();

			badgeId = badgeId || this.getAttribute( 'badge-id' );
			points = points || this.getAttribute( 'data-points' );
			maxPoints = maxPoints || this.getAttribute( 'data-max-points' );
			const progress = ( points / maxPoints ) * 100;
			this.innerHTML = `
				<div class="prpl-badge-progress-bar-container" style="padding: 1rem 0;">
					<div
						class="prpl-badge-progress-bar"
						style="
							width: 100%;
							height: 1rem;
							background-color: var(--prpl-color-gray-1);
							border-radius: 0.5rem;
							position: relative;"
					>
						<div
							class="prpl-badge-progress-bar-progress"
							style="
								width: ${ progress }%;
								height: 100%;
								background-color: var(--prpl-color-accent-orange);
								border-radius: 0.5rem;"
						></div>
						<prpl-badge
							badge-id="${ badgeId }"
							style="
								display:flex;
								width: 5rem;
								height: 5rem;
								position: absolute;
								left: calc(${ progress }% - 2.5rem);
								top: -2.5rem;"
						></prpl-badge>
					</div>
				</div>
			`;
		}
	}
);
