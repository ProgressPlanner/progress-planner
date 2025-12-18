/**
 * Tests for WidgetStates Components
 */

import { render, screen } from '@testing-library/react';
import { LoadingState, ErrorState, EmptyState } from '../index';

describe( 'WidgetStates', () => {
	describe( 'LoadingState', () => {
		describe( 'basic rendering', () => {
			it( 'renders with default message', () => {
				render( <LoadingState /> );

				expect( screen.getByText( 'Loading…' ) ).toBeInTheDocument();
			} );

			it( 'renders with custom message', () => {
				render( <LoadingState message="Please wait..." /> );

				expect(
					screen.getByText( 'Please wait...' )
				).toBeInTheDocument();
			} );

			it( 'has default loading class', () => {
				const { container } = render( <LoadingState /> );

				expect(
					container.querySelector( '.prpl-widget-loading' )
				).toBeInTheDocument();
			} );

			it( 'appends custom className', () => {
				const { container } = render(
					<LoadingState className="custom-loading" />
				);

				const element = container.querySelector(
					'.prpl-widget-loading'
				);
				expect( element ).toHaveClass( 'custom-loading' );
			} );
		} );

		describe( 'styling', () => {
			it( 'applies default styles', () => {
				const { container } = render( <LoadingState /> );

				const element = container.querySelector(
					'.prpl-widget-loading'
				);
				expect( element ).toHaveStyle( {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '2em',
				} );
			} );

			it( 'merges custom styles with defaults', () => {
				const { container } = render(
					<LoadingState style={ { padding: '4em', color: 'blue' } } />
				);

				const element = container.querySelector(
					'.prpl-widget-loading'
				);
				expect( element ).toHaveStyle( {
					display: 'flex',
					padding: '4em',
					color: 'blue',
				} );
			} );
		} );

		describe( 'simple mode', () => {
			it( 'renders as p tag in simple mode', () => {
				render( <LoadingState simple /> );

				const paragraph = screen.getByText( 'Loading…' );
				expect( paragraph.tagName ).toBe( 'P' );
			} );

			it( 'does not have loading class in simple mode', () => {
				const { container } = render( <LoadingState simple /> );

				expect(
					container.querySelector( '.prpl-widget-loading' )
				).not.toBeInTheDocument();
			} );

			it( 'uses custom className in simple mode', () => {
				render( <LoadingState simple className="simple-class" /> );

				const paragraph = screen.getByText( 'Loading…' );
				expect( paragraph ).toHaveClass( 'simple-class' );
			} );

			it( 'omits className attribute when empty in simple mode', () => {
				render( <LoadingState simple /> );

				const paragraph = screen.getByText( 'Loading…' );
				expect( paragraph.className ).toBe( '' );
			} );
		} );
	} );

	describe( 'ErrorState', () => {
		describe( 'basic rendering', () => {
			it( 'renders with default message', () => {
				render( <ErrorState /> );

				expect(
					screen.getByText( 'An error occurred.' )
				).toBeInTheDocument();
			} );

			it( 'renders with custom message', () => {
				render( <ErrorState message="Something went wrong!" /> );

				expect(
					screen.getByText( 'Something went wrong!' )
				).toBeInTheDocument();
			} );

			it( 'has default error class', () => {
				const { container } = render( <ErrorState /> );

				expect(
					container.querySelector( '.prpl-widget-error' )
				).toBeInTheDocument();
			} );

			it( 'appends custom className', () => {
				const { container } = render(
					<ErrorState className="custom-error" />
				);

				const element = container.querySelector( '.prpl-widget-error' );
				expect( element ).toHaveClass( 'custom-error' );
			} );
		} );

		describe( 'styling', () => {
			it( 'applies default error styles', () => {
				const { container } = render( <ErrorState /> );

				const element = container.querySelector( '.prpl-widget-error' );
				expect( element ).toHaveStyle( {
					padding: '1em',
					backgroundColor: 'var(--prpl-color-error-background, #fee)',
					color: 'var(--prpl-color-error, #c00)',
				} );
			} );

			it( 'merges custom styles with defaults', () => {
				const { container } = render(
					<ErrorState
						style={ { backgroundColor: 'red', fontSize: '1.2em' } }
					/>
				);

				const element = container.querySelector( '.prpl-widget-error' );
				expect( element ).toHaveStyle( {
					padding: '1em',
					backgroundColor: 'red',
					fontSize: '1.2em',
				} );
			} );
		} );

		describe( 'simple mode', () => {
			it( 'renders as p tag in simple mode', () => {
				render( <ErrorState simple /> );

				const paragraph = screen.getByText( 'An error occurred.' );
				expect( paragraph.tagName ).toBe( 'P' );
			} );

			it( 'does not have error class in simple mode', () => {
				const { container } = render( <ErrorState simple /> );

				expect(
					container.querySelector( '.prpl-widget-error' )
				).not.toBeInTheDocument();
			} );

			it( 'uses custom className in simple mode', () => {
				render( <ErrorState simple className="error-simple" /> );

				const paragraph = screen.getByText( 'An error occurred.' );
				expect( paragraph ).toHaveClass( 'error-simple' );
			} );
		} );
	} );

	describe( 'EmptyState', () => {
		describe( 'basic rendering', () => {
			it( 'renders with default message', () => {
				render( <EmptyState /> );

				expect(
					screen.getByText( 'No data available.' )
				).toBeInTheDocument();
			} );

			it( 'renders with custom message', () => {
				render( <EmptyState message="Nothing to show here" /> );

				expect(
					screen.getByText( 'Nothing to show here' )
				).toBeInTheDocument();
			} );

			it( 'renders as p tag', () => {
				render( <EmptyState /> );

				const paragraph = screen.getByText( 'No data available.' );
				expect( paragraph.tagName ).toBe( 'P' );
			} );

			it( 'applies custom className', () => {
				render( <EmptyState className="empty-class" /> );

				const paragraph = screen.getByText( 'No data available.' );
				expect( paragraph ).toHaveClass( 'empty-class' );
			} );

			it( 'omits className attribute when empty', () => {
				render( <EmptyState /> );

				const paragraph = screen.getByText( 'No data available.' );
				expect( paragraph.className ).toBe( '' );
			} );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'LoadingState handles empty message', () => {
			render( <LoadingState message="" /> );

			const element = document.querySelector( '.prpl-widget-loading' );
			expect( element ).toBeInTheDocument();
			expect( element.textContent ).toBe( '' );
		} );

		it( 'ErrorState handles empty message', () => {
			render( <ErrorState message="" /> );

			const element = document.querySelector( '.prpl-widget-error' );
			expect( element ).toBeInTheDocument();
			expect( element.textContent ).toBe( '' );
		} );

		it( 'EmptyState handles empty message', () => {
			const { container } = render( <EmptyState message="" /> );

			const paragraph = container.querySelector( 'p' );
			expect( paragraph ).toBeInTheDocument();
			expect( paragraph.textContent ).toBe( '' );
		} );

		it( 'LoadingState handles HTML in message', () => {
			render( <LoadingState message="<b>Loading</b>" /> );

			// React escapes HTML by default
			expect( screen.getByText( '<b>Loading</b>' ) ).toBeInTheDocument();
		} );

		it( 'ErrorState handles special characters', () => {
			render( <ErrorState message="Error: <500> & more" /> );

			expect(
				screen.getByText( 'Error: <500> & more' )
			).toBeInTheDocument();
		} );
	} );
} );
