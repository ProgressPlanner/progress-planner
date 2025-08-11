/* global prplInteractiveTaskFormListener, prplDocumentReady */

/*
 * Set the site timezone.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.siteSettings( {
	settingAPIKey: 'timezone',
	setting: 'timezone',
	taskId: 'select-timezone',
	popoverId: 'prpl-popover-select-timezone',
} );

prplDocumentReady( () => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const timezoneSelect = document.querySelector( 'select#timezone' );
	const timezoneSaved = timezoneSelect?.dataset?.timezoneSaved || 'false';
	console.log( timezoneSelect );
	console.log( timezoneSaved );
	// Try to preselect the timezone.
	if ( timezone && timezoneSelect && 'false' === timezoneSaved ) {
		timezoneSelect.value = timezone;
	}
} );
