/* global prplInteractiveTaskFormListener */

/*
 * Yoast date archive recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo_titles',
	settingPath: JSON.stringify( [ 'disable-date' ] ),
	taskId: 'yoast-date-archive',
	popoverId: 'prpl-popover-yoast-date-archive',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
