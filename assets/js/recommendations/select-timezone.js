/* global prplInteractiveTaskFormListener */

/*
 * Set the site timezone.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	settingAPIKey: 'timezone',
	setting: 'timezone',
	taskId: 'select-timezone',
	popoverId: 'prpl-popover-select-timezone',
} );
