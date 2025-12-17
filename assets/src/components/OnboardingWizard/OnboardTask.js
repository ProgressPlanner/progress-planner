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
 * @param {Object} props          - Component props.
 * @param {Object} props.task     - Task data.
 * @param {Object} props.config   - Wizard configuration.
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
							__( 'Back to recommendations', 'progress-planner' ) }
					</button>
					<button
						type="button"
						className="prpl-complete-task-btn"
						onClick={ handleComplete }
						disabled={ isCompleting }
					>
						{ isCompleting
							? __( 'Completing...', 'progress-planner' )
							: __( 'Complete', 'progress-planner' ) }
					</button>
				</div>
				<div className="prpl-task-form">
					{ /* Task form content will be rendered here */ }
					{ task.title && <h4>{ task.title }</h4> }
					{ task.url && (
						<a
							href={ task.url }
							target="_blank"
							rel="noopener noreferrer"
							className="prpl-button-primary"
						>
							{ task.action_label || __( 'Do it', 'progress-planner' ) }
						</a>
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

