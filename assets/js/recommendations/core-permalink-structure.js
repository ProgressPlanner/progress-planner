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
	// Handle custom date format input
	const customPermalinkStructureInput = document.querySelector(
		'input[name="prpl_custom_permalink_structure"]'
	);

	// Handle date format radio button clicks
	document
		.querySelectorAll(
			'#prpl-popover-core-permalink-structure input[name="prpl_permalink_structure"]'
		)
		.forEach( function ( input ) {
			input.addEventListener( 'click', function () {
				if ( 'prpl_permalink_structure_custom_radio' !== this.id ) {
					console.log( this.value );
					customPermalinkStructureInput.value = this.value;
				}
			} );
		} );

	if ( customPermalinkStructureInput ) {
		customPermalinkStructureInput.addEventListener( 'click', function () {
			document.getElementById(
				'prpl_permalink_structure_custom_radio'
			).checked = true;
		} );
	}
} );
