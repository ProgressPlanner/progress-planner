/* global prplInteractiveTaskFormListener */

/*
 * Select Locale recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.settings( {
	settingAPIKey: 'language',
	setting: 'language',
	taskId: 'select-locale',
	popoverId: 'prpl-popover-select-locale',
	action: 'prpl_interactive_task_submit_select-locale',
} );
