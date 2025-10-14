/* global progressPlannerAjaxRequest, progressPlanner, prplSuggestedTask, alert */
/**
 * Remove Terms Without Posts recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task, progress-planner/ajax-request, progress-planner/suggested-task
 */
( function () {
	/**
	 * Remove Terms Without Posts class.
	 */
	class RemoveTermsWithoutPosts {
		/**
		 * Constructor.
		 */
		constructor() {
			this.popoverId = 'prpl-popover-remove-terms-without-posts';
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
					this.handleInteractiveTaskAction( event );
				}
			);
		}

		/**
		 * Handle interactive task action event.
		 *
		 * @param {CustomEvent} event The custom event with task context data.
		 */
		handleInteractiveTaskAction( event ) {
			this.currentTermData = {
				termId: event.detail.target_term_id,
				taxonomy: event.detail.target_taxonomy,
				termName: event.detail.target_term_name,
			};

			// Store reference to the task element that triggered this.
			this.currentTaskElement = event.target.closest(
				'.prpl-suggested-task'
			);

			// Update the popover content with the term data.
			this.updatePopoverContent(
				this.currentTermData.termId,
				this.currentTermData.taxonomy,
				this.currentTermData.termName
			);
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
				'prpl-delete-term-name'
			);
			const taxonomyElement = document.getElementById(
				'prpl-delete-term-taxonomy'
			);
			const termIdField = document.getElementById(
				'prpl-delete-term-id'
			);
			const taxonomyField = document.getElementById(
				'prpl-delete-taxonomy'
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
				const submitButton = document.getElementById(
					'prpl-delete-term-button'
				);

				// Disable button and show loading state.
				if ( submitButton ) {
					submitButton.disabled = true;
					submitButton.textContent = submitButton.textContent.replace(
						/^.*$/,
						'Deleting...'
					);
				}

				progressPlannerAjaxRequest( {
					url: progressPlanner.ajaxUrl,
					data: {
						action: 'prpl_interactive_task_submit_remove-terms-without-posts',
						_ajax_nonce: progressPlanner.nonce,
						term_id: formData.get( 'term_id' ),
						taxonomy: formData.get( 'taxonomy' ),
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
						console.error( 'Error deleting term:', error );

						// Re-enable the button.
						if ( submitButton ) {
							submitButton.disabled = false;
							submitButton.textContent =
								submitButton.textContent.replace(
									/^.*$/,
									'Delete term'
								);
						}

						// Show error message to user.
						const errorMessage =
							error?.message ||
							error?.data?.message ||
							'Failed to delete term. Please try again.';
						alert( errorMessage );
					} );
			} );
		}
	}

	// Initialize the component.
	new RemoveTermsWithoutPosts();
} )();
