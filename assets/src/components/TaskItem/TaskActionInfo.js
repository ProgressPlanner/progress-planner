/**
 * Task Info Action Component.
 *
 * Renders either an external link or an info tooltip with content.
 */

import { __ } from '@wordpress/i18n';

/**
 * Button styles.
 */
const STYLES = {
	button: {
		textDecoration: 'none',
		padding: 0,
		lineHeight: 1,
		background: 'none',
		border: 'none',
		cursor: 'pointer',
	},
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
 * @param {string} props.taskId      The task ID.
 * @param {string} props.taskTitle   The task title for accessibility.
 * @param {string} props.externalUrl External link URL (if provided, renders as link).
 * @param {string} props.content     HTML content for tooltip (if no external URL).
 * @return {JSX.Element|null} The info action (link or tooltip) or null if no content.
 */
export default function TaskActionInfo( {
	taskId,
	taskTitle,
	externalUrl,
	content,
} ) {
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
			<prpl-tooltip>
				<slot name="open">
					<button
						type="button"
						className="prpl-suggested-task-button"
						style={ STYLES.button }
						data-task-id={ taskId }
						data-task-title={ taskTitle }
						data-action="info"
						data-target="info"
						title={ __( 'Info', 'progress-planner' ) }
					>
						<span
							className="prpl-tooltip-action-text"
							style={ STYLES.actionText }
						>
							{ __( 'Info', 'progress-planner' ) }
						</span>
					</button>
				</slot>
				<slot name="content">
					{ /* Content is pre-rendered HTML from API */ }
					<div dangerouslySetInnerHTML={ { __html: content } } />
				</slot>
			</prpl-tooltip>
		);
	}

	return null;
}
