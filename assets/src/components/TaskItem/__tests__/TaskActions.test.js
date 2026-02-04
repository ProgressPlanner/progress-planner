/**
 * Tests for TaskActions Component
 */

/* global MouseEvent */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
	addAction: jest.fn(),
} ) );

// Mock taskRegistry
jest.mock( '../../../services/taskRegistry', () => ( {
	getTaskProviderInstance: jest.fn(),
} ) );

// Import after mocks
import TaskActions from '../TaskActions';
import { getTaskProviderInstance } from '../../../services/taskRegistry';

describe( 'TaskActions', () => {
	// Task with pre-built actions - avoids provider lookup warnings
	const mockTask = {
		id: 123,
		title: { rendered: 'Test Task' },
		slug: 'test-task',
		prpl_task_actions: [ '<span>Default Action</span>' ],
	};

	// Task without actions - will trigger provider lookup
	const mockTaskWithoutActions = {
		id: 123,
		title: { rendered: 'Test Task' },
		slug: 'test-task',
		prpl_task_actions: [],
	};

	const defaultProps = {
		task: mockTask,
		isUserTask: false,
		onComplete: jest.fn(),
		onSnooze: jest.fn(),
		onDelete: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
		getTaskProviderInstance.mockReturnValue( null );
	} );

	describe( 'basic rendering', () => {
		it( 'renders tooltip-actions container', () => {
			const { container } = render( <TaskActions { ...defaultProps } /> );

			expect(
				container.querySelector( '.tooltip-actions' )
			).toBeInTheDocument();
		} );

		it( 'renders actions from prpl_task_actions array', () => {
			const { container } = render( <TaskActions { ...defaultProps } /> );

			const actions = container.querySelectorAll( '.tooltip-action' );
			expect( actions ).toHaveLength( 1 );
		} );
	} );

	describe( 'rendering pre-built actions', () => {
		it( 'renders multiple actions', () => {
			const taskWithActions = {
				...mockTask,
				prpl_task_actions: [
					'<button data-action="complete">Complete</button>',
					'<a href="#">Info</a>',
				],
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithActions } />
			);

			const actions = container.querySelectorAll( '.tooltip-action' );
			expect( actions ).toHaveLength( 2 );
		} );

		it( 'renders HTML content from actions', () => {
			const taskWithActions = {
				...mockTask,
				prpl_task_actions: [
					'<button class="test-button">Click Me</button>',
				],
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithActions } />
			);

			expect(
				container.querySelector( '.test-button' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'user task delete button', () => {
		it( 'shows delete button for user tasks', () => {
			render( <TaskActions { ...defaultProps } isUserTask={ true } /> );

			expect(
				screen.getByTitle( /Delete.*Test Task/ )
			).toBeInTheDocument();
		} );

		it( 'does not show delete button for non-user tasks', () => {
			render( <TaskActions { ...defaultProps } isUserTask={ false } /> );

			expect(
				screen.queryByRole( 'button', { name: /Delete/ } )
			).not.toBeInTheDocument();
		} );

		it( 'calls onDelete when delete button is clicked', () => {
			const onDelete = jest.fn();

			render(
				<TaskActions
					{ ...defaultProps }
					isUserTask={ true }
					onDelete={ onDelete }
				/>
			);

			fireEvent.click( screen.getByTitle( /Delete.*Test Task/ ) );

			expect( onDelete ).toHaveBeenCalledWith( 123 );
		} );

		it( 'delete button has correct data-post-id attribute', () => {
			render( <TaskActions { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByTitle( /Delete.*Test Task/ ) ).toHaveAttribute(
				'data-post-id',
				'123'
			);
		} );
	} );

	describe( 'event handlers for complete buttons', () => {
		it( 'calls onComplete when complete button is clicked', () => {
			const onComplete = jest.fn();
			const taskWithActions = {
				...mockTask,
				prpl_task_actions: [
					'<button data-action="complete">Complete</button>',
				],
			};

			const { container } = render(
				<TaskActions
					{ ...defaultProps }
					task={ taskWithActions }
					onComplete={ onComplete }
				/>
			);

			const completeButton = container.querySelector(
				'[data-action="complete"]'
			);
			fireEvent.click( completeButton );

			expect( onComplete ).toHaveBeenCalledWith( 123, taskWithActions );
		} );

		it( 'prevents default event on complete button click', () => {
			const taskWithActions = {
				...mockTask,
				prpl_task_actions: [
					'<button data-action="complete">Complete</button>',
				],
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithActions } />
			);

			const completeButton = container.querySelector(
				'[data-action="complete"]'
			);
			const event = new MouseEvent( 'click', {
				bubbles: true,
				cancelable: true,
			} );
			const preventDefaultSpy = jest.spyOn( event, 'preventDefault' );

			completeButton.dispatchEvent( event );

			expect( preventDefaultSpy ).toHaveBeenCalled();
		} );
	} );

	describe( 'event handlers for snooze radios', () => {
		it( 'calls onSnooze when snooze radio is changed', () => {
			const onSnooze = jest.fn();
			const taskWithActions = {
				...mockTask,
				prpl_task_actions: [
					'<div class="prpl-snooze-duration-radio-group"><input type="radio" value="1week" /></div>',
				],
			};

			const { container } = render(
				<TaskActions
					{ ...defaultProps }
					task={ taskWithActions }
					onSnooze={ onSnooze }
				/>
			);

			const snoozeRadio = container.querySelector(
				'input[type="radio"]'
			);
			fireEvent.change( snoozeRadio );

			expect( onSnooze ).toHaveBeenCalledWith( 123, '1week' );
		} );
	} );

	describe( 'generating actions from provider', () => {
		it( 'tries to get provider instance when no prpl_task_actions', () => {
			// Return a mock provider with actions to avoid all warnings
			const mockProvider = {
				getTaskActions: jest.fn( () => [ '<span>Action</span>' ] ),
			};
			getTaskProviderInstance.mockReturnValue( mockProvider );

			const taskWithProvider = {
				...mockTaskWithoutActions,
				prpl_provider: { slug: 'test-provider' },
			};

			render(
				<TaskActions { ...defaultProps } task={ taskWithProvider } />
			);

			expect( getTaskProviderInstance ).toHaveBeenCalledWith(
				'test-provider'
			);
		} );

		it( 'uses task slug as provider ID fallback', () => {
			// Return a mock provider with actions to avoid all warnings
			const mockProvider = {
				getTaskActions: jest.fn( () => [ '<span>Action</span>' ] ),
			};
			getTaskProviderInstance.mockReturnValue( mockProvider );

			const taskWithSlug = {
				id: 123,
				title: { rendered: 'Test' },
				slug: 'my-custom-task',
				prpl_task_actions: [],
			};

			render( <TaskActions { ...defaultProps } task={ taskWithSlug } /> );

			expect( getTaskProviderInstance ).toHaveBeenCalledWith(
				'my-custom-task'
			);
		} );

		it( 'renders actions from provider getTaskActions', () => {
			const mockProvider = {
				getTaskActions: jest.fn( () => [
					'<button>Provider Action</button>',
				] ),
			};
			getTaskProviderInstance.mockReturnValue( mockProvider );

			const taskWithoutActions = {
				...mockTaskWithoutActions,
				slug: 'test-task',
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithoutActions } />
			);

			expect( mockProvider.getTaskActions ).toHaveBeenCalledWith(
				taskWithoutActions
			);
			expect(
				container.querySelectorAll( '.tooltip-action' )
			).toHaveLength( 1 );
		} );

		it( 'returns empty when no provider ID found', () => {
			const taskWithNoProvider = {
				id: 123,
				title: { rendered: 'Test' },
				prpl_task_actions: [],
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithNoProvider } />
			);

			// No actions rendered (empty container).
			const actionsContainer =
				container.querySelector( '.tooltip-actions' );
			expect( actionsContainer.children ).toHaveLength( 0 );
		} );

		it( 'returns empty when provider instance not found', () => {
			getTaskProviderInstance.mockReturnValue( null );

			const taskWithProvider = {
				...mockTaskWithoutActions,
				slug: 'unknown-provider',
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithProvider } />
			);

			// No actions rendered (empty container).
			const actionsContainer =
				container.querySelector( '.tooltip-actions' );
			expect( actionsContainer.children ).toHaveLength( 0 );
		} );

		it( 'returns empty when provider has no getTaskActions method', () => {
			getTaskProviderInstance.mockReturnValue( {} ); // Provider without getTaskActions

			const taskWithProvider = {
				...mockTaskWithoutActions,
				slug: 'incomplete-provider',
			};

			const { container } = render(
				<TaskActions { ...defaultProps } task={ taskWithProvider } />
			);

			// No actions rendered (empty container).
			const actionsContainer =
				container.querySelector( '.tooltip-actions' );
			expect( actionsContainer.children ).toHaveLength( 0 );
		} );
	} );

	describe( 'combined rendering', () => {
		it( 'renders both API actions and delete button for user tasks', () => {
			const { container } = render(
				<TaskActions { ...defaultProps } isUserTask={ true } />
			);

			const actions = container.querySelectorAll( '.tooltip-action' );
			// 1 API action + 1 delete button
			expect( actions ).toHaveLength( 2 );
		} );
	} );

	describe( 'styles', () => {
		it( 'applies inline styles to container', () => {
			const { container } = render( <TaskActions { ...defaultProps } /> );

			const actionsContainer =
				container.querySelector( '.tooltip-actions' );
			expect( actionsContainer ).toHaveStyle( { paddingTop: '2px' } );
		} );
	} );

	describe( 'empty state', () => {
		it( 'renders empty container when no actions and not user task', () => {
			const mockProvider = {
				getTaskActions: jest.fn( () => [] ),
			};
			getTaskProviderInstance.mockReturnValue( mockProvider );

			const { container } = render(
				<TaskActions
					{ ...defaultProps }
					task={ mockTaskWithoutActions }
					isUserTask={ false }
				/>
			);

			const actionsContainer =
				container.querySelector( '.tooltip-actions' );
			expect( actionsContainer.children ).toHaveLength( 0 );
		} );
	} );
} );
