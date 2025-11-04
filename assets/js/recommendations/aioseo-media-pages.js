/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * All in One SEO: redirect media pages.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'aioseo-media-pages',
	popoverId: 'prpl-popover-aioseo-media-pages',
	callback: () => {
		return new Promise( ( resolve, reject ) => {
			fetch( progressPlanner.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'prpl_interactive_task_submit_aioseo-media-pages',
					nonce: progressPlanner.nonce,
				} ),
			} )
				.then( ( response ) => {
					resolve( { response, success: true } );
				} )
				.catch( ( error ) => {
					reject( { success: false, error } );
				} );
		} );
	},
} );
