/**
 * FirstTaskStep Component
 *
 * Step for completing the first onboarding task.
 * The Next button is hidden - user advances by completing the task.
 *
 * @package
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { useTaskCompletion } from '../../../hooks/useTaskCompletion';
import TASK_FORMS from '../TaskForms';

/**
 * FirstTaskStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} FirstTask step component.
 */
export default function FirstTaskStep( props ) {
	const { wizardState, updateState, onNext, stepData, config } = props;
	const { ajaxUrl, nonce } = config;
	const brandingName =
		config?.l10n?.brandingName ||
		__( 'Progress Planner', 'progress-planner' );

	const { completeTask } = useTaskCompletion( {
		ajaxUrl,
		nonce,
	} );

	const [ isCompleting, setIsCompleting ] = useState( false );
	const taskContentRef = useRef( null );

	const task = stepData?.data?.task;

	// Look up React form component for this task.
	const TaskFormComponent = task?.task_id ? TASK_FORMS[ task.task_id ] : null;

	/**
	 * Handle task completion.
	 *
	 * @param {string} taskId     - Task ID.
	 * @param {Object} formValues - Form values from task.
	 */
	const handleCompleteTask = async ( taskId, formValues = {} ) => {
		if ( ! taskId || isCompleting ) {
			return;
		}

		setIsCompleting( true );

		try {
			await completeTask( taskId, formValues );
			updateState( {
				data: {
					...wizardState.data,
					firstTaskCompleted: true,
				},
			} );
			// Auto-advance to next step.
			onNext();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Failed to complete task:', error );
			setIsCompleting( false );
		}
	};

	/**
	 * Handle React form submission.
	 *
	 * @param {Event} e - The form submit event.
	 */
	const handleFormSubmit = ( e ) => {
		e.preventDefault();
		const formData = new FormData( e.target );
		const formValues = Object.fromEntries( formData.entries() );
		handleCompleteTask( task.task_id, formValues );
	};

	// Attach click handler after render (for dangerouslySetInnerHTML fallback).
	useEffect( () => {
		// Skip if using React form component.
		if ( TaskFormComponent ) {
			return;
		}

		if ( ! taskContentRef.current ) {
			return;
		}

		const btn = taskContentRef.current.querySelector(
			'.prpl-complete-task-btn'
		);
		if ( ! btn ) {
			return;
		}

		const handleClick = ( e ) => {
			e.preventDefault();
			const button = e.target.closest( 'button' );
			const taskId = button?.dataset?.taskId || task?.task_id;
			const form = button?.closest( 'form' );

			let formValues = {};
			if ( form ) {
				const formData = new FormData( form );
				formValues = Object.fromEntries( formData.entries() );
			}

			handleCompleteTask( taskId, formValues );
		};

		btn.addEventListener( 'click', handleClick );

		return () => {
			btn.removeEventListener( 'click', handleClick );
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ task, TaskFormComponent ] );

	// Skip step if no task available.
	useEffect( () => {
		if ( ! task ) {
			onNext();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ task ] );

	if ( ! task ) {
		return null;
	}

	/**
	 * Render the task content column.
	 *
	 * @return {JSX.Element} Task content.
	 */
	const renderTaskContent = () => {
		// Use React form component if available.
		if ( TaskFormComponent ) {
			return (
				<form
					className="prpl-onboarding-task-form"
					onSubmit={ handleFormSubmit }
				>
					<TaskFormComponent task={ task } />
					<button
						type="submit"
						className="prpl-complete-task-btn prpl-btn prpl-btn-secondary"
						data-task-id={ task.task_id }
						disabled={ isCompleting }
					>
						{ isCompleting
							? __( 'Completing…', 'progress-planner' )
							: task.action_label ||
							  __( 'Mark as complete', 'progress-planner' ) }
						<span className="dashicons dashicons-arrow-right-alt2"></span>
					</button>
				</form>
			);
		}

		// Fallback: render dangerouslySetInnerHTML or plain button.
		if ( task.template_html ) {
			return (
				<div
					dangerouslySetInnerHTML={ {
						__html: task.template_html,
					} }
				/>
			);
		}

		return (
			<div className="prpl-first-task-content">
				{ task.title && <h4>{ task.title }</h4> }
				<button
					type="button"
					className="prpl-complete-task-btn prpl-btn prpl-btn-secondary"
					data-task-id={ task.task_id }
					disabled={ isCompleting }
				>
					{ isCompleting
						? __( 'Completing…', 'progress-planner' )
						: task.action_label ||
						  __( 'Mark as complete', 'progress-planner' ) }
				</button>
			</div>
		);
	};

	return (
		<div className="onboarding-step">
			<div className="tour-content">
				<div className="prpl-columns-wrapper-flex">
					<div className="prpl-column">
						<div className="prpl-background-content">
							<h3>
								{ __(
									'Ready for your first task and your first point?',
									'progress-planner'
								) }
							</h3>
							<p>
								{ sprintf(
									/* translators: %s: Progress Planner name */
									__(
										"This is an example of a recommendation in %s. It's a task that helps improve your website. Most recommendations can be completed in under five minutes. Once you've completed a recommendation, we'll celebrate your success together and provide you with a new recommendation.",
										'progress-planner'
									),
									brandingName
								) }
							</p>
							<p>
								{ __(
									"Let's give it a try!",
									'progress-planner'
								) }
							</p>
						</div>
					</div>
					<div className="prpl-column" ref={ taskContentRef }>
						{ renderTaskContent() }
					</div>
				</div>
			</div>
			{ /* No footer/Next button - user advances by completing the task */ }
		</div>
	);
}
