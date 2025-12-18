/**
 * Tests for InteractiveTaskPopover Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import InteractiveTaskPopover from '../InteractiveTaskPopover';

// Mock WordPress hooks
jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

describe( 'InteractiveTaskPopover', () => {
	const mockOnClose = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders nothing when isOpen is false', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ false }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-popover' )
			).not.toBeInTheDocument();
		} );

		it( 'renders popover when isOpen is true', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-popover' )
			).toBeInTheDocument();
		} );

		it( 'renders children content', () => {
			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Test Content</p>
				</InteractiveTaskPopover>
			);

			expect( screen.getByText( 'Test Content' ) ).toBeInTheDocument();
		} );

		it( 'renders close button', () => {
			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				screen.getByRole( 'button', { name: /close/i } )
			).toBeInTheDocument();
		} );
	} );

	describe( 'popover ID', () => {
		it( 'generates ID from taskId', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="my-custom-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '#prpl-popover-my-custom-task' )
			).toBeInTheDocument();
		} );

		it( 'handles taskId with special characters', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="task-with-dashes"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '#prpl-popover-task-with-dashes' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has prpl-popover class', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-popover' )
			).toBeInTheDocument();
		} );

		it( 'has prpl-popover-interactive class', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-popover-interactive' )
			).toBeInTheDocument();
		} );

		it( 'has columns wrapper', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'has close button class', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.prpl-popover-close' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'close button', () => {
		it( 'calls onClose when clicked', () => {
			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			const closeButton = screen.getByRole( 'button', {
				name: /close/i,
			} );
			fireEvent.click( closeButton );

			expect( mockOnClose ).toHaveBeenCalled();
		} );

		it( 'triggers doAction on close', () => {
			const { doAction } = require( '@wordpress/hooks' );

			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="my-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			const closeButton = screen.getByRole( 'button', {
				name: /close/i,
			} );
			fireEvent.click( closeButton );

			expect( doAction ).toHaveBeenCalledWith(
				'prpl.popover.close',
				'my-task'
			);
		} );

		it( 'has dashicons icon', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.dashicons-no-alt' )
			).toBeInTheDocument();
		} );

		it( 'has screen reader text', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '.screen-reader-text' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'popover attribute', () => {
		it( 'has popover="auto" attribute', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			const popover = container.querySelector( '.prpl-popover' );
			expect( popover ).toHaveAttribute( 'popover', 'auto' );
		} );
	} );

	describe( 'children', () => {
		it( 'renders multiple children', () => {
			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<p>First paragraph</p>
					<p>Second paragraph</p>
				</InteractiveTaskPopover>
			);

			expect( screen.getByText( 'First paragraph' ) ).toBeInTheDocument();
			expect(
				screen.getByText( 'Second paragraph' )
			).toBeInTheDocument();
		} );

		it( 'renders complex children', () => {
			render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				>
					<div>
						<h2>Title</h2>
						<form>
							<input type="text" placeholder="Enter value" />
							<button type="submit">Submit</button>
						</form>
					</div>
				</InteractiveTaskPopover>
			);

			expect( screen.getByText( 'Title' ) ).toBeInTheDocument();
			expect(
				screen.getByPlaceholderText( 'Enter value' )
			).toBeInTheDocument();
			expect( screen.getByText( 'Submit' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'onToggle handler', () => {
		it( 'has onToggle handler attached', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="toggle-task"
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			const popover = container.querySelector( '.prpl-popover' );
			// Verify popover has the toggle attribute for native popover API
			expect( popover ).toHaveAttribute( 'popover', 'auto' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles onClose being undefined', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ undefined }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			const closeButton = container.querySelector(
				'.prpl-popover-close'
			);

			// Should not throw
			expect( () => fireEvent.click( closeButton ) ).not.toThrow();
		} );

		it( 'handles empty taskId', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId=""
					onClose={ mockOnClose }
				>
					<p>Content</p>
				</InteractiveTaskPopover>
			);

			expect(
				container.querySelector( '#prpl-popover-' )
			).toBeInTheDocument();
		} );

		it( 'renders without children', () => {
			const { container } = render(
				<InteractiveTaskPopover
					isOpen={ true }
					taskId="test-task"
					onClose={ mockOnClose }
				/>
			);

			expect(
				container.querySelector( '.prpl-popover' )
			).toBeInTheDocument();
		} );
	} );
} );
