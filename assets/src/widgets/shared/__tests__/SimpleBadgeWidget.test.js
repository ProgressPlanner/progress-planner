/**
 * Tests for SimpleBadgeWidget Component
 */

import { render, screen } from '@testing-library/react';
import SimpleBadgeWidget from '../SimpleBadgeWidget';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
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

// Mock badges config
jest.mock( '../../../config/badges', () => ( {
	CONTENT_BADGES: [
		{ id: 'content-1', name: 'Content Badge 1', background: '#fff' },
		{ id: 'content-2', name: 'Content Badge 2', background: '#fff' },
	],
	MAINTENANCE_BADGES: [
		{
			id: 'maintenance-1',
			name: 'Maintenance Badge 1',
			background: '#fff',
		},
		{
			id: 'maintenance-2',
			name: 'Maintenance Badge 2',
			background: '#fff',
		},
	],
} ) );

// Mock child components
jest.mock( '../../../components/BadgeProgressInfo', () => ( { badge } ) => (
	<div data-testid="badge-progress-info">{ badge.name }</div>
) );

jest.mock( '../../../components/BadgeGrid', () => ( { badges, className } ) => (
	<div data-testid="badge-grid" className={ className }>
		{ badges.map( ( b ) => (
			<span key={ b.id }>{ b.name }</span>
		) ) }
	</div>
) );

jest.mock( '../../../components/WidgetStates', () => ( {
	LoadingState: () => <div data-testid="loading-state">Loading...</div>,
	ErrorState: ( { message } ) => (
		<div data-testid="error-state">{ message }</div>
	),
	EmptyState: ( { message } ) => (
		<div data-testid="empty-state">{ message }</div>
	),
} ) );

describe( 'SimpleBadgeWidget', () => {
	const { useBadgeData } = require( '../../../hooks/useBadgeData' );
	const { useBadgeProgress } = require( '../../../hooks/useBadgeProgress' );

	const mockGetRemainingText = ( count ) => `${ count } more needed`;

	beforeEach( () => {
		jest.clearAllMocks();

		// Default mock setup
		useBadgeData.mockReturnValue( {
			isLoading: false,
			error: null,
			data: {
				activities: [],
				savedStats: {},
				totalPostsCount: 10,
				activationDate: '2024-01-01',
				config: {},
			},
		} );

		useBadgeProgress.mockReturnValue( {
			'content-1': { progress: 50, remaining: 5 },
			'content-2': { progress: 0, remaining: 10 },
			'maintenance-1': { progress: 75, remaining: 2 },
			'maintenance-2': { progress: 100, remaining: 0 },
		} );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state when isLoading is true', () => {
			useBadgeData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			const { container } = render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			// Skeleton should be rendered during loading
			expect( container.firstChild ).not.toBeNull();
			// Main content (intro text) should not be visible
			expect(
				screen.queryByText( 'Intro text' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'error state', () => {
		it( 'renders error state when error exists', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: 'Something went wrong',
				data: null,
			} );

			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'error-state' ) ).toBeInTheDocument();
			expect(
				screen.getByText( 'Something went wrong' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'empty state', () => {
		it( 'renders empty state when no current badge', () => {
			useBadgeProgress.mockReturnValue( {
				'content-1': { progress: 100, remaining: 0 },
				'content-2': { progress: 100, remaining: 0 },
			} );

			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'empty-state' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders intro text', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="This is the intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByText( 'This is the intro text' )
			).toBeInTheDocument();
		} );

		it( 'renders BadgeProgressInfo component', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByTestId( 'badge-progress-info' )
			).toBeInTheDocument();
		} );

		it( 'renders BadgeGrid component', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'badge-grid' ) ).toBeInTheDocument();
		} );

		it( 'renders hr separator', () => {
			const { container } = render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( container.querySelector( 'hr' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'badge type selection', () => {
		it( 'uses content badges when badgeType is content', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			// Badge name appears in both BadgeProgressInfo and BadgeGrid
			expect(
				screen.getAllByText( 'Content Badge 1' ).length
			).toBeGreaterThan( 0 );
		} );

		it( 'uses maintenance badges when badgeType is maintenance', () => {
			render(
				<SimpleBadgeWidget
					badgeType="maintenance"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			// Badge name appears in both BadgeProgressInfo and BadgeGrid
			expect(
				screen.getAllByText( 'Maintenance Badge 1' ).length
			).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'current badge selection', () => {
		it( 'selects first incomplete badge as current', () => {
			useBadgeProgress.mockReturnValue( {
				'content-1': { progress: 100, remaining: 0 },
				'content-2': { progress: 50, remaining: 5 },
			} );

			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			// BadgeProgressInfo should show the current badge
			expect(
				screen.getByTestId( 'badge-progress-info' )
			).toHaveTextContent( 'Content Badge 2' );
		} );
	} );

	describe( 'badge group class', () => {
		it( 'passes badgeGroupClass to BadgeGrid', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					badgeGroupClass="custom-class"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'badge-grid' ) ).toHaveClass(
				'custom-class'
			);
		} );

		it( 'defaults to empty badgeGroupClass', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'badge-grid' ) ).not.toHaveClass(
				'custom-class'
			);
		} );
	} );

	describe( 'badges container', () => {
		it( 'renders badges container', () => {
			const { container } = render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				container.querySelector( '.prpl-badges-container-achievements' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'hook calls', () => {
		it( 'calls useBadgeData hook', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( useBadgeData ).toHaveBeenCalled();
		} );

		it( 'calls useBadgeProgress with data from useBadgeData', () => {
			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( useBadgeProgress ).toHaveBeenCalledWith(
				expect.objectContaining( {
					activities: [],
					savedStats: {},
					totalPostsCount: 10,
				} )
			);
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles missing config gracefully', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					activities: [],
					savedStats: {},
					totalPostsCount: 0,
					activationDate: null,
				},
			} );

			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			// Should still render
			expect( screen.getByText( 'Intro text' ) ).toBeInTheDocument();
		} );

		it( 'handles empty activities array', () => {
			useBadgeData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					activities: [],
					savedStats: {},
					totalPostsCount: 0,
					activationDate: '2024-01-01',
					config: {},
				},
			} );

			render(
				<SimpleBadgeWidget
					badgeType="content"
					introText="Intro text"
					backgroundColor="#fff"
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( useBadgeProgress ).toHaveBeenCalledWith(
				expect.objectContaining( { activities: [] } )
			);
		} );
	} );
} );
