/* global alert, jQuery, progressPlannerSlack */

jQuery( document ).ready( function () {
	jQuery( '#test-slack-notification' ).on( 'click', function () {
		const button = jQuery( this );
		button.prop( 'disabled', true );

		jQuery.ajax( {
			url: progressPlannerSlack.ajaxUrl,
			type: 'POST',
			data: {
				action: 'progress_planner_test_slack',
				nonce: progressPlannerSlack.nonce,
			},
			success( response ) {
				if ( response.success ) {
					alert( progressPlannerSlack.i18n.testSuccess ); // eslint-disable-line no-alert
				} else {
					alert( progressPlannerSlack.i18n.testError ); // eslint-disable-line no-alert
				}
			},
			error() {
				alert( progressPlannerSlack.i18n.testError ); // eslint-disable-line no-alert
			},
			complete() {
				button.prop( 'disabled', false );
			},
		} );
	} );
} );
