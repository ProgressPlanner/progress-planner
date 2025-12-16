/* global prplInteractiveTaskFormListener, progressPlanner, prplDocumentReady */

/*
 * Set page settings (About, Contact, FAQ, etc.)
 *
 * Dependencies: progress-planner/recommendations/interactive-task
 */

// Initialize custom submit handlers for all set-page tasks.
prplDocumentReady( function () {
	// Find all set-page popovers.
	const popovers = document.querySelectorAll(
		'[id^="prpl-popover-set-page-"]'
	);

	popovers.forEach( function ( popover ) {
		// Extract page name from popover ID (e.g., "prpl-popover-set-page-about" -> "about")
		const popoverId = popover.id;
		const match = popoverId.match( /prpl-popover-set-page-(.+)/ );
		if ( ! match ) {
			return;
		}

		const pageName = match[ 1 ];
		const taskId = 'set-page-' + pageName;

		// Skip if already initialized.
		if ( popover.dataset.setPageInitialized ) {
			return;
		}
		popover.dataset.setPageInitialized = 'true';

		prplInteractiveTaskFormListener.customSubmit( {
			taskId,
			popoverId,
			callback: () => {
				return new Promise( ( resolve, reject ) => {
					const pageValue = document.querySelector(
						'#' +
							popoverId +
							' input[name="pages[' +
							pageName +
							'][have_page]"]:checked'
					);

					if ( ! pageValue ) {
						reject( {
							success: false,
							error: new Error( 'Page value not found' ),
						} );
						return;
					}

					const pageId = document.querySelector(
						'#' +
							popoverId +
							' select[name="pages[' +
							pageName +
							'][id]"]'
					);

					fetch( progressPlanner.ajaxUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams( {
							action: 'prpl_interactive_task_submit_set-page',
							nonce: progressPlanner.nonce,
							have_page: pageValue.value,
							id: pageId ? pageId.value : '',
							task_id: taskId,
						} ),
					} )
						.then( ( response ) => response.json() )
						.then( ( data ) => {
							if ( data.success ) {
								resolve( { response: data, success: true } );
							} else {
								reject( { success: false, error: data } );
							}
						} )
						.catch( ( error ) => {
							reject( { success: false, error } );
						} );
				} );
			},
		} );
	} );
} );

const prplTogglePageSelectorSettingVisibility = function ( page, value ) {
	const itemRadiosWrapperEl = document.querySelector(
		`.prpl-pages-item-${ page } .radios`
	);

	if ( ! itemRadiosWrapperEl ) {
		return;
	}

	const selectPageWrapper =
		itemRadiosWrapperEl.querySelector( '.prpl-select-page' );

	if ( ! selectPageWrapper ) {
		return;
	}

	// Show only create button.
	if ( 'no' === value || 'not-applicable' === value ) {
		// Hide <select> wrapper.
		selectPageWrapper.style.visibility = 'hidden';
	}

	// Show only select and edit button.
	if ( 'yes' === value ) {
		// Show <select> wrapper.
		selectPageWrapper.style.visibility = 'visible';
	}
};

prplDocumentReady( function () {
	document
		.querySelectorAll( 'input[type="radio"][data-page]' )
		.forEach( function ( radio ) {
			const page = radio.getAttribute( 'data-page' ),
				value = radio.value;

			if ( radio ) {
				// Show/hide the page selector setting if radio is checked.
				if ( radio.checked ) {
					prplTogglePageSelectorSettingVisibility( page, value );
				}

				// Add listeners for all radio buttons.
				radio.addEventListener( 'change', function () {
					prplTogglePageSelectorSettingVisibility( page, value );
				} );
			}
		} );
} );
