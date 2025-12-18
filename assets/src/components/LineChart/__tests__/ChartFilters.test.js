/**
 * Tests for ChartFilters Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ChartFilters from '../ChartFilters';

describe( 'ChartFilters', () => {
	const mockDataArgs = {
		series1: { color: '#ff0000', label: 'Series 1' },
		series2: { color: '#00ff00', label: 'Series 2' },
		series3: { color: '#0000ff', label: 'Series 3' },
	};

	const mockOnToggle = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filters' )
			).toBeInTheDocument();
		} );

		it( 'renders all filter labels', () => {
			render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect( screen.getByText( 'Series 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Series 2' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Series 3' ) ).toBeInTheDocument();
		} );

		it( 'renders checkboxes for each series', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '#prpl-chart-filter-series1' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '#prpl-chart-filter-series2' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '#prpl-chart-filter-series3' )
			).toBeInTheDocument();
		} );

		it( 'renders filter classes with series key', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filter--series1' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '.prpl-line-chart__filter--series2' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'checkbox states', () => {
		it( 'sets checkboxes as checked for visible series', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const checkbox1 = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			const checkbox2 = container.querySelector(
				'#prpl-chart-filter-series2'
			);
			const checkbox3 = container.querySelector(
				'#prpl-chart-filter-series3'
			);

			expect( checkbox1 ).toBeChecked();
			expect( checkbox2 ).toBeChecked();
			expect( checkbox3 ).not.toBeChecked();
		} );

		it( 'sets all checkboxes unchecked when no series visible', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const checkbox1 = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			const checkbox2 = container.querySelector(
				'#prpl-chart-filter-series2'
			);
			const checkbox3 = container.querySelector(
				'#prpl-chart-filter-series3'
			);

			expect( checkbox1 ).not.toBeChecked();
			expect( checkbox2 ).not.toBeChecked();
			expect( checkbox3 ).not.toBeChecked();
		} );
	} );

	describe( 'toggle behavior', () => {
		it( 'calls onToggle with series key when checkbox clicked', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const checkbox = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			fireEvent.click( checkbox );

			expect( mockOnToggle ).toHaveBeenCalledWith( 'series1' );
		} );

		it( 'calls onToggle for each unique series', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1', 'series2', 'series3' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			fireEvent.click(
				container.querySelector( '#prpl-chart-filter-series1' )
			);
			fireEvent.click(
				container.querySelector( '#prpl-chart-filter-series2' )
			);
			fireEvent.click(
				container.querySelector( '#prpl-chart-filter-series3' )
			);

			expect( mockOnToggle ).toHaveBeenCalledTimes( 3 );
			expect( mockOnToggle ).toHaveBeenCalledWith( 'series1' );
			expect( mockOnToggle ).toHaveBeenCalledWith( 'series2' );
			expect( mockOnToggle ).toHaveBeenCalledWith( 'series3' );
		} );
	} );

	describe( 'filters label', () => {
		it( 'does not render label span when filtersLabel empty', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filters-label' )
			).not.toBeInTheDocument();
		} );

		it( 'renders label span when filtersLabel provided', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel="Filter by:"
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filters-label' )
			).toBeInTheDocument();
			expect( screen.getByText( 'Filter by:' ) ).toBeInTheDocument();
		} );

		it( 'renders HTML content in filtersLabel', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel="<strong>Filter:</strong>"
					onToggle={ mockOnToggle }
				/>
			);

			const label = container.querySelector(
				'.prpl-line-chart__filters-label'
			);
			expect( label.querySelector( 'strong' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'styling', () => {
		it( 'applies flex container style', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const filters = container.querySelector(
				'.prpl-line-chart__filters'
			);
			expect( filters ).toHaveStyle( {
				display: 'flex',
				gap: '1em',
				marginBottom: '1em',
				justifyContent: 'space-between',
			} );
		} );

		it( 'applies label style with cursor pointer', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const label = container.querySelector( '.prpl-line-chart__filter' );
			expect( label ).toHaveStyle( {
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
			} );
		} );

		it( 'hides checkbox input visually', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const checkbox = container.querySelector(
				'#prpl-chart-filter-series1'
			);
			expect( checkbox ).toHaveStyle( { display: 'none' } );
		} );
	} );

	describe( 'color indicator', () => {
		it( 'renders color indicator span', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				container.querySelector( '.prpl-line-chart__filter-color' )
			).toBeInTheDocument();
		} );

		it( 'shows filled color when series visible', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [ 'series1' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const colorIndicators = container.querySelectorAll(
				'.prpl-line-chart__filter-color'
			);
			// series1 is visible - background should be filled
			expect( colorIndicators[ 0 ] ).toHaveStyle( {
				backgroundColor: '#ff0000',
			} );
		} );

		it( 'shows transparent color when series hidden', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const colorIndicators = container.querySelectorAll(
				'.prpl-line-chart__filter-color'
			);
			// No series visible - background should be transparent
			expect( colorIndicators[ 0 ] ).toHaveStyle( {
				backgroundColor: 'transparent',
			} );
		} );

		it( 'applies outline with series color', () => {
			const { container } = render(
				<ChartFilters
					dataArgs={ mockDataArgs }
					visibleSeries={ [] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const colorIndicator = container.querySelector(
				'.prpl-line-chart__filter-color'
			);
			expect( colorIndicator ).toHaveStyle( {
				outline: '1px solid #ff0000',
			} );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles single series', () => {
			const singleDataArgs = {
				only: { color: '#abc', label: 'Only Series' },
			};

			render(
				<ChartFilters
					dataArgs={ singleDataArgs }
					visibleSeries={ [ 'only' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect( screen.getByText( 'Only Series' ) ).toBeInTheDocument();
		} );

		it( 'handles special characters in label', () => {
			const specialDataArgs = {
				special: { color: '#000', label: "Series <Test> & 'More'" },
			};

			render(
				<ChartFilters
					dataArgs={ specialDataArgs }
					visibleSeries={ [ 'special' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			expect(
				screen.getByText( "Series <Test> & 'More'" )
			).toBeInTheDocument();
		} );

		it( 'handles CSS variable colors', () => {
			const cssVarDataArgs = {
				cssVar: {
					color: 'var(--custom-color)',
					label: 'CSS Var Color',
				},
			};

			const { container } = render(
				<ChartFilters
					dataArgs={ cssVarDataArgs }
					visibleSeries={ [ 'cssVar' ] }
					filtersLabel=""
					onToggle={ mockOnToggle }
				/>
			);

			const colorIndicator = container.querySelector(
				'.prpl-line-chart__filter-color'
			);
			expect( colorIndicator ).toHaveStyle( {
				backgroundColor: 'var(--custom-color)',
			} );
		} );
	} );
} );
