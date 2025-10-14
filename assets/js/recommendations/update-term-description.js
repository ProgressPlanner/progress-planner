/* global progressPlannerAjaxRequest, progressPlanner, prplSuggestedTask, alert */
/**
 * Update Term Description recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task, progress-planner/ajax-request, progress-planner/suggested-task
 */
( function () {
	/**
	 * Update Term Description class.
	 */
	class UpdateTermDescription {
		/**
		 * Constructor.
		 */
		constructor() {
			this.popoverId = 'prpl-popover-update-term-description';
			this.currentTermData = null;
			this.currentTaskElement = null;
			this.init();
		}

		/**
		 * Initialize the component.
		 */
		init() {
			this.bindEvents();
			this.initFormListener();
		}

		/**
		 * Bind event listeners.
		 */
		bindEvents() {
			// Listen for the generic interactive task action event.
			document.addEventListener(
				'prpl-interactive-task-action',
				( event ) => {
					// Only handle events for update term description tasks.
					if (
						event.target.classList.contains(
							'prpl-update-term-description-action'
						)
					) {
						this.handleInteractiveTaskAction( event );
					}
				}
			);
		}

		/**
		 * Handle interactive task action event.
		 *
		 * @param {CustomEvent} event The custom event with task context data.
		 */
		handleInteractiveTaskAction( event ) {
			const { termId, taxonomy, termName } = event.detail;
			this.currentTermData = { termId, taxonomy, termName };

			// Store reference to the task element that triggered this.
			this.currentTaskElement = event.target.closest(
				'.prpl-suggested-task'
			);

			// Update the popover content with the term data.
			this.updatePopoverContent( termId, taxonomy, termName );
		}

		/**
		 * Update the popover content.
		 *
		 * @param {string} termId   The term ID.
		 * @param {string} taxonomy The taxonomy.
		 * @param {string} termName The term name.
		 */
		updatePopoverContent( termId, taxonomy, termName ) {
			const termNameElement = document.getElementById(
				'prpl-update-term-name'
			);
			const taxonomyElement = document.getElementById(
				'prpl-update-term-taxonomy'
			);
			const termIdField = document.getElementById(
				'prpl-update-term-id'
			);
			const taxonomyField = document.getElementById(
				'prpl-update-taxonomy'
			);
			const descriptionField = document.getElementById(
				'prpl-term-description'
			);

			if ( termNameElement ) {
				termNameElement.textContent = termName;
			}

			if ( taxonomyElement ) {
				taxonomyElement.textContent = taxonomy;
			}

			if ( termIdField ) {
				termIdField.value = termId;
			}

			if ( taxonomyField ) {
				taxonomyField.value = taxonomy;
			}

			// Clear the description field.
			if ( descriptionField ) {
				descriptionField.value = '';
			}
		}

		/**
		 * Initialize the form listener.
		 */
		initFormListener() {
			const formElement = document.querySelector(
				`#${ this.popoverId } form`
			);

			if ( ! formElement ) {
				return;
			}

			formElement.addEventListener( 'submit', ( event ) => {
				event.preventDefault();

				if ( ! this.currentTermData || ! this.currentTaskElement ) {
					return;
				}

				const formData = new FormData( formElement );

				// Validate description is not empty.
				const description = formData.get( 'description' );
				if ( ! description || description.trim() === '' ) {
					alert( 'Please enter a description.' ); // eslint-disable-line no-alert
					return;
				}

				const submitButton = document.getElementById(
					'prpl-update-term-description-button'
				);

				// Disable button and show loading state.
				if ( submitButton ) {
					submitButton.disabled = true;
					submitButton.textContent = submitButton.textContent.replace(
						/^.*$/,
						'Saving...'
					);
				}

				progressPlannerAjaxRequest( {
					url: progressPlanner.ajaxUrl,
					data: {
						action: 'prpl_interactive_task_submit_update-term-description',
						_ajax_nonce: progressPlanner.nonce,
						term_id: formData.get( 'term_id' ),
						taxonomy: formData.get( 'taxonomy' ),
						description: formData.get( 'description' ),
					},
				} )
					.then( () => {
						if ( ! this.currentTaskElement ) {
							return;
						}

						const postId = parseInt(
							this.currentTaskElement.dataset.postId
						);
						if ( ! postId ) {
							return;
						}

						// This will trigger the celebration event (confetti) as well.
						prplSuggestedTask.maybeComplete( postId ).then( () => {
							// Close popover.
							document
								.getElementById( this.popoverId )
								.hidePopover();
						} );
					} )
					.catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error(
							'Error updating term description:',
							error
						);

						// Re-enable the button.
						if ( submitButton ) {
							submitButton.disabled = false;
							submitButton.textContent =
								submitButton.textContent.replace(
									/^.*$/,
									'Save description'
								);
						}
					} );
			} );
		}
	}

	// Initialize the component.
	new UpdateTermDescription();
} )();
