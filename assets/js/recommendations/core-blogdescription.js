/* global prplInteractiveTaskFormListenerSiteSettings */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListenerSiteSettings( {
	formElement: document.getElementById( 'prpl-blog-description-form' ),
	settingAPIKey: 'description',
	setting: 'blogdescription',
	taskId: 'core-blogdescription',
	popoverId: 'prpl-popover-blog-description',
} );
