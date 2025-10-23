/* global prplInteractiveTaskFormListener */

/*
 * Yoast format archive recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo_titles',
	settingPath: JSON.stringify( [ 'disable-post_format' ] ),
	taskId: 'yoast-format-archive',
	popoverId: 'prpl-popover-yoast-format-archive',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
