/**
 * Render the Progress Planner sidebar.
 * This sidebar will display the lessons and videos for the current page.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.lessons         Array of lesson objects.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */
import { Fragment } from '@wordpress/element';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import ProgressPlannerIcon from './ProgressPlannerIcon';
import PageTypeSelector from './PageTypeSelector';
import LessonItems from './LessonItems';

export default function ProgressPlannerSidebar( {
	lessons,
	pageTypes,
	defaultPageType,
} ) {
	return (
		<Fragment>
			<PluginSidebarMoreMenuItem target="progress-planner-sidebar">
				{ __( 'Progress Planner Sidebar', 'progress-planner' ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name="progress-planner-sidebar"
				title={ __( 'Progress Planner Sidebar', 'progress-planner' ) }
				icon={ <ProgressPlannerIcon /> }
			>
				<div
					style={ {
						padding: '15px',
						borderBottom: '1px solid #ddd',
					} }
				>
					<PageTypeSelector
						pageTypes={ pageTypes }
						defaultPageType={ defaultPageType }
					/>
					<LessonItems
						lessons={ lessons }
						pageTypes={ pageTypes }
						defaultPageType={ defaultPageType }
					/>
				</div>
			</PluginSidebar>
		</Fragment>
	);
}
