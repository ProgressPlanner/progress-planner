/**
 * Editor script entry point.
 *
 * Registers WordPress editor plugins for Progress Planner sidebar and post status.
 */
import { registerPlugin } from '@wordpress/plugins';
import ProgressPlannerSidebar from './components/ProgressPlannerSidebar';
import PostStatus from './components/PostStatus';

// Get editor configuration from global variable.
const editorConfig = window.progressPlannerEditor || {
	lessons: [],
	pageTypes: [],
	defaultPageType: 0,
};

// Register the sidebar plugin.
registerPlugin( 'progress-planner-sidebar', {
	render: () => (
		<ProgressPlannerSidebar
			lessons={ editorConfig.lessons }
			pageTypes={ editorConfig.pageTypes }
			defaultPageType={ editorConfig.defaultPageType }
		/>
	),
} );

// Register the post status plugin.
registerPlugin( 'progress-planner-post-status', {
	render: PostStatus,
} );
