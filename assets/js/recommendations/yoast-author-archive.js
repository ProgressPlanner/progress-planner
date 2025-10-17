/* global prplInteractiveTaskFormListener */

/*
 * Yoast author archive recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo_titles',
	settingPath: JSON.stringify( [ 'disable-author' ] ),
	taskId: 'yoast-author-archive',
	popoverId: 'prpl-popover-yoast-author-archive',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
