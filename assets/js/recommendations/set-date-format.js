/* global prplInteractiveTaskFormListener, prplDocumentReady, progressPlanner */

/*
 * Set the site date format.
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'set-date-format',
	popoverId: 'prpl-popover-set-date-format',
	callback: () => {
		const format = document.querySelector(
			'#prpl-popover-set-date-format input[name="date_format"]:checked'
		);
		const customFormat = document.querySelector(
			'#prpl-popover-set-date-format input[name="date_format_custom"]'
		);
		console.log( format.value );
		console.log( customFormat.value );
		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_set-date-format',
				nonce: progressPlanner.nonce,
				date_format: format.value,
				date_format_custom: customFormat.value,
			} ),
		} ).then( () => {} );
	},
} );

// prplInteractiveTaskFormListener.settings( {
// 	settingAPIKey: 'date_format',
// 	setting: 'date_format',
// 	taskId: 'set-date-format',
// 	popoverId: 'prpl-popover-set-date-format',
// 	action: 'prpl_interactive_task_submit_set-date-format',
// } );

prplDocumentReady( () => {
	// Handle date format radio button clicks
	document
		.querySelectorAll(
			'#prpl-popover-set-date-format input[name="date_format"]'
		)
		.forEach( function ( input ) {
			input.addEventListener( 'click', function () {
				if ( 'date_format_custom_radio' !== this.id ) {
					const customInput = document.querySelector(
						'#prpl-popover-set-date-format input[name="date_format_custom"]'
					);
					const fieldset = customInput.closest( 'fieldset' );
					const exampleElement = fieldset.querySelector( '.example' );
					const formatText =
						this.parentElement.querySelector(
							'.format-i18n'
						).textContent;

					customInput.value = this.value;
					exampleElement.textContent = formatText;
				}
			} );
		} );

	// Handle custom date format input
	const customDateInput = document.querySelector(
		'input[name="date_format_custom"]'
	);

	customDateInput.addEventListener( 'click', function () {
		document.getElementById( 'date_format_custom_radio' ).checked = true;
	} );

	customDateInput.addEventListener( 'input', function () {
		document.getElementById( 'date_format_custom_radio' ).checked = true;

		const format = this;
		const fieldset = format.closest( 'fieldset' );
		const example = fieldset.querySelector( '.example' );

		// Debounce the event callback while users are typing.
		clearTimeout( format.dataset.timer );
		format.dataset.timer = setTimeout( function () {
			// If custom date is not empty.
			if ( format.value ) {
				// Find the spinner element within the fieldset
				const spinner = fieldset.querySelector( '.spinner' );
				if ( spinner ) {
					spinner.classList.add( 'is-active' );
				}

				// Use fetch instead of $.post
				fetch( progressPlanner.ajaxUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams( {
						action: 'date_format',
						date: format.value,
					} ),
				} )
					.then( function ( response ) {
						return response.text();
					} )
					.then( function ( data ) {
						example.textContent = data;
					} )
					.catch( function ( error ) {
						console.error( 'Error:', error );
					} )
					.finally( function () {
						if ( spinner ) {
							spinner.classList.remove( 'is-active' );
						}
					} );
			}
		}, 500 );
	} );
} );
