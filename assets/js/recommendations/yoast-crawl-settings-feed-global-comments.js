/* global prplInteractiveTaskFormListener */

/*
 * Yoast remove global comment feeds recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo',
	settingPath: JSON.stringify( [ 'remove_feed_global_comments' ] ),
	taskId: 'yoast-crawl-settings-feed-global-comments',
	popoverId: 'prpl-popover-yoast-crawl-settings-feed-global-comments',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
