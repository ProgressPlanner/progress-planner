/* global customElements, HTMLElement, progressPlannerBadge */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-badge',
	class extends HTMLElement {
		constructor( badgeId ) {
			// Get parent class properties
			super();

			badgeId = badgeId || this.getAttribute( 'badge-id' );
			this.innerHTML = `
				<img
					src="${ progressPlannerBadge.remoteServerRootUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }"
					alt="${ progressPlannerBadge.l10n.badge }"
					onerror="this.onerror=null;this.src='${ progressPlannerBadge.placeholderImageUrl }';"
				/>
			`;
		}
	}
);
