/* global prplInteractiveTaskFormListener, samplePageData */

/*
 * Core Blog Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'sample-page',
	popoverId: 'prpl-popover-sample-page',
	callback: () => {
		const post = new wp.api.models.Post( {
			id: samplePageData.postId,
		} );
		post.fetch().then( () => {
			// Handle the case when plain URL structure is used, it used to result in invalid URL (404): http://localhost:8080/index.php?rest_route=/wp/v2/prpl_recommendations/35?force=true
			const url = post.url().includes( 'rest_route=' )
				? post.url() + '&force=true'
				: post.url() + '?force=true';

			post.destroy( { url } );
		} );
	},
} );
