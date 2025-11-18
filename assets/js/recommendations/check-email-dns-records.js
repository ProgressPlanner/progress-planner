/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * Check email DNS records recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'check-email-dns-records',
	popoverId: 'prpl-popover-check-email-dns-records',
	callback: () => {
		return new Promise( ( resolve, reject ) => {
			fetch( progressPlanner.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'prpl_interactive_task_submit_check-email-dns-records',
					nonce: progressPlanner.nonce,
				} ),
			} )
				.then( ( response ) => response.json() )
				.then( ( response ) => {
					// WIP:This will close the popover and trigger the celebration event (confetti).
					resolve( { response, success: true } );
				} )
				.catch( ( error ) => {
					reject( { success: false, error } );
				} );
		} );
	},
} );
