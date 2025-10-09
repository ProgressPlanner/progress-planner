/**
 * Progress Planner Tour
 * Handles the front-end onboarding tour functionality
 */
/* global ProgressPlannerData */

// eslint-disable-next-line no-unused-vars
class ProgressPlannerTour {
	constructor( config ) {
		this.popoverId = 'prpl-popover-front-end-onboarding';
		this.config = config;
		this.state = {
			currentStep: 0,
			data: {
				moreTasksCompleted: {},
				firstTaskCompleted: false,
				finished: false,
			},
			cleanup: null,
		};

		this.tourSteps = this.initializeTourSteps();
		this.setupStateProxy();

		// Set DOM related properties.
		this.popover = document.getElementById( this.popoverId );
		this.contentWrapper = this.popover.querySelector(
			'.tour-content-wrapper'
		);
		this.nextBtn = this.popover.querySelector( '.prpl-tour-next' );
		this.dashboardBtn = this.popover.querySelector( '#prpl-dashboard-btn' );
		this.closeBtn = this.popover.querySelector( '#prpl-tour-close-btn' );

		// Setup event listeners after DOM is ready
		this.setupEventListeners();
	}

	/**
	 * Initialize tour steps configuration
	 */
	initializeTourSteps() {
		return [
			{
				id: 'welcome',
				render: () =>
					document.getElementById( 'tour-step-welcome' ).innerHTML,
			},
			{
				id: 'first-task',
				render: () =>
					document.getElementById( 'tour-step-first-task' ).innerHTML,
				onMount: ( state ) => this.mountFirstTaskStep( state ),
				canProceed: ( state ) => !! state.data.firstTaskCompleted,
			},
			{
				id: 'badges',
				render: () =>
					document.getElementById( 'tour-step-badges' ).innerHTML,
			},
			{
				id: 'more-tasks',
				render: () =>
					document.getElementById( 'tour-step-more-tasks' ).innerHTML,
				onMount: ( state ) => this.mountMoreTasksStep( state ),
				canProceed: ( state ) => {
					return (
						Object.keys( state.data.moreTasksCompleted ).length >
							0 &&
						Object.values( state.data.moreTasksCompleted ).every(
							Boolean
						)
					);
				},
			},
		];
	}

	/**
	 * Mount first task step
	 * @param {Object} state
	 */
	mountFirstTaskStep( state ) {
		const btn = this.popover.querySelector( '#first-task-btn' );
		if ( ! btn ) return () => {};

		const handler = ( e ) => {
			const thisBtn = e.target.closest( 'button' );

			const form = thisBtn.closest( 'form' ); // find parent form
			let formValues = {};

			if ( form ) {
				const formData = new FormData( form );

				// Convert to plain object
				formValues = Object.fromEntries( formData.entries() );
			}

			ProgressPlannerTourUtils.completeTask(
				thisBtn.dataset.taskId,
				formValues
			)
				.then( () => {
					thisBtn.classList.add( 'prpl-complete-task-btn-completed' );
					state.data.firstTaskCompleted = {
						[ thisBtn.dataset.taskId ]: true,
					};
				} )
				.catch( ( error ) => {
					console.error( error );
					thisBtn.classList.add( 'prpl-complete-task-btn-error' );
				} );
		};

		btn.addEventListener( 'click', handler );
		return () => btn.removeEventListener( 'click', handler );
	}

	/**
	 * Mount more tasks step
	 * @param {Object} state
	 */
	mountMoreTasksStep( state ) {
		const moreTasks = this.popover.querySelectorAll(
			'.prpl-task-item[data-task-id]'
		);
		moreTasks.forEach( ( btn ) => {
			state.data.moreTasksCompleted[ btn.dataset.taskId ] = false;
		} );

		this.tasks = Array.from(
			this.popover.querySelectorAll( '[data-popover="task"]' )
		).map( ( t ) => new PopoverTask( t ) );

		const handler = ( e ) => {
			// Update state.
			state.data.moreTasksCompleted[ e.target.dataset.taskId ] = true;
		};

		this.popover.addEventListener( 'taskCompleted', ( e ) => handler( e ) );

		return () => {
			this.popover.removeEventListener( 'taskCompleted', handler );
		};
	}

	/**
	 * Render current step
	 */
	renderStep() {
		const step = this.tourSteps[ this.state.currentStep ];

		this.popover.querySelector( '.tour-content-wrapper' ).innerHTML =
			step.render();

		// Cleanup previous step
		if ( this.state.cleanup ) {
			this.state.cleanup();
		}

		// Mount current step
		if ( typeof step.onMount === 'function' ) {
			this.state.cleanup = step.onMount( this.state );
		} else {
			this.state.cleanup = () => {};
		}

		// Update step indicator
		this.popover.dataset.prplStep = this.state.currentStep;
		this.updateButtonStates();
		this.updateNextButton();
	}

