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
import { useOnboardingProgress } from '../../../hooks/useOnboardingProgress';

const SUB_STEPS = [ 'intro', 'tasks' ];

/**
 * MoreTasksStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} MoreTasks step component.
 */
export default function MoreTasksStep( props ) {
	const { wizardState, updateState, onNext, stepData, config } = props;
	const { ajaxUrl, nonce } = config;

	const progressHooks = useOnboardingProgress( { ajaxUrl, nonce } );

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
		try {
			await progressHooks.saveProgress( {
				...wizardState,
				data: {
					...wizardState.data,
					finished: true,
				},
			} );
		} catch ( error ) {
			// Silently fail - we'll redirect anyway.
			console.error( 'Failed to save final progress:', error );
		}

		// Finish onboarding - redirect to dashboard.
		window.location.href = config?.lastStepRedirectUrl || '/wp-admin/admin.php?page=progress-planner';
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
					data-substep="intro"
				>
					<h3 className="tour-title">
						{ __( 'Finish onboarding!', 'progress-planner' ) }
					</h3>
					<p>
						{ __(
							'Complete a few more tasks to get your site in great shape.',
							'progress-planner'
						) }
					</p>
					<button
						type="button"
						className="prpl-btn prpl-btn-primary prpl-more-tasks-continue"
						onClick={ handleContinue }
					>
						{ __( 'Continue', 'progress-planner' ) }
					</button>
					<button
						type="button"
						className="prpl-finish-onboarding"
						onClick={ handleFinish }
						style={ {
							background: 'none',
							border: 'none',
							color: 'var(--prpl-color-text)',
							textDecoration: 'underline',
							cursor: 'pointer',
							marginTop: '1rem',
						} }
					>
						{ __( 'Skip and finish onboarding', 'progress-planner' ) }
					</button>
				</div>
			);
		}

		// Tasks sub-step.
		return (
			<div
				className="prpl-more-tasks-substep"
				data-substep="tasks"
			>
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
		<OnboardingStep { ...props } canProceed={ canProceed } onNext={ handleNext }>
			<div className="tour-content">
				{ renderSubStep() }
			</div>
		</OnboardingStep>
	);
}

