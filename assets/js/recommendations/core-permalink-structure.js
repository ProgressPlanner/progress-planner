/* global prplInteractiveTaskFormListener, prplDocumentReady, progressPlanner */

/*
 * Set the permalink structure.
 *
 * Dependencies: progress-planner/recommendations/interactive-task, progress-planner/document-ready
 */

prplInteractiveTaskFormListener.customSubmit( {
	taskId: 'core-permalink-structure',
	popoverId: 'prpl-popover-core-permalink-structure',
	callback: () => {
		const customPermalinkStructure = document.querySelector(
			'#prpl-popover-core-permalink-structure input[name="prpl_custom_permalink_structure"]'
		);

		fetch( progressPlanner.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams( {
				action: 'prpl_interactive_task_submit_core-permalink-structure',
				nonce: progressPlanner.nonce,
				value: customPermalinkStructure.value,
			} ),
		} );
	},
} );

prplDocumentReady( () => {
	// Handle custom date format input, this value is what is actually submitted to the server.
	const customPermalinkStructureInput = document.querySelector(
		'#prpl-popover-core-permalink-structure input[name="prpl_custom_permalink_structure"]'
	);

	// If there is no custom permalink structure input, return.
	if ( ! customPermalinkStructureInput ) {
		return;
	}

	// Handle date format radio button clicks.
	document
		.querySelectorAll(
			'#prpl-popover-core-permalink-structure input[name="prpl_permalink_structure"]'
		)
		.forEach( function ( input ) {
			input.addEventListener( 'click', function () {
				// Dont update the custom permalink structure input if the custom radio button is checked.
				if ( 'prpl_permalink_structure_custom_radio' !== this.id ) {
					customPermalinkStructureInput.value = this.value;
				}
			} );
		} );

	// If users clicks on the custom permalink structure input, check the custom radio button.
	customPermalinkStructureInput.addEventListener( 'click', function () {
		document.getElementById(
			'prpl_permalink_structure_custom_radio'
		).checked = true;
	} );
} );
