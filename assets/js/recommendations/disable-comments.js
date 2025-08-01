/* global prplInteractiveTaskFormListener */

/*
 * Disable Comments recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	settingAPIKey: 'default_comment_status',
	setting: 'default_comment_status',
	taskId: 'disable-comments',
	popoverId: 'prpl-popover-disable-comments',
	settingCallbackValue: () => 'closed',
} );
