/**
 * Tests for TaskList Component
 */

/* global HTMLUListElement */

import { render, screen } from '@testing-library/react';
import { createRef } from '@wordpress/element';

// Mock TaskItem component
jest.mock( '../../../components/TaskItem', () => ( props ) => (
	<li
		data-testid={ `task-item-${ props.task.id }` }
		data-task-id={ props.task.id }
		data-index={ props.index }
		data-is-user-task={ props.isUserTask }
		data-is-celebrating={ props.isCelebrating }
	>
		{ props.task.title?.rendered || props.task.title }
	</li>
) );

// Import after mocks
import TaskList from '../TaskList';

describe( 'TaskList', () => {
	const mockTasks = [
		{
			id: 1,
			title: { rendered: 'Task 1' },
			slug: 'task-1',
			prpl_provider: { slug: 'plugin' },
		},
		{
			id: 2,
			title: { rendered: 'Task 2' },
			slug: 'task-2',
			prpl_provider: { slug: 'user' },
		},
		{
			id: 3,
			title: { rendered: 'Task 3' },
			slug: 'task-3',
			prpl_provider: { slug: 'theme' },
		},
	];

	const defaultProps = {
		tasks: mockTasks,
		celebratingTaskIds: new Set(),
		onComplete: jest.fn(),
		onSnooze: jest.fn(),
		onDelete: jest.fn(),
		onMove: jest.fn(),
		onTitleChange: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'list rendering', () => {
		it( 'renders ul element', () => {
			render( <TaskList { ...defaultProps } /> );

			expect( screen.getByRole( 'list' ) ).toBeInTheDocument();
		} );

		it( 'has correct id attribute', () => {
			const { container } = render( <TaskList { ...defaultProps } /> );

			expect(
				container.querySelector( '#prpl-suggested-tasks-list' )
			).toBeInTheDocument();
		} );

		it( 'has correct class name', () => {
			const { container } = render( <TaskList { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-suggested-tasks-list' )
			).toBeInTheDocument();
		} );

		it( 'applies list styles', () => {
			const { container } = render( <TaskList { ...defaultProps } /> );

			const list = container.querySelector( 'ul' );
			expect( list ).toHaveStyle( { listStyle: 'none' } );
		} );
	} );

	describe( 'task items', () => {
		it( 'renders correct number of task items', () => {
			render( <TaskList { ...defaultProps } /> );

			expect( screen.getByTestId( 'task-item-1' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'task-item-2' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'task-item-3' ) ).toBeInTheDocument();
		} );

		it( 'passes correct index to each task item', () => {
			render( <TaskList { ...defaultProps } /> );

			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-index',
				'0'
			);
			expect( screen.getByTestId( 'task-item-2' ) ).toHaveAttribute(
				'data-index',
				'1'
			);
			expect( screen.getByTestId( 'task-item-3' ) ).toHaveAttribute(
				'data-index',
				'2'
			);
		} );

		it( 'displays task titles', () => {
			render( <TaskList { ...defaultProps } /> );

			expect( screen.getByText( 'Task 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Task 2' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Task 3' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'user tasks', () => {
		it( 'identifies user tasks correctly', () => {
			render( <TaskList { ...defaultProps } /> );

			// Task 2 has provider.slug === 'user'
			expect( screen.getByTestId( 'task-item-2' ) ).toHaveAttribute(
				'data-is-user-task',
				'true'
			);
		} );

		it( 'identifies non-user tasks correctly', () => {
			render( <TaskList { ...defaultProps } /> );

			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-is-user-task',
				'false'
			);
			expect( screen.getByTestId( 'task-item-3' ) ).toHaveAttribute(
				'data-is-user-task',
				'false'
			);
		} );

		it( 'handles tasks without provider', () => {
			const tasksWithoutProvider = [
				{ id: 1, title: { rendered: 'No Provider Task' } },
			];

			render(
				<TaskList { ...defaultProps } tasks={ tasksWithoutProvider } />
			);

			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-is-user-task',
				'false'
			);
		} );
	} );

	describe( 'celebrating tasks', () => {
		it( 'marks celebrating tasks correctly', () => {
			const celebratingIds = new Set( [ 1, 3 ] );

			render(
				<TaskList
					{ ...defaultProps }
					celebratingTaskIds={ celebratingIds }
				/>
			);

			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-is-celebrating',
				'true'
			);
			expect( screen.getByTestId( 'task-item-3' ) ).toHaveAttribute(
				'data-is-celebrating',
				'true'
			);
		} );

		it( 'marks non-celebrating tasks correctly', () => {
			const celebratingIds = new Set( [ 1 ] );

			render(
				<TaskList
					{ ...defaultProps }
					celebratingTaskIds={ celebratingIds }
				/>
			);

			expect( screen.getByTestId( 'task-item-2' ) ).toHaveAttribute(
				'data-is-celebrating',
				'false'
			);
		} );

		it( 'handles empty celebrating set', () => {
			render(
				<TaskList
					{ ...defaultProps }
					celebratingTaskIds={ new Set() }
				/>
			);

			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-is-celebrating',
				'false'
			);
		} );
	} );

	describe( 'ref forwarding', () => {
		it( 'forwards ref to ul element', () => {
			const ref = createRef();

			render( <TaskList { ...defaultProps } ref={ ref } /> );

			expect( ref.current ).toBeInstanceOf( HTMLUListElement );
			expect( ref.current.id ).toBe( 'prpl-suggested-tasks-list' );
		} );
	} );

	describe( 'empty state', () => {
		it( 'renders empty list when no tasks', () => {
			render( <TaskList { ...defaultProps } tasks={ [] } /> );

			const list = screen.getByRole( 'list' );
			expect( list ).toBeInTheDocument();
			expect( list.children ).toHaveLength( 0 );
		} );
	} );

	describe( 'single task', () => {
		it( 'renders single task correctly', () => {
			const singleTask = [ mockTasks[ 0 ] ];

			render( <TaskList { ...defaultProps } tasks={ singleTask } /> );

			expect( screen.getByTestId( 'task-item-1' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'task-item-1' ) ).toHaveAttribute(
				'data-index',
				'0'
			);
		} );
	} );

	describe( 'task ordering', () => {
		it( 'renders tasks in provided order', () => {
			const { container } = render( <TaskList { ...defaultProps } /> );

			const items = container.querySelectorAll( 'li' );
			expect( items[ 0 ] ).toHaveAttribute( 'data-task-id', '1' );
			expect( items[ 1 ] ).toHaveAttribute( 'data-task-id', '2' );
			expect( items[ 2 ] ).toHaveAttribute( 'data-task-id', '3' );
		} );

		it( 'respects reversed order', () => {
			const reversedTasks = [ ...mockTasks ].reverse();

			const { container } = render(
				<TaskList { ...defaultProps } tasks={ reversedTasks } />
			);

			const items = container.querySelectorAll( 'li' );
			expect( items[ 0 ] ).toHaveAttribute( 'data-task-id', '3' );
			expect( items[ 1 ] ).toHaveAttribute( 'data-task-id', '2' );
			expect( items[ 2 ] ).toHaveAttribute( 'data-task-id', '1' );
		} );
	} );
} );
