/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * All in One SEO: noindex the author archive.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'aioseo-author-archive',
	popoverId: 'prpl-popover-aioseo-author-archive',
	callback: () => {
		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_aioseo-author-archive',
				nonce: progressPlanner.nonce,
			} ),
		} );
	},
} );
