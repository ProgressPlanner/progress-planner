/* global prplInteractiveTaskFormListener */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	formElement: document.querySelector(
		'#prpl-popover-blog-description form'
	),
	settingAPIKey: 'description',
	setting: 'blogdescription',
	taskId: 'core-blogdescription',
	popoverId: 'prpl-popover-blog-description',
} );
