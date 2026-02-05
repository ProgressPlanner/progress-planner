/**
 * Task Info Action Component.
 *
 * Renders either an external link or an info tooltip with content.
 */

import { __ } from '@wordpress/i18n';
import TaskActionButton from './TaskActionButton';
import Tooltip from '../Tooltip';
import { taskActionTooltipStyle, taskActionArrowStyle } from './styles';

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
			<TaskActionButton
				as="a"
				href={ externalUrl }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ __( 'Why is this important?', 'progress-planner' ) }
			</TaskActionButton>
		);
	}

	// Render info tooltip if content provided.
	if ( content ) {
		return (
			<Tooltip
				triggerContent={ __( 'Info', 'progress-planner' ) }
				tooltipStyle={ taskActionTooltipStyle }
				arrowStyle={ taskActionArrowStyle }
			>
				{ /* Content is pre-rendered HTML from API */ }
				<div dangerouslySetInnerHTML={ { __html: content } } />
			</Tooltip>
		);
	}

	return null;
}
