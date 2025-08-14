/* global customElements, HTMLElement, progressPlannerBadge, prplL10n */
/*
 * Badge
 *
 * A web component to display a badge.
 *
 * Dependencies: progress-planner/l10n
 */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-badge',
	class extends HTMLElement {
		constructor( badgeId, brandingId = 0 ) {
			// Get parent class properties
			super();

			badgeId = badgeId || this.getAttribute( 'badge-id' );
			brandingId = brandingId || this.getAttribute( 'branding-id' );

			let url = `${ progressPlannerBadge.remoteServerRootUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }`;
			if ( brandingId ) {
				url += `&branding_id=${ brandingId }`;
			}

			this.innerHTML = `
				<img
					src="${ url }"
					alt="${ prplL10n( 'badge' ) }"
					onerror="this.onerror=null;this.src='${
						progressPlannerBadge.placeholderImageUrl
					}';"
				/>
			`;
		}
	}
);
