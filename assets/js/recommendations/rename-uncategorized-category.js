/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * Set the site date format.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'rename-uncategorized-category',
	popoverId: 'prpl-popover-rename-uncategorized-category',
	callback: () => {
		const name = document.querySelector(
			'#prpl-popover-rename-uncategorized-category input[name="prpl_uncategorized_category_name"]'
		);
		const slug = document.querySelector(
			'#prpl-popover-rename-uncategorized-category input[name="prpl_uncategorized_category_slug"]'
		);

		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_rename-uncategorized-category',
				nonce: progressPlanner.nonce,
				uncategorized_category_name: name.value,
				uncategorized_category_slug: slug.value,
			} ),
		} );
	},
} );
