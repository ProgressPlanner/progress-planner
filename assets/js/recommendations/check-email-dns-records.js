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

		/**
		 * Show loading state.
		 */
		const showLoading = () => {
			if ( checkButton ) {
				checkButton.style.display = 'none';
			}
			if ( retryButton ) {
				retryButton.style.display = 'none';
			}
			if ( completeButton ) {
				completeButton.style.display = 'none';
			}
			if ( instructionsEl ) {
				instructionsEl.style.display = 'none';
			}
			if ( loadingEl ) {
				loadingEl.style.display = 'block';
			}
			if ( resultEl ) {
				resultEl.style.display = 'none';
			}
			if ( errorEl ) {
				errorEl.style.display = 'none';
			}
		};

		/**
		 * Show result state.
		 *
		 * @param {string} responseHtml - The formatted HTML response.
		 */
		const showResult = ( responseHtml ) => {
			if ( instructionsEl ) {
				instructionsEl.style.display = 'none';
			}
			if ( loadingEl ) {
				loadingEl.style.display = 'none';
			}
			if ( checkButton ) {
				checkButton.style.display = 'none';
			}
			if ( retryButton ) {
				retryButton.style.display = 'none';
			}
			if ( errorEl ) {
				errorEl.style.display = 'none';
			}
			if ( resultEl ) {
				resultEl.style.display = 'block';
			}
			if ( completeButton ) {
				completeButton.style.display = 'inline-block';
			}

			if ( responseEl ) {
				responseEl.innerHTML = responseHtml;
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
			if ( loadingEl ) {
				loadingEl.style.display = 'none';
			}
			if ( checkButton ) {
				checkButton.style.display = 'none';
			}
			if ( retryButton ) {
				retryButton.style.display = 'inline-block';
			}
			if ( completeButton ) {
				completeButton.style.display = 'none';
			}
			if ( resultEl ) {
				resultEl.style.display = 'none';
			}
			if ( errorEl ) {
				errorEl.style.display = 'block';
			}
			if ( errorMessageEl ) {
				errorMessageEl.textContent = message;
			}
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
