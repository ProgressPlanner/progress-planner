/* global prplInteractiveTaskFormListener, progressPlanner */

/*
 * Set valuable post types.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'set-valuable-post-types',
	popoverId: 'prpl-popover-set-valuable-post-types',
	callback: () => {
		return new Promise( ( resolve, reject ) => {
			const postTypes = document.querySelectorAll(
				'#prpl-popover-set-valuable-post-types input[name="prpl-post-types-include[]"]:checked'
			);

			if ( ! postTypes.length ) {
				reject( {
					success: false,
					error: new Error( 'No post types selected' ),
				} );
				return;
			}

			const postTypesValues = Array.from( postTypes ).map(
				( type ) => type.value
			);

			fetch( progressPlanner.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'prpl_interactive_task_submit_set-valuable-post-types',
					nonce: progressPlanner.nonce,
					'prpl-post-types-include': postTypesValues,
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
