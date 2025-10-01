/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * All in One SEO: noindex the date archive.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'aioseo-date-archive',
	popoverId: 'prpl-popover-aioseo-date-archive',
	callback: () => {
		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_aioseo-date-archive',
				nonce: progressPlanner.nonce,
			} ),
		} );
	},
} );
