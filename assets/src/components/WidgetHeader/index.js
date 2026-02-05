/**
 * WidgetHeader Component
 *
 * Renders a widget title with optional info tooltip.
 */

import { __ } from '@wordpress/i18n';
import Tooltip from '../Tooltip';
import Icon from '../Icon';

const TOOLTIP_ACTIONS_STYLE = {
	display: 'flex',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	position: 'relative',
};

const ICON_STYLE = {
	width: '1.25rem',
	height: '1.25rem',
	display: 'inline-block',
	verticalAlign: 'bottom',
	color: '#6b7280',
};

/**
 * WidgetHeader component.
 *
 * @param {Object} props                - Component props.
 * @param {string} props.title          - Widget title.
 * @param {string} props.tooltipContent - Content to display in the tooltip.
 * @param {string} props.className      - Optional additional CSS class.
 * @return {JSX.Element} The widget header.
 */
export default function WidgetHeader( {
	title,
	tooltipContent = '',
	className = '',
} ) {
	return (
		<h2
			className={ `prpl-widget-title${
				className ? ` ${ className }` : ''
			}` }
		>
			{ title }
			{ tooltipContent && (
				<div style={ TOOLTIP_ACTIONS_STYLE }>
					<Tooltip
						triggerContent={
							<span style={ ICON_STYLE }>
								<Icon name="info" />
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
