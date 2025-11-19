/* global progressPlannerAjaxRequest, progressPlanner */

/**
 * Check Email DNS Records Handler
 *
 * Handles execution of email DNS check tasks with state management.
 *
 * Dependencies: progress-planner/suggested-task, progress-planner/ajax-request
 */

( () => {
	/**
	 * Handle email DNS check execution.
	 */
	const handleEmailDNSCheck = () => {
		const popover = document.getElementById(
			'prpl-popover-check-email-dns-records'
		);
		if ( ! popover ) {
			return;
		}

		const checkButton = popover.querySelector( '.prpl-email-dns-check' );
		const retryButton = popover.querySelector( '.prpl-email-dns-retry' );
		const completeButton = popover.querySelector(
			'.prpl-email-dns-complete'
		);
		const instructionsEl = popover.querySelector(
			'.prpl-email-dns-instructions'
		);
		const loadingEl = popover.querySelector( '.prpl-email-dns-loading' );
		const resultEl = popover.querySelector( '.prpl-email-dns-result' );
		const responseEl = popover.querySelector( '.prpl-email-dns-response' );
		const errorEl = popover.querySelector( '.prpl-email-dns-error' );
		const errorMessageEl = popover.querySelector( '.prpl-error-message' );

		// Define all elements in one place for easy maintenance.
		const elements = {
			checkButton,
			retryButton,
			completeButton,
			instructionsEl,
			loadingEl,
			resultEl,
			responseEl,
			errorEl,
			errorMessageEl,
		};

		// State configuration: define visibility for each element in each state.
		const states = {
			loading: {
				checkButton: 'none',
				retryButton: 'none',
				completeButton: 'none',
				instructionsEl: 'none',
				loadingEl: 'block',
				resultEl: 'none',
				errorEl: 'none',
			},
			result: {
				instructionsEl: 'none',
				loadingEl: 'none',
				checkButton: 'none',
				retryButton: 'none',
				errorEl: 'none',
				resultEl: 'block',
				completeButton: 'inline-block',
			},
			error: {
				instructionsEl: 'none',
				loadingEl: 'none',
				checkButton: 'none',
				retryButton: 'inline-block',
				completeButton: 'none',
				resultEl: 'none',
				errorEl: 'block',
			},
		};

		/**
		 * Set the UI state.
		 *
		 * @param {string} stateName            - The state name ('loading', 'result', or 'error').
		 * @param {Object} options              - Additional options for the state.
		 * @param {string} options.responseHtml - HTML content for responseEl (result state only).
		 * @param {string} options.message      - Error message for errorMessageEl (error state only).
		 */
		const setUIState = ( stateName, options = {} ) => {
			const state = states[ stateName ];
			if ( ! state ) {
				console.warn( `Unknown state: ${ stateName }` );
				return;
			}

			// Apply visibility for each element in the state.
			Object.entries( state ).forEach( ( [ key, display ] ) => {
				const element = elements[ key ];
				if ( element ) {
					element.style.display = display;
				}
			} );

			// Handle special cases.
			if (
				stateName === 'result' &&
				options.responseHtml &&
				elements.responseEl
			) {
				elements.responseEl.innerHTML = options.responseHtml;
			}

			if (
				stateName === 'error' &&
				options.message &&
				elements.errorMessageEl
			) {
				elements.errorMessageEl.textContent = options.message;
			}
		};

		/**
		 * Show loading state.
		 */
		const showLoading = () => {
			setUIState( 'loading' );
		};

		/**
		 * Show result state.
		 *
		 * @param {string} responseHtml - The formatted HTML response.
		 */
		const showResult = ( responseHtml ) => {
			setUIState( 'result', { responseHtml } );
		};

		/**
		 * Show error state.
		 *
		 * @param {string} message - The error message.
		 */
		const showError = ( message ) => {
			setUIState( 'error', { message } );
		};

		/**
		 * Execute the email DNS check.
		 */
		const executeCheck = () => {
			showLoading();

			// Make AJAX request to check email DNS records.
			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'prpl_interactive_task_submit_check-email-dns-records',
					nonce: progressPlanner.nonce,
				},
			} )
				.then( ( response ) => {
					if ( ! response.success ) {
						const errorMessage =
							response.data?.message ||
							'Failed to check email DNS records. Please try again.';
						showError( errorMessage );
						return;
					}

					const data = response.data;
					const responseHtml =
						data.response_html ||
						'<p>Check completed successfully.</p>';

					showResult( responseHtml );
				} )
				.catch( ( error ) => {
					console.error( 'Email DNS check error:', error );
					showError(
						'An error occurred while checking your email DNS records. Please try again.'
					);
				} );
		};

		// Check button click handler.
		if ( checkButton ) {
			checkButton.addEventListener( 'click', executeCheck );
		}

		// Retry button click handler.
		if ( retryButton ) {
			retryButton.addEventListener( 'click', executeCheck );
		}
	};

	// Initialize when DOM is ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', handleEmailDNSCheck );
	} else {
		handleEmailDNSCheck();
	}
} )();
