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

			// Badge URLs come from the site's brand; a badge the brand does not have shows the placeholder.
			const url =
				progressPlannerBadge.badgeUrls[ badgeId ] ||
				progressPlannerBadge.placeholderImageUrl;

			if ( ! badgeName || 'null' === badgeName ) {
				badgeName = `${ prplL10n( 'badge' ) }`;
			}

			this.innerHTML = `
				<img
					src="${ url }"
					alt="${ badgeName }"
					onerror="this.onerror=null;this.src='${ progressPlannerBadge.placeholderImageUrl }';"
					style="max-width: 100%; height: auto%;"
				/>
			`;
		}
	}
);
