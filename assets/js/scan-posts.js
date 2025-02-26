/* global progressPlanner, progressPlannerAjaxRequest, prplOnboardRedirect */
/*
 * Scan Posts
 *
 * A script to scan posts for the Progress Planner.
 *
 * Dependencies: progress-planner-ajax-request, progress-planner-upgrade-tasks
 */

const progressPlannerTriggerScan = () => {
	document.getElementById( 'progress-planner-scan-progress' ).style.display =
		'block';

	return new Promise( async ( resolve, reject ) => {
		const progressBar = document.querySelector(
			'#progress-planner-scan-progress progress'
		);
		let failCount = 0;
		let isComplete = false;

		while ( ! isComplete && 10 >= failCount ) {
			try {
				const response = await progressPlannerAjaxRequest( {
					url: progressPlanner.ajaxUrl,
					data: {
						action: 'progress_planner_scan_posts',
						_ajax_nonce: progressPlanner.nonce,
					},
				} );

				if ( response.data.progress > progressBar.value ) {
					progressBar.value = response.data.progress;
				}

				console.info(
					`Progress: ${ response.data.progress }%, (${ response.data.lastScanned }/${ response.data.lastPage })`
				);

				if ( 100 <= response.data.progress ) {
					document.getElementById(
						'progress-planner-scan-progress'
					).style.display = 'none';

					resolve();
					isComplete = true; // Stops the loop.
				}

				failCount = 0; // Reset fail count on success.
			} catch ( error ) {
				failCount++;
				console.warn( 'Failed to scan posts. Retrying...', error );
			}

			// 200ms delay between retries.
			if ( ! isComplete && 10 >= failCount ) {
				await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );
			}
		}

		if ( 10 <= failCount ) {
			reject( new Error( 'Max scan failures reached' ) );
		}
	} );
};

if ( document.getElementById( 'prpl-scan-button' ) ) {
	document
		.getElementById( 'prpl-scan-button' )
		.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			document.getElementById( 'prpl-scan-button' ).disabled = true;
			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'progress_planner_reset_posts_data',
					_ajax_nonce: progressPlanner.nonce,
				},
				successAction: progressPlannerTriggerScan,
				failAction: progressPlannerTriggerScan,
			} );
		} );
}
