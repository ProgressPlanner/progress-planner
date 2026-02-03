/**
 * Tests for BadgeProgressInfo Component
 */

import { render, screen } from '@testing-library/react';
import BadgeProgressInfo from '../index';

// Mock the Gauge component
jest.mock( '../../Gauge', () => ( { children, value, backgroundColor } ) => (
	<div
		data-testid="gauge"
		data-value={ value }
		data-background={ backgroundColor }
	>
		{ children }
	</div>
) );

// Mock the Badge component
jest.mock( '../../Badge', () => ( { badgeId, badgeName, isComplete } ) => (
	<img
		data-testid="badge"
		alt={ badgeName }
		data-badge-id={ badgeId }
		data-complete={ isComplete }
	/>
) );

describe( 'BadgeProgressInfo', () => {
	const mockConfig = {
		brandingId: 123,
	};

	const mockBadge = {
		id: 'content-curator',
		name: 'Content Curator',
		progress: 75,
		remaining: 25,
	};

	const mockGetRemainingText = jest.fn(
		( remaining ) => `${ remaining } more items needed`
	);

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				container.querySelector( '.prpl-latest-badges-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders Gauge component', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'gauge' ) ).toBeInTheDocument();
		} );

		it( 'renders Badge component inside Gauge', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByTestId( 'badge' ) ).toBeInTheDocument();
		} );

		it( 'renders progress percentage', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByText( '75%' ) ).toBeInTheDocument();
		} );

		it( 'renders progress label with badge name', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByText( 'Progress Content Curator' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'props passing', () => {
		it( 'passes progress value to Gauge', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '75' );
		} );

		it( 'passes badge id to Badge', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute(
				'data-badge-id',
				'content-curator'
			);
		} );

		it( 'passes badge name to Badge', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute( 'alt', 'Content Curator' );
		} );

		it( 'passes isComplete as true to Badge', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute( 'data-complete', 'true' );
		} );
	} );

	describe( 'getRemainingText function', () => {
		it( 'calls getRemainingText with badge.remaining', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( mockGetRemainingText ).toHaveBeenCalledWith( 25 );
		} );

		it( 'renders remaining text from function', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByText( '25 more items needed' )
			).toBeInTheDocument();
		} );

		it( 'handles different remaining values', () => {
			const customBadge = { ...mockBadge, remaining: 100 };

			render(
				<BadgeProgressInfo
					badge={ customBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( mockGetRemainingText ).toHaveBeenCalledWith( 100 );
		} );
	} );

	describe( 'background color', () => {
		it( 'uses default background color', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute(
				'data-background',
				'var(--prpl-background-content-badge)'
			);
		} );

		it( 'uses badge.background if provided', () => {
			const badgeWithBackground = {
				...mockBadge,
				background: 'var(--custom-bg)',
			};

			render(
				<BadgeProgressInfo
					badge={ badgeWithBackground }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute(
				'data-background',
				'var(--custom-bg)'
			);
		} );

		it( 'uses backgroundColor prop as fallback', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
					backgroundColor="var(--fallback-bg)"
				/>
			);

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute(
				'data-background',
				'var(--fallback-bg)'
			);
		} );

		it( 'badge.background takes precedence over backgroundColor prop', () => {
			const badgeWithBackground = {
				...mockBadge,
				background: 'var(--badge-bg)',
			};

			render(
				<BadgeProgressInfo
					badge={ badgeWithBackground }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
					backgroundColor="var(--prop-bg)"
				/>
			);

			const gauge = screen.getByTestId( 'gauge' );
			expect( gauge ).toHaveAttribute(
				'data-background',
				'var(--badge-bg)'
			);
		} );
	} );

	describe( 'styling', () => {
		it( 'renders content wrapper', () => {
			const { container } = render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				container.querySelector( '.prpl-badge-content-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'applies progress label styles', () => {
			const { container } = render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const label = container.querySelector(
				'.prpl-badge-content-wrapper p'
			);
			expect( label ).toHaveStyle( {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			} );
		} );

		it( 'applies percent style with bold font', () => {
			render(
				<BadgeProgressInfo
					badge={ mockBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			const percentSpan = screen.getByText( '75%' );
			expect( percentSpan ).toHaveStyle( {
				fontWeight: '600',
			} );
		} );
	} );

	describe( 'different progress values', () => {
		it( 'handles 0% progress', () => {
			const zeroBadge = { ...mockBadge, progress: 0 };

			render(
				<BadgeProgressInfo
					badge={ zeroBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByText( '0%' ) ).toBeInTheDocument();
		} );

		it( 'handles 100% progress', () => {
			const completeBadge = { ...mockBadge, progress: 100 };

			render(
				<BadgeProgressInfo
					badge={ completeBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByText( '100%' ) ).toBeInTheDocument();
		} );

		it( 'handles decimal progress', () => {
			const decimalBadge = { ...mockBadge, progress: 33.5 };

			render(
				<BadgeProgressInfo
					badge={ decimalBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect( screen.getByText( '33.5%' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles badge with special characters in name', () => {
			const specialBadge = {
				...mockBadge,
				name: "Badge's <Name> & More",
			};

			render(
				<BadgeProgressInfo
					badge={ specialBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByText( "Progress Badge's <Name> & More" )
			).toBeInTheDocument();
		} );

		it( 'handles zero remaining', () => {
			const zeroRemaining = { ...mockBadge, remaining: 0 };
			const getRemainingZero = ( remaining ) =>
				remaining === 0 ? 'Complete!' : `${ remaining } left`;

			render(
				<BadgeProgressInfo
					badge={ zeroRemaining }
					config={ mockConfig }
					getRemainingText={ getRemainingZero }
				/>
			);

			expect( screen.getByText( 'Complete!' ) ).toBeInTheDocument();
		} );

		it( 'handles long badge name', () => {
			const longNameBadge = {
				...mockBadge,
				name: 'This is a very long badge name',
			};

			render(
				<BadgeProgressInfo
					badge={ longNameBadge }
					config={ mockConfig }
					getRemainingText={ mockGetRemainingText }
				/>
			);

			expect(
				screen.getByText( 'Progress This is a very long badge name' )
			).toBeInTheDocument();
		} );
	} );
} );
