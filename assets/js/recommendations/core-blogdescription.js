/* global prplInteractiveTaskFormListener */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	settingAPIKey: 'description',
	setting: 'blogdescription',
	taskId: 'core-blogdescription',
	popoverId: 'prpl-popover-core-blogdescription',
} );

document
	.querySelector( 'input#blogdescription' )
	?.addEventListener( 'input', function ( e ) {
		const button = document.querySelector(
			'[popover-id="prpl-popover-core-blogdescription"] button[type="submit"]'
		);
		button.disabled = e.target.value.length === 0;
	} );
