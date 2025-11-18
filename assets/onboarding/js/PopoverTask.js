/**
 * PopoverTask - Handles individual tasks that open sub-popovers
 * Used by the MoreTasksStep for tasks that require user input
 */
/* global ProgressPlannerOnboardData, ProgressPlannerTourUtils */

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
		if ( this.popover ) {
			return;
		}

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

		if ( ! form || ! submitButton ) {
			return;
		}

		const validateElements = form.querySelectorAll( '[data-validate]' );
		if ( validateElements.length === 0 ) {
			return;
		}

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
		if ( ! uploadContainer ) {
			return;
		} // no upload for this task

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
				'X-WP-Nonce': ProgressPlannerOnboardData.nonceWPAPI, // usually wp_localize_script adds this
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
