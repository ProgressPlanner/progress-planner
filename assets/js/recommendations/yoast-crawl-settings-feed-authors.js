/* global prplInteractiveTaskFormListener */

/*
 * Yoast remove post authors feeds recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo',
	settingPath: JSON.stringify( [ 'remove_feed_authors' ] ),
	taskId: 'yoast-crawl-settings-feed-authors',
	popoverId: 'prpl-popover-yoast-crawl-settings-feed-authors',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
