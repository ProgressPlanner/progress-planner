/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * LiteSpeed Cache: enable JS minification.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'litespeed-cache-js-minification',
	popoverId: 'prpl-popover-litespeed-cache-js-minification',
	callback: () => {
		return new Promise( ( resolve, reject ) => {
			fetch( progressPlanner.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'prpl_interactive_task_submit_litespeed-cache-js-minification',
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
