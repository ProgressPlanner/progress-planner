/**
 * Badge Component
 *
 * Displays a badge image fetched from the remote SaaS server.
 */

import { useState, useCallback } from '@wordpress/element';

/**
 * Badge component.
 *
 * @param {Object}  props                 - Component props.
 * @param {string}  props.badgeId         - The badge ID (e.g., "monthly-2025-m12").
 * @param {string}  props.badgeName       - The badge name for alt text.
 * @param {number}  props.brandingId      - Optional branding ID.
 * @param {string}  props.remoteServerUrl - Remote server URL for badge SVGs.
 * @param {string}  props.placeholderUrl  - Placeholder image URL for errors.
 * @param {boolean} props.isComplete      - Whether the badge is complete.
 * @return {JSX.Element} The Badge component.
 */
export default function Badge( {
	badgeId,
	badgeName,
	brandingId = 0,
	remoteServerUrl,
	placeholderUrl,
	isComplete = true,
} ) {
	const [ hasError, setHasError ] = useState( false );

	/**
	 * Build the badge SVG URL.
	 *
	 * @return {string} The badge URL.
	 */
	const getBadgeUrl = useCallback( () => {
		let url = `${ remoteServerUrl }/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${ badgeId }`;
		if ( brandingId ) {
			url += `&branding_id=${ brandingId }`;
		}
		return url;
	}, [ badgeId, brandingId, remoteServerUrl ] );

	/**
	 * Handle image load error.
	 */
	const handleError = useCallback( () => {
		if ( ! hasError && placeholderUrl ) {
			setHasError( true );
		}
	}, [ hasError, placeholderUrl ] );

	// Apply grayscale/opacity for incomplete badges (matching original CSS)
	const imgStyle = {
		maxWidth: '100%',
		height: 'auto',
		verticalAlign: 'bottom',
		transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
		...( isComplete ? {} : { opacity: 0.25, filter: 'grayscale(1)' } ),
	};

	return (
		<img
			className="prpl-badge__image"
			src={ hasError ? placeholderUrl : getBadgeUrl() }
			alt={ badgeName || 'Badge' }
			onError={ handleError }
			style={ imgStyle }
		/>
	);
}
