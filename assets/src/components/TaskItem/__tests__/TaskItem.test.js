/**
 * Tests for TaskItem Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../index';
import { getTaskItemStyle } from '../styles';

// Mock the task registry to prevent console warnings
jest.mock( '../../../services/taskRegistry', () => ( {
	getTaskProviderInstance: jest.fn( () => null ),
	registerTaskProvider: jest.fn(),
	getRegisteredProviders: jest.fn( () => [] ),
	getTaskProviderClass: jest.fn( () => null ),
} ) );

// Mock taskUtils
jest.mock( '../../../utils/taskUtils', () => ( {
	getTaskPoints: ( task ) => {
		if ( task.prpl_points !== undefined && task.prpl_points !== null ) {
			return parseInt( task.prpl_points, 10 ) || 0;
		}
		return 1;
	},
} ) );

// Helper to create a mock task
function createMockTask( overrides = {} ) {
	return {
		id: 123,
		title: { rendered: 'Test Task Title' },
		slug: 'test-task',
		status: 'publish',
		menu_order: 0,
		prpl_points: 5,
		prpl_provider: { slug: 'test-provider' },
		prpl_task_actions: [ '<span>Action</span>' ], // Provide actions to avoid provider lookup
		...overrides,
	};
}

describe( 'TaskItem', () => {
	const defaultProps = {
		task: createMockTask(),
		isUserTask: false,
		isCelebrating: false,
		isCompleted: false,
		index: 0,
		showMoveButtons: true,
		showActions: true,
		onComplete: jest.fn(),
		onSnooze: jest.fn(),
		onDelete: jest.fn(),
		onMove: jest.fn(),
		onTitleChange: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'rendering', () => {
		it( 'renders task title', () => {
			render( <TaskItem { ...defaultProps } /> );

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );

		it( 'renders as list item', () => {
			render( <TaskItem { ...defaultProps } /> );

			expect( screen.getByRole( 'listitem' ) ).toBeInTheDocument();
		} );

		it( 'renders arrow icon for non-user tasks', () => {
			render( <TaskItem { ...defaultProps } isUserTask={ false } /> );

			// Non-user tasks show an arrow icon instead of checkbox
			expect( screen.queryByRole( 'checkbox' ) ).not.toBeInTheDocument();
			// Arrow icon is an SVG
			expect(
				document.querySelector(
					'.prpl-suggested-task-checkbox-wrapper svg'
				)
			).toBeInTheDocument();
		} );

		it( 'renders checkbox for user tasks', () => {
			render( <TaskItem { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByRole( 'checkbox' ) ).toBeInTheDocument();
		} );

		it( 'renders task points with plus sign', () => {
			render( <TaskItem { ...defaultProps } /> );

			// Points display as "+5" with a plus prefix
			expect( screen.getByText( /\+5/ ) ).toBeInTheDocument();
		} );

		it( 'applies celebrating class when isCelebrating is true', () => {
			render( <TaskItem { ...defaultProps } isCelebrating={ true } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveClass( 'prpl-suggested-task-celebrated' );
		} );

		it( 'does not apply celebrating class when not celebrating', () => {
			render( <TaskItem { ...defaultProps } isCelebrating={ false } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).not.toHaveClass(
				'prpl-suggested-task-celebrated'
			);
		} );
	} );

	describe( 'data attributes', () => {
		it( 'sets data-task-id from slug', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute( 'data-task-id', 'test-task' );
		} );

		it( 'sets data-task-id from id when no slug', () => {
			const task = createMockTask( { slug: undefined } );
			render( <TaskItem { ...defaultProps } task={ task } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute( 'data-task-id', '123' );
		} );

		it( 'sets data-post-id', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute( 'data-post-id', '123' );
		} );

		it( 'sets data-task-points', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute( 'data-task-points', '5' );
		} );

		it( 'sets data-task-provider-id', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute(
				'data-task-provider-id',
				'test-provider'
			);
		} );

		it( 'sets data-task-provider-id to user for user tasks', () => {
			const task = createMockTask( { prpl_provider: undefined } );
			render(
				<TaskItem
					{ ...defaultProps }
					task={ task }
					isUserTask={ true }
				/>
			);

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute(
				'data-task-provider-id',
				'user'
			);
		} );
	} );

	describe( 'task action data attribute', () => {
		it( 'sets celebrate action when task status is pending', () => {
			const task = createMockTask( { status: 'pending' } );
			render( <TaskItem { ...defaultProps } task={ task } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute(
				'data-task-action',
				'celebrate'
			);
		} );

		it( 'sets celebrate action when isCelebrating', () => {
			render( <TaskItem { ...defaultProps } isCelebrating={ true } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute(
				'data-task-action',
				'celebrate'
			);
		} );

		it( 'sets completed action when isCompleted', () => {
			render( <TaskItem { ...defaultProps } isCompleted={ true } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute(
				'data-task-action',
				'completed'
			);
		} );

		it( 'sets empty action when not celebrating or completed', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem ).toHaveAttribute( 'data-task-action', '' );
		} );
	} );

	describe( 'checkbox interaction', () => {
		it( 'calls onComplete when checkbox is clicked for user task', () => {
			render( <TaskItem { ...defaultProps } isUserTask={ true } /> );

			const checkbox = screen.getByRole( 'checkbox' );
			fireEvent.click( checkbox );

			expect( defaultProps.onComplete ).toHaveBeenCalledWith(
				123,
				defaultProps.task
			);
		} );

		it( 'checkbox is disabled when celebrating', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeDisabled();
		} );
	} );

	describe( 'move buttons', () => {
		it( 'shows move buttons for user tasks when not completed', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					showMoveButtons={ true }
					isCompleted={ false }
				/>
			);

			// Check for move buttons by title attribute
			expect( screen.getByTitle( 'Move up' ) ).toBeInTheDocument();
			expect( screen.getByTitle( 'Move down' ) ).toBeInTheDocument();
		} );

		it( 'hides move buttons when isCompleted', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					showMoveButtons={ true }
					isCompleted={ true }
				/>
			);

			expect( screen.queryByTitle( 'Move up' ) ).not.toBeInTheDocument();
			expect(
				screen.queryByTitle( 'Move down' )
			).not.toBeInTheDocument();
		} );

		it( 'hides move buttons for non-user tasks', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ false }
					showMoveButtons={ true }
				/>
			);

			expect( screen.queryByTitle( 'Move up' ) ).not.toBeInTheDocument();
		} );

		it( 'hides move buttons when showMoveButtons is false', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					showMoveButtons={ false }
				/>
			);

			expect( screen.queryByTitle( 'Move up' ) ).not.toBeInTheDocument();
		} );

		it( 'calls onMove with up direction when up button clicked', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					showMoveButtons={ true }
				/>
			);

			const upButton = screen.getByTitle( 'Move up' );
			fireEvent.click( upButton );

			expect( defaultProps.onMove ).toHaveBeenCalledWith( 123, 'up' );
		} );

		it( 'calls onMove with down direction when down button clicked', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					showMoveButtons={ true }
				/>
			);

			const downButton = screen.getByTitle( 'Move down' );
			fireEvent.click( downButton );

			expect( defaultProps.onMove ).toHaveBeenCalledWith( 123, 'down' );
		} );
	} );

	describe( 'actions section', () => {
		it( 'shows actions when showActions is true', () => {
			render( <TaskItem { ...defaultProps } showActions={ true } /> );

			expect(
				document.querySelector( '.prpl-suggested-task-actions-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'hides actions when showActions is false', () => {
			render( <TaskItem { ...defaultProps } showActions={ false } /> );

			expect(
				document.querySelector( '.prpl-suggested-task-actions-wrapper' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'styling', () => {
		it( 'getTaskItemStyle returns alternating backgrounds based on index', () => {
			// Test the style function directly since JSDOM doesn't handle CSS vars
			const evenStyle = getTaskItemStyle( 0 );
			expect( evenStyle.backgroundColor ).toBe(
				'var(--prpl-background-table)'
			);

			const oddStyle = getTaskItemStyle( 1 );
			expect( oddStyle.backgroundColor ).toBe( 'transparent' );

			// Test more indices
			expect( getTaskItemStyle( 2 ).backgroundColor ).toBe(
				'var(--prpl-background-table)'
			);
			expect( getTaskItemStyle( 3 ).backgroundColor ).toBe(
				'transparent'
			);
		} );

		it( 'applies grid layout styles', () => {
			render( <TaskItem { ...defaultProps } /> );

			const listItem = screen.getByRole( 'listitem' );
			expect( listItem.style.display ).toBe( 'grid' );
		} );
	} );

	describe( 'completed state', () => {
		it( 'shows checkbox as checked when completed', () => {
			render(
				<TaskItem
					{ ...defaultProps }
					isUserTask={ true }
					isCompleted={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeChecked();
		} );

		it( 'shows checkbox as checked when task status is trash', () => {
			const task = createMockTask( { status: 'trash' } );
			render(
				<TaskItem
					{ ...defaultProps }
					task={ task }
					isUserTask={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeChecked();
		} );

		it( 'shows checkbox as checked when task status is pending', () => {
			const task = createMockTask( { status: 'pending' } );
			render(
				<TaskItem
					{ ...defaultProps }
					task={ task }
					isUserTask={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeChecked();
		} );
	} );
} );
