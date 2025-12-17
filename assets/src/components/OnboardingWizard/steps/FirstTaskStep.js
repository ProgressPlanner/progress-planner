/**
 * FirstTaskStep Component
 *
 * Step for completing the first onboarding task.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';
import { useTaskCompletion } from '../../../hooks/useTaskCompletion';

/**
 * FirstTaskStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} FirstTask step component.
 */
export default function FirstTaskStep( props ) {
	const { wizardState, updateState, onNext, stepData } = props;
	const { config } = props;
	const { ajaxUrl, nonce } = config;

	const { completeTask, isCompleting } = useTaskCompletion( {
		ajaxUrl,
		nonce,
	} );

	const [ isCompleted, setIsCompleted ] = useState(
		wizardState.data.firstTaskCompleted || false
	);

	const task = stepData?.data?.task;

	/**
	 * Handle task completion.
	 *
	 * @param {Object} formValues - Form values from task.
	 */
	const handleCompleteTask = async ( formValues = {} ) => {
		if ( ! task?.task_id ) {
			return;
		}

		try {
			await completeTask( task.task_id, formValues );
			setIsCompleted( true );
			updateState( {
				data: {
					...wizardState.data,
					firstTaskCompleted: true,
				},
			} );
			// Auto-advance to next step.
			setTimeout( () => {
				onNext();
			}, 500 );
		} catch ( error ) {
			console.error( 'Failed to complete task:', error );
		}
	};

	/**
	 * Check if can proceed.
	 *
	 * @return {boolean} True if task is completed.
	 */
	const canProceed = () => {
		return isCompleted;
	};

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

	return (
		<OnboardingStep { ...props } canProceed={ canProceed }>
			<div className="tour-content">
				<h3 className="tour-title">
					{ __( 'Complete your first task!', 'progress-planner' ) }
				</h3>
				<p>
					{ __(
						"Let's start by completing your first recommended task.",
						'progress-planner'
					) }
				</p>
				{ /* Task content will be rendered here - using existing task components */ }
				<div className="prpl-first-task-content">
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
					<button
						type="button"
						className="prpl-complete-task-btn"
						onClick={ () => handleCompleteTask() }
						disabled={ isCompleting }
					>
						{ isCompleting
							? __( 'Completing…', 'progress-planner' )
							: __( 'Mark as complete', 'progress-planner' ) }
					</button>
				</div>
			</div>
		</OnboardingStep>
	);
}
