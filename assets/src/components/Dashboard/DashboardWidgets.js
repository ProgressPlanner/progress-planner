/**
 * DashboardWidgets Component
 *
 * Renders all dashboard widgets in a grid layout.
 */

import { Fragment } from '@wordpress/element';
import ActivityScores from '../../widgets/ActivityScores';
import ContentActivity from '../../widgets/ContentActivity';
import ContentBadges from '../../widgets/ContentBadges';
import MonthlyBadges from '../../widgets/MonthlyBadges';
import StreakBadges from '../../widgets/StreakBadges';
import SuggestedTasks from '../../widgets/SuggestedTasks';
import TodoWidget from '../../widgets/TodoWidget';
import WhatsNew from '../../widgets/WhatsNew';

/**
 * Widget wrapper component.
 *
 * @param {Object}      props                 - Component props.
 * @param {string}      props.id              - Widget ID.
 * @param {number}      props.width           - Widget width (1 or 2).
 * @param {boolean}     props.forceLastColumn - Force to last column.
 * @param {string}      props.titleHtml       - Widget title HTML.
 * @param {JSX.Element} props.children        - Widget content.
 * @return {JSX.Element} The widget wrapper.
 */
function WidgetWrapper( {
	id,
	width = 1,
	forceLastColumn = false,
	titleHtml,
	children,
} ) {
	// Widget-specific styles
	const widgetStyles = {};
	const innerContainerStyles = {};

	// Todo widget: padding-left: 0 on wrapper, padding-left on children
	if ( id === 'todo' ) {
		widgetStyles.paddingLeft = 0;
		innerContainerStyles.paddingLeft = 'var(--prpl-padding)';
	}

	// Badge streak widgets: flex layout
	if (
		id === 'badge-streak' ||
		id === 'badge-streak-content' ||
		id === 'badge-streak-maintenance'
	) {
		widgetStyles.display = 'flex';
		widgetStyles.flexDirection = 'column';
		widgetStyles.justifyContent = 'space-between';
	}

	// Monthly badges: grid positioning for large screens
	if ( id === 'monthly-badges' ) {
		// Apply via media query would require CSS, but we can set base styles
		// The grid positioning is handled by CSS grid auto-flow
	}

	return (
		<div
			className={ `prpl-widget-wrapper prpl-${ id } prpl-widget-width-${ width }` }
			data-force-last-column={ forceLastColumn ? 1 : 0 }
			style={ widgetStyles }
		>
			<div
				className="widget-inner-container"
				style={ innerContainerStyles }
			>
				{ titleHtml && (
					<div
						className="prpl-widget-title"
						dangerouslySetInnerHTML={ { __html: titleHtml } }
						style={ {
							marginTop: 0,
							fontSize: '1.375rem',
							lineHeight: 1.2,
						} }
					/>
				) }
				{ children }
			</div>
		</div>
	);
}

/**
 * DashboardWidgets component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration.
 * @return {JSX.Element} The DashboardWidgets component.
 */
export default function DashboardWidgets( { config } ) {
	const { widgets = [] } = config;

	/**
	 * Map widget ID to React component.
	 *
	 * @param {string} widgetId     - Widget ID.
	 * @param {Object} widgetConfig - Widget configuration.
	 * @return {JSX.Element|null} The widget component.
	 */
	const renderWidget = ( widgetId, widgetConfig ) => {
		const widgetMap = {
			'suggested-tasks': SuggestedTasks,
			todo: TodoWidget,
			'monthly-badges': MonthlyBadges,
			'badge-streak-content': ContentBadges,
			'badge-streak-maintenance': StreakBadges,
			'activity-scores': ActivityScores,
			'content-activity': ContentActivity,
			'whats-new': WhatsNew,
		};

		const WidgetComponent = widgetMap[ widgetId ];
		if ( ! WidgetComponent ) {
			return null;
		}

		return (
			<WidgetWrapper
				key={ widgetId }
				id={ widgetId }
				width={ widgetConfig.width || 1 }
				forceLastColumn={ widgetConfig.forceLastColumn || false }
				titleHtml={ widgetConfig.titleHtml }
			>
				<WidgetComponent config={ widgetConfig.config || {} } />
			</WidgetWrapper>
		);
	};

	return (
		<Fragment>
			{ widgets.map( ( widget ) => renderWidget( widget.id, widget ) ) }
		</Fragment>
	);
}
