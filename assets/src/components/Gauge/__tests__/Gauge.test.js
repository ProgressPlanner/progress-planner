/**
 * Tests for Gauge Component
 */

import { render, screen } from '@testing-library/react';
import Gauge from '../index';

describe( 'Gauge', () => {
	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'renders gauge ring', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'renders min label as 0', () => {
			render( <Gauge /> );

			expect( screen.getByText( '0' ) ).toBeInTheDocument();
		} );

		it( 'renders max label with default value', () => {
			render( <Gauge /> );

			expect( screen.getByText( '10' ) ).toBeInTheDocument();
		} );

		it( 'renders max label with custom value', () => {
			render( <Gauge max={ 100 } /> );

			expect( screen.getByText( '100' ) ).toBeInTheDocument();
		} );

		it( 'renders children content', () => {
			render(
				<Gauge>
					<span>5 pts</span>
				</Gauge>
			);

			expect( screen.getByText( '5 pts' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'styling', () => {
		it( 'applies default background color', () => {
			const { container } = render( <Gauge /> );

			const gauge = container.querySelector( '.prpl-gauge' );
			expect( gauge ).toHaveStyle( {
				background: 'var(--prpl-background-monthly)',
			} );
		} );

		it( 'applies custom background color', () => {
			const { container } = render(
				<Gauge backgroundColor="var(--custom-bg)" />
			);

			const gauge = container.querySelector( '.prpl-gauge' );
			expect( gauge ).toHaveStyle( {
				background: 'var(--custom-bg)',
			} );
		} );

		it( 'applies aspect ratio to container', () => {
			const { container } = render( <Gauge /> );

			const gauge = container.querySelector( '.prpl-gauge' );
			// jsdom doesn't fully support aspectRatio, check style attribute
			expect( gauge.style.aspectRatio ).toBe( '2 / 1' );
		} );

		it( 'applies default content font size', () => {
			const { container } = render( <Gauge /> );

			const content = container.querySelector( '.prpl-gauge__content' );
			expect( content ).toHaveStyle( {
				fontSize: 'var(--prpl-font-size-6xl)',
			} );
		} );

		it( 'applies custom content font size', () => {
			const { container } = render( <Gauge contentFontSize="2rem" /> );

			const content = container.querySelector( '.prpl-gauge__content' );
			expect( content ).toHaveStyle( {
				fontSize: '2rem',
			} );
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has main gauge class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'has ring class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'has min label class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__label--min' )
			).toBeInTheDocument();
		} );

		it( 'has max label class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__label--max' )
			).toBeInTheDocument();
		} );

		it( 'has content class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__content' )
			).toBeInTheDocument();
		} );

		it( 'has content inner class', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__content-inner' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'progress calculation', () => {
		it( 'handles 0% progress', () => {
			const { container } = render( <Gauge value={ 0 } max={ 10 } /> );

			// Component should render with gauge ring
			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'handles 50% progress', () => {
			const { container } = render( <Gauge value={ 5 } max={ 10 } /> );

			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'handles 100% progress', () => {
			const { container } = render( <Gauge value={ 10 } max={ 10 } /> );

			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'handles max of 0 gracefully', () => {
			const { container } = render( <Gauge value={ 5 } max={ 0 } /> );

			// Should not crash and should render
			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'handles value exceeding max', () => {
			const { container } = render( <Gauge value={ 15 } max={ 10 } /> );

			// Should not crash and should render
			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'label positioning', () => {
		it( 'positions min label on the left', () => {
			const { container } = render( <Gauge /> );

			const minLabel = container.querySelector(
				'.prpl-gauge__label--min'
			);
			expect( minLabel ).toHaveStyle( {
				left: '0',
			} );
		} );

		it( 'positions max label on the right', () => {
			const { container } = render( <Gauge /> );

			const maxLabel = container.querySelector(
				'.prpl-gauge__label--max'
			);
			expect( maxLabel ).toHaveStyle( {
				right: '0',
			} );
		} );

		it( 'labels are at 50% top position', () => {
			const { container } = render( <Gauge /> );

			const minLabel = container.querySelector(
				'.prpl-gauge__label--min'
			);
			const maxLabel = container.querySelector(
				'.prpl-gauge__label--max'
			);

			expect( minLabel ).toHaveStyle( { top: '50%' } );
			expect( maxLabel ).toHaveStyle( { top: '50%' } );
		} );
	} );

	describe( 'color props', () => {
		it( 'renders with default colors', () => {
			const { container } = render( <Gauge value={ 3 } max={ 10 } /> );

			// Component should render with default colors (can't test CSS gradient in jsdom)
			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'renders with custom color prop', () => {
			const { container } = render(
				<Gauge value={ 3 } max={ 10 } color="var(--custom-color)" />
			);

			// Component should accept custom color
			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'renders with color2 prop for high progress', () => {
			const { container } = render(
				<Gauge
					value={ 8 }
					max={ 10 }
					color="var(--primary)"
					color2="var(--secondary)"
				/>
			);

			// Component should accept color2 prop
			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );

		it( 'renders for progress under 50%', () => {
			const { container } = render(
				<Gauge
					value={ 3 }
					max={ 10 }
					color="var(--primary)"
					color2="var(--secondary)"
				/>
			);

			// Component should render correctly
			expect(
				container.querySelector( '.prpl-gauge__ring' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'children rendering', () => {
		it( 'renders text children', () => {
			render( <Gauge>50%</Gauge> );

			expect( screen.getByText( '50%' ) ).toBeInTheDocument();
		} );

		it( 'renders element children', () => {
			render(
				<Gauge>
					<strong data-testid="child">Bold text</strong>
				</Gauge>
			);

			expect( screen.getByTestId( 'child' ) ).toBeInTheDocument();
		} );

		it( 'renders multiple children', () => {
			render(
				<Gauge>
					<span>Line 1</span>
					<span>Line 2</span>
				</Gauge>
			);

			expect( screen.getByText( 'Line 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Line 2' ) ).toBeInTheDocument();
		} );

		it( 'renders without children', () => {
			const { container } = render( <Gauge /> );

			expect(
				container.querySelector( '.prpl-gauge__content-inner' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles negative value', () => {
			const { container } = render( <Gauge value={ -5 } max={ 10 } /> );

			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'handles negative max', () => {
			const { container } = render( <Gauge value={ 5 } max={ -10 } /> );

			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'handles decimal values', () => {
			const { container } = render( <Gauge value={ 7.5 } max={ 10 } /> );

			expect(
				container.querySelector( '.prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'handles large values', () => {
			render( <Gauge value={ 999999 } max={ 1000000 } /> );

			expect( screen.getByText( '1000000' ) ).toBeInTheDocument();
		} );
	} );
} );
