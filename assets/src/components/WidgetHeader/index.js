/**
 * WidgetHeader Component
 *
 * Renders a widget title with optional info tooltip.
 */

import { __ } from '@wordpress/i18n';
import Tooltip from '../Tooltip';

/**
 * WidgetHeader component.
 *
 * @param {Object} props                - Component props.
 * @param {string} props.title          - Widget title.
 * @param {string} props.infoIconSvg    - SVG markup for the info icon.
 * @param {string} props.tooltipContent - Content to display in the tooltip.
 * @param {string} props.className      - Optional additional CSS class.
 * @return {JSX.Element} The widget header.
 */
export default function WidgetHeader( {
	title,
	infoIconSvg = '',
	tooltipContent = '',
	className = '',
} ) {
	const hasTooltip = infoIconSvg && tooltipContent;

	return (
		<h2
			className={ `prpl-widget-title${
				className ? ` ${ className }` : ''
			}` }
		>
			{ title }
			{ hasTooltip && (
				<div className="tooltip-actions">
					<Tooltip
						triggerContent={
							<span className="icon prpl-info-icon">
								<span
									dangerouslySetInnerHTML={ {
										__html: infoIconSvg,
									} }
								/>
								<span className="screen-reader-text">
									{ __( 'More info', 'progress-planner' ) }
								</span>
							</span>
						}
					>
						{ tooltipContent }
					</Tooltip>
				</div>
			) }
		</h2>
	);
}
