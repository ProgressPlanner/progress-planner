/* global prplSuggestedTask */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: wp-api, progress-planner/suggested-task
 */

// Get the form.
const prplBlogDescriptionForm = document.getElementById(
	'prpl-blog-description-form'
);

// Add event listener to the form.
prplBlogDescriptionForm.addEventListener( 'submit', ( event ) => {
	event.preventDefault();

	// Get the form data.
	const formData = new FormData( prplBlogDescriptionForm );

	// Update the blog description.
	wp.api.loadPromise.done( () => {
		const settings = new wp.api.models.Settings( {
			description: formData.get( 'blogdescription' ),
		} );

		settings.save().then( () => {
			// Close popover.
			document
				.getElementById( 'prpl-popover-blog-description' )
				.hidePopover();
			const postId = parseInt(
				document.querySelector(
					`#prpl-suggested-tasks-list .prpl-suggested-task[data-task-id="core-blogdescription"]`
				).dataset.postId
			);
			if ( postId ) {
				prplSuggestedTask.maybeComplete( postId );
			}
		} );
	} );
} );
