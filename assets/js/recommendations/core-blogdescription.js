/* global prplInteractiveTaskFormListener */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener( {
	formElement: document.getElementById( 'prpl-blog-description-form' ),
	settingAPIKey: 'description',
	setting: 'blogdescription',
	taskId: 'core-blogdescription',
	popoverId: 'prpl-popover-blog-description',
} );
