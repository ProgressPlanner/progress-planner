/**
 * Challenge Widget Component
 *
 * Displays challenge content from remote API.
 */

import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Challenge widget component.
 *
 * @param {Object}   props         - Component props.
 * @param {Object|Array}   props.challenge - Challenge data (can be array or object).
 * @return {JSX.Element|null} The widget component or null if no challenge.
 */
export default function Challenge( { challenge } ) {
	// Handle array format (from PHP get_challenge method).
	if ( Array.isArray( challenge ) ) {
		challenge = challenge[ 0 ] || null;
	}

	if ( ! challenge || ( ! challenge.name && ! challenge.title ) ) {
		return null;
	}

	const challengeName = challenge.name || challenge.title || '';
	const challengeContent = challenge.content || '';
	const hasPromoNotice = challengeContent.includes(
		'prpl-challenge-promo-notice'
	);

	return (
		<Fragment>
			<div
				className="prpl-challenge-content"
				style={ {
					position: hasPromoNotice ? 'relative' : undefined,
				} }
			>
				{ hasPromoNotice && (
					<div
						style={ {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							background: 'var(--prpl-color-border)',
							opacity: 0.4,
							zIndex: 0,
						} }
					/>
				) }
				<div
					dangerouslySetInnerHTML={ {
						__html: challengeContent.replace(
							/{{admin_url}}/g,
							window.prplDashboardConfig?.adminUrl || ''
						),
					} }
					style={ {
						position: hasPromoNotice ? 'relative' : undefined,
						zIndex: hasPromoNotice ? 1 : undefined,
					} }
				/>
			</div>
		</Fragment>
	);
}
