/**
 * Tests for TodoWidget
 */

import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

// Mock hooks
const mockFetchTasks = jest.fn();
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

jest.mock( '../../../hooks/useTasksApi', () => ( {
	fetchTasks: ( ...args ) => mockFetchTasks( ...args ),
	createTask: ( ...args ) => mockCreateTask( ...args ),
	updateTask: ( ...args ) => mockUpdateTask( ...args ),
	deleteTask: ( ...args ) => mockDeleteTask( ...args ),
} ) );

jest.mock( '../../../hooks/useGridMasonry', () => ( {
	useGridMasonry: jest.fn(),
} ) );

const mockCelebrate = jest.fn();
jest.mock( '../../../hooks/useCelebration', () => ( {
	useCelebration: () => ( {
		celebrate: mockCelebrate,
	} ),
} ) );

const mockOnTaskCompleted = jest.fn();
jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => mockOnTaskCompleted ),
} ) );

jest.mock( '../../../utils/gridResize', () => ( {
	dispatchGridResize: jest.fn(),
} ) );

// Mock taskUtils to avoid importing taskRegistry which uses addAction
jest.mock( '../../../utils/taskUtils', () => ( {
	getTaskPoints: ( task ) => {
		if ( task.prpl_points !== undefined && task.prpl_points !== null ) {
			return parseInt( task.prpl_points, 10 ) || 0;
		}
		return 1; // Default to 1 point
	},
} ) );

// Mock child components
jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header">{ props.title }</div>
) );

jest.mock( '../../../components/TaskItem', () => ( props ) => (
	<li
		data-testid={ `task-item-${ props.task.id }` }
		data-completed={ props.isCompleted }
	>
		<span>{ props.task.title?.rendered || props.task.title }</span>
		<button
			data-testid={ `toggle-${ props.task.id }` }
			onClick={ () => props.onComplete( props.task.id ) }
		>
			Toggle
		</button>
		<button
			data-testid={ `delete-${ props.task.id }` }
			onClick={ () => props.onDelete( props.task.id ) }
		>
			Delete
		</button>
		{ props.showMoveButtons && (
			<>
				<button
					data-testid={ `move-up-${ props.task.id }` }
					onClick={ () => props.onMove( props.task.id, 'up' ) }
				>
					Up
				</button>
				<button
					data-testid={ `move-down-${ props.task.id }` }
					onClick={ () => props.onMove( props.task.id, 'down' ) }
				>
					Down
				</button>
			</>
		) }
	</li>
) );

// Import after mocks
import TodoWidget from '../index';

