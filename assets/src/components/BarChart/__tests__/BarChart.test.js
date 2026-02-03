/**
 * Tests for BarChart Component
 */

import { render, screen } from '@testing-library/react';
import BarChart from '../index';

describe( 'BarChart', () => {
	const mockData = [
		{ label: 'Jan', score: 80, color: '#ff0000' },
		{ label: 'Feb', score: 60, color: '#00ff00' },
		{ label: 'Mar', score: 90, color: '#0000ff' },
	];

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			expect(
				container.querySelector( '.prpl-bar-chart' )
			).toBeInTheDocument();
		} );

		it( 'renders chart-bar container', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			expect(
				container.querySelector( '.chart-bar' )
			).toBeInTheDocument();
		} );

		it( 'renders correct number of bars', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars ).toHaveLength( 3 );
		} );

		it( 'renders empty chart for empty data', () => {
			const { container } = render( <BarChart data={ [] } /> );

			expect(
				container.querySelector( '.prpl-bar-chart' )
			).toBeInTheDocument();
			expect(
				container.querySelectorAll( '.prpl-bar-chart__bar' )
			).toHaveLength( 0 );
		} );

		it( 'uses default empty array for undefined data', () => {
			const { container } = render( <BarChart /> );

			expect(
				container.querySelector( '.prpl-bar-chart' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'bar styling', () => {
		it( 'applies bar height based on score', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars[ 0 ] ).toHaveStyle( { height: '80%' } );
			expect( bars[ 1 ] ).toHaveStyle( { height: '60%' } );
			expect( bars[ 2 ] ).toHaveStyle( { height: '90%' } );
		} );

		it( 'applies bar color from data', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars[ 0 ] ).toHaveStyle( { background: '#ff0000' } );
			expect( bars[ 1 ] ).toHaveStyle( { background: '#00ff00' } );
			expect( bars[ 2 ] ).toHaveStyle( { background: '#0000ff' } );
		} );

		it( 'sets bar width to 100%', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const bar = container.querySelector( '.prpl-bar-chart__bar' );
			expect( bar ).toHaveStyle( { width: '100%' } );
		} );
	} );

	describe( 'bar title attribute', () => {
		it( 'sets title with label and score', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars[ 0 ] ).toHaveAttribute( 'title', 'Jan - 80%' );
			expect( bars[ 1 ] ).toHaveAttribute( 'title', 'Feb - 60%' );
			expect( bars[ 2 ] ).toHaveAttribute( 'title', 'Mar - 90%' );
		} );
	} );

	describe( 'labels', () => {
		it( 'renders labels for each bar', () => {
			render( <BarChart data={ mockData } /> );

			expect( screen.getByText( 'Jan' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Feb' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Mar' ) ).toBeInTheDocument();
		} );

		it( 'makes labels visible for small datasets', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const labels = container.querySelectorAll( '.label' );
			labels.forEach( ( label ) => {
				expect( label ).toHaveClass( 'visible' );
			} );
		} );

		it( 'uses label-container wrapper', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const containers = container.querySelectorAll( '.label-container' );
			expect( containers ).toHaveLength( 3 );
		} );
	} );

	describe( 'label visibility with many items', () => {
		const manyDataPoints = Array.from( { length: 12 }, ( _, i ) => ( {
			label: `Item ${ i + 1 }`,
			score: ( i + 1 ) * 8,
			color: '#333',
		} ) );

		it( 'renders all bars for many data points', () => {
			const { container } = render(
				<BarChart data={ manyDataPoints } />
			);

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars ).toHaveLength( 12 );
		} );

		it( 'hides some labels when there are many items', () => {
			const { container } = render(
				<BarChart data={ manyDataPoints } />
			);

			const invisibleLabels =
				container.querySelectorAll( '.label.invisible' );
			expect( invisibleLabels.length ).toBeGreaterThan( 0 );
		} );

		it( 'keeps some labels visible', () => {
			const { container } = render(
				<BarChart data={ manyDataPoints } />
			);

			const visibleLabels =
				container.querySelectorAll( '.label.visible' );
			expect( visibleLabels.length ).toBeGreaterThan( 0 );
			expect( visibleLabels.length ).toBeLessThanOrEqual( 6 );
		} );
	} );

	describe( 'container styling', () => {
		it( 'applies flex layout to chart-bar', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const chartBar = container.querySelector( '.chart-bar' );
			expect( chartBar ).toHaveStyle( {
				display: 'flex',
				alignItems: 'flex-end',
			} );
		} );

		it( 'sets max width on chart-bar', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const chartBar = container.querySelector( '.chart-bar' );
			expect( chartBar ).toHaveStyle( { maxWidth: '600px' } );
		} );

		it( 'sets height on chart-bar', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const chartBar = container.querySelector( '.chart-bar' );
			expect( chartBar ).toHaveStyle( { height: '200px' } );
		} );
	} );

	describe( 'bar container styling', () => {
		it( 'applies flex column layout', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const barContainer = container.querySelector(
				'.prpl-bar-chart__bar-container'
			);
			expect( barContainer ).toHaveStyle( {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
			} );
		} );

		it( 'sets full height on bar container', () => {
			const { container } = render( <BarChart data={ mockData } /> );

			const barContainer = container.querySelector(
				'.prpl-bar-chart__bar-container'
			);
			expect( barContainer ).toHaveStyle( { height: '100%' } );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles 0% score', () => {
			const zeroData = [ { label: 'Zero', score: 0, color: '#000' } ];

			const { container } = render( <BarChart data={ zeroData } /> );

			const bar = container.querySelector( '.prpl-bar-chart__bar' );
			expect( bar ).toHaveStyle( { height: '0%' } );
		} );

		it( 'handles 100% score', () => {
			const fullData = [ { label: 'Full', score: 100, color: '#000' } ];

			const { container } = render( <BarChart data={ fullData } /> );

			const bar = container.querySelector( '.prpl-bar-chart__bar' );
			expect( bar ).toHaveStyle( { height: '100%' } );
		} );

		it( 'handles special characters in label', () => {
			const specialData = [
				{ label: "Jan's <Data> & More", score: 50, color: '#000' },
			];

			render( <BarChart data={ specialData } /> );

			expect(
				screen.getByText( "Jan's <Data> & More" )
			).toBeInTheDocument();
		} );

		it( 'handles CSS variable colors', () => {
			const cssVarData = [
				{ label: 'Test', score: 50, color: 'var(--chart-color)' },
			];

			const { container } = render( <BarChart data={ cssVarData } /> );

			const bar = container.querySelector( '.prpl-bar-chart__bar' );
			expect( bar ).toHaveStyle( { background: 'var(--chart-color)' } );
		} );

		it( 'handles single data point', () => {
			const singleData = [ { label: 'Only', score: 75, color: '#abc' } ];

			const { container } = render( <BarChart data={ singleData } /> );

			const bars = container.querySelectorAll( '.prpl-bar-chart__bar' );
			expect( bars ).toHaveLength( 1 );
		} );

		it( 'handles decimal scores', () => {
			const decimalData = [
				{ label: 'Decimal', score: 33.5, color: '#000' },
			];

			const { container } = render( <BarChart data={ decimalData } /> );

			const bar = container.querySelector( '.prpl-bar-chart__bar' );
			expect( bar ).toHaveStyle( { height: '33.5%' } );
			expect( bar ).toHaveAttribute( 'title', 'Decimal - 33.5%' );
		} );
	} );

	describe( 'exactly 6 items', () => {
		it( 'shows all labels for exactly 6 items', () => {
			const sixItems = Array.from( { length: 6 }, ( _, i ) => ( {
				label: `Item ${ i + 1 }`,
				score: 50,
				color: '#333',
			} ) );

			const { container } = render( <BarChart data={ sixItems } /> );

			const visibleLabels =
				container.querySelectorAll( '.label.visible' );
			expect( visibleLabels ).toHaveLength( 6 );
		} );
	} );

	describe( 'exactly 7 items', () => {
		it( 'shows all labels for 7 items (divider is 1)', () => {
			// labelsDivider = Math.floor(7/6) = 1, so all labels visible
			const sevenItems = Array.from( { length: 7 }, ( _, i ) => ( {
				label: `Item ${ i + 1 }`,
				score: 50,
				color: '#333',
			} ) );

			const { container } = render( <BarChart data={ sevenItems } /> );

			const visibleLabels =
				container.querySelectorAll( '.label.visible' );
			expect( visibleLabels ).toHaveLength( 7 );
		} );
	} );
} );
