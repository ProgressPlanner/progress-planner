/**
 * Tests for TaskPoints Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock TrashIcon
jest.mock( '../icons/TrashIcon', () => () => <svg data-testid="trash-icon" /> );

// Mock taskUtils with a function that returns prpl_points or default to 0
jest.mock( '../../../utils/taskUtils', () => ( {
	getTaskPoints: ( task ) => {
		if ( task.prpl_points !== undefined && task.prpl_points !== null ) {
			return parseInt( task.prpl_points, 10 ) || 0;
		}
		return 0; // Default to 0 in tests for predictable behavior
	},
} ) );

// Import after mocks
import TaskPoints from '../TaskPoints';

describe( 'TaskPoints', () => {
	const mockTask = {
		id: 123,
		title: { rendered: 'Test Task' },
		prpl_points: 5,
	};

	const defaultProps = {
		task: mockTask,
		isUserTask: false,
		onDelete: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders points wrapper', () => {
			const { container } = render( <TaskPoints { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-suggested-task-points-wrapper' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'points badge', () => {
		it( 'shows points badge when points > 0', () => {
			render( <TaskPoints { ...defaultProps } /> );

			expect( screen.getByText( '+5' ) ).toBeInTheDocument();
		} );

		it( 'does not show points badge when points is 0', () => {
			const taskWithZeroPoints = { ...mockTask, prpl_points: 0 };

			render(
				<TaskPoints { ...defaultProps } task={ taskWithZeroPoints } />
			);

			expect( screen.queryByText( '+0' ) ).not.toBeInTheDocument();
		} );

		it( 'does not show points badge when points is undefined', () => {
			const taskWithNoPoints = { ...mockTask, prpl_points: undefined };

			render(
				<TaskPoints { ...defaultProps } task={ taskWithNoPoints } />
			);

			// Should not render any points badge
			const { container } = render(
				<TaskPoints { ...defaultProps } task={ taskWithNoPoints } />
			);
			expect(
				container.querySelector( '.prpl-suggested-task-points' )
			).not.toBeInTheDocument();
		} );

		it( 'has correct class', () => {
			const { container } = render( <TaskPoints { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-suggested-task-points' )
			).toBeInTheDocument();
		} );

		it( 'displays different point values correctly', () => {
			const taskWith10Points = { ...mockTask, prpl_points: 10 };

			render(
				<TaskPoints { ...defaultProps } task={ taskWith10Points } />
			);

			expect( screen.getByText( '+10' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'trash button for user tasks', () => {
		it( 'shows trash button for user tasks', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByTitle( 'Delete' ) ).toBeInTheDocument();
		} );

		it( 'does not show trash button for non-user tasks', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ false } /> );

			expect( screen.queryByTitle( 'Delete' ) ).not.toBeInTheDocument();
		} );

		it( 'calls onDelete when trash button is clicked', () => {
			const onDelete = jest.fn();

			render(
				<TaskPoints
					{ ...defaultProps }
					isUserTask={ true }
					onDelete={ onDelete }
				/>
			);

			fireEvent.click( screen.getByTitle( 'Delete' ) );

			expect( onDelete ).toHaveBeenCalled();
		} );

		it( 'has correct data-post-id attribute', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByTitle( 'Delete' ) ).toHaveAttribute(
				'data-post-id',
				'123'
			);
		} );

		it( 'renders trash icon', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByTestId( 'trash-icon' ) ).toBeInTheDocument();
		} );

		it( 'has screen reader text', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByText( 'Delete' ) ).toBeInTheDocument();
		} );

		it( 'is type button', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByTitle( 'Delete' ) ).toHaveAttribute(
				'type',
				'button'
			);
		} );

		it( 'has correct class', () => {
			const { container } = render(
				<TaskPoints { ...defaultProps } isUserTask={ true } />
			);

			expect( container.querySelector( '.trash' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'combined rendering', () => {
		it( 'shows both points and trash button for user task with points', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByText( '+5' ) ).toBeInTheDocument();
			expect( screen.getByTitle( 'Delete' ) ).toBeInTheDocument();
		} );

		it( 'shows only trash button for user task with zero points', () => {
			const taskWithZeroPoints = { ...mockTask, prpl_points: 0 };

			render(
				<TaskPoints
					{ ...defaultProps }
					task={ taskWithZeroPoints }
					isUserTask={ true }
				/>
			);

			expect( screen.queryByText( '+0' ) ).not.toBeInTheDocument();
			expect( screen.getByTitle( 'Delete' ) ).toBeInTheDocument();
		} );

		it( 'shows only points for non-user task with points', () => {
			render( <TaskPoints { ...defaultProps } isUserTask={ false } /> );

			expect( screen.getByText( '+5' ) ).toBeInTheDocument();
			expect( screen.queryByTitle( 'Delete' ) ).not.toBeInTheDocument();
		} );
	} );
} );
