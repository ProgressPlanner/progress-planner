/**
 * Tests for MonthlyBadges Widget
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
	addAction: jest.fn(),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useBadgeData', () => ( {
	useBadgeData: jest.fn(),
} ) );

jest.mock( '../../../hooks/useBadgeProgress', () => ( {
	useBadgeProgress: jest.fn(),
} ) );

jest.mock( '../../../hooks/useBadgeProgressSave', () => ( {
	useBadgeProgressSave: jest.fn(),
} ) );

jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => 0 ),
} ) );

// Mock badges config
jest.mock( '../../../config/badges', () => ( {
	getMonthlyBadgeIdFromDate: jest.fn( ( date ) => {
		if ( ! date ) {
			return 'monthly-2024-m12';
		}
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		return `monthly-${ year }-m${ month }`;
	} ),
	getMonthlyBadgeNameFromDate: jest.fn( ( date ) => {
		if ( ! date ) {
			return 'December 2024';
		}
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		return `${ months[ date.getMonth() ] } ${ date.getFullYear() }`;
	} ),
	MONTHLY_BADGE_CONFIG: {
		targetPoints: 10,
	},
} ) );

// Mock child components
jest.mock( '../../../components/Gauge', () => ( props ) => (
	<div data-testid="gauge" data-value={ props.value } data-max={ props.max }>
		{ props.children }
	</div>
) );

jest.mock( '../../../components/Badge', () => ( props ) => (
	<div
		data-testid="badge"
		data-badge-id={ props.badgeId }
		data-complete={ props.isComplete }
	>
		{ props.badgeName }
	</div>
) );

jest.mock( '../../../components/BadgeProgressBar', () => ( props ) => (
	<div data-testid="badge-progress-bar" data-badge-id={ props.badgeId }>
		{ props.badgeName }
	</div>
) );

jest.mock( '../PointsCounter', () => ( props ) => (
	<div data-testid="points-counter" data-points={ props.points }>
		{ props.label }
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
import MonthlyBadges from '../index';

describe( 'MonthlyBadges', () => {
	const { useBadgeData } = require( '../../../hooks/useBadgeData' );
	const { useBadgeProgress } = require( '../../../hooks/useBadgeProgress' );
	const { useDashboardStore } = require( '../../../stores/dashboardStore' );

	// Generate current month badge ID dynamically
	const now = new Date();
	const currentBadgeId = `monthly-${ now.getFullYear() }-m${
		now.getMonth() + 1
	}`;

	const mockBadgeData = {
		activities: [],
		savedStats: {},
		totalPostsCount: 10,
		activationDate: '2024-01-01',
		config: { brandingId: 1 },
	};

	const mockBadgeProgress = {
		[ currentBadgeId ]: {
			progress: 50,
			remaining: 5,
			points: 5,
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();

		useBadgeData.mockReturnValue( {
			isLoading: false,
			error: null,
			data: mockBadgeData,
		} );

		useBadgeProgress.mockReturnValue( mockBadgeProgress );
		useDashboardStore.mockReturnValue( 0 );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state when isLoading is true', () => {
			useBadgeData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <MonthlyBadges /> );

			// Widget header should be visible during loading
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Main content (gauge) should not be visible
			expect( screen.queryByTestId( 'gauge' ) ).not.toBeInTheDocument();
		} );

		it( 'shows widget header during loading', () => {
			useBadgeData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'error state', () => {
		it( 'renders error state when error exists', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: 'Failed to load badges',
				data: null,
			} );

			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'error-state' ) ).toBeInTheDocument();
		} );

		it( 'shows widget header during error', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: 'Error',
				data: null,
			} );

			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'displays error message', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: 'Network error',
				data: null,
			} );

			render( <MonthlyBadges /> );

			expect( screen.getByText( 'Network error' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header', () => {
			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'uses default title when config not provided', () => {
			render( <MonthlyBadges /> );

			expect(
				screen.getByText( 'Your monthly badge' )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render(
				<MonthlyBadges config={ { title: 'Custom Badge Title' } } />
			);

			expect(
				screen.getByText( 'Custom Badge Title' )
			).toBeInTheDocument();
		} );

		it( 'renders Gauge component', () => {
			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'gauge' ) ).toBeInTheDocument();
		} );

		it( 'renders Badge component inside Gauge', () => {
			render( <MonthlyBadges /> );

			expect( screen.getByTestId( 'badge' ) ).toBeInTheDocument();
		} );

		it( 'renders PointsCounter component', () => {
			render( <MonthlyBadges /> );

			expect(
				screen.getByTestId( 'points-counter' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'gauge values', () => {
		it( 'passes correct value to Gauge', () => {
			render( <MonthlyBadges /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '5' );
		} );

		it( 'passes max points to Gauge', () => {
			render( <MonthlyBadges /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-max', '10' );
		} );

		it( 'adds session points to gauge value', () => {
			useDashboardStore.mockReturnValue( 3 );

			render( <MonthlyBadges /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '8' );
		} );

		it( 'passes points to PointsCounter', () => {
			render( <MonthlyBadges /> );

			const counter = screen.getByTestId( 'points-counter' );
			expect( counter ).toHaveAttribute( 'data-points', '5' );
		} );

		it( 'includes session points in PointsCounter', () => {
			useDashboardStore.mockReturnValue( 2 );

			render( <MonthlyBadges /> );

			const counter = screen.getByTestId( 'points-counter' );
			expect( counter ).toHaveAttribute( 'data-points', '7' );
		} );
	} );

	describe( 'badge completion', () => {
		it( 'marks badge as incomplete when below target', () => {
			render( <MonthlyBadges /> );

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute( 'data-complete', 'false' );
		} );

		it( 'marks badge as complete when at or above target', () => {
			useBadgeProgress.mockReturnValue( {
				[ currentBadgeId ]: {
					progress: 100,
					remaining: 0,
					points: 10,
				},
			} );

			render( <MonthlyBadges /> );

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute( 'data-complete', 'true' );
		} );

		it( 'marks badge complete with session points', () => {
			useBadgeProgress.mockReturnValue( {
				[ currentBadgeId ]: {
					progress: 80,
					remaining: 2,
					points: 8,
				},
			} );
			useDashboardStore.mockReturnValue( 2 );

			render( <MonthlyBadges /> );

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute( 'data-complete', 'true' );
		} );
	} );

	describe( 'previous badges', () => {
		it( 'does not show previous badges section when all complete', () => {
			render( <MonthlyBadges /> );

			expect(
				screen.queryByText(
					'Oh no! You missed the previous monthly badge!'
				)
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has monthly-badges wrapper class', () => {
			const { container } = render( <MonthlyBadges /> );

			expect(
				container.querySelector( '.prpl-monthly-badges' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <MonthlyBadges config={ {} } /> );

			expect(
				screen.getByText( 'Your monthly badge' )
			).toBeInTheDocument();
		} );

		it( 'handles missing badge progress', () => {
			useBadgeProgress.mockReturnValue( {} );

			render( <MonthlyBadges /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '0' );
		} );

		it( 'handles zero session points', () => {
			useDashboardStore.mockReturnValue( 0 );

			render( <MonthlyBadges /> );

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '5' );
		} );
	} );

	describe( 'hook calls', () => {
		it( 'calls useBadgeData hook', () => {
			render( <MonthlyBadges /> );

			expect( useBadgeData ).toHaveBeenCalled();
		} );

		it( 'calls useBadgeProgress with correct parameters', () => {
			render( <MonthlyBadges /> );

			expect( useBadgeProgress ).toHaveBeenCalledWith(
				expect.objectContaining( {
					activities: expect.any( Array ),
					savedStats: expect.any( Object ),
				} )
			);
		} );
	} );
} );
