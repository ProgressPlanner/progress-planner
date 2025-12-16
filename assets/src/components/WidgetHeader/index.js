/**
 * WidgetHeader Component
 *
 * Renders a widget title with optional info tooltip.
 */

import { __ } from '@wordpress/i18n';

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
					<prpl-tooltip>
						<slot name="open-icon">
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
						</slot>
						<slot name="content">{ tooltipContent }</slot>
					</prpl-tooltip>
				</div>
			) }
		</h2>
	);
}
