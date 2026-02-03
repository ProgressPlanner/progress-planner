/**
 * Tests for LineChart Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import LineChart from '../index';

describe( 'LineChart', () => {
	const mockData = {
		series1: [
			{ label: 'Jan', score: 10 },
			{ label: 'Feb', score: 20 },
			{ label: 'Mar', score: 30 },
		],
	};

	const mockOptions = {
		dataArgs: {
			series1: { color: '#ff0000', label: 'Series 1' },
		},
	};

	const multiSeriesData = {
		series1: [
			{ label: 'Jan', score: 10 },
			{ label: 'Feb', score: 20 },
			{ label: 'Mar', score: 30 },
		],
		series2: [
			{ label: 'Jan', score: 5 },
			{ label: 'Feb', score: 15 },
			{ label: 'Mar', score: 25 },
		],
	};

	const multiSeriesOptions = {
		dataArgs: {
			series1: { color: '#ff0000', label: 'Series 1' },
			series2: { color: '#00ff00', label: 'Series 2' },
		},
	};

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart' )
			).toBeInTheDocument();
		} );

		it( 'renders SVG element', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__svg' )
			).toBeInTheDocument();
		} );

		it( 'renders SVG container', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__svg-container' )
			).toBeInTheDocument();
		} );

		it( 'renders X axis', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__x-axis' )
			).toBeInTheDocument();
		} );

		it( 'renders Y axis', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__y-axis' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'X-axis labels', () => {
		it( 'renders X-axis labels from data', () => {
			render( <LineChart data={ mockData } options={ mockOptions } /> );

			expect( screen.getByText( 'Jan' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Feb' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Mar' ) ).toBeInTheDocument();
		} );

		it( 'renders X-axis label groups', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const xLabels = container.querySelectorAll(
				'.prpl-line-chart__x-label'
			);
			expect( xLabels ).toHaveLength( 3 );
		} );

		it( 'limits labels to ~6 for many data points', () => {
			const manyPointsData = {
				series1: Array.from( { length: 12 }, ( _, i ) => ( {
					label: `Point ${ i + 1 }`,
					score: i * 10,
				} ) ),
			};

			const { container } = render(
				<LineChart data={ manyPointsData } options={ mockOptions } />
			);

			// With divider logic, not all labels will be rendered
			const xLabels = container.querySelectorAll(
				'.prpl-line-chart__x-label'
			);
			expect( xLabels.length ).toBeLessThanOrEqual( 7 );
		} );
	} );

	describe( 'Y-axis labels', () => {
		it( 'renders Y-axis label groups', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const yLabels = container.querySelectorAll(
				'.prpl-line-chart__y-label'
			);
			expect( yLabels.length ).toBeGreaterThan( 0 );
		} );

		it( 'includes 0 as minimum Y label', () => {
			render( <LineChart data={ mockData } options={ mockOptions } /> );

			expect( screen.getByText( '0' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'series rendering', () => {
		it( 'renders series polyline', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__series' )
			).toBeInTheDocument();
		} );

		it( 'renders polyline with correct stroke color', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const polyline = container.querySelector(
				'.prpl-line-chart__series polyline'
			);
			expect( polyline ).toHaveAttribute( 'stroke', '#ff0000' );
		} );

		it( 'renders polyline with fill none', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const polyline = container.querySelector(
				'.prpl-line-chart__series polyline'
			);
			expect( polyline ).toHaveAttribute( 'fill', 'none' );
		} );

		it( 'renders series with class including key', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'multiple series', () => {
		it( 'renders multiple series', () => {
			const { container } = render(
				<LineChart
					data={ multiSeriesData }
					options={ multiSeriesOptions }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '.prpl-line-chart__series--series2' )
			).toBeInTheDocument();
		} );

		it( 'shows filters for multiple series', () => {
			const { container } = render(
				<LineChart
					data={ multiSeriesData }
					options={ multiSeriesOptions }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filters' )
			).toBeInTheDocument();
		} );

		it( 'does not show filters for single series', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__filters' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'series visibility toggle', () => {
		it( 'hides series when filter unchecked', () => {
			const { container } = render(
				<LineChart
					data={ multiSeriesData }
					options={ multiSeriesOptions }
				/>
			);

			// Initially both series visible
			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).toBeInTheDocument();

			// Click to uncheck series1
			const checkbox = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			fireEvent.click( checkbox );

			// Series1 should now be hidden
			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).not.toBeInTheDocument();
		} );

		it( 'shows series when filter checked again', () => {
			const { container } = render(
				<LineChart
					data={ multiSeriesData }
					options={ multiSeriesOptions }
				/>
			);

			// Uncheck series1
			const checkbox = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			fireEvent.click( checkbox );

			// Series1 hidden
			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).not.toBeInTheDocument();

			// Check series1 again
			fireEvent.click( checkbox );

			// Series1 visible again
			expect(
				container.querySelector( '.prpl-line-chart__series--series1' )
			).toBeInTheDocument();
		} );

		it( 'maintains other series visibility when toggling one', () => {
			const { container } = render(
				<LineChart
					data={ multiSeriesData }
					options={ multiSeriesOptions }
				/>
			);

			// Uncheck series1
			const checkbox = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			fireEvent.click( checkbox );

			// Series2 should still be visible
			expect(
				container.querySelector( '.prpl-line-chart__series--series2' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'options', () => {
		it( 'uses default height of 300', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const svg = container.querySelector( '.prpl-line-chart__svg' );
			const viewBox = svg.getAttribute( 'viewBox' );
			// Default: height=300, aspectRatio=2, axisOffset=16
			// svgHeight = 300 + 16*2 = 332
			expect( viewBox ).toContain( '332' );
		} );

		it( 'accepts custom height', () => {
			const customOptions = {
				...mockOptions,
				height: 400,
			};

			const { container } = render(
				<LineChart data={ mockData } options={ customOptions } />
			);

			const svg = container.querySelector( '.prpl-line-chart__svg' );
			const viewBox = svg.getAttribute( 'viewBox' );
			// svgHeight = 400 + 16*2 = 432
			expect( viewBox ).toContain( '432' );
		} );

		it( 'accepts custom aspect ratio', () => {
			const customOptions = {
				...mockOptions,
				aspectRatio: 3,
			};

			const { container } = render(
				<LineChart data={ mockData } options={ customOptions } />
			);

			const svg = container.querySelector( '.prpl-line-chart__svg' );
			const viewBox = svg.getAttribute( 'viewBox' );
			// svgWidth = 300*3 + 16*2 = 932
			expect( viewBox ).toContain( '932' );
		} );

		it( 'accepts custom stroke width', () => {
			const customOptions = {
				...mockOptions,
				strokeWidth: 8,
			};

			const { container } = render(
				<LineChart data={ mockData } options={ customOptions } />
			);

			const polyline = container.querySelector(
				'.prpl-line-chart__series polyline'
			);
			expect( polyline ).toHaveAttribute( 'stroke-width', '8' );
		} );

		it( 'accepts custom axis color', () => {
			const customOptions = {
				...mockOptions,
				axisColor: '#333333',
			};

			const { container } = render(
				<LineChart data={ mockData } options={ customOptions } />
			);

			const xAxisLine = container.querySelector(
				'.prpl-line-chart__x-axis line'
			);
			expect( xAxisLine ).toHaveAttribute( 'stroke', '#333333' );
		} );

		it( 'shows filters label when provided', () => {
			const customOptions = {
				...multiSeriesOptions,
				filtersLabel: 'Filter by:',
			};

			render(
				<LineChart data={ multiSeriesData } options={ customOptions } />
			);

			expect( screen.getByText( 'Filter by:' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'styling', () => {
		it( 'applies width 100% to container', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const chart = container.querySelector( '.prpl-line-chart' );
			expect( chart ).toHaveStyle( { width: '100%' } );
		} );

		it( 'applies width 100% to SVG container', () => {
			const { container } = render(
				<LineChart data={ mockData } options={ mockOptions } />
			);

			const svgContainer = container.querySelector(
				'.prpl-line-chart__svg-container'
			);
			expect( svgContainer ).toHaveStyle( { width: '100%' } );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty data', () => {
			const { container } = render(
				<LineChart data={ {} } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart' )
			).toBeInTheDocument();
		} );

		it( 'handles two data points (minimum viable)', () => {
			const twoPointData = {
				series1: [
					{ label: 'Start', score: 50 },
					{ label: 'End', score: 75 },
				],
			};

			const { container } = render(
				<LineChart data={ twoPointData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__series' )
			).toBeInTheDocument();
		} );

		it( 'handles zero scores', () => {
			const zeroData = {
				series1: [
					{ label: 'A', score: 0 },
					{ label: 'B', score: 0 },
					{ label: 'C', score: 0 },
				],
			};

			const { container } = render(
				<LineChart data={ zeroData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__series' )
			).toBeInTheDocument();
		} );

		it( 'handles max score near 100', () => {
			// Tests the 70-100 padding logic
			const nearMaxData = {
				series1: [
					{ label: 'A', score: 75 },
					{ label: 'B', score: 85 },
				],
			};

			render(
				<LineChart data={ nearMaxData } options={ mockOptions } />
			);

			// Should render with Y-axis going to 100
			expect( screen.getByText( '100' ) ).toBeInTheDocument();
		} );

		it( 'handles high scores', () => {
			const highData = {
				series1: [
					{ label: 'A', score: 500 },
					{ label: 'B', score: 1000 },
				],
			};

			const { container } = render(
				<LineChart data={ highData } options={ mockOptions } />
			);

			expect(
				container.querySelector( '.prpl-line-chart__series' )
			).toBeInTheDocument();
		} );

		it( 'handles data with special characters in labels', () => {
			const specialData = {
				series1: [
					{ label: "Jan's <Data>", score: 10 },
					{ label: 'Feb & Mar', score: 20 },
				],
			};

			render(
				<LineChart data={ specialData } options={ mockOptions } />
			);

			expect( screen.getByText( "Jan's <Data>" ) ).toBeInTheDocument();
			expect( screen.getByText( 'Feb & Mar' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'SVG viewBox', () => {
		it( 'calculates correct viewBox dimensions', () => {
			const customOptions = {
				...mockOptions,
				height: 200,
				aspectRatio: 2,
				axisOffset: 10,
			};

			const { container } = render(
				<LineChart data={ mockData } options={ customOptions } />
			);

			const svg = container.querySelector( '.prpl-line-chart__svg' );
			// svgWidth = 200*2 + 10*2 = 420
			// svgHeight = 200 + 10*2 = 220
			expect( svg ).toHaveAttribute( 'viewBox', '0 0 420 220' );
		} );
	} );
} );
