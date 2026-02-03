/**
 * Tests for FirstTaskStep Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg ) => {
			result = result.replace( '%s', arg );
		} );
		return result;
	},
} ) );

// Mock useTaskCompletion hook
jest.mock( '../../../../hooks/useTaskCompletion', () => ( {
	useTaskCompletion: jest.fn( () => ( {
		completeTask: jest.fn().mockResolvedValue( {} ),
		isCompleting: false,
	} ) ),
} ) );

// Mock OnboardingStep component
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">
		<button
			onClick={ props.onNext }
			disabled={ props.canProceed && ! props.canProceed() }
			data-testid="next-button"
		>
			Next
		</button>
		{ props.children }
	</div>
) );

// Import after mocks
import FirstTaskStep from '../FirstTaskStep';
import { useTaskCompletion } from '../../../../hooks/useTaskCompletion';

describe( 'FirstTaskStep', () => {
	const mockTask = {
		task_id: 'first-task',
		title: 'First Task Title',
		url: 'https://example.com/first-task',
		action_label: 'Complete Task',
	};

	const defaultConfig = {
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce',
		l10n: { brandingName: 'Progress Planner' },
	};

	const defaultProps = {
		wizardState: {
			data: {
				firstTaskCompleted: false,
			},
		},
		updateState: jest.fn(),
		config: defaultConfig,
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: {
			id: 'onboarding-step-first-task',
			data: {
				task: mockTask,
			},
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		useTaskCompletion.mockReturnValue( {
			completeTask: jest.fn().mockResolvedValue( {} ),
			isCompleting: false,
		} );
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders first task heading', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Ready for your first task/ )
			).toBeInTheDocument();
		} );

		it( 'renders explanation text', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByText( /This is an example of a recommendation/ )
			).toBeInTheDocument();
		} );

		it( 'renders encouragement text', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Let's give it a try/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'task display', () => {
		it( 'renders task title', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'heading', { name: 'First Task Title' } )
			).toBeInTheDocument();
		} );

		it( 'renders task action link', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'link', { name: 'Complete Task' } )
			).toBeInTheDocument();
		} );

		it( 'task link has correct href', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			const link = screen.getByRole( 'link', { name: 'Complete Task' } );
			expect( link ).toHaveAttribute(
				'href',
				'https://example.com/first-task'
			);
		} );

		it( 'task link opens in new tab', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			const link = screen.getByRole( 'link', { name: 'Complete Task' } );
			expect( link ).toHaveAttribute( 'target', '_blank' );
			expect( link ).toHaveAttribute( 'rel', 'noopener noreferrer' );
		} );

		it( 'renders mark as complete button', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: 'Mark as complete' } )
			).toBeInTheDocument();
		} );

		it( 'uses default action label when not provided', () => {
			const taskWithoutLabel = {
				...mockTask,
				action_label: undefined,
			};

			render(
				<FirstTaskStep
					{ ...defaultProps }
					stepData={ {
						id: 'onboarding-step-first-task',
						data: { task: taskWithoutLabel },
					} }
				/>
			);

			expect(
				screen.getByRole( 'link', { name: 'Do it' } )
			).toBeInTheDocument();
		} );
	} );

	describe( 'task completion', () => {
		it( 'calls completeTask when button clicked', async () => {
			const mockCompleteTask = jest.fn().mockResolvedValue( {} );
			useTaskCompletion.mockReturnValue( {
				completeTask: mockCompleteTask,
				isCompleting: false,
			} );

			render( <FirstTaskStep { ...defaultProps } /> );

			const button = screen.getByRole( 'button', {
				name: 'Mark as complete',
			} );
			await act( async () => {
				fireEvent.click( button );
			} );

			expect( mockCompleteTask ).toHaveBeenCalledWith( 'first-task', {} );
		} );

		it( 'updates wizard state on completion', async () => {
			const updateState = jest.fn();
			const mockCompleteTask = jest.fn().mockResolvedValue( {} );
			useTaskCompletion.mockReturnValue( {
				completeTask: mockCompleteTask,
				isCompleting: false,
			} );

			render(
				<FirstTaskStep
					{ ...defaultProps }
					updateState={ updateState }
				/>
			);

			const button = screen.getByRole( 'button', {
				name: 'Mark as complete',
			} );
			await act( async () => {
				fireEvent.click( button );
			} );

			expect( updateState ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						firstTaskCompleted: true,
					} ),
				} )
			);
		} );

		it( 'auto-advances after completion', async () => {
			const onNext = jest.fn();
			const mockCompleteTask = jest.fn().mockResolvedValue( {} );
			useTaskCompletion.mockReturnValue( {
				completeTask: mockCompleteTask,
				isCompleting: false,
			} );

			render( <FirstTaskStep { ...defaultProps } onNext={ onNext } /> );

			const button = screen.getByRole( 'button', {
				name: 'Mark as complete',
			} );
			await act( async () => {
				fireEvent.click( button );
			} );

			await act( async () => {
				jest.advanceTimersByTime( 500 );
			} );

			expect( onNext ).toHaveBeenCalled();
		} );

		it( 'shows completing state', () => {
			useTaskCompletion.mockReturnValue( {
				completeTask: jest.fn(),
				isCompleting: true,
			} );

			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: 'Completing…' } )
			).toBeInTheDocument();
		} );

		it( 'disables button while completing', () => {
			useTaskCompletion.mockReturnValue( {
				completeTask: jest.fn(),
				isCompleting: true,
			} );

			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: 'Completing…' } )
			).toBeDisabled();
		} );
	} );

	describe( 'can proceed logic', () => {
		it( 'cannot proceed when task not completed', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).toBeDisabled();
		} );

		it( 'can proceed when task already completed in state', () => {
			const propsWithCompleted = {
				...defaultProps,
				wizardState: {
					data: {
						firstTaskCompleted: true,
					},
				},
			};

			render( <FirstTaskStep { ...propsWithCompleted } /> );

			const nextBtn = screen.getByTestId( 'next-button' );
			expect( nextBtn ).not.toBeDisabled();
		} );
	} );

	describe( 'no task handling', () => {
		it( 'returns null when no task', () => {
			const propsWithoutTask = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-first-task',
					data: {},
				},
			};

			const { container } = render(
				<FirstTaskStep { ...propsWithoutTask } />
			);

			expect( container.firstChild ).toBeNull();
		} );

		it( 'calls onNext when no task', () => {
			const onNext = jest.fn();
			const propsWithoutTask = {
				...defaultProps,
				onNext,
				stepData: {
					id: 'onboarding-step-first-task',
					data: {},
				},
			};

			render( <FirstTaskStep { ...propsWithoutTask } /> );

			expect( onNext ).toHaveBeenCalled();
		} );
	} );

	describe( 'template HTML rendering', () => {
		it( 'renders template HTML when provided', () => {
			const taskWithTemplate = {
				...mockTask,
				template_html: '<div class="custom-task">Custom Content</div>',
			};

			const { container } = render(
				<FirstTaskStep
					{ ...defaultProps }
					stepData={ {
						id: 'onboarding-step-first-task',
						data: { task: taskWithTemplate },
					} }
				/>
			);

			expect(
				container.querySelector( '.custom-task' )
			).toBeInTheDocument();
		} );

		it( 'does not render standard task UI when template provided', () => {
			const taskWithTemplate = {
				...mockTask,
				template_html: '<div class="custom-task">Custom Content</div>',
			};

			const { container } = render(
				<FirstTaskStep
					{ ...defaultProps }
					stepData={ {
						id: 'onboarding-step-first-task',
						data: { task: taskWithTemplate },
					} }
				/>
			);

			expect(
				container.querySelector( '.prpl-first-task-content' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'branding', () => {
		it( 'uses branding name in description', () => {
			render( <FirstTaskStep { ...defaultProps } /> );

			expect(
				screen.getByText( /recommendation in Progress Planner/ )
			).toBeInTheDocument();
		} );

		it( 'falls back to default branding', () => {
			const configWithoutBranding = {
				...defaultConfig,
				l10n: {},
			};

			render(
				<FirstTaskStep
					{ ...defaultProps }
					config={ configWithoutBranding }
				/>
			);

			expect(
				screen.getByText( /recommendation in Progress Planner/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render(
				<FirstTaskStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper', () => {
			const { container } = render(
				<FirstTaskStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'renders background content', () => {
			const { container } = render(
				<FirstTaskStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-background-content' )
			).toBeInTheDocument();
		} );
	} );
} );
