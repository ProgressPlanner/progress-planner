/**
 * Tests for BadgeGrid Component
 */

import { render, screen } from '@testing-library/react';
import BadgeGrid from '../index';

// Mock the Badge component
jest.mock( '../../Badge', () => ( { badgeId, badgeName, isComplete } ) => (
	<img
		data-testid={ `badge-${ badgeId }` }
		alt={ badgeName }
		data-complete={ isComplete }
	/>
) );

describe( 'BadgeGrid', () => {
	const mockConfig = {
		brandingId: 123,
	};

	const mockBadges = [
		{ id: 'badge-1', name: 'First Badge', progress: 100, isComplete: true },
		{
			id: 'badge-2',
			name: 'Second Badge',
			progress: 50,
			isComplete: false,
		},
		{ id: 'badge-3', name: 'Third Badge', progress: 0, isComplete: false },
	];

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			expect(
				container.querySelector( '.progress-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders all badges', () => {
			render( <BadgeGrid badges={ mockBadges } config={ mockConfig } /> );

			expect( screen.getByTestId( 'badge-badge-1' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'badge-badge-2' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'badge-badge-3' ) ).toBeInTheDocument();
		} );

		it( 'renders badge names as labels', () => {
			render( <BadgeGrid badges={ mockBadges } config={ mockConfig } /> );

			expect( screen.getByText( 'First Badge' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Second Badge' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Third Badge' ) ).toBeInTheDocument();
		} );

		it( 'renders empty grid for empty badges array', () => {
			const { container } = render(
				<BadgeGrid badges={ [] } config={ mockConfig } />
			);

			expect(
				container.querySelector( '.progress-wrapper' )
			).toBeInTheDocument();
			expect( container.querySelectorAll( '.prpl-badge' ) ).toHaveLength(
				0
			);
		} );
	} );

	describe( 'badge rendering', () => {
		it( 'passes correct props to Badge component', () => {
			render( <BadgeGrid badges={ mockBadges } config={ mockConfig } /> );

			const firstBadge = screen.getByTestId( 'badge-badge-1' );
			expect( firstBadge ).toHaveAttribute( 'alt', 'First Badge' );
			expect( firstBadge ).toHaveAttribute( 'data-complete', 'true' );

			const secondBadge = screen.getByTestId( 'badge-badge-2' );
			expect( secondBadge ).toHaveAttribute( 'data-complete', 'false' );
		} );

		it( 'sets data-value attribute with progress', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			const badgeItems = container.querySelectorAll( '.prpl-badge' );
			expect( badgeItems[ 0 ] ).toHaveAttribute( 'data-value', '100' );
			expect( badgeItems[ 1 ] ).toHaveAttribute( 'data-value', '50' );
			expect( badgeItems[ 2 ] ).toHaveAttribute( 'data-value', '0' );
		} );

		it( 'uses badge id as key', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			// React uses keys internally, we can verify by checking badges render correctly
			expect( container.querySelectorAll( '.prpl-badge' ) ).toHaveLength(
				3
			);
		} );
	} );

	describe( 'styling', () => {
		it( 'applies grid layout', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid ).toHaveStyle( {
				display: 'grid',
				gridTemplateColumns: '1fr 1fr 1fr',
			} );
		} );

		it( 'applies default background color', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid ).toHaveStyle( {
				background: 'var(--prpl-background-content-badge)',
			} );
		} );

		it( 'applies custom background color', () => {
			const { container } = render(
				<BadgeGrid
					badges={ mockBadges }
					config={ mockConfig }
					backgroundColor="var(--custom-bg)"
				/>
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid ).toHaveStyle( {
				background: 'var(--custom-bg)',
			} );
		} );

		it( 'applies badge item styles', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			const badgeItem = container.querySelector( '.prpl-badge' );
			expect( badgeItem ).toHaveStyle( {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			} );
		} );

		it( 'applies label styles', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			const label = container.querySelector( '.prpl-badge p' );
			expect( label ).toHaveStyle( {
				margin: '0',
				textAlign: 'center',
			} );
		} );
	} );

	describe( 'className prop', () => {
		it( 'includes progress-wrapper class by default', () => {
			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ mockConfig } />
			);

			expect(
				container.querySelector( '.progress-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'appends custom className', () => {
			const { container } = render(
				<BadgeGrid
					badges={ mockBadges }
					config={ mockConfig }
					className="custom-class"
				/>
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid ).toHaveClass( 'custom-class' );
		} );

		it( 'handles empty className', () => {
			const { container } = render(
				<BadgeGrid
					badges={ mockBadges }
					config={ mockConfig }
					className=""
				/>
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid.className ).toBe( 'progress-wrapper' );
		} );

		it( 'handles multiple custom classes', () => {
			const { container } = render(
				<BadgeGrid
					badges={ mockBadges }
					config={ mockConfig }
					className="class-one class-two"
				/>
			);

			const grid = container.querySelector( '.progress-wrapper' );
			expect( grid.className ).toContain( 'class-one' );
			expect( grid.className ).toContain( 'class-two' );
		} );
	} );

	describe( 'single badge', () => {
		it( 'renders single badge correctly', () => {
			const singleBadge = [
				{
					id: 'only-badge',
					name: 'Only Badge',
					progress: 75,
					isComplete: false,
				},
			];

			render(
				<BadgeGrid badges={ singleBadge } config={ mockConfig } />
			);

			expect(
				screen.getByTestId( 'badge-only-badge' )
			).toBeInTheDocument();
			expect( screen.getByText( 'Only Badge' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'many badges', () => {
		it( 'renders many badges in grid', () => {
			const manyBadges = Array.from( { length: 9 }, ( _, i ) => ( {
				id: `badge-${ i }`,
				name: `Badge ${ i }`,
				progress: i * 10,
				isComplete: i > 5,
			} ) );

			const { container } = render(
				<BadgeGrid badges={ manyBadges } config={ mockConfig } />
			);

			expect( container.querySelectorAll( '.prpl-badge' ) ).toHaveLength(
				9
			);
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles badge with special characters in name', () => {
			const specialBadges = [
				{
					id: 'special',
					name: "Badge's <Name> & More",
					progress: 50,
					isComplete: false,
				},
			];

			render(
				<BadgeGrid badges={ specialBadges } config={ mockConfig } />
			);

			expect(
				screen.getByText( "Badge's <Name> & More" )
			).toBeInTheDocument();
		} );

		it( 'handles badge with long name', () => {
			const longNameBadges = [
				{
					id: 'long',
					name: 'This is a very long badge name that might wrap',
					progress: 50,
					isComplete: false,
				},
			];

			render(
				<BadgeGrid badges={ longNameBadges } config={ mockConfig } />
			);

			expect(
				screen.getByText(
					'This is a very long badge name that might wrap'
				)
			).toBeInTheDocument();
		} );

		it( 'handles zero brandingId', () => {
			const zeroConfig = { brandingId: 0 };

			const { container } = render(
				<BadgeGrid badges={ mockBadges } config={ zeroConfig } />
			);

			expect( container.querySelectorAll( '.prpl-badge' ) ).toHaveLength(
				3
			);
		} );

		it( 'handles undefined progress', () => {
			const badgesWithoutProgress = [
				{ id: 'no-progress', name: 'No Progress', isComplete: false },
			];

			const { container } = render(
				<BadgeGrid
					badges={ badgesWithoutProgress }
					config={ mockConfig }
				/>
			);

			// Component should render even without progress value
			const badge = container.querySelector( '.prpl-badge' );
			expect( badge ).toBeInTheDocument();
		} );
	} );
} );
