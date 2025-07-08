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
			const taskEl = document.querySelector(
				`#prpl-suggested-tasks-list .prpl-suggested-task[data-task-id="core-blogdescription"]`
			);
			// Close popover.
			document
				.getElementById( 'prpl-popover-blog-description' )
				.hidePopover();
			const postId = parseInt( taskEl.dataset.postId );
			if ( postId ) {
				prplSuggestedTask.maybeComplete( postId );
				taskEl.setAttribute( 'data-task-action', 'celebrate' );
				document.dispatchEvent(
					new CustomEvent( 'prpl/celebrateTasks', {
						detail: {
							element: taskEl,
						},
					} )
				);
			}
		} );
	} );
} );
