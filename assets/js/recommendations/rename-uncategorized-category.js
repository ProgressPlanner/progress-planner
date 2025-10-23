/* global prplInteractiveTaskFormListener, progressPlanner, prplDocumentReady */

/*
 * Rename the Uncategorized category.
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

prplDocumentReady( () => {
	const name = document.querySelector(
		'#prpl-popover-rename-uncategorized-category input[name="prpl_uncategorized_category_name"]'
	);
	const slug = document.querySelector(
		'#prpl-popover-rename-uncategorized-category input[name="prpl_uncategorized_category_slug"]'
	);

	if ( ! name || ! slug ) {
		return;
	}

	// Function to check if both fields are valid and toggle button state
	const toggleSubmitButton = () => {
		const submitButton = document.querySelector(
			'#prpl-popover-rename-uncategorized-category button[type="submit"]'
		);
		const isNameValid =
			name.value &&
			name.value.toLowerCase() !== name.placeholder.toLowerCase();
		const isSlugValid =
			slug.value &&
			slug.value.toLowerCase() !== slug.placeholder.toLowerCase();

		submitButton.disabled = ! ( isNameValid && isSlugValid );
	};

	// If there is no name or slug or it is the same as placeholder the submit button should be disabled.
	toggleSubmitButton();

	// Add event listeners to both fields
	name.addEventListener( 'input', toggleSubmitButton );
	slug.addEventListener( 'input', toggleSubmitButton );
} );
