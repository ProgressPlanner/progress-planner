/**
 * Tests for TaskTitle Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Import after mocks
import TaskTitle from '../TaskTitle';

describe( 'TaskTitle', () => {
	const mockTask = {
		id: 123,
		title: { rendered: 'Test Task Title' },
	};

	const defaultProps = {
		task: mockTask,
		isUserTask: false,
		isCompleted: false,
		isCelebrating: false,
		titleRef: { current: null },
		onKeyDown: jest.fn(),
		onInput: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders title wrapper', () => {
			const { container } = render( <TaskTitle { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-suggested-task-title-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders h3 title element', () => {
			render( <TaskTitle { ...defaultProps } /> );

			expect(
				screen.getByRole( 'heading', { level: 3 } )
			).toBeInTheDocument();
		} );

		it( 'displays task title', () => {
			render( <TaskTitle { ...defaultProps } /> );

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );

		it( 'has correct class on h3', () => {
			const { container } = render( <TaskTitle { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-task-title' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'non-user task (read-only)', () => {
		it( 'renders non-editable title for non-user task', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ false } /> );

			expect( screen.queryByRole( 'textbox' ) ).not.toBeInTheDocument();
		} );

		it( 'renders title content', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ false } /> );

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'user task (editable)', () => {
		it( 'renders editable title for user task', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByRole( 'textbox' ) ).toBeInTheDocument();
		} );

		it( 'has contentEditable attribute', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ true } /> );

			const textbox = screen.getByRole( 'textbox' );
			expect( textbox ).toHaveAttribute(
				'contenteditable',
				'plaintext-only'
			);
		} );

		it( 'has aria-label for accessibility', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ true } /> );

			const textbox = screen.getByRole( 'textbox' );
			expect( textbox ).toHaveAttribute(
				'aria-label',
				'Edit task title'
			);
		} );

		it( 'has tabIndex for keyboard navigation', () => {
			render( <TaskTitle { ...defaultProps } isUserTask={ true } /> );

			const textbox = screen.getByRole( 'textbox' );
			expect( textbox ).toHaveAttribute( 'tabIndex', '0' );
		} );

		it( 'calls onKeyDown when key is pressed', () => {
			const onKeyDown = jest.fn();

			render(
				<TaskTitle
					{ ...defaultProps }
					isUserTask={ true }
					onKeyDown={ onKeyDown }
				/>
			);

			const textbox = screen.getByRole( 'textbox' );
			fireEvent.keyDown( textbox, { key: 'Enter' } );

			expect( onKeyDown ).toHaveBeenCalled();
		} );

		it( 'calls onInput when text is changed', () => {
			const onInput = jest.fn();

			render(
				<TaskTitle
					{ ...defaultProps }
					isUserTask={ true }
					onInput={ onInput }
				/>
			);

			const textbox = screen.getByRole( 'textbox' );
			fireEvent.input( textbox );

			expect( onInput ).toHaveBeenCalled();
		} );
	} );

	describe( 'completed user task', () => {
		it( 'renders non-editable title when completed', () => {
			render(
				<TaskTitle
					{ ...defaultProps }
					isUserTask={ true }
					isCompleted={ true }
				/>
			);

			// Should not be editable when completed
			expect( screen.queryByRole( 'textbox' ) ).not.toBeInTheDocument();
		} );

		it( 'still displays title content when completed', () => {
			render(
				<TaskTitle
					{ ...defaultProps }
					isUserTask={ true }
					isCompleted={ true }
				/>
			);

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'title text handling', () => {
		it( 'uses rendered title from object', () => {
			render( <TaskTitle { ...defaultProps } /> );

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );

		it( 'uses string title as fallback', () => {
			const taskWithStringTitle = {
				id: 123,
				title: 'String Title',
			};

			render(
				<TaskTitle { ...defaultProps } task={ taskWithStringTitle } />
			);

			expect( screen.getByText( 'String Title' ) ).toBeInTheDocument();
		} );

		it( 'handles HTML entities in title', () => {
			const taskWithHtml = {
				id: 123,
				title: { rendered: 'Task with &amp; symbol' },
			};

			render( <TaskTitle { ...defaultProps } task={ taskWithHtml } /> );

			expect(
				screen.getByText( 'Task with & symbol' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'celebrating state', () => {
		it( 'renders title when celebrating', () => {
			render( <TaskTitle { ...defaultProps } isCelebrating={ true } /> );

			expect( screen.getByText( 'Test Task Title' ) ).toBeInTheDocument();
		} );
	} );
} );
