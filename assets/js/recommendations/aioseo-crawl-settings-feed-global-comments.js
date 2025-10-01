/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * All in One SEO: disable global comment RSS feeds.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'aioseo-crawl-settings-feed-global-comments',
	popoverId: 'prpl-popover-aioseo-crawl-settings-feed-global-comments',
	callback: () => {
		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_aioseo-crawl-settings-feed-global-comments',
				nonce: progressPlanner.nonce,
				disable_global_comment_feed: true,
			} ),
		} );
	},
} );
