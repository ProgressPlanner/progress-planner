/* global progressPlanner, prplSuggestedTask */
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
			this.popover = document.getElementById( this.popoverId );
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
				'prpl-interactive-task-action-remove-terms-without-posts',
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
				termId: this.decodeHtmlEntities( event.detail.target_term_id ),
				taxonomy: this.decodeHtmlEntities(
					event.detail.target_taxonomy
				),
				termName: this.decodeHtmlEntities(
					event.detail.target_term_name
				),
			};

			// Store reference to the task element that triggered this.
			this.currentTaskElement = event.target.closest(
				'.prpl-suggested-task'
			);

			// Update the popover content with the term data.
			this.updatePopoverContent(
				this.currentTermData.termId,
				this.currentTermData.taxonomy,
				this.currentTermData.termName,
				this.decodeHtmlEntities( event.detail.post_title )
			);
		}

		/**
		 * Update the popover content.
		 *
		 * @param {string} termId    The term ID.
		 * @param {string} taxonomy  The taxonomy.
		 * @param {string} termName  The term name.
		 * @param {string} postTitle The post title.
		 */
		updatePopoverContent( termId, taxonomy, termName, postTitle ) {
			const popoverTitle = this.popover.querySelector(
				'.prpl-popover-title'
			);

			const termNameElement = this.popover.querySelector(
				'#prpl-delete-term-name'
			);
			const taxonomyElement = this.popover.querySelector(
				'#prpl-delete-term-taxonomy'
			);
			const termIdField = this.popover.querySelector(
				'#prpl-delete-term-id'
			);
			const taxonomyField = this.popover.querySelector(
				'#prpl-delete-taxonomy'
			);

			if ( popoverTitle ) {
				popoverTitle.textContent = postTitle;
			}

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

				fetch( progressPlanner.ajaxUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams( {
						action: 'prpl_interactive_task_submit_remove-terms-without-posts',
						_ajax_nonce: progressPlanner.nonce,
						term_id: formData.get( 'term_id' ),
						taxonomy: formData.get( 'taxonomy' ),
					} ),
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
					} );
			} );
		}

		/**
		 * Decodes HTML entities in a string (like &quot;, &amp;, etc.)
		 * @param {string} str The string to decode.
		 * @return {string} The decoded string.
		 */
		decodeHtmlEntities( str ) {
			if ( typeof str !== 'string' ) {
				return str;
			}

			return str
				.replace( /&quot;/g, '"' )
				.replace( /&#039;/g, "'" )
				.replace( /&lt;/g, '<' )
				.replace( /&gt;/g, '>' )
				.replace( /&amp;/g, '&' );
		}
	}

	// Initialize the component.
	new RemoveTermsWithoutPosts();
} )();
