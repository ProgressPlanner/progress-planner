/* global prplInteractiveTaskFormListener */

/*
 * Yoast Archive Author recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	settingAPIKey: 'wpseo_titles ',
	setting: 'wpseo_titles',
	settingPath: JSON.stringify( [ 'disable-author' ] ),
	taskId: 'yoast-author-archive',
	popoverId: 'prpl-popover-yoast-author-archive',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
