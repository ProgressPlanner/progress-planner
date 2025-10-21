/* global prplInteractiveTaskFormListener */

/*
 * Yoast remove global comment feeds recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */
prplInteractiveTaskFormListener.settings( {
	setting: 'wpseo_titles',
	settingPath: JSON.stringify( [ 'disable-attachment' ] ),
	taskId: 'yoast-media-pages',
	popoverId: 'prpl-popover-yoast-media-pages',
	action: 'prpl_interactive_task_submit',
	settingCallbackValue: () => true,
} );
