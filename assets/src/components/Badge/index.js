/**
 * Badge Component
 *
 * Displays a badge image fetched from the remote SaaS server.
 * Replicates the exact behavior of the web component (prpl-badge).
 */

/**
 * Badge component.
 *
 * @param {Object}  props            - Component props.
 * @param {string}  props.badgeId    - The badge ID (e.g., "monthly-2025-m12").
 * @param {string}  props.badgeName  - The badge name for alt text.
 * @param {number}  props.brandingId - Optional branding ID.
 * @param {boolean} props.isComplete - Whether the badge is complete.
 * @return {JSX.Element} The Badge component.
 */
export default function Badge( {
	badgeId,
	badgeName,
	brandingId = 0,
	isComplete = true,
} ) {
	// Get badge config from window.progressPlannerBadge (same as web component).
	// Fallback to default remote server URL if not available (matches PHP default).
	const badgeConfig = window.progressPlannerBadge || {};
	let remoteServerRootUrl =
		badgeConfig.remoteServerRootUrl || 'https://progressplanner.com';
	const placeholderImageUrl = badgeConfig.placeholderImageUrl || '';

	// If remote server URL points to localhost, use production URL instead.
	// The badge-svg endpoint only exists on the remote server, not locally.
	if (
		remoteServerRootUrl.includes( 'localhost' ) ||
		remoteServerRootUrl.includes( '127.0.0.1' )
	) {
		remoteServerRootUrl = 'https://progressplanner.com';
	}

	// Build URL exactly like web component.
	let url = `${ remoteServerRootUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }`;
	if ( brandingId ) {
		url += `&branding_id=${ brandingId }`;
	}

	// Use inline onerror handler (same as web component).
	// Note: React's onError expects a function, but we need to replicate the inline string behavior.
	// We'll use dangerouslySetInnerHTML approach or create the img element properly.
	const handleError = ( e ) => {
		if ( placeholderImageUrl && e.target.src !== placeholderImageUrl ) {
			e.target.onerror = null; // Prevent infinite loop.
			e.target.src = placeholderImageUrl;
		}
	};

	// Determine badge name (same logic as web component).
	const displayName = badgeName && 'null' !== badgeName ? badgeName : 'Badge';

	// Apply styles matching the web component CSS.
	// CSS handles opacity/grayscale for incomplete badges via prpl-badge[complete="false"] img,
	// but since we're not using the custom element, we apply styles directly.
	const imgStyle = {
		maxWidth: '100%',
		height: 'auto',
		verticalAlign: 'bottom',
		transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
		...( ! isComplete && {
			opacity: 0.25,
			filter: 'grayscale(1)',
		} ),
	};

	return (
		<img
			src={ url }
			alt={ displayName }
			onError={ handleError }
			style={ imgStyle }
		/>
	);
}
