/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * All in One SEO: disable author RSS feeds.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'aioseo-crawl-settings-feed-authors',
	popoverId: 'prpl-popover-aioseo-crawl-settings-feed-authors',
	callback: () => {
		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_aioseo-crawl-settings-feed-authors',
				nonce: progressPlanner.nonce,
				disable_author_feed: true,
			} ),
		} );
	},
} );
