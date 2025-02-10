/* global customElements, HTMLElement, progressPlannerBadge */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-badge',
	class extends HTMLElement {
		constructor( badgeId, complete = true ) {
			// Get parent class properties
			super();
			complete =
				true === complete && 'true' === this.getAttribute( 'complete' );

			badgeId = badgeId || this.getAttribute( 'badge-id' );
			this.innerHTML = `
				<img
					src="${
						progressPlannerBadge.remoteServerRootUrl
					}/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }"
					alt="Badge"
					${ false === complete ? 'style="filter: grayscale(1);opacity: 0.25;"' : '' }
					onerror="this.onerror=null;this.src='${
						progressPlannerBadge.placeholderImageUrl
					}';"
				/>
			`;
		}
	}
);
