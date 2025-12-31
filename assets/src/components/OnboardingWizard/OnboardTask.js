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

	if ( isOpen ) {
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
