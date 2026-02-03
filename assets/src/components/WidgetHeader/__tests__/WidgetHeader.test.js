/**
 * Tests for WidgetHeader Component
 */

import { render, screen } from '@testing-library/react';
import WidgetHeader from '../index';

describe( 'WidgetHeader', () => {
	describe( 'basic rendering', () => {
		it( 'renders the title', () => {
			render( <WidgetHeader title="Widget Title" /> );

			expect(
				screen.getByRole( 'heading', { level: 2 } )
			).toHaveTextContent( 'Widget Title' );
		} );

		it( 'renders as h2 element', () => {
			render( <WidgetHeader title="Test" /> );

			expect(
				screen.getByRole( 'heading', { level: 2 } )
			).toBeInTheDocument();
		} );

		it( 'has correct default class', () => {
			const { container } = render( <WidgetHeader title="Test" /> );

			expect(
				container.querySelector( '.prpl-widget-title' )
			).toBeInTheDocument();
		} );

		it( 'renders different titles', () => {
			const { rerender } = render( <WidgetHeader title="First Title" /> );
			expect( screen.getByText( 'First Title' ) ).toBeInTheDocument();

			rerender( <WidgetHeader title="Second Title" /> );
			expect( screen.getByText( 'Second Title' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'custom className', () => {
		it( 'appends custom className', () => {
			const { container } = render(
				<WidgetHeader title="Test" className="custom-class" />
			);

			const header = container.querySelector( 'h2' );
			expect( header ).toHaveClass( 'prpl-widget-title' );
			expect( header ).toHaveClass( 'custom-class' );
		} );

		it( 'handles multiple custom classes', () => {
			const { container } = render(
				<WidgetHeader title="Test" className="class-one class-two" />
			);

			const header = container.querySelector( 'h2' );
			expect( header.className ).toContain( 'class-one class-two' );
		} );

		it( 'works without custom className', () => {
			const { container } = render( <WidgetHeader title="Test" /> );

			const header = container.querySelector( 'h2' );
			expect( header.className ).toBe( 'prpl-widget-title' );
		} );

		it( 'handles empty className', () => {
			const { container } = render(
				<WidgetHeader title="Test" className="" />
			);

			const header = container.querySelector( 'h2' );
			expect( header.className ).toBe( 'prpl-widget-title' );
		} );
	} );

	describe( 'tooltip rendering', () => {
		const mockSvg = '<svg><circle cx="10" cy="10" r="5"/></svg>';

		it( 'shows tooltip when both icon and content provided', () => {
			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ mockSvg }
					tooltipContent="Helpful info"
				/>
			);

			expect(
				container.querySelector( '.tooltip-actions' )
			).toBeInTheDocument();
		} );

		it( 'hides tooltip when only icon provided', () => {
			const { container } = render(
				<WidgetHeader title="Test" infoIconSvg={ mockSvg } />
			);

			expect(
				container.querySelector( '.tooltip-actions' )
			).not.toBeInTheDocument();
		} );

		it( 'hides tooltip when only content provided', () => {
			const { container } = render(
				<WidgetHeader title="Test" tooltipContent="Helpful info" />
			);

			expect(
				container.querySelector( '.tooltip-actions' )
			).not.toBeInTheDocument();
		} );

		it( 'hides tooltip when neither icon nor content provided', () => {
			const { container } = render( <WidgetHeader title="Test" /> );

			expect(
				container.querySelector( '.tooltip-actions' )
			).not.toBeInTheDocument();
		} );

		it( 'renders prpl-tooltip custom element', () => {
			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ mockSvg }
					tooltipContent="Info"
				/>
			);

			expect(
				container.querySelector( 'prpl-tooltip' )
			).toBeInTheDocument();
		} );

		it( 'renders SVG inside icon span', () => {
			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ mockSvg }
					tooltipContent="Info"
				/>
			);

			const iconSpan = container.querySelector( '.prpl-info-icon span' );
			expect( iconSpan.innerHTML ).toContain( '<svg>' );
			expect( iconSpan.innerHTML ).toContain( 'circle' );
		} );

		it( 'renders tooltip content in slot', () => {
			render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ mockSvg }
					tooltipContent="Detailed information here"
				/>
			);

			expect(
				screen.getByText( 'Detailed information here' )
			).toBeInTheDocument();
		} );

		it( 'includes screen reader text for accessibility', () => {
			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ mockSvg }
					tooltipContent="Info"
				/>
			);

			expect(
				container.querySelector( '.screen-reader-text' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '.screen-reader-text' )
			).toHaveTextContent( 'More info' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty title', () => {
			render( <WidgetHeader title="" /> );

			expect(
				screen.getByRole( 'heading', { level: 2 } )
			).toBeInTheDocument();
		} );

		it( 'handles special characters in title', () => {
			render( <WidgetHeader title="Title & <Special> 'Characters'" /> );

			expect(
				screen.getByText( "Title & <Special> 'Characters'" )
			).toBeInTheDocument();
		} );

		it( 'handles HTML in tooltip content', () => {
			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg="<svg></svg>"
					tooltipContent="<strong>Bold</strong> text"
				/>
			);

			// Content is rendered as text, not HTML
			const slot = container.querySelector( 'slot[name="content"]' );
			expect( slot.textContent ).toContain( '<strong>Bold</strong>' );
		} );

		it( 'handles complex SVG icons', () => {
			const complexSvg = `
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="12" cy="12" r="10"/>
					<path d="M12 16v-4"/>
					<path d="M12 8h.01"/>
				</svg>
			`;

			const { container } = render(
				<WidgetHeader
					title="Test"
					infoIconSvg={ complexSvg }
					tooltipContent="Info"
				/>
			);

			const iconSpan = container.querySelector( '.prpl-info-icon span' );
			expect( iconSpan.innerHTML ).toContain( '<svg' );
			expect( iconSpan.innerHTML ).toContain( 'viewBox="0 0 24 24"' );
			expect( iconSpan.innerHTML ).toContain( 'circle' );
			expect( iconSpan.innerHTML ).toContain( 'path' );
		} );
	} );
} );