	/**
	 * Update button visibility states
	 */
	updateButtonStates() {
		const isLastStep = this.state.currentStep === this.tourSteps.length - 1;

		// Toggle button visibility
		this.nextBtn.style.display = isLastStep ? 'none' : 'inline-block';
		this.dashboardBtn.style.display = isLastStep ? 'inline-block' : 'none';
	}

	/**
	 * Move to next step
	 */
	nextStep() {
		console.log(
			'nextStep() called, current step:',
			this.state.currentStep
		);
		const step = this.tourSteps[ this.state.currentStep ];

		if ( step.canProceed && ! step.canProceed( this.state ) ) {
			console.log( 'Cannot proceed - step requirements not met' );
			return;
		}

		if ( this.state.currentStep < this.tourSteps.length - 1 ) {
			this.state.currentStep++;
			console.log( 'Moving to step:', this.state.currentStep );
			this.saveProgressToServer();
			this.renderStep();
		} else {
			console.log( 'Closing tour - reached last step' );
			this.closeTour();
		}
	}

	/**
	 * Move to previous step
	 */
	prevStep() {
		if ( this.state.currentStep > 0 ) {
			this.state.currentStep--;
			this.renderStep();
		}
	}

	/**
	 * Close the tour
	 */
	closeTour() {
		if ( this.popover ) {
			this.popover.hidePopover();
		}
		this.saveProgressToServer();

		// Cleanup active step
		if ( this.state.cleanup ) {
			this.state.cleanup();
		}

		// Reset cleanup
		this.state.cleanup = null;
	}

	/**
	 * Start the tour
	 */
	startTour() {
		if ( this.popover ) {
			this.popover.showPopover();
			this.renderStep();
		}
	}

	/**
	 * Save progress to server
	 */
	async saveProgressToServer() {
		try {
			const response = await fetch( this.config.adminAjaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					state: JSON.stringify( this.state ),
					nonce: this.config.nonceProgressPlanner,
					action: 'progress_planner_tour_save_progress',
				} ),
				credentials: 'same-origin',
			} );

			if ( ! response.ok ) {
				throw new Error( 'Request failed: ' + response.status );
			}

			return response.json();
		} catch ( error ) {
			console.error( 'Failed to save tour progress:', error );
		}
	}

	/**
	 * Update next button state
	 */
	updateNextButton() {
		const step = this.tourSteps[ this.state.currentStep ];

		if ( step.canProceed ) {
			this.nextBtn.disabled = ! step.canProceed( this.state );
		} else {
			this.nextBtn.disabled = false;
		}
	}

	/**
	 * Update DOM, used for reactive updates.
	 * All changes which should happen when the state changes should be done here.
	 */
	updateDOM() {
		this.updateNextButton();
	}

	/**
	 * Get popover element
	 */
	getPopover() {
		return document.getElementById( this.popoverId );
	}

	/**
	 * Setup event listeners
	 */
	setupEventListeners() {
		console.log( 'Setting up event listeners...' );
		if ( this.popover ) {
			console.log( 'Popover found:', this.popover );

			this.popover.addEventListener( 'beforetoggle', ( event ) => {
				if ( event.newState === 'open' ) {
					console.log( 'Tour opened' );
				}
				if ( event.newState === 'closed' ) {
					console.log( 'Tour closed' );
				}
			} );

			if ( this.nextBtn ) {
				this.nextBtn.addEventListener( 'click', () => {
					console.log( 'Next button clicked!' );
					this.nextStep();
				} );
			}

			if ( this.dashboardBtn ) {
				this.dashboardBtn.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					console.log( 'Dashboard button clicked!' );
					this.state.data.finished = true;
					this.closeTour();

					// Redirect to the dashboard.
					window.location.href =
						this.dashboardBtn.getAttribute( 'data-redirect-to' );
				} );
			}

			if ( this.closeBtn ) {
				this.closeBtn.addEventListener( 'click', () => {
					console.log( 'Close button clicked!' );
					this.state.data.finished =
						this.state.currentStep === this.tourSteps.length - 1;
					this.closeTour();
				} );
			}
		} else {
			console.error( 'Popover not found!' );
		}
	}

	/**
	 * Setup state proxy for reactive updates
	 */
	setupStateProxy() {
		this.state.data = this.createDeepProxy( this.state.data, () =>
			this.updateDOM()
		);
	}

	/**
	 * Create deep proxy for nested object changes
	 * @param {Object}   target
	 * @param {Function} callback
	 */
	createDeepProxy( target, callback ) {
		// Recursively wrap existing nested objects first
		for ( const key of Object.keys( target ) ) {
			if (
				target[ key ] &&
				typeof target[ key ] === 'object' &&
				! Array.isArray( target[ key ] )
			) {
				target[ key ] = this.createDeepProxy( target[ key ], callback );
			}
		}

		return new Proxy( target, {
			set: ( obj, prop, value ) => {
				if (
					value &&
					typeof value === 'object' &&
					! Array.isArray( value )
				) {
					value = this.createDeepProxy( value, callback );
				}
				obj[ prop ] = value;
				callback();
				return true;
			},
		} );
	}
}

