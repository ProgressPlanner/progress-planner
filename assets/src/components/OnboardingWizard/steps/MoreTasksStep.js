/**
 * MoreTasksStep Component
 *
 * Step for completing additional tasks with 2 sub-steps:
 * 1. Intro screen (can skip to finish)
 * 2. Task list screen (uses OnboardTask component)
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';
import OnboardTask from '../OnboardTask';

const SUB_STEPS = [ 'intro', 'tasks' ];

/**
 * MoreTasksStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} MoreTasks step component.
 */
export default function MoreTasksStep( props ) {
	const { wizardState, updateState, onNext, stepData, config } = props;

	const [ currentSubStep, setCurrentSubStep ] = useState( 0 );
	const [ completedTasks, setCompletedTasks ] = useState( {} );

	const tasks = stepData?.data?.tasks || [];

	// Initialize completed tasks from wizard state.
	useEffect( () => {
		if ( wizardState.data.moreTasksCompleted ) {
			setCompletedTasks( wizardState.data.moreTasksCompleted );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	/**
	 * Handle task completion.
	 *
	 * @param {string} taskId - Completed task ID.
	 */
	const handleTaskComplete = ( taskId ) => {
		setCompletedTasks( ( prev ) => ( {
			...prev,
			[ taskId ]: true,
		} ) );

		updateState( {
			data: {
				...wizardState.data,
				moreTasksCompleted: {
					...completedTasks,
					[ taskId ]: true,
				},
			},
		} );
	};

	/**
	 * Handle continue from intro.
	 */
	const handleContinue = () => {
		setCurrentSubStep( 1 );
	};

	/**
	 * Handle finish onboarding.
	 */
	const handleFinish = async () => {
		// Mark wizard as finished.
		updateState( {
			data: {
				...wizardState.data,
				finished: true,
			},
		} );

		// Save progress before redirecting.
		// Note: Progress saving is handled by the parent wizard component.
		// We just mark as finished and redirect.

		// Finish onboarding - redirect to dashboard.
		window.location.href =
			config?.lastStepRedirectUrl ||
			'/wp-admin/admin.php?page=progress-planner';
	};

	/**
	 * Render current sub-step.
	 *
	 * @return {JSX.Element} Current sub-step content.
	 */
	const renderSubStep = () => {
		if ( currentSubStep === 0 ) {
			// Intro sub-step.
			return (
				<div
					className="prpl-more-tasks-substep"
					data-substep="more-tasks-intro"
				>
					<div className="prpl-columns-wrapper-flex prpl-columns-2-1">
						<div className="prpl-column">
							<div className="prpl-background-content">
								<p>
									<strong>
										{ __(
											'Well done! Great work so far!',
											'progress-planner'
										) }
									</strong>
								</p>
								<p>
									{ __(
										'You can take on a few more recommendations if you feel like it, or jump straight to your dashboard.',
										'progress-planner'
									) }
								</p>
							</div>
							<div className="prpl-more-tasks-intro-buttons">
								<a
									href={
										config?.lastStepRedirectUrl ||
										'/wp-admin/admin.php?page=progress-planner'
									}
									className="prpl-finish-onboarding"
									onClick={ ( e ) => {
										e.preventDefault();
										handleFinish();
									} }
								>
									{ __(
										'Take me to the dashboard',
										'progress-planner'
									) }
								</a>
								<button
									type="button"
									className="prpl-btn prpl-btn-secondary prpl-more-tasks-continue"
									onClick={ handleContinue }
								>
									{ __(
										"Yes! Let's tackle more tasks",
										'progress-planner'
									) }{ ' ' }
									&rsaquo;
								</button>
							</div>
						</div>
						<div className="prpl-column prpl-hide-on-mobile">
							<div id="prpl-success-graphic">
								{ /* Graphic would be rendered here - success_ravi.svg */ }
								<div
									style={ {
										width: '100%',
										height: '200px',
										backgroundColor: '#f0f0f0',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#999',
									} }
								>
									{ __(
										'Graphic placeholder',
										'progress-planner'
									) }
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// Tasks sub-step.
		return (
			<div className="prpl-more-tasks-substep" data-substep="tasks">
				<h3 className="tour-title">
					{ __( 'Complete more tasks', 'progress-planner' ) }
				</h3>
				<div className="prpl-task-list">
					{ tasks.map( ( task ) => (
						<OnboardTask
							key={ task.task_id }
							task={ task }
							config={ config }
							onComplete={ handleTaskComplete }
						/>
					) ) }
				</div>
			</div>
		);
	};

	/**
	 * Handle next button click.
	 */
	const handleNext = () => {
		// If on intro sub-step, continue to tasks.
		if ( currentSubStep === 0 ) {
			handleContinue();
			return;
		}

		// If on tasks sub-step, finish onboarding.
		if ( currentSubStep === SUB_STEPS.length - 1 ) {
			handleFinish();
		}
	};

	/**
	 * Check if can proceed.
	 *
	 * @return {boolean} True if on tasks sub-step.
	 */
	const canProceed = () => {
		return currentSubStep === SUB_STEPS.length - 1;
	};

	return (
		<OnboardingStep
			{ ...props }
			canProceed={ canProceed }
			onNext={ handleNext }
		>
			<div className="tour-content">{ renderSubStep() }</div>
		</OnboardingStep>
	);
}
