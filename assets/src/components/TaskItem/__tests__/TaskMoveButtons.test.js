/**
 * Tests for TaskMoveButtons Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Import after mocks
import TaskMoveButtons from '../TaskMoveButtons';

describe( 'TaskMoveButtons', () => {
	const mockTask = {
		id: 123,
		title: { rendered: 'Test Task' },
	};

	const defaultProps = {
		task: mockTask,
		taskId: 'task-123',
		onMoveUp: jest.fn(),
		onMoveDown: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders move buttons wrapper', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-move-buttons-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders move buttons container', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-move-buttons' )
			).toBeInTheDocument();
		} );

		it( 'renders move up button', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			expect( screen.getByTitle( 'Move up' ) ).toBeInTheDocument();
		} );

		it( 'renders move down button', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			expect( screen.getByTitle( 'Move down' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'move up button', () => {
		it( 'has correct class', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect( container.querySelector( '.move-up' ) ).toBeInTheDocument();
		} );

		it( 'calls onMoveUp when clicked', () => {
			const onMoveUp = jest.fn();

			render(
				<TaskMoveButtons { ...defaultProps } onMoveUp={ onMoveUp } />
			);

			fireEvent.click( screen.getByTitle( 'Move up' ) );

			expect( onMoveUp ).toHaveBeenCalled();
		} );

		it( 'has correct data attributes', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			const button = screen.getByTitle( 'Move up' );
			expect( button ).toHaveAttribute( 'data-task-id', 'task-123' );
			expect( button ).toHaveAttribute( 'data-task-title', 'Test Task' );
			expect( button ).toHaveAttribute( 'data-action', 'move-up' );
		} );

		it( 'has arrow icon', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect(
				container.querySelector( '.dashicons-arrow-up-alt2' )
			).toBeInTheDocument();
		} );

		it( 'has screen reader text', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			const screenReaderTexts = screen.getAllByText( 'Move up' );
			expect( screenReaderTexts.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'move down button', () => {
		it( 'has correct class', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect(
				container.querySelector( '.move-down' )
			).toBeInTheDocument();
		} );

		it( 'calls onMoveDown when clicked', () => {
			const onMoveDown = jest.fn();

			render(
				<TaskMoveButtons
					{ ...defaultProps }
					onMoveDown={ onMoveDown }
				/>
			);

			fireEvent.click( screen.getByTitle( 'Move down' ) );

			expect( onMoveDown ).toHaveBeenCalled();
		} );

		it( 'has correct data attributes', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			const button = screen.getByTitle( 'Move down' );
			expect( button ).toHaveAttribute( 'data-task-id', 'task-123' );
			expect( button ).toHaveAttribute( 'data-task-title', 'Test Task' );
			expect( button ).toHaveAttribute( 'data-action', 'move-down' );
		} );

		it( 'has arrow icon', () => {
			const { container } = render(
				<TaskMoveButtons { ...defaultProps } />
			);

			expect(
				container.querySelector( '.dashicons-arrow-down-alt2' )
			).toBeInTheDocument();
		} );

		it( 'has screen reader text', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			const screenReaderTexts = screen.getAllByText( 'Move down' );
			expect( screenReaderTexts.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'task title handling', () => {
		it( 'uses rendered title from object', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			const button = screen.getByTitle( 'Move up' );
			expect( button ).toHaveAttribute( 'data-task-title', 'Test Task' );
		} );

		it( 'uses string title as fallback', () => {
			const taskWithStringTitle = {
				id: 123,
				title: 'String Title',
			};

			render(
				<TaskMoveButtons
					{ ...defaultProps }
					task={ taskWithStringTitle }
				/>
			);

			const button = screen.getByTitle( 'Move up' );
			expect( button ).toHaveAttribute(
				'data-task-title',
				'String Title'
			);
		} );
	} );

	describe( 'button types', () => {
		it( 'move up button is type button', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			expect( screen.getByTitle( 'Move up' ) ).toHaveAttribute(
				'type',
				'button'
			);
		} );

		it( 'move down button is type button', () => {
			render( <TaskMoveButtons { ...defaultProps } /> );

			expect( screen.getByTitle( 'Move down' ) ).toHaveAttribute(
				'type',
				'button'
			);
		} );
	} );
} );
