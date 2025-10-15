/* global progressPlanner, prplInteractiveTaskFormListener */
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
			this.elements = this.getElements();
			this.init();
		}

		/**
		 * Get all DOM elements.
		 *
		 * @return {Object} Object containing all DOM elements.
		 */
		getElements() {
			const popover = document.getElementById( this.popoverId );
			return {
				popover,
				popoverTitle: popover.querySelector( '.prpl-popover-title' ),

				termNameElement: popover.querySelector(
					'#prpl-delete-term-name'
				),
				taxonomyElement: popover.querySelector(
					'#prpl-delete-term-taxonomy'
				),
				termIdField: popover.querySelector( '#prpl-delete-term-id' ),
				taxonomyField: popover.querySelector( '#prpl-delete-taxonomy' ),
			};
		}

		/**
		 * Initialize the component.
		 */
		init() {
			this.bindEvents();
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

					// After the event is handled, initialize the form listener.
					this.initFormListener();
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
			if ( this.elements.popoverTitle ) {
				this.elements.popoverTitle.textContent = postTitle;
			}

			if ( this.elements.termNameElement ) {
				this.elements.termNameElement.textContent = termName;
			}

			if ( this.elements.taxonomyElement ) {
				this.elements.taxonomyElement.textContent = taxonomy;
			}

			if ( this.elements.termIdField ) {
				this.elements.termIdField.value = termId;
			}

			if ( this.elements.taxonomyField ) {
				this.elements.taxonomyField.value = taxonomy;
			}
		}

		/**
		 * Initialize the form listener.
		 */
		initFormListener() {
			if ( ! this.currentTermData || ! this.currentTaskElement ) {
				return;
			}

			prplInteractiveTaskFormListener.customSubmit( {
				taskId: this.currentTaskElement.dataset.taskId,
				popoverId: this.popoverId,
				callback: () => {
					fetch( progressPlanner.ajaxUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams( {
							action: 'prpl_interactive_task_submit_remove-terms-without-posts',
							nonce: progressPlanner.nonce,
							term_id: this.elements.termIdField.value,
							taxonomy: this.elements.taxonomyField.value,
						} ),
					} ).then( () => {
						this.currentTaskElement = null;
						this.currentTermData = null;
					} );
				},
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
