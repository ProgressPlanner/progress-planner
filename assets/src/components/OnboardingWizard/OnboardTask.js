/**
 * OnboardTask Component
 *
 * Individual task component for MoreTasksStep.
 * Handles task form toggling, file uploads, and completion.
 *
 * @package
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useTaskCompletion } from '../../hooks/useTaskCompletion';
import TASK_FORMS from './TaskForms';

/**
 * OnboardTask component.
 *
 * @param {Object}   props                     - Component props.
 * @param {Object}   props.task                - Task data.
 * @param {Object}   props.config              - Wizard configuration.
 * @param {Function} props.onComplete          - Callback when task is completed.
 * @param {Function} props.onOpenChange        - Callback when task open state changes.
 * @param {boolean}  props.forceOpen           - If true, render in open state.
 * @param {boolean}  props.disableActionButton - If true, disable the template's action button by default.
 * @return {JSX.Element} OnboardTask component.
 */
export default function OnboardTask( {
	task,
	config,
	onComplete,
	onOpenChange,
	forceOpen = false,
	disableActionButton = false,
} ) {
	const { ajaxUrl, nonce } = config;
	const { completeTask } = useTaskCompletion( {
		ajaxUrl,
		nonce,
	} );

	const [ isOpen, setIsOpen ] = useState( forceOpen );
	const [ isCompleted, setIsCompleted ] = useState( false );
	const [ formValues, setFormValues ] = useState( {} );
	const taskContentRef = useRef( null );

	// Use template HTML from task data if available, otherwise fetch it.
	const [ templateHtml, setTemplateHtml ] = useState(
		task?.template_html || ''
	);
	const [ isLoadingTemplate, setIsLoadingTemplate ] = useState( false );

	// Fetch template if not provided in task data.
	useEffect( () => {
		if ( ! task?.task_id || task?.template_html ) {
			return;
		}

		const fetchTemplate = async () => {
			setIsLoadingTemplate( true );
			try {
				const formData = new FormData();
				formData.append(
					'action',
					'progress_planner_get_task_template'
				);
				formData.append( 'nonce', nonce );
				formData.append( 'task_id', task.task_id );
				formData.append( 'task_data', JSON.stringify( task ) );

				const response = await fetch( ajaxUrl, {
					method: 'POST',
					body: formData,
				} ).then( ( res ) => res.json() );

				if ( response.success && response.data?.html ) {
					setTemplateHtml( response.data.html );
				}
			} catch ( error ) {
				console.error( 'Failed to fetch task template:', error );
			} finally {
				setIsLoadingTemplate( false );
			}
		};

		fetchTemplate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ task?.task_id, task?.template_html, ajaxUrl, nonce ] );

	/**
	 * Handle task completion.
	 */
	const handleComplete = async () => {
		if ( ! task?.task_id ) {
			return;
		}

		try {
			await completeTask( task.task_id, formValues );
			setIsCompleted( true );
			// Close the task view and return to task list.
			setIsOpen( false );
			onOpenChange?.( false );
			onComplete?.( task.task_id );
		} catch ( error ) {
			console.error( 'Failed to complete task:', error );
		}
	};

	/**
	 * Handle open task.
	 */
	const handleOpen = () => {
		setIsOpen( true );
		onOpenChange?.( true );
	};

	/**
	 * Handle close task.
	 */
	const handleClose = () => {
		setIsOpen( false );
		onOpenChange?.( false );
	};

	/**
	 * Validate if file matches the accepted file types from the input.
	 *
	 * @param {File}             file      - The file to validate.
	 * @param {HTMLInputElement} fileInput - The file input element.
	 * @return {boolean} True if file extension is supported.
	 */
	const isValidFile = ( file, fileInput ) => {
		if ( ! fileInput || ! fileInput.accept ) {
			return true;
		}

		const acceptedTypes = fileInput.accept
			.split( ',' )
			.map( ( type ) => type.trim() );
		const fileName = file.name.toLowerCase();

		return acceptedTypes.some( ( type ) => {
			if ( type.startsWith( '.' ) ) {
				return fileName.endsWith( type );
			} else if ( type.includes( '/' ) ) {
				return file.type === type;
			}
			return false;
		} );
	};

	/**
	 * Upload file to WordPress media library.
	 *
	 * @param {File}        file      - The file to upload.
	 * @param {HTMLElement} statusDiv - The status div element.
	 * @param {HTMLElement} el        - The container element.
	 * @return {Promise} Promise resolving to the uploaded file response.
	 */
	const uploadFile = async ( file, statusDiv, el ) => {
		const fileInput = el.querySelector( 'input[type="file"]' );

		if ( ! isValidFile( file, fileInput ) ) {
			const acceptedTypes = fileInput?.accept || 'supported file types';
			statusDiv.textContent = `Invalid file type. Please upload: ${ acceptedTypes }`;
			return null;
		}

		statusDiv.textContent = `Uploading ${ file.name }...`;
		statusDiv.style.display = '';

		const formData = new FormData();
		formData.append( 'file', file );
		formData.append( 'prplFileUpload', '1' );

		try {
			const response = await fetch( '/wp-json/wp/v2/media', {
				method: 'POST',
				headers: {
					'X-WP-Nonce': config.nonceWPAPI,
				},
				body: formData,
				credentials: 'same-origin',
			} );

			if ( response.status !== 201 ) {
				throw new Error( 'Failed to upload file' );
			}

			const result = await response.json();
			statusDiv.style.display = 'none';

			// Update file preview.
			const previewDiv = el.querySelector( '.prpl-file-preview' );
			if ( previewDiv ) {
				previewDiv.innerHTML = `<img src="${ result.source_url }" alt="${ file.name }" />`;
				previewDiv.style.display = 'block';
			}

			// Update drop zone styling.
			const dropZone = el.querySelector( '.prpl-file-drop-zone' );
			if ( dropZone ) {
				dropZone.classList.add( 'has-image' );
				const removeBtn = dropZone.querySelector(
					'.prpl-file-remove-btn'
				);
				if ( removeBtn ) {
					removeBtn.hidden = false;
				}
			}

			return result;
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Upload error:', error );
			statusDiv.textContent = `Error: ${ error.message }`;
			return null;
		}
	};

	/**
	 * Remove uploaded file and reset drop zone.
	 *
	 * @param {HTMLElement} dropZone   - The drop zone element.
	 * @param {HTMLElement} previewDiv - The preview div element.
	 */
	const removeUploadedFile = ( dropZone, previewDiv ) => {
		previewDiv.innerHTML = '';
		previewDiv.style.display = 'none';

		dropZone.classList.remove( 'has-image' );

		const removeBtn = dropZone.querySelector( '.prpl-file-remove-btn' );
		if ( removeBtn ) {
			removeBtn.hidden = true;
		}

		const fileInput = dropZone.querySelector( 'input[type="file"]' );
		if ( fileInput ) {
			fileInput.value = '';
		}

		const postIdInput = dropZone.querySelector( 'input[name="post_id"]' );
		if ( postIdInput ) {
			postIdInput.value = '';
			postIdInput.dispatchEvent(
				new CustomEvent( 'change', { bubbles: true } )
			);
		}

		const statusDiv = dropZone.querySelector( '.prpl-upload-status' );
		if ( statusDiv ) {
			statusDiv.style.display = '';
			statusDiv.textContent = '';
		}
	};

	/**
	 * Set up file upload functionality for drop zone.
	 *
	 * @param {HTMLElement} el - The container element.
	 */
	const setupFileUpload = ( el ) => {
		const uploadContainer = el.querySelector( '[data-upload-field]' );
		if ( ! uploadContainer ) {
			return;
		}

		// Prevent duplicate event listener setup.
		if ( uploadContainer.dataset.uploadInitialized ) {
			return;
		}
		uploadContainer.dataset.uploadInitialized = 'true';

		const fileInput = uploadContainer.querySelector( 'input[type="file"]' );
		const statusDiv = uploadContainer.querySelector(
			'.prpl-upload-status'
		);
		const previewDiv =
			uploadContainer.querySelector( '.prpl-file-preview' );

		// Drag and drop visual feedback.
		[ 'dragenter', 'dragover' ].forEach( ( eventName ) => {
			uploadContainer.addEventListener( eventName, ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				uploadContainer.classList.add( 'dragover' );
			} );
		} );

		// Handle dragleave.
		uploadContainer.addEventListener( 'dragleave', ( e ) => {
			e.preventDefault();
			e.stopPropagation();
			uploadContainer.classList.remove( 'dragover' );
		} );

		// Handle drop.
		uploadContainer.addEventListener( 'drop', async ( e ) => {
			e.preventDefault();
			e.stopPropagation();
			uploadContainer.classList.remove( 'dragover' );
			const file = e.dataTransfer.files[ 0 ];
			if ( file ) {
				const result = await uploadFile( file, statusDiv, el );
				if ( result && fileInput ) {
					// Update hidden post_id input for site icon task.
					const postIdInput = fileInput.nextElementSibling;
					if ( postIdInput && postIdInput.name === 'post_id' ) {
						postIdInput.value = result.id;
						postIdInput.dispatchEvent(
							new CustomEvent( 'change', { bubbles: true } )
						);
					}
				}
			}
		} );

		// Handle file input change.
		fileInput?.addEventListener( 'change', async ( e ) => {
			const file = e.target.files[ 0 ];
			if ( file ) {
				const result = await uploadFile( file, statusDiv, el );
				if ( result ) {
					// Update hidden post_id input for site icon task.
					const postIdInput = fileInput.nextElementSibling;
					if ( postIdInput && postIdInput.name === 'post_id' ) {
						postIdInput.value = result.id;
						postIdInput.dispatchEvent(
							new CustomEvent( 'change', { bubbles: true } )
						);
					}
				}
			}
		} );

		// Handle remove button.
		const removeBtn = uploadContainer.querySelector(
			'.prpl-file-remove-btn'
		);
		removeBtn?.addEventListener( 'click', () => {
			removeUploadedFile( uploadContainer, previewDiv );
		} );
	};

	// Look up React form component for this task.
	const TaskFormComponent = task?.task_id ? TASK_FORMS[ task.task_id ] : null;

	/**
	 * Handle React form submission.
	 *
	 * @param {Event} e - The form submit event.
	 */
	const handleFormSubmit = ( e ) => {
		e.preventDefault();
		const formData = new FormData( e.target );
		setFormValues( Object.fromEntries( formData.entries() ) );
		setTimeout( () => handleComplete(), 0 );
	};

	if ( isOpen ) {
		// Render with native React form component if available.
		if ( TaskFormComponent ) {
			return (
				<div
					className="prpl-task-content-active"
					ref={ taskContentRef }
				>
					<div className="prpl-task-form">
						<form
							className="prpl-onboarding-task-form"
							onSubmit={ handleFormSubmit }
							ref={ ( el ) => {
								if ( el ) {
									setupFileUpload( el );
								}
							} }
						>
							<TaskFormComponent task={ task } />
							<div className="prpl-task-buttons">
								<button
									type="button"
									className="prpl-btn prpl-task-close-btn"
									onClick={ handleClose }
								>
									<span className="dashicons dashicons-arrow-left-alt2"></span>{ ' ' }
									{ config?.l10n?.backToRecommendations ||
										__(
											'Back to recommendations',
											'progress-planner'
										) }
								</button>
								<button
									type="submit"
									className="prpl-complete-task-btn prpl-btn prpl-btn-secondary"
									data-task-id={ task.task_id }
								>
									{ task.action_label ||
										__(
											'Mark as complete',
											'progress-planner'
										) }
								</button>
							</div>
						</form>
					</div>
				</div>
			);
		}

		return (
			<div className="prpl-task-content-active" ref={ taskContentRef }>
				<div className="prpl-task-form">
					{ isLoadingTemplate && (
						<div className="prpl-spinner">
							<span
								className="spinner"
								style={ { visibility: 'visible' } }
							></span>
						</div>
					) }
					{ ! isLoadingTemplate && templateHtml && (
						<div
							dangerouslySetInnerHTML={ { __html: templateHtml } }
							role="presentation"
							onClick={ ( e ) => {
								// Handle form submission and file uploads.
								if (
									e.target.classList.contains(
										'prpl-complete-task-btn'
									)
								) {
									const form = e.target.closest( 'form' );
									if ( form ) {
										const formData = new FormData( form );
										setFormValues(
											Object.fromEntries(
												formData.entries()
											)
										);
										// Trigger completion after form values are set.
										setTimeout( () => handleComplete(), 0 );
									}
								}
							} }
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' || e.key === ' ' ) {
									e.preventDefault();
									const target = e.target;
									if (
										target.classList.contains(
											'prpl-complete-task-btn'
										)
									) {
										const form = target.closest( 'form' );
										if ( form ) {
											const formData = new FormData(
												form
											);
											setFormValues(
												Object.fromEntries(
													formData.entries()
												)
											);
											setTimeout(
												() => handleComplete(),
												0
											);
										}
									}
								}
							} }
							tabIndex={ -1 }
							ref={ ( el ) => {
								if ( el && templateHtml ) {
									// Set up file upload functionality (has its own guard).
									setupFileUpload( el );

									// Prevent duplicate button creation on re-renders.
									if (
										el.querySelector( '.prpl-task-buttons' )
									) {
										return;
									}

									const actionBtn = el.querySelector(
										'.prpl-complete-task-btn'
									);

									if ( actionBtn ) {
										// Create button wrapper like develop branch does.
										const buttonWrapper =
											document.createElement( 'div' );
										buttonWrapper.className =
											'prpl-task-buttons';

										// Create close button.
										const closeBtn =
											document.createElement( 'button' );
										closeBtn.type = 'button';
										closeBtn.className =
											'prpl-btn prpl-task-close-btn';
										closeBtn.innerHTML =
											'<span class="dashicons dashicons-arrow-left-alt2"></span> ' +
											( config?.l10n
												?.backToRecommendations ||
												'Back to recommendations' );
										closeBtn.addEventListener(
											'click',
											handleClose
										);

										// Insert wrapper before action button, then move buttons into it.
										actionBtn.parentNode.insertBefore(
											buttonWrapper,
											actionBtn
										);
										buttonWrapper.appendChild( closeBtn );
										buttonWrapper.appendChild( actionBtn );

										// Disable action button by default if requested.
										if ( disableActionButton ) {
											actionBtn.disabled = true;
											actionBtn.classList.add(
												'prpl-btn-disabled'
											);

											// Enable button when user makes a selection.
											const enableButton = () => {
												actionBtn.disabled = false;
												actionBtn.classList.remove(
													'prpl-btn-disabled'
												);
											};

											// Watch for form input changes.
											const inputs = el.querySelectorAll(
												'input, select, textarea'
											);
											inputs.forEach( ( input ) => {
												input.addEventListener(
													'change',
													enableButton
												);
												input.addEventListener(
													'input',
													enableButton
												);
											} );

											// Watch for file uploads.
											const fileInputs =
												el.querySelectorAll(
													'input[type="file"]'
												);
											fileInputs.forEach(
												( fileInput ) => {
													fileInput.addEventListener(
														'change',
														enableButton
													);
												}
											);

											// Watch for custom events (e.g., from media uploader).
											el.addEventListener(
												'prpl-task-input-changed',
												enableButton
											);
										}
									}
								}
							} }
						/>
					) }
					{ ! isLoadingTemplate && ! templateHtml && (
						<>
							{ task.title && <h4>{ task.title }</h4> }
							{ task.url && (
								<a
									href={ task.url }
									target="_blank"
									rel="noopener noreferrer"
									className="prpl-button-primary"
								>
									{ task.action_label ||
										__( 'Do it', 'progress-planner' ) }
								</a>
							) }
						</>
					) }
				</div>
			</div>
		);
	}

	return (
		<div className="prpl-task-item" data-task-id={ task?.task_id }>
			<button
				type="button"
				className="prpl-open-task-btn"
				onClick={ handleOpen }
				disabled={ isCompleted }
			>
				{ task?.title || __( 'Task', 'progress-planner' ) }
				{ isCompleted && ' ✓' }
			</button>
		</div>
	);
}
