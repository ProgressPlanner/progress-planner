/**
 * Progress Planner - Multi-screen Guided Tours
 *
 * Handles guided tours that span multiple WordPress admin pages, frontend,
 * and block editor using driver.js with server-side state persistence.
 *
 * This is for hosting partner installations, distinct from the plugin onboarding.
 */

( function() {
	'use strict';

	// Bail if config is missing.
	if ( typeof window.ppGuidedTour === 'undefined' ) {
		return;
	}

	const config = window.ppGuidedTour;
	const context = config.context || 'admin';

	/**
	 * Tour Manager - handles all tour operations.
	 */
	const TourManager = {
		driverInstance: null,
		isNavigating: false,
		currentStepElement: null,

		/**
		 * Click the current step's target element (called from hint button).
		 */
		clickCurrentElement() {
			if ( this.currentStepElement ) {
				this.currentStepElement.click();
				this.currentStepElement.focus();
			}
		},

		/**
		 * Initialize the tour manager.
		 */
		init() {
			// Route to appropriate handler based on context.
			switch ( context ) {
				case 'frontend':
					this.initFrontend();
					break;
				case 'editor':
					this.initEditor();
					break;
				case 'admin':
				default:
					this.initAdmin();
					break;
			}
		},

		/**
		 * Initialize frontend context (homepage welcome card).
		 */
		initFrontend() {
			// Close Extendify AI assistant for YourHosting (branding ID 5159).
			if ( config.brandingId && parseInt( config.brandingId, 10 ) === 5159 ) {
				this.closeExtendifyAssistant();
			}

			// Wait for driver.js to be ready, then bind events.
			this.waitForDriver( () => {
				this.bindFrontendEvents();
			} );
		},

		/**
		 * Close the Extendify AI assistant.
		 * Used for YourHosting installations to avoid UI overlap with the tour.
		 */
		closeExtendifyAssistant() {
			try {
				// First, try to update localStorage to prevent future opens.
				if ( typeof localStorage !== 'undefined' ) {
					const keys = Object.keys( localStorage );
					for ( const key of keys ) {
						if ( key.startsWith( 'extendify-agent-global-' ) ) {
							try {
								const data = JSON.parse( localStorage.getItem( key ) );
								if ( data && data.state ) {
									data.state.open = false;
									data.state.minimized = true;
									localStorage.setItem( key, JSON.stringify( data ) );
								}
							} catch ( e ) {
								// Ignore parse errors for individual keys.
							}
						}
					}
				}

				// Then, click the close button if the popup is already open.
				this.clickExtendifyCloseButton();
			} catch ( e ) {
				// Silently fail - don't break tour if Extendify handling fails.
				console.warn( 'PP Guided Tour: Could not close Extendify assistant', e );
			}
		},

		/**
		 * Click the Extendify popup close button if it exists.
		 * Retries multiple times since Extendify may load after our script.
		 *
		 * @param {number} attempt Current attempt number.
		 */
		clickExtendifyCloseButton( attempt = 0 ) {
			const maxAttempts = 10;
			const delay = 500; // 500ms between attempts = 5 seconds total

			try {
				// Find the Extendify close button by its text content.
				const allButtons = document.querySelectorAll( 'button' );
				for ( const btn of allButtons ) {
					const text = ( btn.textContent || '' ).trim().toLowerCase();

					// Match the Extendify close button by text.
					if ( text === 'venster sluiten' || text === 'close window' ) {
						btn.click();
						console.log( 'PP Guided Tour: Clicked Extendify close button (attempt ' + attempt + ')' );
						return;
					}
				}

				// If not found and we haven't exceeded max attempts, retry.
				if ( attempt < maxAttempts ) {
					setTimeout( () => this.clickExtendifyCloseButton( attempt + 1 ), delay );
				}
			} catch ( e ) {
				console.warn( 'PP Guided Tour: Could not click Extendify close button', e );
			}
		},

		/**
		 * Initialize block editor context.
		 */
		initEditor() {
			console.log( 'PP Guided Tour: Initializing editor context', config );

			// Close Extendify AI assistant for YourHosting (branding ID 5159).
			if ( config.brandingId && parseInt( config.brandingId, 10 ) === 5159 ) {
				this.closeExtendifyAssistant();
			}

			// Wait for editor to be ready.
			if ( typeof wp !== 'undefined' && wp.domReady ) {
				wp.domReady( () => {
					console.log( 'PP Guided Tour: wp.domReady fired' );

					// Close Extendify editor sidebar for YourHosting.
					if ( config.brandingId && parseInt( config.brandingId, 10 ) === 5159 ) {
						this.closeExtendifyEditorSidebar();
					}

					// Open Progress Planner sidebar.
					this.openProgressPlannerSidebar();
					// Wait for driver.js and editor to be ready.
					this.waitForDriver( () => {
						// For FSE themes, wait for the editor canvas to be fully loaded.
						if ( config.isBlockTheme ) {
							this.waitForFSEContent( () => this.resumeEditorTour() );
						} else {
							setTimeout( () => this.resumeEditorTour(), 1000 );
						}
					} );
				} );
			} else {
				// Fallback.
				console.log( 'PP Guided Tour: Using fallback timeout' );

				// Close Extendify editor sidebar for YourHosting.
				if ( config.brandingId && parseInt( config.brandingId, 10 ) === 5159 ) {
					this.closeExtendifyEditorSidebar();
				}

				this.openProgressPlannerSidebar();
				this.waitForDriver( () => {
					if ( config.isBlockTheme ) {
						this.waitForFSEContent( () => this.resumeEditorTour() );
					} else {
						setTimeout( () => this.resumeEditorTour(), 2000 );
					}
				} );
			}
		},

		/**
		 * Wait for FSE (Full Site Editor) content to be fully loaded.
		 * In FSE themes, the editor initially loads as regular Gutenberg, then AJAX
		 * replaces the content with the FSE template view (Header, Content, Footer).
		 *
		 * @param {Function} callback Callback when content is ready.
		 * @param {number} attempts Number of attempts made.
		 */
		waitForFSEContent( callback, attempts = 0 ) {
			const maxAttempts = 30; // 30 attempts * 300ms = 9 seconds max
			const delay = 300;

			console.log( 'PP Guided Tour: waitForFSEContent (attempt ' + ( attempts + 1 ) + ')' );

			// Check if iframe exists and has content.
			const editorCanvas = document.querySelector( 'iframe[name="editor-canvas"]' );
			const hasIframe = !! editorCanvas;
			let doc = document;

			if ( hasIframe && editorCanvas.contentDocument ) {
				doc = editorCanvas.contentDocument;
			}

			// Check for FSE template indicators - these appear after AJAX replacement.
			// The key indicators are template parts (header/footer) which indicate FSE mode.
			// These selectors work both in iframe and direct document modes.
			const hasFSETemplateParts =
				doc.querySelector( '.wp-block-template-part' ) || // Header/Footer template parts
				doc.querySelector( '[data-type="core/template-part"]' ) ||
				doc.querySelector( '.block-editor-block-list__layout [data-type="core/template-part"]' );

			// Also check for post-content wrapper which contains the actual page content.
			const postContent =
				doc.querySelector( '.wp-block-post-content' ) ||
				doc.querySelector( '[data-type="core/post-content"]' );
			const hasContentInside = postContent && postContent.children.length > 0;

			// FSE mode is confirmed when we have template parts (Header/Footer blocks).
			if ( hasFSETemplateParts ) {
				// Check if the content inside post-content has rendered.
				if ( hasContentInside ) {
					console.log( 'PP Guided Tour: FSE template fully loaded (attempt ' + ( attempts + 1 ) + ')', {
						hasTemplateParts: true,
						hasPostContent: !! postContent,
						contentChildCount: postContent ? postContent.children.length : 0,
						hasIframe: hasIframe,
					} );
					// Add a small delay to ensure all content is rendered.
					setTimeout( callback, 300 );
					return;
				}

				// If we have template structure but no content inside yet, keep waiting.
				if ( attempts < maxAttempts ) {
					console.log( 'PP Guided Tour: FSE template parts found but content not loaded yet...' );
					setTimeout( () => this.waitForFSEContent( callback, attempts + 1 ), delay );
					return;
				}
			}

			// Check if we're in regular block editor mode (non-FSE theme).
			// For non-FSE themes, we can proceed when the editor has blocks loaded.
			const regularEditor = document.querySelector( '.edit-post-visual-editor' );

			if ( regularEditor && ! config.isBlockTheme ) {
				// For non-FSE themes, check if the editor content is ready.
				const hasBlocks = doc.querySelector( '.wp-block' ) ||
					doc.querySelector( '[data-type]' ) ||
					doc.querySelector( '.block-editor-block-list__layout' );

				if ( hasBlocks ) {
					console.log( 'PP Guided Tour: Non-FSE editor with blocks ready (attempt ' + ( attempts + 1 ) + ')' );
					setTimeout( callback, 300 );
					return;
				}
			}

			// For FSE themes without iframe, keep waiting for template parts to appear.
			// The editor starts as regular Gutenberg, then AJAX replaces with FSE structure.
			if ( config.isBlockTheme && attempts < maxAttempts ) {
				console.log( 'PP Guided Tour: FSE theme, waiting for template parts... (attempt ' + ( attempts + 1 ) + ')' );
				setTimeout( () => this.waitForFSEContent( callback, attempts + 1 ), delay );
				return;
			}

			// Max attempts reached or unexpected state.
			if ( attempts >= maxAttempts ) {
				console.warn( 'PP Guided Tour: FSE content not found after ' + maxAttempts + ' attempts, proceeding anyway' );
			}
			callback();
		},

		/**
		 * Close the Extendify editor sidebar (AI Tools button).
		 * Used for YourHosting installations to show PP sidebar instead.
		 * Retries multiple times since Extendify may open after wp.domReady.
		 *
		 * @param {number} attempt Current attempt number.
		 */
		closeExtendifyEditorSidebar( attempt = 0 ) {
			const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds total
			const delay = 500;

			try {
				// Find the Extendify AI Tools button that's open.
				const extendifyButton = document.querySelector(
					'button[aria-controls^="extendify-draft"][aria-expanded="true"]'
				);

				if ( extendifyButton ) {
					// Sidebar is open, click to close it.
					extendifyButton.click();
					console.log( 'PP Guided Tour: Closed Extendify editor sidebar (attempt ' + ( attempt + 1 ) + ')' );

					// Open Progress Planner sidebar after a short delay.
					setTimeout( () => this.openProgressPlannerSidebar(), 300 );
					return;
				}

				// Sidebar not open yet, retry if we haven't exceeded max attempts.
				if ( attempt < maxAttempts ) {
					setTimeout( () => this.closeExtendifyEditorSidebar( attempt + 1 ), delay );
				}
			} catch ( e ) {
				// Silently fail - don't break tour if Extendify handling fails.
				console.warn( 'PP Guided Tour: Could not close Extendify editor sidebar', e );
			}
		},

		/**
		 * Open the Progress Planner sidebar in the block editor.
		 *
		 * @param {number} attempt Current attempt number.
		 */
		openProgressPlannerSidebar( attempt = 0 ) {
			const maxAttempts = 10;

			// Find the Progress Planner sidebar toggle button.
			// Use multiple selectors to handle different languages/versions.
			const sidebarButton =
				document.querySelector( 'button[aria-label*="Progress Planner"]' ) ||
				document.querySelector( 'button[aria-controls*="progress-planner"]' );

			if ( ! sidebarButton ) {
				// Button not found yet, retry after a short delay.
				if ( attempt < maxAttempts ) {
					setTimeout( () => this.openProgressPlannerSidebar( attempt + 1 ), 500 );
				}
				return;
			}

			// Check if sidebar is already open.
			if ( sidebarButton.getAttribute( 'aria-expanded' ) === 'true' ) {
				console.log( 'PP Guided Tour: Progress Planner sidebar already open' );
				return;
			}

			// Click to open the sidebar.
			sidebarButton.click();
			console.log( 'PP Guided Tour: Opened Progress Planner sidebar' );
		},

		/**
		 * Wait for driver.js to be available.
		 *
		 * @param {Function} callback Callback when ready.
		 * @param {number} attempts Number of attempts.
		 */
		waitForDriver( callback, attempts = 0 ) {
			const driver = this.getDriver();
			if ( driver ) {
				callback();
				return;
			}

			if ( attempts > 20 ) {
				console.error( 'PP Guided Tour: driver.js not available after 20 attempts' );
				return;
			}

			console.log( 'PP Guided Tour: Waiting for driver.js...', window.driver );
			setTimeout( () => this.waitForDriver( callback, attempts + 1 ), 250 );
		},

		/**
		 * Get the driver function from window.driver.
		 *
		 * @return {Function|null} The driver function or null.
		 */
		getDriver() {
			// Try different possible locations
			if ( typeof window.driver === 'function' ) {
				return window.driver;
			}
			if ( typeof window.driver?.driver === 'function' ) {
				return window.driver.driver;
			}
			if ( typeof window.driver?.js?.driver === 'function' ) {
				return window.driver.js.driver;
			}
			return null;
		},

		/**
		 * Initialize admin context.
		 */
		initAdmin() {
			// Driver.js will be checked when needed.

			// Check if there's an active tour.
			if ( config.state?.active && config.activeTour ) {
				this.resumeTour();
			}

			// Set up event listeners for tour triggers.
			this.bindEvents();
		},

		/**
		 * Bind frontend event listeners.
		 */
		bindFrontendEvents() {
			const welcomeCard = document.getElementById( 'pp-guided-tour-welcome' );
			if ( ! welcomeCard ) {
				return;
			}

			// Close button.
			const closeBtn = welcomeCard.querySelector( '.pp-guided-tour-welcome-close' );
			if ( closeBtn ) {
				closeBtn.addEventListener( 'click', () => this.skipTour() );
			}

			// Skip button.
			const skipBtn = welcomeCard.querySelector( '.pp-guided-tour-welcome-skip' );
			if ( skipBtn ) {
				skipBtn.addEventListener( 'click', () => this.skipTour() );
			}

			// Click on the card content to highlight the Edit Page link.
			const cardContent = welcomeCard.querySelector( '.pp-guided-tour-welcome-text' );
			if ( cardContent ) {
				cardContent.style.cursor = 'pointer';
				cardContent.addEventListener( 'click', () => this.highlightEditPageLink() );
			}

			// Watch for clicks on admin bar "Edit Page" link.
			const editPageLink = document.querySelector( '#wp-admin-bar-edit a' );
			if ( editPageLink ) {
				editPageLink.addEventListener( 'click', async ( e ) => {
					e.preventDefault();
					const href = editPageLink.href;

					// Destroy any active driver instance.
					if ( this.driverInstance ) {
						this.driverInstance.destroy();
					}

					// Update progress to next step before navigating.
					await this.updateProgress( 1 );

					// Navigate to the editor.
					window.location.href = href;
				} );
			}
		},

		/**
		 * Highlight the Edit Page link in the admin bar.
		 */
		highlightEditPageLink() {
			const driver = this.getDriver();
			if ( ! driver ) {
				console.error( 'PP Guided Tour: driver.js not available for highlight' );
				return;
			}

			const editPageLink = document.querySelector( '#wp-admin-bar-edit' );
			if ( ! editPageLink ) {
				console.error( 'PP Guided Tour: Edit Page link not found in admin bar' );
				return;
			}

			// Hide the welcome card.
			const welcomeCard = document.getElementById( 'pp-guided-tour-welcome' );
			if ( welcomeCard ) {
				welcomeCard.style.display = 'none';
			}

			// Add active class to body to adjust z-indexes.
			document.body.classList.add( 'pp-guided-tour-active' );

			// Use driver.js to highlight the Edit Page link.
			// Only show close button - user should click the Edit Page link directly.
			this.driverInstance = driver( {
				showProgress: false,
				showButtons: [ 'close' ],
				steps: [
					{
						element: '#wp-admin-bar-edit',
						popover: {
							title: config.i18n.editPageTitle || 'Edit Page',
							description: config.i18n.editPageDesc || 'Click here to edit your homepage.',
							side: 'bottom',
							align: 'center',
						},
					},
				],
				popoverClass: 'pp-guided-tour-popover',
				stagePadding: 4,
				stageRadius: 4,
				allowClose: true,
				onCloseClick: () => {
					// X button clicked - user wants to dismiss temporarily.
					document.body.classList.remove( 'pp-guided-tour-active' );
					if ( this.driverInstance ) {
						this.driverInstance.destroy();
					}
					// Show the welcome card again.
					if ( welcomeCard ) {
						welcomeCard.style.display = 'block';
					}
				},
				onDestroyStarted: () => {
					// Show welcome card when popover is dismissed.
					document.body.classList.remove( 'pp-guided-tour-active' );
					if ( welcomeCard ) {
						welcomeCard.style.display = 'block';
					}
				},
			} );

			this.driverInstance.drive();
		},

		/**
		 * Resume tour in block editor.
		 *
		 * @param {number} retryAttempt Current retry attempt for FSE themes.
		 */
		resumeEditorTour( retryAttempt = 0 ) {
			const maxRetries = config.isBlockTheme ? 10 : 3; // More retries for FSE themes.
			const retryDelay = 500;

			console.log( 'PP Guided Tour: resumeEditorTour called', {
				activeTour: config.activeTour,
				state: config.state,
				isBlockTheme: config.isBlockTheme,
				retryAttempt,
			} );

			if ( ! config.activeTour || ! config.state?.active ) {
				console.log( 'PP Guided Tour: No active tour, exiting' );
				return;
			}

			const currentStepIndex = config.state.step || 0;
			const step = config.activeTour.steps[ currentStepIndex ];

			console.log( 'PP Guided Tour: Current step', { currentStepIndex, step } );

			if ( ! step || step.context !== 'editor' ) {
				console.log( 'PP Guided Tour: Step not for editor context, exiting' );
				return;
			}

			// Find the element based on step configuration.
			const result = this.findEditorElement( step.element );

			console.log( 'PP Guided Tour: Found element', {
				elementType: step.element,
				result,
				hasElement: !! result.element,
			} );

			if ( ! result.element ) {
				// In FSE themes, content may still be loading. Retry a few times.
				if ( retryAttempt < maxRetries ) {
					console.log( 'PP Guided Tour: Element not found, retrying... (attempt ' + ( retryAttempt + 1 ) + '/' + maxRetries + ')' );
					setTimeout( () => this.resumeEditorTour( retryAttempt + 1 ), retryDelay );
					return;
				}

				console.warn( 'Guided Tour: Could not find element after ' + maxRetries + ' attempts:', step.element );
				// Show a fallback popover or skip to next step.
				this.showEditorFallbackPopover( step );
				return;
			}

			// Show popover - handle different cases.
			if ( result.isInIframe ) {
				this.showEditorPopoverForIframe( result, step, currentStepIndex );
			} else if ( result.useFixedPopover ) {
				// Use fixed popover with simple highlight (no overlay).
				this.showFixedPopoverWithHighlight( result.element, step, currentStepIndex );
			} else {
				this.showEditorPopover( result.element, step, currentStepIndex );
			}
		},

		/**
		 * Find element in block editor.
		 * Handles both classic block editor and FSE (Full Site Editor) themes.
		 *
		 * @param {string} elementType Type of element to find.
		 * @return {Object} Object with element, isInIframe, and iframe reference.
		 */
		findEditorElement( elementType ) {
			const editorCanvas = document.querySelector( 'iframe[name="editor-canvas"]' );
			const isInIframe = !! editorCanvas;
			const doc = editorCanvas ? editorCanvas.contentDocument : document;

			// In FSE themes, page content is inside .wp-block-post-content.
			// We need to look there ONLY to avoid finding elements in header/footer template parts.
			const isFSE = config.isBlockTheme && isInIframe;

			// Try multiple selectors for the content container.
			// In FSE, the page content is wrapped in .wp-block-post-content which is
			// separate from the header/footer template parts.
			let contentContainer = null;
			if ( isFSE && doc ) {
				// Primary selector for FSE post content block.
				contentContainer = doc.querySelector( '.wp-block-post-content' );

				// Fallback selectors.
				if ( ! contentContainer ) {
					contentContainer = doc.querySelector( '[data-type="core/post-content"]' );
				}
				if ( ! contentContainer ) {
					contentContainer = doc.querySelector( '.entry-content' );
				}

				// Debug: Log all potential content containers found.
				console.log( 'PP Guided Tour: FSE content container search', {
					postContent: !! doc.querySelector( '.wp-block-post-content' ),
					postContentDataType: !! doc.querySelector( '[data-type="core/post-content"]' ),
					entryContent: !! doc.querySelector( '.entry-content' ),
					templateParts: doc.querySelectorAll( '.wp-block-template-part' ).length,
				} );
			}

			console.log( 'PP Guided Tour: findEditorElement', {
				elementType,
				isFSE,
				isInIframe,
				isBlockTheme: config.isBlockTheme,
				hasContentContainer: !! contentContainer,
				contentContainerClass: contentContainer?.className,
				contentContainerChildCount: contentContainer?.children?.length || 0,
			} );

			let element = null;

			switch ( elementType ) {
				case 'first-heading':
					// Look for first heading block in editor.
					if ( isFSE && contentContainer ) {
						// In FSE, look ONLY within the post content block.
						element = contentContainer.querySelector(
							'.wp-block-heading, ' +
							'[data-type="core/heading"], ' +
							'h1, h2, h3'
						);
						console.log( 'PP Guided Tour: FSE heading search in content container', { found: !! element } );
					}
					// Only use fallback for non-FSE themes.
					if ( ! element && ! isFSE ) {
						element = doc.querySelector(
							'.wp-block-heading, ' +
							'[data-type="core/heading"], ' +
							'.editor-post-title__input, ' +
							'.wp-block-post-title'
						);
					}
					break;

				case 'first-paragraph':
					// Look for first paragraph block in editor.
					if ( isFSE && contentContainer ) {
						// In FSE, look ONLY within the post content block.
						element = contentContainer.querySelector(
							'.wp-block-paragraph, ' +
							'[data-type="core/paragraph"], ' +
							'p'
						);
						console.log( 'PP Guided Tour: FSE paragraph search in content container', { found: !! element } );
					}
					// Only use fallback for non-FSE themes.
					if ( ! element && ! isFSE ) {
						element = doc.querySelector(
							'.wp-block-paragraph, ' +
							'[data-type="core/paragraph"]'
						);
					}
					break;

				case 'first-image':
					// Look for first image block in editor.
					if ( isFSE && contentContainer ) {
						// In FSE, look ONLY within the post content block.
						element = contentContainer.querySelector(
							'.wp-block-image, ' +
							'[data-type="core/image"], ' +
							'.wp-block-cover, ' +
							'[data-type="core/cover"], ' +
							'img'
						);
						console.log( 'PP Guided Tour: FSE image search in content container', { found: !! element } );
					}
					// Only use fallback for non-FSE themes.
					if ( ! element && ! isFSE ) {
						element = doc.querySelector(
							'.wp-block-image, ' +
							'[data-type="core/image"], ' +
							'.wp-block-cover, ' +
							'[data-type="core/cover"]'
						);
					}
					break;

				case 'list-view-button':
					// List View / Document Overview button in editor toolbar (for reordering blocks).
					// This is in the main document, not the iframe.
					element = document.querySelector(
						'.editor-document-tools__document-overview-toggle, ' +
						'.edit-post-header-toolbar__document-overview-toggle, ' +
						'button[aria-label="Document Overview"], ' +
						'button[aria-label="List View"], ' +
						'.edit-post-header-toolbar__list-view-toggle'
					);
					return {
						element,
						isInIframe: false,
						iframe: null,
						doc: document,
						useFixedPopover: true, // Use fixed popover without overlay.
					};

				case 'block-inserter':
					// Block inserter (+ button) in editor toolbar.
					// This is in the main document, not the iframe.
					element = document.querySelector(
						'button[aria-label="Block Inserter"], ' +
						'.editor-document-tools__inserter-toggle, ' +
						'.edit-post-header-toolbar__inserter-toggle, ' +
						'button[aria-label="Toggle block inserter"], ' +
						'.block-editor-inserter__toggle'
					);
					return {
						element,
						isInIframe: false,
						iframe: null,
						doc: document,
						useFixedPopover: true, // Use fixed popover without overlay.
					};

				case 'save-button':
					// Save/Update button is in the main document, not the iframe.
					element = document.querySelector(
						'.editor-post-publish-button, ' +
						'.editor-post-save-draft, ' +
						'button.editor-post-publish-button__button'
					);
					// Return early with isInIframe false since save button is in main UI.
					return {
						element,
						isInIframe: false,
						iframe: null,
						doc: document,
					};

				default:
					// Try as a CSS selector.
					// In FSE, try content container ONLY.
					if ( isFSE && contentContainer ) {
						element = contentContainer.querySelector( elementType );
					}
					// Only use fallback for non-FSE themes.
					if ( ! element && ! isFSE ) {
						element = doc.querySelector( elementType );
					}
			}

			return {
				element,
				isInIframe,
				iframe: editorCanvas,
				doc,
			};
		},

		/**
		 * Show popover for editor step when content is in an iframe.
		 *
		 * @param {Object} result Result from findEditorElement.
		 * @param {Object} step Step configuration.
		 * @param {number} stepIndex Current step index.
		 */
		showEditorPopoverForIframe( result, step, stepIndex ) {
			const { element, iframe, doc } = result;

			// Add highlight class to element inside iframe.
			element.classList.add( 'pp-guided-tour-highlight' );

			// Inject highlight styles into iframe if not already there.
			if ( ! doc.getElementById( 'pp-guided-tour-iframe-styles' ) ) {
				const style = doc.createElement( 'style' );
				style.id = 'pp-guided-tour-iframe-styles';
				style.textContent = `
					.pp-guided-tour-highlight {
						outline: 3px solid #667eea !important;
						outline-offset: 4px !important;
						border-radius: 4px !important;
						animation: pp-highlight-pulse 1.5s ease-in-out infinite !important;
					}
					@keyframes pp-highlight-pulse {
						0%, 100% { outline-color: #667eea; }
						50% { outline-color: #764ba2; }
					}
				`;
				doc.head.appendChild( style );
			}

			// Scroll element into view.
			element.scrollIntoView( { behavior: 'smooth', block: 'center' } );

			// Create custom popover positioned relative to iframe.
			this.showCustomEditorPopover( element, iframe, step, stepIndex );
		},

		/**
		 * Show custom popover for iframe editor.
		 *
		 * @param {HTMLElement} element Target element inside iframe.
		 * @param {HTMLElement} iframe The iframe element.
		 * @param {Object} step Step configuration.
		 * @param {number} stepIndex Current step index.
		 */
		showCustomEditorPopover( element, iframe, step, stepIndex ) {
			// Remove any existing custom popover.
			const existingPopover = document.getElementById( 'pp-guided-tour-custom-popover' );
			if ( existingPopover ) {
				existingPopover.remove();
			}

			// Build description with optional hint (clickable).
			let hintHtml = '';
			if ( step.hint ) {
				hintHtml = `<button type="button" class="pp-guided-tour-hint pp-guided-tour-hint-clickable">${step.hint}</button>`;
			}

			// Check if there are more steps.
			const hasMoreSteps = config.activeTour.steps.length > stepIndex + 1;

			// Create popover element.
			const popover = document.createElement( 'div' );
			popover.id = 'pp-guided-tour-custom-popover';
			popover.className = 'pp-guided-tour-custom-popover';
			popover.innerHTML = `
				<div class="pp-guided-tour-custom-popover-content">
					<button type="button" class="pp-guided-tour-custom-popover-close" aria-label="Close">&times;</button>
					<h4 class="pp-guided-tour-custom-popover-title">${step.title}</h4>
					<p class="pp-guided-tour-custom-popover-description">${step.description}</p>
					${hintHtml}
					<div class="pp-guided-tour-custom-popover-footer">
						<button type="button" class="pp-guided-tour-custom-popover-skip">${config.i18n.skipStep}</button>
						<button type="button" class="pp-guided-tour-custom-popover-next">${hasMoreSteps ? config.i18n.next : config.i18n.done}</button>
					</div>
				</div>
			`;

			document.body.appendChild( popover );

			// Position the popover.
			this.positionCustomPopover( popover, element, iframe );

			// Bind events.
			popover.querySelector( '.pp-guided-tour-custom-popover-close' ).addEventListener( 'click', () => {
				this.cleanupIframeHighlight( element );
				popover.remove();
				this.skipTour();
			} );

			popover.querySelector( '.pp-guided-tour-custom-popover-skip' ).addEventListener( 'click', () => {
				this.cleanupIframeHighlight( element );
				popover.remove();
				this.handleEditorStepComplete( stepIndex );
			} );

			popover.querySelector( '.pp-guided-tour-custom-popover-next' ).addEventListener( 'click', () => {
				this.cleanupIframeHighlight( element );
				popover.remove();
				this.handleEditorStepComplete( stepIndex );
			} );

			// Make hint clickable to interact with the target element.
			const hintBtn = popover.querySelector( '.pp-guided-tour-hint-clickable' );
			if ( hintBtn ) {
				hintBtn.addEventListener( 'click', () => {
					// Click the target element to activate it.
					if ( element ) {
						element.click();
						element.focus();
					}
				} );
			}

			// Reposition on scroll/resize.
			const repositionHandler = () => this.positionCustomPopover( popover, element, iframe );
			window.addEventListener( 'resize', repositionHandler );
			iframe.contentWindow?.addEventListener( 'scroll', repositionHandler );

			// Store cleanup function.
			this.customPopoverCleanup = () => {
				window.removeEventListener( 'resize', repositionHandler );
				iframe.contentWindow?.removeEventListener( 'scroll', repositionHandler );
			};
		},

		/**
		 * Position custom popover relative to iframe element.
		 *
		 * @param {HTMLElement} popover The popover element.
		 * @param {HTMLElement} element Target element inside iframe.
		 * @param {HTMLElement} iframe The iframe element.
		 */
		positionCustomPopover( popover, element, iframe ) {
			const iframeRect = iframe.getBoundingClientRect();
			const elementRect = element.getBoundingClientRect();

			// Calculate position relative to viewport.
			const top = iframeRect.top + elementRect.top;
			const left = iframeRect.left + elementRect.left;
			const width = elementRect.width;
			const height = elementRect.height;

			// Position popover to the right of the element.
			popover.style.position = 'fixed';
			popover.style.top = `${top}px`;
			popover.style.left = `${left + width + 20}px`;
			popover.style.zIndex = '100001';

			// If popover goes off screen to the right, position it to the left.
			const popoverRect = popover.getBoundingClientRect();
			if ( popoverRect.right > window.innerWidth ) {
				popover.style.left = `${left - popoverRect.width - 20}px`;
			}

			// If popover goes off screen at bottom, adjust top.
			if ( popoverRect.bottom > window.innerHeight ) {
				popover.style.top = `${window.innerHeight - popoverRect.height - 20}px`;
			}
		},

		/**
		 * Clean up iframe highlight.
		 *
		 * @param {HTMLElement} element The highlighted element.
		 */
		cleanupIframeHighlight( element ) {
			if ( element ) {
				element.classList.remove( 'pp-guided-tour-highlight' );
			}
			if ( this.customPopoverCleanup ) {
				this.customPopoverCleanup();
				this.customPopoverCleanup = null;
			}
		},

		/**
		 * Show popover for editor step (non-iframe).
		 *
		 * @param {HTMLElement} element Target element.
		 * @param {Object} step Step configuration.
		 * @param {number} stepIndex Current step index.
		 */
		showEditorPopover( element, step, stepIndex ) {
			const driver = this.getDriver();
			if ( ! driver ) {
				console.error( 'PP Guided Tour: driver.js not available' );
				this.showEditorFallbackPopover( step );
				return;
			}

			// Store element reference for hint click handler.
			this.currentStepElement = element;

			// Build description with optional hint (clickable button).
			let description = step.description;
			if ( step.hint ) {
				description += `<button type="button" class="pp-guided-tour-hint pp-guided-tour-hint-clickable" onclick="window.ppGuidedTourManager.clickCurrentElement()">${step.hint}</button>`;
			}

			// Check if there are more steps after this one
			const hasMoreSteps = config.activeTour.steps.length > stepIndex + 1;

			this.driverInstance = driver( {
				showProgress: false,
				showButtons: [ 'next', 'close' ],
				steps: [
					{
						element: element,
						popover: {
							title: step.title,
							description: description,
							side: step.side || 'right',
							align: step.align || 'start',
						},
					},
				],
				nextBtnText: config.i18n.next,
				doneBtnText: hasMoreSteps ? config.i18n.next : config.i18n.done,
				popoverClass: 'pp-guided-tour-popover pp-guided-tour-editor-popover',
				stagePadding: 10,
				stageRadius: 8,
				allowClose: true,
				// Allow clicking on highlighted element to edit
				disableActiveInteraction: false,
				// Don't close on overlay click - let user edit
				overlayClickBehavior: 'none',

				onNextClick: () => {
					this.handleEditorStepComplete( stepIndex );
				},

				onCloseClick: () => {
					this.skipTour();
				},

				onPopoverRender: ( popover ) => {
					this.addEditorPopoverButtons( popover.wrapper, stepIndex );
				},
			} );

			this.driverInstance.drive();
		},

		/**
		 * Show fixed popover with simple highlight (no overlay).
		 * Used for toolbar buttons like List View and Block Inserter.
		 *
		 * @param {HTMLElement} element Target element.
		 * @param {Object} step Step configuration.
		 * @param {number} stepIndex Current step index.
		 */
		showFixedPopoverWithHighlight( element, step, stepIndex ) {
			// Add highlight class to the element.
			element.classList.add( 'pp-guided-tour-highlight' );

			// Inject highlight styles into document if not already there.
			if ( ! document.getElementById( 'pp-guided-tour-highlight-styles' ) ) {
				const style = document.createElement( 'style' );
				style.id = 'pp-guided-tour-highlight-styles';
				style.textContent = `
					.pp-guided-tour-highlight {
						outline: 3px solid #667eea !important;
						outline-offset: 4px !important;
						border-radius: 4px !important;
						animation: pp-highlight-pulse 1.5s ease-in-out infinite !important;
					}
					@keyframes pp-highlight-pulse {
						0%, 100% { outline-color: #667eea; }
						50% { outline-color: #764ba2; }
					}
				`;
				document.head.appendChild( style );
			}

			// Store element for cleanup.
			this.currentHighlightedElement = element;

			// Remove any existing fixed popover.
			const existingPopover = document.getElementById( 'pp-guided-tour-fixed-popover' );
			if ( existingPopover ) {
				existingPopover.remove();
			}

			// Build hint HTML (clickable).
			let hintHtml = '';
			if ( step.hint ) {
				hintHtml = `<button type="button" class="pp-guided-tour-hint pp-guided-tour-hint-clickable">${step.hint}</button>`;
			}

			// Check if there are more steps.
			const hasMoreSteps = config.activeTour.steps.length > stepIndex + 1;

			// Create fixed popover element.
			const popover = document.createElement( 'div' );
			popover.id = 'pp-guided-tour-fixed-popover';
			popover.className = 'pp-guided-tour-fixed-popover';
			popover.innerHTML = `
				<div class="pp-guided-tour-fixed-popover-content">
					<button type="button" class="pp-guided-tour-fixed-popover-close" aria-label="Close">&times;</button>
					<h4 class="pp-guided-tour-fixed-popover-title">${step.title}</h4>
					<p class="pp-guided-tour-fixed-popover-description">${step.description}</p>
					${hintHtml}
					<div class="pp-guided-tour-fixed-popover-footer">
						<button type="button" class="pp-guided-tour-fixed-popover-skip">${config.i18n.skipStep}</button>
						<button type="button" class="pp-guided-tour-fixed-popover-next">${hasMoreSteps ? config.i18n.next : config.i18n.done}</button>
					</div>
				</div>
			`;

			document.body.appendChild( popover );

			// Bind events.
			popover.querySelector( '.pp-guided-tour-fixed-popover-close' ).addEventListener( 'click', () => {
				this.cleanupFixedPopover( element );
				popover.remove();
				this.skipTour();
			} );

			popover.querySelector( '.pp-guided-tour-fixed-popover-skip' ).addEventListener( 'click', () => {
				this.cleanupFixedPopover( element );
				popover.remove();
				this.handleEditorStepComplete( stepIndex );
			} );

			popover.querySelector( '.pp-guided-tour-fixed-popover-next' ).addEventListener( 'click', () => {
				this.cleanupFixedPopover( element );
				popover.remove();
				this.handleEditorStepComplete( stepIndex );
			} );

			// Make hint clickable to interact with the target element.
			const hintBtn = popover.querySelector( '.pp-guided-tour-hint-clickable' );
			if ( hintBtn ) {
				hintBtn.addEventListener( 'click', () => {
					if ( element ) {
						element.click();
						element.focus();
					}
				} );
			}
		},

		/**
		 * Clean up fixed popover highlight.
		 *
		 * @param {HTMLElement} element The highlighted element.
		 */
		cleanupFixedPopover( element ) {
			if ( element ) {
				element.classList.remove( 'pp-guided-tour-highlight' );
			}
		},

		/**
		 * Add custom buttons to editor popover.
		 *
		 * @param {HTMLElement} wrapper Popover wrapper.
		 * @param {number} stepIndex Current step index.
		 */
		addEditorPopoverButtons( wrapper, stepIndex ) {
			const footer = wrapper.querySelector( '.driver-popover-footer' );
			if ( ! footer ) {
				return;
			}

			// Add skip button.
			const skipBtn = document.createElement( 'button' );
			skipBtn.className = 'pp-guided-tour-skip';
			skipBtn.textContent = config.i18n.skipStep;
			skipBtn.type = 'button';

			skipBtn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				this.handleEditorStepComplete( stepIndex );
			} );

			footer.insertBefore( skipBtn, footer.firstChild );
		},

		/**
		 * Handle editor step completion.
		 *
		 * @param {number} stepIndex Completed step index.
		 */
		async handleEditorStepComplete( stepIndex ) {
			if ( this.driverInstance ) {
				this.driverInstance.destroy();
			}

			const nextIndex = stepIndex + 1;
			const tour = config.activeTour;

			// Check if tour is complete.
			if ( ! tour.steps[ nextIndex ] ) {
				this.completeTour();
				return;
			}

			// Update progress.
			await this.updateProgress( nextIndex );

			// Check if next step is also in editor.
			const nextStep = tour.steps[ nextIndex ];
			if ( nextStep.context === 'editor' && nextStep.page === 'front_page' ) {
				// Show next step.
				config.state.step = nextIndex;
				setTimeout( () => this.resumeEditorTour(), 100 );
			} else {
				// Need to navigate elsewhere - show continue prompt or auto-navigate.
				this.showContinuePrompt( nextStep );
			}
		},

		/**
		 * Show fallback popover when element not found.
		 *
		 * @param {Object} step Step configuration.
		 */
		showEditorFallbackPopover( step ) {
			// Use fallback description if available, otherwise use regular description.
			const description = step.fallback_description || step.description;

			const currentStepIndex = config.state.step || 0;
			const hasMoreSteps = config.activeTour.steps.length > currentStepIndex + 1;
			const nextButtonText = hasMoreSteps ? config.i18n.next : config.i18n.done;

			// Create a floating popover without highlighting.
			const popover = document.createElement( 'div' );
			popover.className = 'pp-guided-tour-fallback-popover';
			popover.innerHTML = `
				<div class="pp-guided-tour-fallback-content">
					<h4>${ step.title }</h4>
					<p>${ description }</p>
					${ step.hint ? `<p class="pp-guided-tour-hint">${ step.hint }</p>` : '' }
					<div class="pp-guided-tour-fallback-actions">
						<button type="button" class="pp-guided-tour-fallback-next">${ nextButtonText }</button>
						<button type="button" class="pp-guided-tour-fallback-skip">${ config.i18n.skipStep }</button>
					</div>
				</div>
			`;

			document.body.appendChild( popover );

			popover.querySelector( '.pp-guided-tour-fallback-next' ).addEventListener( 'click', () => {
				popover.remove();
				this.handleEditorStepComplete( currentStepIndex );
			} );

			popover.querySelector( '.pp-guided-tour-fallback-skip' ).addEventListener( 'click', () => {
				popover.remove();
				this.handleEditorStepComplete( currentStepIndex );
			} );
		},

		/**
		 * Bind event listeners (admin context).
		 */
		bindEvents() {
			// Tour starter buttons.
			document.querySelectorAll( '[data-start-tour]' ).forEach( btn => {
				btn.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					const tourId = btn.dataset.startTour;
					this.startTour( tourId );
				} );
			} );

			// Continue prompt buttons.
			const continueBtn = document.querySelector( '.pp-guided-tour-continue-btn' );
			const dismissBtn = document.querySelector( '.pp-guided-tour-continue-dismiss' );

			if ( continueBtn ) {
				continueBtn.addEventListener( 'click', () => this.navigateToNextStep() );
			}
			if ( dismissBtn ) {
				dismissBtn.addEventListener( 'click', () => this.skipTour() );
			}

			// Handle page visibility changes (tab switching).
			document.addEventListener( 'visibilitychange', () => {
				if ( ! document.hidden && config.state?.active ) {
					this.resumeTour();
				}
			} );
		},

		/**
		 * Start a new tour.
		 *
		 * @param {string} tourId Tour identifier.
		 */
		async startTour( tourId ) {
			try {
				const response = await this.apiCall( 'start', { tour_id: tourId } );

				if ( response.success ) {
					config.state = response.data.state;
					config.activeTour = response.data.tour;

					// Navigate to first step's page if different.
					const firstStep = response.data.tour.steps[0];
					if ( firstStep ) {
						this.navigateToStep( firstStep );
					}
				}
			} catch ( error ) {
				console.error( 'Failed to start tour:', error );
			}
		},

		/**
		 * Navigate to a step's location.
		 *
		 * @param {Object} step Step configuration.
		 */
		navigateToStep( step ) {
			const stepContext = step.context || 'admin';

			switch ( stepContext ) {
				case 'frontend':
					if ( step.page === 'front_page' ) {
						window.location.href = config.adminUrl.replace( '/wp-admin/', '/' );
					}
					break;

				case 'editor':
					if ( step.page === 'front_page' && config.frontPageEditUrl ) {
						window.location.href = config.frontPageEditUrl;
					}
					break;

				case 'admin':
				default:
					window.location.href = config.adminUrl + step.page;
					break;
			}
		},

		/**
		 * Resume an active tour (admin context).
		 */
		resumeTour() {
			if ( ! config.activeTour || ! config.state?.active ) {
				return;
			}

			const currentStep = config.state.step || 0;
			const step = config.activeTour.steps[ currentStep ];

			if ( ! step ) {
				this.completeTour();
				return;
			}

			// Check context matches.
			const stepContext = step.context || 'admin';
			if ( stepContext !== 'admin' ) {
				// Show continue prompt to navigate to correct context.
				this.showContinuePrompt( step );
				return;
			}

			// Check if we're on the correct page for this step.
			if ( this.isOnPage( step.page ) ) {
				// Small delay to ensure DOM is ready.
				setTimeout( () => this.runStep( currentStep ), 100 );
			} else {
				// Show continue prompt.
				this.showContinuePrompt( step );
			}
		},

		/**
		 * Run a specific tour step (admin context).
		 *
		 * @param {number} stepIndex Step index.
		 */
		runStep( stepIndex ) {
			const driver = this.getDriver();
			if ( ! driver ) {
				console.error( 'PP Guided Tour: driver.js not available for admin step' );
				return;
			}
			const tour = config.activeTour;
			const step = tour.steps[ stepIndex ];

			if ( ! step ) {
				this.completeTour();
				return;
			}

			// Check if element exists.
			const element = document.querySelector( step.element );
			if ( ! element ) {
				console.warn( `Element not found: ${step.element}. Skipping to next step.` );
				// Element doesn't exist, try next step on same page or show continue prompt.
				const nextStep = tour.steps[ stepIndex + 1 ];
				if ( nextStep && this.isOnPage( nextStep.page ) ) {
					this.updateProgress( stepIndex + 1 );
					this.runStep( stepIndex + 1 );
				} else if ( nextStep ) {
					config.state.step = stepIndex + 1;
					this.showContinuePrompt( nextStep );
				} else {
					this.completeTour();
				}
				return;
			}

			// Configure driver.js.
			this.driverInstance = driver( {
				showProgress: true,
				showButtons: [ 'next', 'close' ],
				steps: this.buildDriverSteps( tour.steps, stepIndex ),
				progressText: `{{current}} / {{total}}`,
				nextBtnText: config.i18n.next,
				doneBtnText: config.i18n.done,
				popoverClass: 'pp-guided-tour-popover',
				stagePadding: 10,
				stageRadius: 8,

				onNextClick: ( element, step, opts ) => {
					const nextIndex = stepIndex + opts.state.activeIndex + 1;
					this.handleStepTransition( nextIndex );
				},

				onCloseClick: () => {
					this.skipTour();
				},

				onDestroyStarted: () => {
					// Called when tour is being destroyed.
				},

				onDestroyed: () => {
					// Cleanup.
				},

				onPopoverRender: ( popover, opts ) => {
					// Add skip button to popover.
					this.addSkipButton( popover.wrapper );
				},
			} );

			// Start the tour.
			this.driverInstance.drive();
		},

		/**
		 * Build driver.js steps array for current page.
		 *
		 * @param {Array} allSteps All tour steps.
		 * @param {number} startIndex Starting index.
		 * @return {Array} Steps for driver.js.
		 */
		buildDriverSteps( allSteps, startIndex ) {
			const driverSteps = [];
			const currentPageSteps = [];

			// Collect consecutive steps on the same page.
			for ( let i = startIndex; i < allSteps.length; i++ ) {
				const step = allSteps[ i ];
				const stepContext = step.context || 'admin';

				if ( stepContext === 'admin' && this.isOnPage( step.page ) && document.querySelector( step.element ) ) {
					currentPageSteps.push( {
						index: i,
						step: step,
					} );
				} else {
					break;
				}
			}

			// Convert to driver.js format.
			currentPageSteps.forEach( ( { step }, idx ) => {
				driverSteps.push( {
					element: step.element,
					popover: {
						title: step.title,
						description: step.description,
						side: step.side || 'bottom',
						align: step.align || 'center',
					},
				} );
			} );

			return driverSteps;
		},

		/**
		 * Handle transition between steps.
		 *
		 * @param {number} nextIndex Next step index.
		 */
		async handleStepTransition( nextIndex ) {
			if ( this.isNavigating ) {
				return;
			}

			const tour = config.activeTour;
			const nextStep = tour.steps[ nextIndex ];

			// Tour completed.
			if ( ! nextStep ) {
				if ( this.driverInstance ) {
					this.driverInstance.destroy();
				}
				this.completeTour();
				return;
			}

			// Update server state.
			await this.updateProgress( nextIndex );

			const nextContext = nextStep.context || 'admin';

			// Check if next step is on current page and same context.
			if ( nextContext === 'admin' && this.isOnPage( nextStep.page ) ) {
				// Just move driver to next step (it handles this internally).
				if ( this.driverInstance ) {
					this.driverInstance.moveNext();
				}
			} else {
				// Need to navigate to different page/context.
				if ( this.driverInstance ) {
					this.driverInstance.destroy();
				}
				this.navigateToStep( nextStep );
			}
		},

		/**
		 * Update tour progress on server.
		 *
		 * @param {number} step Step index.
		 * @return {Promise} API response.
		 */
		async updateProgress( step ) {
			config.state.step = step;

			try {
				const response = await this.apiCall( 'update', { step } );
				return response;
			} catch ( error ) {
				console.error( 'Failed to update progress:', error );
			}
		},

		/**
		 * Skip/dismiss the current tour.
		 */
		async skipTour() {
			if ( this.driverInstance ) {
				this.driverInstance.destroy();
			}

			this.hideContinuePrompt();
			this.hideWelcomeCard();

			try {
				await this.apiCall( 'skip' );
				config.state.active = false;
			} catch ( error ) {
				console.error( 'Failed to skip tour:', error );
			}
		},

		/**
		 * Complete the current tour.
		 */
		async completeTour() {
			if ( this.driverInstance ) {
				this.driverInstance.destroy();
			}

			this.hideContinuePrompt();

			try {
				await this.apiCall( 'complete' );
				config.state.active = false;

				// Show completion message.
				this.showCompletionMessage();
			} catch ( error ) {
				console.error( 'Failed to complete tour:', error );
			}
		},

		/**
		 * Show continue prompt when next step is on different page.
		 *
		 * @param {Object} nextStep Next step configuration.
		 */
		showContinuePrompt( nextStep ) {
			const prompt = document.getElementById( 'pp-guided-tour-continue-prompt' );
			if ( ! prompt ) {
				return;
			}

			const title = prompt.querySelector( '.pp-guided-tour-continue-title' );
			const message = prompt.querySelector( '.pp-guided-tour-continue-message' );

			if ( title ) {
				title.textContent = config.i18n.continueTitle;
			}
			if ( message ) {
				message.textContent = config.i18n.continueMessage;
			}

			prompt.style.display = 'block';

			// Determine next page URL based on context.
			const nextContext = nextStep.context || 'admin';
			let nextPageUrl = '';

			switch ( nextContext ) {
				case 'frontend':
					if ( nextStep.page === 'front_page' ) {
						nextPageUrl = config.adminUrl.replace( '/wp-admin/', '/' );
					}
					break;

				case 'editor':
					if ( nextStep.page === 'front_page' ) {
						nextPageUrl = config.frontPageEditUrl;
					}
					break;

				case 'admin':
				default:
					nextPageUrl = config.adminUrl + nextStep.page;
					break;
			}

			prompt.dataset.nextPage = nextPageUrl;
		},

		/**
		 * Hide continue prompt.
		 */
		hideContinuePrompt() {
			const prompt = document.getElementById( 'pp-guided-tour-continue-prompt' );
			if ( prompt ) {
				prompt.style.display = 'none';
			}
		},

		/**
		 * Hide welcome card (frontend).
		 */
		hideWelcomeCard() {
			const card = document.getElementById( 'pp-guided-tour-welcome' );
			if ( card ) {
				card.style.display = 'none';
			}
		},

		/**
		 * Navigate to the next step's page.
		 */
		navigateToNextStep() {
			const prompt = document.getElementById( 'pp-guided-tour-continue-prompt' );
			if ( prompt && prompt.dataset.nextPage ) {
				window.location.href = prompt.dataset.nextPage;
			}
		},

		/**
		 * Navigate to a specific page (admin context).
		 *
		 * @param {string} page Page path.
		 */
		navigateToPage( page ) {
			this.isNavigating = true;
			window.location.href = config.adminUrl + page;
		},

		/**
		 * Check if current page matches a step's page.
		 *
		 * @param {string} stepPage Step page path.
		 * @return {boolean} True if on the same page.
		 */
		isOnPage( stepPage ) {
			const current = config.currentPage;

			// Parse both URLs for comparison.
			const currentParams = this.parsePageUrl( current );
			const stepParams = this.parsePageUrl( stepPage );

			// Must match base page.
			if ( currentParams.base !== stepParams.base ) {
				return false;
			}

			// Check required query params from step.
			for ( const [ key, value ] of Object.entries( stepParams.params ) ) {
				if ( currentParams.params[ key ] !== value ) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Parse a page URL into base and params.
		 *
		 * @param {string} url URL string.
		 * @return {Object} Parsed URL.
		 */
		parsePageUrl( url ) {
			const [ base, queryString ] = url.split( '?' );
			const params = {};

			if ( queryString ) {
				queryString.split( '&' ).forEach( pair => {
					const [ key, value ] = pair.split( '=' );
					params[ key ] = value;
				} );
			}

			return { base, params };
		},

		/**
		 * Add skip button to popover.
		 *
		 * @param {HTMLElement} wrapper Popover wrapper element.
		 */
		addSkipButton( wrapper ) {
			// Check if already added.
			if ( wrapper.querySelector( '.pp-guided-tour-skip' ) ) {
				return;
			}

			const skipBtn = document.createElement( 'button' );
			skipBtn.className = 'pp-guided-tour-skip';
			skipBtn.textContent = config.i18n.skip;
			skipBtn.type = 'button';

			skipBtn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				this.skipTour();
			} );

			const footer = wrapper.querySelector( '.driver-popover-footer' );
			if ( footer ) {
				footer.insertBefore( skipBtn, footer.firstChild );
			}
		},

		/**
		 * Show tour completion message.
		 */
		showCompletionMessage() {
			const brandingIdNum = config.brandingId ? parseInt( config.brandingId, 10 ) : 0;
			console.log( 'PP Guided Tour: showCompletionMessage called', {
				brandingId: config.brandingId,
				brandingIdNum: brandingIdNum,
				isYourHosting: brandingIdNum === 5159,
			} );

			// Check for YourHosting branding (with safeguard).
			if ( brandingIdNum === 5159 ) {
				this.showYourHostingCompletionMessage();
				return;
			}

			this.showDefaultCompletionMessage();
		},

		/**
		 * Show the default tour completion message.
		 */
		showDefaultCompletionMessage() {
			// Create a simple notification.
			const notification = document.createElement( 'div' );
			notification.className = 'pp-guided-tour-complete-notice notice notice-success is-dismissible';
			notification.innerHTML = `
				<p><strong>${config.activeTour?.title || 'Tour'} completed!</strong></p>
				<button type="button" class="notice-dismiss">
					<span class="screen-reader-text">Dismiss this notice.</span>
				</button>
			`;

			// Insert after the first h1 or at start of content.
			const target = document.querySelector( '.wrap h1' ) || document.querySelector( '#wpbody-content' );
			if ( target ) {
				target.parentNode.insertBefore( notification, target.nextSibling );

				// Handle dismiss.
				notification.querySelector( '.notice-dismiss' ).addEventListener( 'click', () => {
					notification.remove();
				} );

				// Auto-dismiss after 5 seconds.
				setTimeout( () => notification.remove(), 5000 );
			}
		},

		/**
		 * Show YourHosting-specific completion message with publish CTA.
		 */
		showYourHostingCompletionMessage() {
			console.log( 'PP Guided Tour: showYourHostingCompletionMessage called' );

			try {
				// Determine publish URL - try admin bar first, then construct directly.
				let publishUrl = '';
				const adminBarPublish = document.querySelector( '#wp-admin-bar-iwp_migration_btn a' );

				if ( adminBarPublish ) {
					publishUrl = adminBarPublish.href;
				} else if ( config.adminUrl ) {
					// Construct publish URL directly (works in editor where admin bar isn't visible).
					publishUrl = config.adminUrl + 'admin.php?page=iwp_migrate_content';
				}

				console.log( 'PP Guided Tour: Publish URL', publishUrl );

				const notification = document.createElement( 'div' );
				notification.className = 'pp-guided-tour-complete-notice pp-guided-tour-yourhosting-complete';
				notification.innerHTML = `
					<div class="pp-guided-tour-yourhosting-complete-content">
						<button type="button" class="pp-guided-tour-yourhosting-complete-close" aria-label="Close">&times;</button>
						<h3>Great work! You're ready to go live!</h3>
						<p>You now know your way around your website. Time to share it with the world!</p>
						${ publishUrl ? `<a href="${ publishUrl }" class="pp-guided-tour-yourhosting-publish-btn">Publish Your Site</a>` : '' }
					</div>
				`;

				document.body.appendChild( notification );
				console.log( 'PP Guided Tour: YourHosting completion message appended to body' );

				// Close button handler (with safeguard).
				const closeBtn = notification.querySelector( '.pp-guided-tour-yourhosting-complete-close' );
				if ( closeBtn ) {
					closeBtn.addEventListener( 'click', () => notification.remove() );
				}
			} catch ( e ) {
				console.warn( 'PP Guided Tour: Could not show YourHosting completion message', e );
				// Fall back to default completion message.
				this.showDefaultCompletionMessage();
			}
		},

		/**
		 * Make API call to tour endpoints.
		 *
		 * @param {string} action Action name.
		 * @param {Object} data Additional data.
		 * @return {Promise} Response promise.
		 */
		async apiCall( action, data = {} ) {
			const formData = new FormData();
			formData.append( 'action', `pp_guided_tour_${action}` );
			formData.append( 'nonce', config.nonce );

			Object.entries( data ).forEach( ( [ key, value ] ) => {
				formData.append( key, value );
			} );

			const response = await fetch( config.ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				body: formData,
			} );

			return response.json();
		},
	};

	// Initialize when DOM is ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', () => TourManager.init() );
	} else {
		TourManager.init();
	}

	// Expose for external use.
	window.ppGuidedTourManager = TourManager;

} )();
