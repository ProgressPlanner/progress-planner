/**
 * Tests for LoadMoreButton Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import LoadMoreButton from '../LoadMoreButton';

// Mock WordPress i18n
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock styles
jest.mock( '../styles', () => ( {
	STYLES: {
		toggleButton: {
			background: 'none',
			border: 'none',
			cursor: 'pointer',
		},
	},
} ) );

describe( 'LoadMoreButton', () => {
	const mockOnLoadMore = jest.fn();
	const mockOnCollapse = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'when hasMore is true', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '.prpl-show-all-tasks' )
			).toBeInTheDocument();
		} );

		it( 'renders button element', () => {
			render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByRole( 'button' ) ).toBeInTheDocument();
		} );

		it( 'has correct button id', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '#prpl-load-more-recommendations' )
			).toBeInTheDocument();
		} );

		it( 'has toggle button class', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector(
					'.prpl-toggle-all-recommendations-button'
				)
			).toBeInTheDocument();
		} );

		it( 'shows "Load more tasks" text', () => {
			render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();
		} );

		it( 'calls onLoadMore when clicked', () => {
			render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			const button = screen.getByRole( 'button' );
			fireEvent.click( button );

			expect( mockOnLoadMore ).toHaveBeenCalled();
			expect( mockOnLoadMore ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'has type="button"', () => {
			render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveAttribute( 'type', 'button' );
		} );

		it( 'wraps button in paragraph element', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			const paragraph = container.querySelector(
				'p.prpl-show-all-tasks'
			);
			expect( paragraph ).toBeInTheDocument();
			expect( paragraph.querySelector( 'button' ) ).toBeInTheDocument();
		} );

		it( 'applies cursor style from STYLES.toggleButton', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			const button = container.querySelector( 'button' );
			expect( button.style.cursor ).toBe( 'pointer' );
		} );
	} );

	describe( 'when canCollapse is true', () => {
		it( 'renders collapse button', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '.prpl-show-all-tasks' )
			).toBeInTheDocument();
		} );

		it( 'has correct button id for collapse', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '#prpl-collapse-recommendations' )
			).toBeInTheDocument();
		} );

		it( 'shows "Show top 5" text', () => {
			render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Show top 5' ) ).toBeInTheDocument();
		} );

		it( 'calls onCollapse when clicked', () => {
			render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			const button = screen.getByRole( 'button' );
			fireEvent.click( button );

			expect( mockOnCollapse ).toHaveBeenCalled();
			expect( mockOnCollapse ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'when neither hasMore nor canCollapse is true', () => {
		it( 'returns null', () => {
			const { container } = render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '.prpl-show-all-tasks' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'hasMore takes priority over canCollapse', () => {
		it( 'shows load more button when both hasMore and canCollapse are true', () => {
			render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();
			expect(
				screen.queryByText( 'Show top 5' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'state transitions', () => {
		it( 'transitions from hasMore to canCollapse', () => {
			const { rerender } = render(
				<LoadMoreButton
					hasMore={ true }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();

			rerender(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Show top 5' ) ).toBeInTheDocument();
		} );

		it( 'transitions from canCollapse to hidden', () => {
			const { rerender, container } = render(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ true }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect( screen.getByText( 'Show top 5' ) ).toBeInTheDocument();

			rerender(
				<LoadMoreButton
					hasMore={ false }
					canCollapse={ false }
					onLoadMore={ mockOnLoadMore }
					onCollapse={ mockOnCollapse }
				/>
			);

			expect(
				container.querySelector( '.prpl-show-all-tasks' )
			).not.toBeInTheDocument();
		} );
	} );
} );