describe( 'TodoWidget', () => {
	const mockPendingTasks = [
		{
			id: 1,
			title: { rendered: 'Task One' },
			status: 'publish',
			menu_order: 0,
			prpl_points: 1,
		},
		{
			id: 2,
			title: { rendered: 'Task Two' },
			status: 'publish',
			menu_order: 1,
			prpl_points: 0,
		},
	];

	const mockCompletedTasks = [
		{
			id: 3,
			title: { rendered: 'Completed Task' },
			status: 'trash',
			menu_order: 0,
			prpl_points: 0,
		},
	];

	beforeEach( () => {
		jest.clearAllMocks();

		mockFetchTasks.mockImplementation( async ( params ) => {
			if ( params.status === 'publish' ) {
				return { tasks: mockPendingTasks };
			}
			return { tasks: mockCompletedTasks };
		} );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state initially', async () => {
			// Delay the fetch to see loading state
			mockFetchTasks.mockImplementation(
				() => new Promise( () => {} ) // Never resolves
			);

			render( <TodoWidget /> );

			// During loading, the widget header is rendered with skeleton
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// The task list should not be rendered yet
			expect(
				screen.queryByRole( 'list', { name: /todo/i } )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByTestId( 'widget-header' )
				).toBeInTheDocument();
			} );
		} );

		it( 'uses default title when config not provided', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'My to-do list' )
				).toBeInTheDocument();
			} );
		} );

		it( 'uses custom title from config', async () => {
			render( <TodoWidget config={ { title: 'Custom Todo Title' } } /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Custom Todo Title' )
				).toBeInTheDocument();
			} );
		} );

		it( 'renders pending tasks', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByTestId( 'task-item-1' )
				).toBeInTheDocument();
				expect(
					screen.getByTestId( 'task-item-2' )
				).toBeInTheDocument();
			} );
		} );

		it( 'renders add task form', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByPlaceholderText( 'Add a new task' )
				).toBeInTheDocument();
			} );
		} );

		it( 'renders completed tasks section when there are completed tasks', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );
		} );
	} );

	describe( 'API calls', () => {
		it( 'fetches pending and completed tasks on mount', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect( mockFetchTasks ).toHaveBeenCalledWith(
					expect.objectContaining( {
						status: 'publish',
						provider: 'user',
					} )
				);
				expect( mockFetchTasks ).toHaveBeenCalledWith(
					expect.objectContaining( {
						status: 'trash',
						provider: 'user',
					} )
				);
			} );
		} );
	} );

	describe( 'create task', () => {
		it( 'creates a new task on form submit', async () => {
			mockCreateTask.mockResolvedValue( {
				id: 4,
				title: { rendered: 'New Task' },
				status: 'publish',
				menu_order: 2,
				prpl_points: 0,
			} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByPlaceholderText( 'Add a new task' )
				).toBeInTheDocument();
			} );

			const input = screen.getByPlaceholderText( 'Add a new task' );
			fireEvent.change( input, { target: { value: 'New Task' } } );

			const form = screen.getByRole( 'textbox' ).closest( 'form' );
			await act( async () => {
				fireEvent.submit( form );
			} );

			await waitFor( () => {
				expect( mockCreateTask ).toHaveBeenCalledWith(
					expect.objectContaining( {
						title: 'New Task',
					} )
				);
			} );
		} );

		it( 'does not create task with empty title', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByPlaceholderText( 'Add a new task' )
				).toBeInTheDocument();
			} );

			const form = screen.getByRole( 'textbox' ).closest( 'form' );
			await act( async () => {
				fireEvent.submit( form );
			} );

			expect( mockCreateTask ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'toggle task', () => {
		it( 'moves pending task to completed', async () => {
			mockUpdateTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'toggle-1' ) ).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'toggle-1' ) );
			} );

			await waitFor( () => {
				expect( mockUpdateTask ).toHaveBeenCalledWith( 1, {
					status: 'trash',
				} );
			} );
		} );

		it( 'triggers celebration for golden task', async () => {
			mockUpdateTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'toggle-1' ) ).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'toggle-1' ) );
			} );

			await waitFor( () => {
				expect( mockCelebrate ).toHaveBeenCalled();
			} );
		} );

		it( 'does not trigger celebration for non-golden task', async () => {
			mockUpdateTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'toggle-2' ) ).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'toggle-2' ) );
			} );

			expect( mockCelebrate ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'delete task', () => {
		it( 'deletes a task', async () => {
			mockDeleteTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'delete-1' ) ).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'delete-1' ) );
			} );

			await waitFor( () => {
				expect( mockDeleteTask ).toHaveBeenCalledWith( 1 );
			} );
		} );
	} );

	describe( 'move task', () => {
		it( 'renders move buttons for pending tasks', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'move-up-1' ) ).toBeInTheDocument();
				expect(
					screen.getByTestId( 'move-down-1' )
				).toBeInTheDocument();
			} );
		} );

		it( 'moves task up', async () => {
			mockUpdateTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( screen.getByTestId( 'move-up-2' ) ).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'move-up-2' ) );
			} );

			await waitFor( () => {
				expect( mockUpdateTask ).toHaveBeenCalled();
			} );
		} );

		it( 'moves task down', async () => {
			mockUpdateTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByTestId( 'move-down-1' )
				).toBeInTheDocument();
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'move-down-1' ) );
			} );

			await waitFor( () => {
				expect( mockUpdateTask ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'delete all completed', () => {
		it( 'shows delete confirmation popover', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );

			// Open details
			fireEvent.click( screen.getByText( 'Completed tasks' ) );

			// Click delete all
			fireEvent.click( screen.getByText( 'Delete all completed tasks' ) );

			expect(
				screen.getByText(
					/Are you sure you want to delete all completed tasks/
				)
			).toBeInTheDocument();
		} );

		it( 'cancels delete all on No click', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );

			// Open details
			fireEvent.click( screen.getByText( 'Completed tasks' ) );

			// Click delete all
			fireEvent.click( screen.getByText( 'Delete all completed tasks' ) );

			// Click No
			fireEvent.click( screen.getByText( 'No' ).closest( 'button' ) );

			expect(
				screen.queryByText(
					/Are you sure you want to delete all completed tasks/
				)
			).not.toBeInTheDocument();
		} );

		it( 'deletes all completed on Yes click', async () => {
			mockDeleteTask.mockResolvedValue( {} );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );

			// Open details
			fireEvent.click( screen.getByText( 'Completed tasks' ) );

			// Click delete all
			fireEvent.click( screen.getByText( 'Delete all completed tasks' ) );

			// Click Yes
			await act( async () => {
				fireEvent.click(
					screen.getByText( 'Yes' ).closest( 'button' )
				);
			} );

			await waitFor( () => {
				expect( mockDeleteTask ).toHaveBeenCalledWith( 3 );
			} );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty tasks lists', async () => {
			mockFetchTasks.mockResolvedValue( { tasks: [] } );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByTestId( 'widget-header' )
				).toBeInTheDocument();
			} );

			// Should not show completed tasks section
			expect(
				screen.queryByText( 'Completed tasks' )
			).not.toBeInTheDocument();
		} );

		it( 'handles fetch error gracefully', async () => {
			const consoleError = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );
			mockFetchTasks.mockRejectedValue( new Error( 'Network error' ) );

			render( <TodoWidget /> );

			await waitFor( () => {
				expect( consoleError ).toHaveBeenCalled();
			} );

			consoleError.mockRestore();
		} );

		it( 'handles empty config object', async () => {
			render( <TodoWidget config={ {} } /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'My to-do list' )
				).toBeInTheDocument();
			} );
		} );
	} );

	describe( 'task descriptions', () => {
		it( 'renders golden task description', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				const descriptions = screen.getAllByText(
					/Write down all your tasks you want to get done/
				);
				expect( descriptions.length ).toBeGreaterThanOrEqual( 1 );
			} );
		} );

		it( 'uses custom descriptions from config', async () => {
			render(
				<TodoWidget
					config={ {
						goldenTaskDescription: 'Custom golden description',
						silverTaskDescription: 'Custom silver description',
					} }
				/>
			);

			await waitFor( () => {
				expect(
					screen.getByText( 'Custom golden description' )
				).toBeInTheDocument();
				expect(
					screen.getByText( 'Custom silver description' )
				).toBeInTheDocument();
			} );
		} );
	} );

	describe( 'overlay', () => {
		it( 'closes popover on overlay click', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );

			// Open details
			fireEvent.click( screen.getByText( 'Completed tasks' ) );

			// Click delete all
			fireEvent.click( screen.getByText( 'Delete all completed tasks' ) );

			// Click overlay
			const overlay = screen.getByRole( 'button', {
				name: 'Close dialog',
			} );
			fireEvent.click( overlay );

			expect(
				screen.queryByText(
					/Are you sure you want to delete all completed tasks/
				)
			).not.toBeInTheDocument();
		} );

		it( 'closes popover on Enter key on overlay', async () => {
			render( <TodoWidget /> );

			await waitFor( () => {
				expect(
					screen.getByText( 'Completed tasks' )
				).toBeInTheDocument();
			} );

			// Open details
			fireEvent.click( screen.getByText( 'Completed tasks' ) );

			// Click delete all
			fireEvent.click( screen.getByText( 'Delete all completed tasks' ) );

			// Press Enter on overlay
			const overlay = screen.getByRole( 'button', {
				name: 'Close dialog',
			} );
			fireEvent.keyDown( overlay, { key: 'Enter' } );

			expect(
				screen.queryByText(
					/Are you sure you want to delete all completed tasks/
				)
			).not.toBeInTheDocument();
		} );
	} );
} );