// eslint-disable-next-line no-unused-vars
class PopoverTask {
	constructor( el ) {
		this.el = el;
		this.id = el.dataset.taskId;
		this.popover = null;
		this.formValues = {};
		this.openPopoverBtn = el.querySelector( '[prpl-open-task-popover]' );

		// Register popover open event, this is needed to be able to open the popover from the button.
		this.openPopoverBtn?.addEventListener( 'click', () => this.open() );
	}

	registerEvents() {
		this.popover.addEventListener( 'click', ( e ) => {
			if ( e.target.classList.contains( 'prpl-complete-task-btn' ) ) {
				const formData = new FormData(
					this.popover.querySelector( 'form' )
				);
				this.formValues = Object.fromEntries( formData.entries() );
				this.complete();
			}
		} );

		this.popover
			.querySelector( '.prpl-popover-close' )
			?.addEventListener( 'click', () => this.close() );

		this.setupFormValidation();

		// Initialize upload handling (only if upload field exists)
		this.setupFileUpload();

		this.el.addEventListener( 'prplFileUploaded', ( e ) => {
			// Handle file upload for the 'set site icon' task.
			if ( 'core-siteicon' === e.detail.fileInput.dataset.taskId ) {
				// Element which will be used to store the file post ID.
				const nextElementSibling =
					e.detail.fileInput.nextElementSibling;

				nextElementSibling.value = e.detail.filePost.id;

				// Trigger change so validation is triggered and "Complete" button is enabled.
				nextElementSibling.dispatchEvent(
					new CustomEvent( 'change', {
						bubbles: true,
					} )
				);
			}
		} );
	}

	open() {
		if ( this.popover ) return;

		const content = this.el
			.querySelector( 'template' )
			.content.cloneNode( true );
		this.popover = document.createElement( 'div' );
		this.popover.className =
			'prpl-popover prpl-popover-onboarding prpl-task-popover';
		this.popover.setAttribute( 'popover', 'manual' );
		this.popover.appendChild( content );

		// Add close button.
		const closeBtn = document.createElement( 'button' );
		closeBtn.className = 'prpl-popover-close';
		closeBtn.setAttribute( 'popovertarget', this.popover.id );
		closeBtn.setAttribute( 'popovertargetaction', 'hide' );
		closeBtn.innerHTML = '<span class="dashicons dashicons-no-alt"></span>';
		this.popover.appendChild( closeBtn );

		document.body.appendChild( this.popover );

		// Register events
		this.registerEvents();

		this.popover.showPopover();
	}

	close() {
		this.popover?.remove();
		this.popover = null;
	}

	complete() {
		ProgressPlannerTourUtils.completeTask( this.id, this.formValues )
			.then( () => {
				this.el.classList.add( 'completed' );
				this.el
					.querySelector( '.prpl-complete-task-btn' )
					.classList.add( 'prpl-complete-task-btn-completed' );

				this.close();
				this.notifyParent();
			} )
			.catch( ( error ) => {
				console.error( error );
				// TODO: Handle error.
			} );
	}

	notifyParent() {
		const event = new CustomEvent( 'taskCompleted', {
			bubbles: true,
			detail: { id: this.id, formValues: this.formValues },
		} );
		this.el.dispatchEvent( event );
	}

	setupFormValidation() {
		const form = this.popover.querySelector( 'form' );
		const submitButton = this.popover.querySelector(
			'.prpl-complete-task-btn'
		);

		if ( ! form || ! submitButton ) return;

		const validateElements = form.querySelectorAll( '[data-validate]' );
		if ( validateElements.length === 0 ) return;

		const checkValidation = () => {
			let isValid = true;

			validateElements.forEach( ( element ) => {
				const validationType = element.getAttribute( 'data-validate' );
				let elementValid = false;

				switch ( validationType ) {
					case 'required':
						elementValid =
							element.value !== null &&
							element.value !== undefined &&
							element.value !== '';
						break;
					case 'not-empty':
						elementValid = element.value.trim() !== '';
						break;
					default:
						elementValid = true;
				}

				if ( ! elementValid ) {
					isValid = false;
				}
			} );

			submitButton.disabled = ! isValid;
		};

		checkValidation();
		validateElements.forEach( ( element ) => {
			element.addEventListener( 'change', checkValidation );
			element.addEventListener( 'input', checkValidation );
		} );
	}

