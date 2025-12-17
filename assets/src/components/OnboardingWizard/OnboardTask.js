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
 * @param {Object}   props            - Component props.
 * @param {Object}   props.task       - Task data.
 * @param {Object}   props.config     - Wizard configuration.
 * @param {Function} props.onComplete - Callback when task is completed.
 * @return {JSX.Element} OnboardTask component.
 */
export default function OnboardTask( { task, config, onComplete } ) {
	const { ajaxUrl, nonce } = config;
	const { completeTask, isCompleting } = useTaskCompletion( {
		ajaxUrl,
		nonce,
	} );

	const [ isOpen, setIsOpen ] = useState( false );
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
	};

	/**
	 * Handle close task.
	 */
	const handleClose = () => {
		setIsOpen( false );
	};

	if ( isOpen ) {
		return (
			<div className="prpl-task-content-active" ref={ taskContentRef }>
				<div className="prpl-task-buttons">
					<button
						type="button"
						className="prpl-btn prpl-task-close-btn"
						onClick={ handleClose }
					>
						<span className="dashicons dashicons-arrow-left-alt2"></span>
						{ config?.l10n?.backToRecommendations ||
							__(
								'Back to recommendations',
								'progress-planner'
							) }
					</button>
					<button
						type="button"
						className="prpl-complete-task-btn"
						onClick={ handleComplete }
						disabled={ isCompleting }
					>
						{ isCompleting
							? __( 'Completing…', 'progress-planner' )
							: __( 'Complete', 'progress-planner' ) }
					</button>
				</div>
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
							ref={ ( el ) => {
								if ( el && templateHtml ) {
									// Re-initialize file upload handlers after template is rendered.
									const fileInputs =
										el.querySelectorAll(
											'input[type="file"]'
										);
									fileInputs.forEach( ( input ) => {
										// File upload handling will be done by existing JavaScript if available.
										// The PHP template includes the necessary data attributes.
									} );
								}
							} }
						/>
					) : (
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
