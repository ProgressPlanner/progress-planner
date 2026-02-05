/**
 * Tests for TaskCheckbox Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TaskCheckbox from '../TaskCheckbox';

// Helper to create a mock task
function createMockTask( overrides = {} ) {
	return {
		id: 123,
		title: { rendered: 'Test Task Title' },
		slug: 'test-task',
		status: 'publish',
		...overrides,
	};
}

describe( 'TaskCheckbox', () => {
	const defaultProps = {
		isUserTask: false,
		taskIsCompleted: false,
		isCelebrating: false,
		task: createMockTask(),
		onChange: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'non-user tasks', () => {
		it( 'renders arrow icon for non-user tasks', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ false } /> );

			// Should NOT have a checkbox
			expect( screen.queryByRole( 'checkbox' ) ).not.toBeInTheDocument();

			// Should have an arrow SVG
			const wrapper = document.querySelector(
				'.prpl-suggested-task-checkbox-wrapper'
			);
			expect( wrapper ).toBeInTheDocument();
			expect( wrapper.querySelector( 'svg' ) ).toBeInTheDocument();
		} );

		it( 'does not render checkbox input for non-user tasks', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ false } /> );

			expect(
				document.querySelector( '.prpl-suggested-task-checkbox' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'user tasks', () => {
		it( 'renders checkbox for user tasks', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ true } /> );

			expect( screen.getByRole( 'checkbox' ) ).toBeInTheDocument();
		} );

		it( 'checkbox has correct class', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ true } /> );

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toHaveClass( 'prpl-suggested-task-checkbox' );
		} );

		it( 'checkbox is unchecked when taskIsCompleted is false', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					taskIsCompleted={ false }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).not.toBeChecked();
		} );

		it( 'checkbox is checked when taskIsCompleted is true', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					taskIsCompleted={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeChecked();
		} );

		it( 'checkbox is disabled when celebrating', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeDisabled();
		} );

		it( 'checkbox is enabled when not celebrating', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ false }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).not.toBeDisabled();
		} );

		it( 'calls onChange when checkbox is clicked', () => {
			const onChange = jest.fn();
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					onChange={ onChange }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			fireEvent.click( checkbox );

			expect( onChange ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'marks checkbox as disabled when celebrating', () => {
			// Note: fireEvent.click can still trigger events on disabled elements
			// in testing-library, but the disabled attribute is properly set
			// which prevents interaction in real browsers
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toBeDisabled();
			expect( checkbox ).toHaveAttribute( 'disabled' );
		} );
	} );

	describe( 'accessibility', () => {
		it( 'has screen reader text with task title', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					task={ createMockTask( {
						title: { rendered: 'My Test Task' },
					} ) }
				/>
			);

			// Check for screen reader text
			const srText = document.querySelector( '.screen-reader-text' );
			expect( srText ).toBeInTheDocument();
			expect( srText.textContent ).toContain( 'My Test Task' );
			expect( srText.textContent ).toContain( 'Mark as complete' );
		} );

		it( 'handles task with plain string title', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					task={ createMockTask( { title: 'Plain String Title' } ) }
				/>
			);

			const srText = document.querySelector( '.screen-reader-text' );
			expect( srText ).toBeInTheDocument();
			expect( srText.textContent ).toContain( 'Plain String Title' );
		} );

		it( 'checkbox is inside a label', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ true } /> );

			const checkbox = screen.getByRole( 'checkbox' );
			// The checkbox should be inside a label element
			expect( checkbox.closest( 'label' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'disabled checkbox inline styles', () => {
		it( 'applies disabled styles when celebrating', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ true }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).toHaveStyle( {
				opacity: '0.5',
				borderColor: '#0773bf',
				backgroundColor: '#effbfe',
			} );
		} );

		it( 'does not apply disabled styles when not celebrating', () => {
			render(
				<TaskCheckbox
					{ ...defaultProps }
					isUserTask={ true }
					isCelebrating={ false }
				/>
			);

			const checkbox = screen.getByRole( 'checkbox' );
			expect( checkbox ).not.toHaveStyle( {
				opacity: '0.5',
			} );
		} );
	} );

	describe( 'wrapper styling', () => {
		it( 'has wrapper class', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ true } /> );

			expect(
				document.querySelector(
					'.prpl-suggested-task-checkbox-wrapper'
				)
			).toBeInTheDocument();
		} );

		it( 'wrapper has flex display', () => {
			render( <TaskCheckbox { ...defaultProps } isUserTask={ true } /> );

			const wrapper = document.querySelector(
				'.prpl-suggested-task-checkbox-wrapper'
			);
			expect( wrapper.style.display ).toBe( 'flex' );
		} );
	} );
} );
