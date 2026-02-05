/**
 * Tests for Tooltip Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../index';

describe( 'Tooltip', () => {
	describe( 'basic rendering', () => {
		it( 'renders the trigger content', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			expect( screen.getByText( 'Open' ) ).toBeInTheDocument();
		} );

		it( 'does not show tooltip body by default', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toHaveAttribute( 'aria-hidden', 'true' );
		} );
	} );

	describe( 'visibility toggle', () => {
		it( 'shows tooltip body on trigger click', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			fireEvent.click( screen.getByRole( 'button', { name: 'Open' } ) );

			expect( screen.getByRole( 'tooltip' ) ).not.toHaveAttribute(
				'aria-hidden',
				'true'
			);
		} );

		it( 'hides tooltip on close button click', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			// Open
			fireEvent.click( screen.getByRole( 'button', { name: 'Open' } ) );
			expect( screen.getByRole( 'tooltip' ) ).not.toHaveAttribute(
				'aria-hidden',
				'true'
			);

			// Close via close button
			fireEvent.click( screen.getByRole( 'button', { name: /close/i } ) );
			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toHaveAttribute( 'aria-hidden', 'true' );
		} );

		it( 'hides tooltip on overlay click', () => {
			const { container } = render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			// Open
			fireEvent.click( screen.getByRole( 'button', { name: 'Open' } ) );

			// Close via overlay
			const overlay = container.querySelector( '.prpl-overlay' );
			fireEvent.click( overlay );

			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toHaveAttribute( 'aria-hidden', 'true' );
		} );

		it( 'hides tooltip on Escape key', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Tooltip body</p>
				</Tooltip>
			);

			// Open
			fireEvent.click( screen.getByRole( 'button', { name: 'Open' } ) );

			// Close via Escape
			fireEvent.keyDown( document, { key: 'Escape' } );

			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toHaveAttribute( 'aria-hidden', 'true' );
		} );

		it( 'does NOT close on click inside tooltip body', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Click me</p>
				</Tooltip>
			);

			// Open
			fireEvent.click( screen.getByRole( 'button', { name: 'Open' } ) );

			// Click inside the tooltip body
			fireEvent.click( screen.getByText( 'Click me' ) );

			expect( screen.getByRole( 'tooltip' ) ).not.toHaveAttribute(
				'aria-hidden',
				'true'
			);
		} );
	} );

	describe( 'ARIA attributes', () => {
		it( 'has role="tooltip" on the panel', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Body</p>
				</Tooltip>
			);

			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toBeInTheDocument();
		} );

		it( 'has aria-hidden="true" when closed', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Body</p>
				</Tooltip>
			);

			expect(
				screen.getByRole( 'tooltip', { hidden: true } )
			).toHaveAttribute( 'aria-hidden', 'true' );
		} );

		it( 'trigger has aria-describedby matching tooltip id', () => {
			render(
				<Tooltip triggerContent={ <span>Open</span> }>
					<p>Body</p>
				</Tooltip>
			);

			const trigger = screen.getByRole( 'button', { name: 'Open' } );
			const tooltip = screen.getByRole( 'tooltip', { hidden: true } );

			expect( trigger ).toHaveAttribute( 'aria-describedby' );
			expect( trigger.getAttribute( 'aria-describedby' ) ).toBe(
				tooltip.getAttribute( 'id' )
			);
		} );
	} );

	describe( 'className passthrough', () => {
		it( 'applies custom className to wrapper', () => {
			const { container } = render(
				<Tooltip
					triggerContent={ <span>Open</span> }
					className="custom-class"
				>
					<p>Body</p>
				</Tooltip>
			);

			expect(
				container.querySelector( '.prpl-tooltip-wrapper.custom-class' )
			).toBeInTheDocument();
		} );
	} );
} );
