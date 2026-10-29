/* global progressPlannerAjaxRequest, progressPlanner */
/**
 * AI Task Handler
 *
 * Handles execution of AI-powered tasks from the SaaS server.
 *
 * Dependencies: progress-planner/suggested-task, progress-planner/ajax-request, progress-planner/web-components/prpl-ai-task-popover
 */
( function () {
	/**
	 * AI Task class.
	 */
	class AITask {
		/**
		 * Constructor.
		 */
		constructor() {
			this.popoverId = 'prpl-popover-ai-task';

			// Early return if the popover is not found.
			if ( ! document.getElementById( this.popoverId ) ) {
				return;
			}

			this.currentTaskData = null;
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
				webComponent: popover.querySelector( 'prpl-ai-task-popover' ),
				executeButton: popover.querySelector( '.prpl-ai-task-execute' ),
				retryButton: popover.querySelector( '.prpl-ai-task-retry' ),
				completeButton: popover.querySelector(
					'.prpl-ai-task-complete'
				),
				instructionsEl: popover.querySelector(
					'.prpl-ai-task-instructions'
				),
				loadingEl: popover.querySelector( '.prpl-ai-task-loading' ),
				resultEl: popover.querySelector( '.prpl-ai-task-result' ),
				responseEl: popover.querySelector( '.prpl-ai-task-response' ),
				errorEl: popover.querySelector( '.prpl-ai-task-error' ),
				errorMessageEl: popover.querySelector( '.prpl-error-message' ),
				promptEl: popover.querySelector( '.prpl-ai-task-prompt' ),
				promptTextEl: popover.querySelector(
					'.prpl-ai-task-prompt-text'
				),
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
				'prpl-interactive-task-action-ai-task',
				( event ) => {
					this.handleInteractiveTaskAction( event );
				}
			);

			// Execute button click handler.
			if ( this.elements.executeButton ) {
				this.elements.executeButton.addEventListener( 'click', () => {
					if ( this.currentTaskData?.taskId ) {
						this.executeTask(
							parseInt( this.currentTaskData.taskId )
						);
					} else {
						console.error( 'No task ID found' );
						this.showError(
							'Task ID not found. Please try again.'
						);
					}
				} );
			}

			// Retry button click handler.
			if ( this.elements.retryButton ) {
				this.elements.retryButton.addEventListener( 'click', () => {
					if ( this.currentTaskData?.taskId ) {
						this.executeTask(
							parseInt( this.currentTaskData.taskId )
						);
					} else {
						console.error( 'No task ID found' );
						this.showError(
							'Task ID not found. Please try again.'
						);
					}
				} );
			}
		}

		/**
		 * Handle interactive task action event.
		 *
		 * @param {CustomEvent} event The custom event with task context data.
		 */
		handleInteractiveTaskAction( event ) {
			this.currentTaskData = {
				taskId: this.decodeHtmlEntities( event.detail.remote_task_id ),
				taskPrompt: this.decodeHtmlEntities( event.detail.task_prompt ),
			};

			// Store reference to the task element that triggered this.
			this.currentTaskElement = event.target.closest(
				'.prpl-suggested-task'
			);

			// Update the web component with current task data.
			if ( this.elements.webComponent && this.currentTaskElement ) {
				this.elements.webComponent.setAttribute(
					'data-task-id',
					this.currentTaskData.taskId
				);
				this.elements.webComponent.setAttribute(
					'current-task-id',
					this.currentTaskElement.dataset.taskId
				);
			}

			// Update the popover content with the task data.
			this.updatePopoverContent(
				this.currentTaskData.taskId,
				this.currentTaskData.taskPrompt
			);

			// Reset popover state.
			this.resetPopoverState();
		}

		/**
		 * Update the popover content.
		 *
		 * @param {string} taskId     The task ID.
		 * @param {string} taskPrompt The task prompt.
		 */
		updatePopoverContent( taskId, taskPrompt ) {
			// Display task prompt if available.
			if ( taskPrompt && this.elements.promptTextEl ) {
				this.elements.promptTextEl.textContent = taskPrompt;
				if ( this.elements.promptEl ) {
					this.elements.promptEl.style.display = 'block';
				}
			} else if ( this.elements.promptEl ) {
				this.elements.promptEl.style.display = 'none';
			}

			// Store task ID on buttons as backup.
			if ( this.elements.executeButton ) {
				this.elements.executeButton.dataset.taskId = taskId;
			}
			if ( this.elements.retryButton ) {
				this.elements.retryButton.dataset.taskId = taskId;
			}
		}

		/**
		 * Reset popover state to initial view.
		 */
		resetPopoverState() {
			if ( this.elements.instructionsEl ) {
				this.elements.instructionsEl.style.display = 'block';
			}
			if ( this.elements.loadingEl ) {
				this.elements.loadingEl.style.display = 'none';
			}
			if ( this.elements.resultEl ) {
				this.elements.resultEl.style.display = 'none';
			}
			if ( this.elements.errorEl ) {
				this.elements.errorEl.style.display = 'none';
			}
			if ( this.elements.executeButton ) {
				this.elements.executeButton.style.display = 'inline-block';
			}
			if ( this.elements.retryButton ) {
				this.elements.retryButton.style.display = 'none';
			}
			if ( this.elements.completeButton ) {
				this.elements.completeButton.style.display = 'none';
			}
		}

		/**
		 * Show loading state.
		 */
		showLoading() {
			if ( this.elements.executeButton ) {
				this.elements.executeButton.style.display = 'none';
			}
			if ( this.elements.retryButton ) {
				this.elements.retryButton.style.display = 'none';
			}
			if ( this.elements.completeButton ) {
				this.elements.completeButton.style.display = 'none';
			}
			if ( this.elements.instructionsEl ) {
				this.elements.instructionsEl.style.display = 'none';
			}
			if ( this.elements.loadingEl ) {
				this.elements.loadingEl.style.display = 'block';
			}
			if ( this.elements.resultEl ) {
				this.elements.resultEl.style.display = 'none';
			}
			if ( this.elements.errorEl ) {
				this.elements.errorEl.style.display = 'none';
			}
		}

		/**
		 * Show result state.
		 *
		 * @param {string}  response - The AI response text.
		 * @param {boolean} cached   - Whether the response was cached.
		 */
		showResult( response, cached = false ) {
			if ( this.elements.instructionsEl ) {
				this.elements.instructionsEl.style.display = 'none';
			}
			if ( this.elements.loadingEl ) {
				this.elements.loadingEl.style.display = 'none';
			}
			if ( this.elements.executeButton ) {
				this.elements.executeButton.style.display = 'none';
			}
			if ( this.elements.retryButton ) {
				this.elements.retryButton.style.display = 'none';
			}
			if ( this.elements.errorEl ) {
				this.elements.errorEl.style.display = 'none';
			}
			if ( this.elements.resultEl ) {
				this.elements.resultEl.style.display = 'block';
			}
			if ( this.elements.completeButton ) {
				this.elements.completeButton.style.display = 'inline-block';
			}

			// Format the response with markdown-like formatting.
			const formattedResponse = this.formatAIResponse( response );
			if ( this.elements.responseEl ) {
				this.elements.responseEl.innerHTML = formattedResponse;
			}

			// Add cached indicator if applicable.
			if ( cached && this.elements.responseEl ) {
				const cachedIndicator = document.createElement( 'p' );
				cachedIndicator.className = 'prpl-ai-cached-indicator';
				cachedIndicator.style.fontSize = '0.9em';
				cachedIndicator.style.color = '#666';
				cachedIndicator.style.marginTop = '10px';
				cachedIndicator.textContent = '(Cached result)';
				this.elements.responseEl.appendChild( cachedIndicator );
			}
		}

		/**
		 * Show error state.
		 *
		 * @param {string} message - The error message.
		 */
		showError( message ) {
			if ( this.elements.instructionsEl ) {
				this.elements.instructionsEl.style.display = 'none';
			}
			if ( this.elements.loadingEl ) {
				this.elements.loadingEl.style.display = 'none';
			}
			if ( this.elements.executeButton ) {
				this.elements.executeButton.style.display = 'none';
			}
			if ( this.elements.retryButton ) {
				this.elements.retryButton.style.display = 'inline-block';
			}
			if ( this.elements.completeButton ) {
				this.elements.completeButton.style.display = 'none';
			}
			if ( this.elements.resultEl ) {
				this.elements.resultEl.style.display = 'none';
			}
			if ( this.elements.errorEl ) {
				this.elements.errorEl.style.display = 'block';
			}
			if ( this.elements.errorMessageEl ) {
				this.elements.errorMessageEl.textContent = message;
			}
		}

		/**
		 * Format AI response with basic HTML formatting.
		 *
		 * @param {string} text - The raw AI response text.
		 * @return {string} Formatted HTML string.
		 */
		formatAIResponse( text ) {
			if ( ! text ) {
				return '';
			}

			// Convert line breaks to paragraphs.
			const paragraphs = text.split( /\n\n+/ ).map( ( p ) => {
				const trimmed = p.trim();
				if ( ! trimmed ) {
					return '';
				}
				// Replace single line breaks with <br>.
				const formatted = trimmed.replace( /\n/g, '<br>' );
				return `<p>${ formatted }</p>`;
			} );

			return paragraphs.join( '' );
		}

		/**
		 * Execute the AI task.
		 *
		 * @param {number} taskId - The server task ID.
		 */
		executeTask( taskId ) {
			if ( ! taskId ) {
				this.showError( 'Invalid task ID.' );
				return;
			}

			this.showLoading();

			// Make AJAX request to execute the AI task.
			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'prpl_execute_ai_task',
					task_id: taskId,
					nonce: progressPlanner.nonce,
				},
			} )
				.then( ( response ) => {
					if ( ! response.success ) {
						const errorMessage =
							response.data?.message ||
							'Failed to execute AI task. Please try again.';
						this.showError( errorMessage );
						return;
					}

					const data = response.data;
					const aiResponse = data.ai_response || '';
					const cached = data.cached || false;

					this.showResult( aiResponse, cached );
				} )
				.catch( ( error ) => {
					console.error( 'AI task execution error:', error );
					this.showError(
						'An error occurred while analyzing your site. Please try again.'
					);
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
	new AITask();
} )();
