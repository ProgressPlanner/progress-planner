/* global progressPlannerAjaxRequest, progressPlanner */

/**
 * AI Task Handler
 *
 * Handles execution of AI-powered tasks from the SaaS server.
 *
 * Dependencies: progress-planner/suggested-task, progress-planner/ajax-request
 */

( () => {
	/**
	 * Handle AI task execution.
	 */
	const handleAITaskExecution = () => {
		const popover = document.getElementById( 'prpl-popover-ai-task' );
		if ( ! popover ) {
			return;
		}

		const executeButton = popover.querySelector( '.prpl-ai-task-execute' );
		const retryButton = popover.querySelector( '.prpl-ai-task-retry' );
		const completeButton = popover.querySelector(
			'.prpl-ai-task-complete'
		);
		const instructionsEl = popover.querySelector(
			'.prpl-ai-task-instructions'
		);
		const loadingEl = popover.querySelector( '.prpl-ai-task-loading' );
		const resultEl = popover.querySelector( '.prpl-ai-task-result' );
		const responseEl = popover.querySelector( '.prpl-ai-task-response' );
		const errorEl = popover.querySelector( '.prpl-ai-task-error' );
		const errorMessageEl = popover.querySelector( '.prpl-error-message' );

		let currentTaskId = null;

		/**
		 * Show loading state.
		 */
		const showLoading = () => {
			executeButton.style.display = 'none';
			retryButton.style.display = 'none';
			completeButton.style.display = 'none';
			if ( instructionsEl ) {
				instructionsEl.style.display = 'none';
			}
			loadingEl.style.display = 'block';
			resultEl.style.display = 'none';
			errorEl.style.display = 'none';
		};

		/**
		 * Show result state.
		 *
		 * @param {string}  response - The AI response text.
		 * @param {boolean} cached   - Whether the response was cached.
		 */
		const showResult = ( response, cached = false ) => {
			if ( instructionsEl ) {
				instructionsEl.style.display = 'none';
			}
			loadingEl.style.display = 'none';
			executeButton.style.display = 'none';
			retryButton.style.display = 'none';
			errorEl.style.display = 'none';
			resultEl.style.display = 'block';
			completeButton.style.display = 'inline-block';

			// Format the response with markdown-like formatting.
			const formattedResponse = formatAIResponse( response );
			responseEl.innerHTML = formattedResponse;

			// Add cached indicator if applicable.
			if ( cached ) {
				const cachedIndicator = document.createElement( 'p' );
				cachedIndicator.className = 'prpl-ai-cached-indicator';
				cachedIndicator.style.fontSize = '0.9em';
				cachedIndicator.style.color = '#666';
				cachedIndicator.style.marginTop = '10px';
				cachedIndicator.textContent = '(Cached result)';
				responseEl.appendChild( cachedIndicator );
			}
		};

		/**
		 * Show error state.
		 *
		 * @param {string} message - The error message.
		 */
		const showError = ( message ) => {
			if ( instructionsEl ) {
				instructionsEl.style.display = 'none';
			}
			loadingEl.style.display = 'none';
			executeButton.style.display = 'none';
			retryButton.style.display = 'inline-block';
			completeButton.style.display = 'none';
			resultEl.style.display = 'none';
			errorEl.style.display = 'block';
			errorMessageEl.textContent = message;
		};

		/**
		 * Format AI response with basic HTML formatting.
		 *
		 * @param {string} text - The raw AI response text.
		 * @return {string} Formatted HTML string.
		 */
		const formatAIResponse = ( text ) => {
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
		};

		/**
		 * Execute the AI task.
		 *
		 * @param {number} taskId - The server task ID.
		 */
		const executeTask = ( taskId ) => {
			if ( ! taskId ) {
				showError( 'Invalid task ID.' );
				return;
			}

			currentTaskId = taskId;
			showLoading();

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
						showError( errorMessage );
						return;
					}

					const data = response.data;
					const aiResponse = data.ai_response || '';
					const cached = data.cached || false;

					showResult( aiResponse, cached );
				} )
				.catch( ( error ) => {
					console.error( 'AI task execution error:', error );
					showError(
						'An error occurred while analyzing your site. Please try again.'
					);
				} );
		};

		/**
		 * Set up event listeners for trigger buttons in task list.
		 */
		const setupTriggerButtons = () => {
			document.addEventListener(
				'prpl-interactive-task-ai-task',
				( event ) => {
					const taskContext = event.detail;
					console.log( 'AI task event received:', taskContext );

					if ( taskContext.remote_task_id ) {
						currentTaskId = parseInt( taskContext.remote_task_id );
						console.log( 'Set currentTaskId to:', currentTaskId );

						// Reset the popover state.
						if ( instructionsEl ) {
							instructionsEl.style.display = 'block';
						}
						loadingEl.style.display = 'none';
						resultEl.style.display = 'none';
						errorEl.style.display = 'none';
						executeButton.style.display = 'inline-block';
						retryButton.style.display = 'none';
						completeButton.style.display = 'none';
					}
				}
			);
		};
	};

	// Initialize when DOM is ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', handleAITaskExecution );
	} else {
		handleAITaskExecution();
	}
} )();
