/**
 * Task Info Action Component.
 *
 * Renders either an external link or an info tooltip with content.
 */

import { __ } from '@wordpress/i18n';
import Tooltip from '../Tooltip';

/**
 * Button styles.
 */
const STYLES = {
	actionText: {
		lineHeight: 1,
		fontSize: 'var(--prpl-font-size-small)',
		color: 'var(--prpl-color-link)',
	},
	link: {
		textDecoration: 'none',
	},
};

/**
 * Task Info Action component.
 *
 * @param {Object} props             Component props.
 * @param {string} props.externalUrl External link URL (if provided, renders as link).
 * @param {string} props.content     HTML content for tooltip (if no external URL).
 * @return {JSX.Element|null} The info action (link or tooltip) or null if no content.
 */
export default function TaskActionInfo( { externalUrl, content } ) {
	// Render external link if URL provided.
	if ( externalUrl ) {
		return (
			<a
				className="prpl-tooltip-action-text"
				style={ { ...STYLES.actionText, ...STYLES.link } }
				href={ externalUrl }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ __( 'Why is this important?', 'progress-planner' ) }
			</a>
		);
	}

	// Render info tooltip if content provided.
	if ( content ) {
		return (
			<Tooltip
				triggerContent={
					<span
						className="prpl-tooltip-action-text"
						style={ STYLES.actionText }
					>
						{ __( 'Info', 'progress-planner' ) }
					</span>
				}
			>
				{ /* Content is pre-rendered HTML from API */ }
				<div dangerouslySetInnerHTML={ { __html: content } } />
			</Tooltip>
		);
	}

	return null;
}
