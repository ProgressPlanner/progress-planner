/* global prplInteractiveTaskFormListener, prplDocumentReady */

/*
 * Set the site timezone.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.settings( {
	settingAPIKey: 'timezone',
	setting: 'timezone',
	taskId: 'select-timezone',
	popoverId: 'prpl-popover-select-timezone',
	action: 'prpl_interactive_task_submit_select-timezone',
} );

prplDocumentReady( () => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const timezoneSelect = document.querySelector( 'select#timezone' );
	const timezoneSaved = timezoneSelect?.dataset?.timezoneSaved || 'false';

	// Try to preselect the timezone.
	if ( timezone && timezoneSelect && 'false' === timezoneSaved ) {
		timezoneSelect.value = timezone;
	}
} );
