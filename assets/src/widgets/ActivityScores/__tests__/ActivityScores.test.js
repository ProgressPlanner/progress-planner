/**
 * Tests for ActivityScores Widget
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	_n: ( single, plural, count ) => ( count === 1 ? single : plural ),
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg, i ) => {
			result = result
				.replace( `%${ i + 1 }$s`, arg )
				.replace( '%s', arg );
		} );
		return result;
	},
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
	addAction: jest.fn(),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useApiData', () => ( {
	useApiData: jest.fn(),
} ) );

jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => 0 ),
} ) );

// Mock child components
jest.mock( '../../../components/Gauge', () => ( props ) => (
	<div data-testid="gauge" data-value={ props.value }>
		{ props.children }
	</div>
) );

jest.mock( '../../../components/BarChart', () => ( props ) => (
	<div data-testid="bar-chart" data-items={ props.data.length }>
		Bar Chart
	</div>
) );

jest.mock( '../../../components/BigCounter', () => ( props ) => (
	<div data-testid="big-counter" data-number={ props.number }>
		{ props.label }
	</div>
) );

jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header">{ props.title }</div>
) );

jest.mock( '../../../components/WidgetStates', () => ( {
	LoadingState: () => <div data-testid="loading-state">Loading...</div>,
	ErrorState: ( props ) => (
		<div data-testid="error-state">{ props.message }</div>
	),
	EmptyState: () => <div data-testid="empty-state">No data</div>,
} ) );

// Import after mocks
import ActivityScores from '../index';

describe( 'ActivityScores', () => {
	const { useApiData } = require( '../../../hooks/useApiData' );
	const { useDashboardStore } = require( '../../../stores/dashboardStore' );

	const mockData = {
		score: 75,
		chartData: [
			{ label: 'Jan', score: 60 },
			{ label: 'Feb', score: 70 },
			{ label: 'Mar', score: 80 },
		],
		personalRecord: {
			maxStreak: 5,
			currentStreak: 3,
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();

		useApiData.mockReturnValue( {
			isLoading: false,
			error: null,
			data: mockData,
		} );

		useDashboardStore.mockReturnValue( 0 );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state when isLoading is true', () => {
			useApiData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <ActivityScores /> );

			// Widget header should be visible during loading
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Main content should not be visible
			expect(
				screen.queryByText( 'Activity scores' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'error state', () => {
		it( 'renders error state when error exists', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: 'Failed to load',
				data: null,
			} );

			render( <ActivityScores /> );

			expect( screen.getByTestId( 'error-state' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'empty state', () => {
		it( 'renders empty state when data is null', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: null,
			} );

			render( <ActivityScores /> );

			expect( screen.getByTestId( 'empty-state' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header', () => {
			render( <ActivityScores /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'uses default title when config not provided', () => {
			render( <ActivityScores /> );

			expect(
				screen.getByText( 'Your website activity score' )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render(
				<ActivityScores config={ { title: 'Custom Activity Title' } } />
			);

			expect(
				screen.getByText( 'Custom Activity Title' )
			).toBeInTheDocument();
		} );

		it( 'renders Gauge component', () => {
			render( <ActivityScores /> );

			expect( screen.getByTestId( 'gauge' ) ).toBeInTheDocument();
		} );

		it( 'renders BarChart component', () => {
			render( <ActivityScores /> );

			expect( screen.getByTestId( 'bar-chart' ) ).toBeInTheDocument();
		} );

		it( 'renders BigCounter component', () => {
			render( <ActivityScores /> );

			expect( screen.getByTestId( 'big-counter' ) ).toBeInTheDocument();
		} );

		it( 'displays chart description text', () => {
			render( <ActivityScores /> );

			expect(
				screen.getByText(
					'Check out your website activity in the past months:'
				)
			).toBeInTheDocument();
		} );
	} );

	describe( 'gauge score', () => {
		it( 'displays score value in gauge', () => {
			render( <ActivityScores /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '75' );
		} );

		it( 'adds session points to score', () => {
			useDashboardStore.mockReturnValue( 10 );

			render( <ActivityScores /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '85' );
		} );

		it( 'caps score at 100', () => {
			useDashboardStore.mockReturnValue( 50 );

			render( <ActivityScores /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '100' );
		} );

		it( 'displays score inside gauge', () => {
			render( <ActivityScores /> );

			expect( screen.getByText( '75' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'bar chart', () => {
		it( 'passes chart data to BarChart', () => {
			render( <ActivityScores /> );

			const chart = screen.getByTestId( 'bar-chart' );
			expect( chart ).toHaveAttribute( 'data-items', '3' );
		} );
	} );

	describe( 'personal record', () => {
		it( 'displays max streak in BigCounter', () => {
			render( <ActivityScores /> );

			const counter = screen.getByTestId( 'big-counter' );
			expect( counter ).toHaveAttribute( 'data-number', '5' );
		} );

		it( 'displays personal record label', () => {
			render( <ActivityScores /> );

			expect( screen.getByText( 'personal record' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'streak messages', () => {
		it( 'shows first streak message when maxStreak is 0', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					personalRecord: { maxStreak: 0, currentStreak: 0 },
				},
			} );

			render( <ActivityScores /> );

			expect(
				screen.getByText( /This is the start of your first streak/ )
			).toBeInTheDocument();
		} );

		it( 'shows congratulations message when on a record streak', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					personalRecord: { maxStreak: 5, currentStreak: 5 },
				},
			} );

			render( <ActivityScores /> );

			expect( screen.getByText( /Congratulations/ ) ).toBeInTheDocument();
		} );

		it( 'shows keep it up message when on a streak but not at record', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					personalRecord: { maxStreak: 10, currentStreak: 5 },
				},
			} );

			render( <ActivityScores /> );

			expect( screen.getByText( /Keep it up/ ) ).toBeInTheDocument();
		} );

		it( 'shows get back message when no current streak', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					...mockData,
					personalRecord: { maxStreak: 5, currentStreak: 0 },
				},
			} );

			render( <ActivityScores /> );

			expect(
				screen.getByText( /Get back to your streak/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'API call', () => {
		it( 'calls useApiData with correct path', () => {
			render( <ActivityScores /> );

			expect( useApiData ).toHaveBeenCalledWith(
				expect.stringContaining(
					'/progress-planner/v1/widgets/activity-scores'
				),
				[],
				'Failed to load activity data'
			);
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has graph wrapper class', () => {
			const { container } = render( <ActivityScores /> );

			expect(
				container.querySelector( '.prpl-graph-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'has widget content class for streak message', () => {
			const { container } = render( <ActivityScores /> );

			expect(
				container.querySelector( '.prpl-widget-content' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <ActivityScores config={ {} } /> );

			expect(
				screen.getByText( 'Your website activity score' )
			).toBeInTheDocument();
		} );

		it( 'handles missing score in data', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					chartData: [],
					personalRecord: { maxStreak: 0, currentStreak: 0 },
				},
			} );

			render( <ActivityScores /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '0' );
		} );
	} );
} );
