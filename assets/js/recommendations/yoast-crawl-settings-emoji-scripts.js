/* global prplInteractiveTaskFormListener */

/*
 * Yoast remove emoji scripts recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo',
	settingPath: JSON.stringify( [ 'remove_emoji_scripts' ] ),
	taskId: 'yoast-crawl-settings-emoji-scripts',
	popoverId: 'prpl-popover-yoast-crawl-settings-emoji-scripts',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
