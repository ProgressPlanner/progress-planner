/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * LiteSpeed Cache: enable guest mode.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'litespeed-cache-guest-mode',
	popoverId: 'prpl-popover-litespeed-cache-guest-mode',
	callback: () => {
		return new Promise( ( resolve, reject ) => {
			fetch( progressPlanner.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'prpl_interactive_task_submit_litespeed-cache-guest-mode',
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
