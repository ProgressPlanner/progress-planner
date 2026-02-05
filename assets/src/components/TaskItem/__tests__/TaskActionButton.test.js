/**
 * Tests for TaskActionButton Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TaskActionButton from '../TaskActionButton';

describe( 'TaskActionButton', () => {
	describe( 'rendering as button', () => {
		it( 'renders as a button by default', () => {
			render( <TaskActionButton>Click me</TaskActionButton> );

			const button = screen.getByRole( 'button', {
				name: 'Click me',
			} );
			expect( button.tagName ).toBe( 'BUTTON' );
		} );

		it( 'adds type="button" for button elements', () => {
			render( <TaskActionButton>Click me</TaskActionButton> );

			expect( screen.getByRole( 'button' ) ).toHaveAttribute(
				'type',
				'button'
			);
		} );
	} );

	describe( 'rendering as link', () => {
		it( 'renders as an anchor when as="a"', () => {
			render(
				<TaskActionButton as="a" href="https://example.com">
					Link text
				</TaskActionButton>
			);

			const link = screen.getByRole( 'link', { name: 'Link text' } );
			expect( link.tagName ).toBe( 'A' );
			expect( link ).toHaveAttribute( 'href', 'https://example.com' );
		} );

		it( 'does not add type="button" for anchor elements', () => {
			render(
				<TaskActionButton as="a" href="#">
					Link
				</TaskActionButton>
			);

			expect( screen.getByRole( 'link' ) ).not.toHaveAttribute( 'type' );
		} );
	} );

	describe( 'base styles', () => {
		it( 'applies base styles', () => {
			render( <TaskActionButton>Styled</TaskActionButton> );

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveStyle( {
				padding: '0',
				cursor: 'pointer',
				textDecoration: 'none',
			} );
		} );
	} );

	describe( 'hover behavior', () => {
		it( 'shows underline on hover', () => {
			render( <TaskActionButton>Hover me</TaskActionButton> );

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveStyle( { textDecoration: 'none' } );

			fireEvent.mouseEnter( button );
			expect( button ).toHaveStyle( { textDecoration: 'underline' } );

			fireEvent.mouseLeave( button );
			expect( button ).toHaveStyle( { textDecoration: 'none' } );
		} );
	} );

	describe( 'prop passthrough', () => {
		it( 'passes data attributes through', () => {
			render(
				<TaskActionButton data-task-id="123" data-action="complete">
					Action
				</TaskActionButton>
			);

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveAttribute( 'data-task-id', '123' );
			expect( button ).toHaveAttribute( 'data-action', 'complete' );
		} );

		it( 'passes onClick handler', () => {
			const onClick = jest.fn();
			render(
				<TaskActionButton onClick={ onClick }>Click</TaskActionButton>
			);

			fireEvent.click( screen.getByRole( 'button' ) );
			expect( onClick ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'passes title attribute', () => {
			render(
				<TaskActionButton title="My title">Action</TaskActionButton>
			);

			expect( screen.getByRole( 'button' ) ).toHaveAttribute(
				'title',
				'My title'
			);
		} );

		it( 'merges consumer styles with base styles', () => {
			render(
				<TaskActionButton style={ { marginLeft: '10px' } }>
					Styled
				</TaskActionButton>
			);

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveStyle( {
				marginLeft: '10px',
				cursor: 'pointer',
			} );
		} );
	} );
} );
