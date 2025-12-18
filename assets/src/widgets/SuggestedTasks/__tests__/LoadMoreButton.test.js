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
	const mockOnClick = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect(
				container.querySelector( '.prpl-show-all-tasks' )
			).toBeInTheDocument();
		} );

		it( 'renders button element', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect( screen.getByRole( 'button' ) ).toBeInTheDocument();
		} );

		it( 'has correct button id', () => {
			const { container } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect(
				container.querySelector( '#prpl-load-more-recommendations' )
			).toBeInTheDocument();
		} );

		it( 'has toggle button class', () => {
			const { container } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect(
				container.querySelector(
					'.prpl-toggle-all-recommendations-button'
				)
			).toBeInTheDocument();
		} );
	} );

	describe( 'button text', () => {
		it( 'shows "Load more tasks" when not loading', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();
		} );

		it( 'shows "Loading…" when loading', () => {
			render(
				<LoadMoreButton isLoading={ true } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Loading…' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'button state', () => {
		it( 'is enabled when not loading', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			expect( button ).not.toBeDisabled();
		} );

		it( 'is disabled when loading', () => {
			render(
				<LoadMoreButton isLoading={ true } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			expect( button ).toBeDisabled();
		} );
	} );

	describe( 'click handling', () => {
		it( 'calls onClick when clicked', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			fireEvent.click( button );

			expect( mockOnClick ).toHaveBeenCalled();
		} );

		it( 'calls onClick only once per click', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			fireEvent.click( button );

			expect( mockOnClick ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'does not call onClick when disabled', () => {
			render(
				<LoadMoreButton isLoading={ true } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			fireEvent.click( button );

			expect( mockOnClick ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'button type', () => {
		it( 'has type="button"', () => {
			render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveAttribute( 'type', 'button' );
		} );
	} );

	describe( 'wrapper element', () => {
		it( 'wraps button in paragraph element', () => {
			const { container } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const paragraph = container.querySelector(
				'p.prpl-show-all-tasks'
			);
			expect( paragraph ).toBeInTheDocument();
			expect( paragraph.querySelector( 'button' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'inline styles', () => {
		it( 'applies cursor style from STYLES.toggleButton', () => {
			const { container } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			const button = container.querySelector( 'button' );
			expect( button.style.cursor ).toBe( 'pointer' );
		} );
	} );

	describe( 'loading state transitions', () => {
		it( 'transitions from loading to not loading', () => {
			const { rerender } = render(
				<LoadMoreButton isLoading={ true } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Loading…' ) ).toBeInTheDocument();
			expect( screen.getByRole( 'button' ) ).toBeDisabled();

			rerender(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();
			expect( screen.getByRole( 'button' ) ).not.toBeDisabled();
		} );

		it( 'transitions from not loading to loading', () => {
			const { rerender } = render(
				<LoadMoreButton isLoading={ false } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Load more tasks' ) ).toBeInTheDocument();

			rerender(
				<LoadMoreButton isLoading={ true } onClick={ mockOnClick } />
			);

			expect( screen.getByText( 'Loading…' ) ).toBeInTheDocument();
		} );
	} );
} );
