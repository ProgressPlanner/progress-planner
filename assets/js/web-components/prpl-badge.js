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
		constructor( badgeId, badgeName ) {
			// Get parent class properties
			super();

			badgeId = badgeId || this.getAttribute( 'badge-id' );
			badgeName = badgeName || this.getAttribute( 'badge-name' );
			badgeName = badgeName || `${ prplL10n( 'badge' ) }`;

			this.innerHTML = `
				<img
					src="${ progressPlannerBadge.remoteServerRootUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }"
					alt="${ badgeName }"
					onerror="this.onerror=null;this.src='${ progressPlannerBadge.placeholderImageUrl }';"
				/>
			`;
		}
	}
);
