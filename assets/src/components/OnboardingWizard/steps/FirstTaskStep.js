/**
 * FirstTaskStep Component
 *
 * Step for completing the first onboarding task.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';
import { useTaskCompletion } from '../../../hooks/useTaskCompletion';

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
										'This is an example of a recommendation in %s. It\'s a task that helps improve your website. Most recommendations can be completed in under five minutes. Once you\'ve completed a recommendation, we\'ll celebrate your success together and provide you with a new recommendation.',
										'progress-planner'
									),
									brandingName
								) }
							</p>
							<p>
								{ __( "Let's give it a try!", 'progress-planner' ) }
							</p>
						</div>
					</div>
					<div className="prpl-column">
						{ task.template_html ? (
							<div
								dangerouslySetInnerHTML={ {
									__html: task.template_html,
								} }
							/>
						) : (
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
						) }
					</div>
				</div>
			</div>
		</OnboardingStep>
	);
}
