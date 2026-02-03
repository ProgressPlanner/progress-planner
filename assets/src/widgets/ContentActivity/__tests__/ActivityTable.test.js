/**
 * Tests for ActivityTable Component
 */

import { render, screen } from '@testing-library/react';
import ActivityTable from '../ActivityTable';

// Mock WordPress i18n
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

describe( 'ActivityTable', () => {
	const mockActivityTypes = {
		publish: { label: 'Published' },
		update: { label: 'Updated' },
		delete: { label: 'Deleted' },
	};

	const mockWeeklyActivity = {
		publish: 5,
		update: 3,
		delete: 1,
	};

	const mockTotalCount = 9;

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table' )
			).toBeInTheDocument();
		} );

		it( 'renders table element', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByRole( 'table' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'table header', () => {
		it( 'renders table head', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table-head' )
			).toBeInTheDocument();
		} );

		it( 'renders Content managed header', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( 'Content managed' ) ).toBeInTheDocument();
		} );

		it( 'renders Last week header', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( 'Last week' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'table body', () => {
		it( 'renders table body', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table-body' )
			).toBeInTheDocument();
		} );

		it( 'renders row for each activity type', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector(
					'.prpl-content-activity__table-row--publish'
				)
			).toBeInTheDocument();
			expect(
				container.querySelector(
					'.prpl-content-activity__table-row--update'
				)
			).toBeInTheDocument();
			expect(
				container.querySelector(
					'.prpl-content-activity__table-row--delete'
				)
			).toBeInTheDocument();
		} );

		it( 'renders activity type labels', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( 'Published' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Updated' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Deleted' ) ).toBeInTheDocument();
		} );

		it( 'renders activity counts', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( '5' ) ).toBeInTheDocument();
			expect( screen.getByText( '3' ) ).toBeInTheDocument();
			expect( screen.getByText( '1' ) ).toBeInTheDocument();
		} );

		it( 'renders zero when activity count missing', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ { publish: 5 } }
					totalCount={ 5 }
				/>
			);

			const zeroCells = screen.getAllByText( '0' );
			expect( zeroCells.length ).toBe( 2 );
		} );
	} );

	describe( 'table footer', () => {
		it( 'renders table foot', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table-foot' )
			).toBeInTheDocument();
		} );

		it( 'renders Total label', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( 'Total' ) ).toBeInTheDocument();
		} );

		it( 'renders total count', () => {
			render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect( screen.getByText( '9' ) ).toBeInTheDocument();
		} );

		it( 'has total row class', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector(
					'.prpl-content-activity__table-row--total'
				)
			).toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has table class', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table' )
			).toBeInTheDocument();
		} );

		it( 'has header class', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector(
					'.prpl-content-activity__table-header'
				)
			).toBeInTheDocument();
		} );

		it( 'has cell class', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table-cell' )
			).toBeInTheDocument();
		} );

		it( 'has row class', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			expect(
				container.querySelector( '.prpl-content-activity__table-row' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'inline styles', () => {
		it( 'table has full width', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			const table = container.querySelector( 'table' );
			expect( table.style.width ).toBe( '100%' );
		} );

		it( 'table has margin bottom', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			const table = container.querySelector( 'table' );
			expect( table.style.marginBottom ).toBe( '1em' );
		} );
	} );

	describe( 'alternating row colors', () => {
		it( 'applies different backgrounds to alternating rows', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			const rows = container.querySelectorAll(
				'.prpl-content-activity__table-body tr'
			);

			// Even and odd rows should have different backgrounds
			expect( rows[ 0 ].style.backgroundColor ).not.toBe(
				rows[ 1 ].style.backgroundColor
			);
		} );

		it( 'applies transparent to odd rows', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ mockWeeklyActivity }
					totalCount={ mockTotalCount }
				/>
			);

			const rows = container.querySelectorAll(
				'.prpl-content-activity__table-body tr'
			);
			expect( rows[ 1 ].style.backgroundColor ).toBe( 'transparent' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty activity types', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ {} }
					weeklyActivity={ {} }
					totalCount={ 0 }
				/>
			);

			const bodyRows = container.querySelectorAll(
				'.prpl-content-activity__table-body tr'
			);
			expect( bodyRows.length ).toBe( 0 );
		} );

		it( 'handles single activity type', () => {
			render(
				<ActivityTable
					activityTypes={ { single: { label: 'Single Type' } } }
					weeklyActivity={ { single: 10 } }
					totalCount={ 10 }
				/>
			);

			expect( screen.getByText( 'Single Type' ) ).toBeInTheDocument();
			// Count appears twice: in the row and in the total
			expect( screen.getAllByText( '10' ).length ).toBe( 2 );
		} );

		it( 'handles zero total count', () => {
			const { container } = render(
				<ActivityTable
					activityTypes={ mockActivityTypes }
					weeklyActivity={ {} }
					totalCount={ 0 }
				/>
			);

			const footerCells = container.querySelectorAll(
				'.prpl-content-activity__table-foot td'
			);
			expect( footerCells[ 0 ].textContent ).toBe( '0' );
		} );

		it( 'handles large activity counts', () => {
			render(
				<ActivityTable
					activityTypes={ { posts: { label: 'Posts' } } }
					weeklyActivity={ { posts: 9999 } }
					totalCount={ 9999 }
				/>
			);

			expect( screen.getAllByText( '9999' ).length ).toBe( 2 );
		} );
	} );
} );
