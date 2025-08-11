/* global prplInteractiveTaskFormListener */

/*
 * Disable Comment Pagination recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.settings( {
	setting: 'page_comments',
	settingPath: '{}',
	taskId: 'disable-comment-pagination',
	popoverId: 'prpl-popover-disable-comment-pagination',
	settingCallbackValue: () => false,
} );
