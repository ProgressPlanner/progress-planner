/* global prplInteractiveTaskFormListener */

/*
 * Disable Comment Pagination recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	settingAPIKey: 'page_comments',
	setting: 'page_comments',
	taskId: 'disable-comment-pagination',
	popoverId: 'prpl-popover-disable-comment-pagination',
	settingCallbackValue: () => '',
} );
