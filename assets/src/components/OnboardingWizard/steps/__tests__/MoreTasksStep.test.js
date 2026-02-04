/**
 * Tests for MoreTasksStep Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock OnboardingStep component - respect hideFooter prop
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">{ props.children }</div>
) );

// Mock OnboardTask component
jest.mock( '../../OnboardTask', () => ( props ) => (
	<div data-testid={ `onboard-task-${ props.task.task_id }` }>
		<span>{ props.task.task_title }</span>
		<button
			onClick={ () => props.onComplete( props.task.task_id ) }
			data-testid={ `complete-task-${ props.task.task_id }` }
		>
			Complete
		</button>
	</div>
) );

// Import after mocks
import MoreTasksStep from '../MoreTasksStep';

describe( 'MoreTasksStep', () => {
	const mockTasks = [
		{ task_id: 'task-1', title: 'Task 1' },
		{ task_id: 'task-2', title: 'Task 2' },
	];

	const defaultConfig = {
		lastStepRedirectUrl: '/wp-admin/admin.php?page=progress-planner',
	};

	const defaultProps = {
		wizardState: {
			data: {
				moreTasksCompleted: {},
			},
		},
		updateState: jest.fn(),
		config: defaultConfig,
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: {
			id: 'onboarding-step-more-tasks',
			data: {
				tasks: mockTasks,
			},
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();
		delete window.location;
		window.location = { href: '' };
	} );

	describe( 'intro sub-step', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders intro sub-step by default', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '[data-substep="more-tasks-intro"]' )
			).toBeInTheDocument();
		} );

		it( 'renders congratulations message', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Well done! Great work so far!/ )
			).toBeInTheDocument();
		} );

		it( 'renders dashboard link', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			expect(
				screen.getByText( 'Take me to the dashboard' )
			).toBeInTheDocument();
		} );

		it( 'renders continue button', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Let's tackle more tasks/ )
			).toBeInTheDocument();
		} );

		it( 'dashboard link has correct href', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			const link = screen.getByText( 'Take me to the dashboard' );
			expect( link ).toHaveAttribute(
				'href',
				'/wp-admin/admin.php?page=progress-planner'
			);
		} );

		it( 'continue button has correct class', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-more-tasks-continue' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'navigation between sub-steps', () => {
		it( 'continues to tasks sub-step when continue clicked', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '[data-substep="more-tasks-tasks"]' )
			).toBeInTheDocument();
		} );

		it( 'hides intro when on tasks sub-step', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '[data-substep="more-tasks-intro"]' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'tasks sub-step', () => {
		it( 'renders task list', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '.prpl-task-list' )
			).toBeInTheDocument();
		} );

		it( 'renders tasks from stepData', () => {
			render( <MoreTasksStep { ...defaultProps } /> );

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			// The component renders task.title in a span.task-title
			expect( screen.getByText( 'Task 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Task 2' ) ).toBeInTheDocument();
		} );

		it( 'renders task list container', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '.prpl-task-list' )
			).toBeInTheDocument();
		} );

		it( 'renders finish button on tasks sub-step', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			// NextButton is rendered as the footer with "Take me to the dashboard" text
			const footerBtns = container.querySelectorAll( '.prpl-tour-next' );
			expect( footerBtns.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'finish onboarding', () => {
		it( 'marks wizard as finished on finish', () => {
			const updateState = jest.fn();

			render(
				<MoreTasksStep
					{ ...defaultProps }
					updateState={ updateState }
				/>
			);

			const link = screen.getByText( 'Take me to the dashboard' );
			fireEvent.click( link );

			expect( updateState ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						finished: true,
					} ),
				} )
			);
		} );

		it( 'uses custom redirect URL if provided', () => {
			const customConfig = {
				lastStepRedirectUrl: '/custom/redirect',
			};

			render(
				<MoreTasksStep { ...defaultProps } config={ customConfig } />
			);

			const link = screen.getByText( 'Take me to the dashboard' );
			expect( link ).toHaveAttribute( 'href', '/custom/redirect' );
		} );
	} );

	describe( 'empty tasks', () => {
		it( 'handles empty tasks array', () => {
			const propsWithNoTasks = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-more-tasks',
					data: {
						tasks: [],
					},
				},
			};

			const { container } = render(
				<MoreTasksStep { ...propsWithNoTasks } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '.prpl-task-list' )
			).toBeInTheDocument();
		} );

		it( 'handles missing tasks', () => {
			const propsWithoutTasks = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-more-tasks',
					data: {},
				},
			};

			const { container } = render(
				<MoreTasksStep { ...propsWithoutTasks } />
			);

			const continueBtn = screen.getByText( /Let's tackle more tasks/ );
			fireEvent.click( continueBtn );

			expect(
				container.querySelector( '.prpl-task-list' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper on intro', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'renders background content', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-background-content' )
			).toBeInTheDocument();
		} );

		it( 'renders intro buttons container', () => {
			const { container } = render(
				<MoreTasksStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-more-tasks-intro-buttons' )
			).toBeInTheDocument();
		} );
	} );
} );
