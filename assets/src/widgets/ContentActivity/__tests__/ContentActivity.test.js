/**
 * Tests for ContentActivity Widget
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useApiData', () => ( {
	useApiData: jest.fn(),
} ) );

// Mock child components
jest.mock( '../../../components/BigCounter', () => ( props ) => (
	<div data-testid="big-counter" data-number={ props.number }>
		{ props.label }
	</div>
) );

jest.mock( '../../../components/LineChart', () => ( props ) => (
	<div data-testid="line-chart" data-items={ props.data?.length || 0 }>
		Line Chart
	</div>
) );

jest.mock( '../ActivityTable', () => ( props ) => (
	<div data-testid="activity-table" data-total={ props.totalCount }>
		Activity Table
	</div>
) );

jest.mock( '../../../components/WidgetStates', () => ( {
	LoadingState: ( props ) => (
		<div data-testid="loading-state" className={ props.className }>
			Loading...
		</div>
	),
	ErrorState: ( props ) => (
		<div data-testid="error-state" className={ props.className }>
			{ props.message }
		</div>
	),
} ) );

jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header">{ props.title }</div>
) );

// Import after mocks
import ContentActivity from '../index';

describe( 'ContentActivity', () => {
	const { useApiData } = require( '../../../hooks/useApiData' );

	const mockData = {
		totalCount: 15,
		chartData: [
			{ label: 'Jan', value: 5 },
			{ label: 'Feb', value: 8 },
			{ label: 'Mar', value: 2 },
		],
		chartOptions: {},
		activityTypes: {
			publish: { label: 'Published' },
			update: { label: 'Updated' },
		},
		weeklyActivity: {
			publish: 5,
			update: 10,
		},
		weeklyTotalCount: 15,
		i18n: {
			description: 'Custom description text',
			piecesOfContentManaged: 'content items managed',
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();

		useApiData.mockReturnValue( {
			isLoading: false,
			error: null,
			data: mockData,
		} );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state when isLoading is true', () => {
			useApiData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <ContentActivity /> );

			expect( screen.getByTestId( 'loading-state' ) ).toBeInTheDocument();
		} );

		it( 'loading state has correct class', () => {
			useApiData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <ContentActivity /> );

			expect( screen.getByTestId( 'loading-state' ) ).toHaveClass(
				'prpl-content-activity__loading'
			);
		} );
	} );

	describe( 'error state', () => {
		it( 'renders error state when error exists', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: 'Failed to load',
				data: null,
			} );

			render( <ContentActivity /> );

			expect( screen.getByTestId( 'error-state' ) ).toBeInTheDocument();
		} );

		it( 'displays error message', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: 'Network error occurred',
				data: null,
			} );

			render( <ContentActivity /> );

			expect(
				screen.getByText( 'Network error occurred' )
			).toBeInTheDocument();
		} );

		it( 'error state has correct class', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: 'Error',
				data: null,
			} );

			render( <ContentActivity /> );

			expect( screen.getByTestId( 'error-state' ) ).toHaveClass(
				'prpl-content-activity__error'
			);
		} );
	} );

	describe( 'empty state', () => {
		it( 'returns null when data is null', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: null,
			} );

			const { container } = render( <ContentActivity /> );

			expect( container.firstChild ).toBeNull();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header', () => {
			render( <ContentActivity /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'uses default title when config not provided', () => {
			render( <ContentActivity /> );

			expect(
				screen.getByText( 'Content activity' )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render(
				<ContentActivity
					config={ { title: 'Custom Activity Title' } }
				/>
			);

			expect(
				screen.getByText( 'Custom Activity Title' )
			).toBeInTheDocument();
		} );

		it( 'renders description text', () => {
			render( <ContentActivity /> );

			expect(
				screen.getByText( 'Custom description text' )
			).toBeInTheDocument();
		} );

		it( 'renders BigCounter component', () => {
			render( <ContentActivity /> );

			expect( screen.getByTestId( 'big-counter' ) ).toBeInTheDocument();
		} );

		it( 'passes total count to BigCounter', () => {
			render( <ContentActivity /> );

			const counter = screen.getByTestId( 'big-counter' );
			expect( counter ).toHaveAttribute( 'data-number', '15' );
		} );

		it( 'renders LineChart component', () => {
			render( <ContentActivity /> );

			expect( screen.getByTestId( 'line-chart' ) ).toBeInTheDocument();
		} );

		it( 'passes chart data to LineChart', () => {
			render( <ContentActivity /> );

			const chart = screen.getByTestId( 'line-chart' );
			expect( chart ).toHaveAttribute( 'data-items', '3' );
		} );

		it( 'renders ActivityTable component', () => {
			render( <ContentActivity /> );

			expect(
				screen.getByTestId( 'activity-table' )
			).toBeInTheDocument();
		} );

		it( 'passes weekly total count to ActivityTable', () => {
			render( <ContentActivity /> );

			const table = screen.getByTestId( 'activity-table' );
			expect( table ).toHaveAttribute( 'data-total', '15' );
		} );
	} );

	describe( 'API call', () => {
		it( 'calls useApiData with correct path', () => {
			render( <ContentActivity /> );

			expect( useApiData ).toHaveBeenCalledWith(
				expect.stringContaining(
					'/progress-planner/v1/widgets/content-activity'
				),
				[],
				expect.any( String )
			);
		} );

		it( 'includes range parameter in API path', () => {
			render( <ContentActivity /> );

			expect( useApiData ).toHaveBeenCalledWith(
				expect.stringContaining( 'range=' ),
				expect.anything(),
				expect.anything()
			);
		} );

		it( 'includes frequency parameter in API path', () => {
			render( <ContentActivity /> );

			expect( useApiData ).toHaveBeenCalledWith(
				expect.stringContaining( 'frequency=' ),
				expect.anything(),
				expect.anything()
			);
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has content activity wrapper class', () => {
			const { container } = render( <ContentActivity /> );

			expect(
				container.querySelector( '.prpl-content-activity' )
			).toBeInTheDocument();
		} );

		it( 'has graph wrapper class', () => {
			const { container } = render( <ContentActivity /> );

			expect(
				container.querySelector( '.prpl-graph-wrapper' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <ContentActivity config={ {} } /> );

			expect(
				screen.getByText( 'Content activity' )
			).toBeInTheDocument();
		} );

		it( 'uses default description when i18n not provided', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					i18n: undefined,
				},
			} );

			render( <ContentActivity /> );

			expect(
				screen.getByText(
					/Here are the updates you made to your content/
				)
			).toBeInTheDocument();
		} );

		it( 'uses default label when i18n.piecesOfContentManaged not provided', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					i18n: {},
				},
			} );

			render( <ContentActivity /> );

			expect(
				screen.getByText( 'pieces of content managed' )
			).toBeInTheDocument();
		} );

		it( 'handles zero total count', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					totalCount: 0,
				},
			} );

			render( <ContentActivity /> );

			const counter = screen.getByTestId( 'big-counter' );
			expect( counter ).toHaveAttribute( 'data-number', '0' );
		} );

		it( 'handles empty chart data', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					chartData: [],
				},
			} );

			render( <ContentActivity /> );

			const chart = screen.getByTestId( 'line-chart' );
			expect( chart ).toHaveAttribute( 'data-items', '0' );
		} );
	} );
} );