	/**
	 * Handles drag-and-drop or manual file upload for specific tasks.
	 * Only runs if the form contains an upload field.
	 */
	setupFileUpload() {
		const uploadContainer = this.popover.querySelector(
			'[data-upload-field]'
		);
		if ( ! uploadContainer ) return; // no upload for this task

		const fileInput = uploadContainer.querySelector( 'input[type="file"]' );
		const statusDiv = uploadContainer.querySelector(
			'.prpl-upload-status'
		);

		// Visual drag behavior
		[ 'dragenter', 'dragover' ].forEach( ( event ) => {
			uploadContainer.addEventListener( event, ( e ) => {
				e.preventDefault();
				uploadContainer.classList.add( 'dragover' );
			} );
		} );

		[ 'dragleave', 'drop' ].forEach( ( event ) => {
			uploadContainer.addEventListener( event, ( e ) => {
				e.preventDefault();
				uploadContainer.classList.remove( 'dragover' );
			} );
		} );

		uploadContainer.addEventListener( 'drop', ( e ) => {
			const file = e.dataTransfer.files[ 0 ];
			if ( file ) {
				this.uploadFile( file, statusDiv ).then( ( response ) => {
					this.el.dispatchEvent(
						new CustomEvent( 'prplFileUploaded', {
							detail: { file, filePost: response, fileInput },
							bubbles: true,
						} )
					);
				} );
			}
		} );

		fileInput?.addEventListener( 'change', ( e ) => {
			const file = e.target.files[ 0 ];
			if ( file ) {
				this.uploadFile( file, statusDiv, fileInput ).then(
					( response ) => {
						this.el.dispatchEvent(
							new CustomEvent( 'prplFileUploaded', {
								detail: { file, filePost: response, fileInput },
								bubbles: true,
							} )
						);
					}
				);
			}
		} );
	}

	async uploadFile( file, statusDiv ) {
		// Validate file extension
		if ( ! this.isValidFaviconFile( file ) ) {
			const fileInput =
				this.popover.querySelector( 'input[type="file"]' );
			const acceptedTypes = fileInput?.accept || 'supported file types';
			statusDiv.textContent = `Invalid file type. Please upload a file with one of these formats: ${ acceptedTypes }`;
			return;
		}

		statusDiv.textContent = `Uploading ${ file.name }...`;

		const formData = new FormData();
		formData.append( 'file', file );
		formData.append( 'prplFileUpload', '1' );

		return fetch( '/wp-json/wp/v2/media', {
			method: 'POST',
			headers: {
				'X-WP-Nonce': ProgressPlannerData.nonceWPAPI, // usually wp_localize_script adds this
			},
			body: formData,
			credentials: 'same-origin',
		} )
			.then( ( res ) => {
				if ( 201 !== res.status ) {
					throw new Error( 'Failed to upload file' );
				}
				return res.json();
			} )
			.then( ( response ) => {
				statusDiv.textContent = `${ file.name } uploaded.`;
				return response;
			} )
			.catch( ( error ) => {
				console.error( error );
				statusDiv.textContent = `Error: ${ error.message }`;
			} );
	}

	/**
	 * Validate if file matches the accepted file types from the input
	 * @param {File} file The file to validate
	 * @return {boolean} True if file extension is supported
	 */
	isValidFaviconFile( file ) {
		const fileInput = this.popover.querySelector( 'input[type="file"]' );
		if ( ! fileInput || ! fileInput.accept ) {
			return true; // No restrictions if no accept attribute
		}

		const acceptedTypes = fileInput.accept
			.split( ',' )
			.map( ( type ) => type.trim() );
		const fileName = file.name.toLowerCase();

		return acceptedTypes.some( ( type ) => {
			if ( type.startsWith( '.' ) ) {
				// Extension-based validation
				return fileName.endsWith( type );
			} else if ( type.includes( '/' ) ) {
				// MIME type-based validation
				return file.type === type;
			}
			return false;
		} );
	}
}

class ProgressPlannerTourUtils {
	/**
	 * Complete a task via AJAX
	 * @param {string} taskId
	 * @param {Object} formValues
	 */
	static async completeTask( taskId, formValues = {} ) {
		const response = await fetch( ProgressPlannerData.adminAjaxUrl, {
			method: 'POST',
			body: new URLSearchParams( {
				form_values: JSON.stringify( formValues ),
				task_id: taskId,
				nonce: ProgressPlannerData.nonceProgressPlanner,
				action: 'progress_planner_tour_complete_task',
			} ),
		} );

		if ( ! response.ok ) {
			throw new Error( 'Request failed: ' + response.status );
		}

		return response.json();
	}
}
