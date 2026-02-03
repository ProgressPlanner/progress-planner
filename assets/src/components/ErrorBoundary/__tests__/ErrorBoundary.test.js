/**
 * Tests for ErrorBoundary Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../index';

// Suppress console.error during error boundary tests
const originalError = console.error;
beforeAll( () => {
	console.error = jest.fn();
} );
afterAll( () => {
	console.error = originalError;
} );

// Test component that throws an error
const ThrowingComponent = ( { shouldThrow = true } ) => {
	if ( shouldThrow ) {
		throw new Error( 'Test error' );
	}
	return <div>Content rendered successfully</div>;
};

// Test component that can conditionally throw
const ConditionalThrowingComponent = ( { error } ) => {
	if ( error ) {
		throw error;
	}
	return <div>Child content</div>;
};

describe( 'ErrorBoundary', () => {
	describe( 'normal rendering', () => {
		it( 'renders children when no error occurs', () => {
			render(
				<ErrorBoundary>
					<div>Test content</div>
				</ErrorBoundary>
			);

			expect( screen.getByText( 'Test content' ) ).toBeInTheDocument();
		} );

		it( 'renders multiple children', () => {
			render(
				<ErrorBoundary>
					<div>First child</div>
					<div>Second child</div>
				</ErrorBoundary>
			);

			expect( screen.getByText( 'First child' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Second child' ) ).toBeInTheDocument();
		} );

		it( 'passes through children unchanged', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent shouldThrow={ false } />
				</ErrorBoundary>
			);

			expect(
				screen.getByText( 'Content rendered successfully' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'error handling', () => {
		it( 'catches errors in child components', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect(
				screen.getByText( 'Something went wrong' )
			).toBeInTheDocument();
		} );

		it( 'displays default error message', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect(
				screen.getByText(
					'This widget failed to load. Try refreshing the page.'
				)
			).toBeInTheDocument();
		} );

		it( 'displays retry button', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect(
				screen.getByRole( 'button', { name: 'Retry' } )
			).toBeInTheDocument();
		} );

		it( 'logs error to console', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect( console.error ).toHaveBeenCalledWith(
				'ErrorBoundary caught an error:',
				expect.any( Error ),
				expect.objectContaining( {
					componentStack: expect.any( String ),
				} )
			);
		} );
	} );

	describe( 'retry functionality', () => {
		it( 'retry button resets error state', () => {
			let shouldThrow = true;

			const DynamicThrow = () => {
				if ( shouldThrow ) {
					throw new Error( 'Test error' );
				}
				return <div>Recovered content</div>;
			};

			render(
				<ErrorBoundary>
					<DynamicThrow />
				</ErrorBoundary>
			);

			// Verify error state
			expect(
				screen.getByText( 'Something went wrong' )
			).toBeInTheDocument();

			// Set to not throw and retry
			shouldThrow = false;
			fireEvent.click( screen.getByRole( 'button', { name: 'Retry' } ) );

			// Should now show recovered content
			expect(
				screen.getByText( 'Recovered content' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'custom fallback', () => {
		it( 'renders custom fallback when provided', () => {
			const customFallback = <div>Custom error display</div>;

			render(
				<ErrorBoundary fallback={ customFallback }>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect(
				screen.getByText( 'Custom error display' )
			).toBeInTheDocument();
			expect(
				screen.queryByText( 'Something went wrong' )
			).not.toBeInTheDocument();
		} );

		it( 'custom fallback can be a complex component', () => {
			const customFallback = (
				<div>
					<h1>Error!</h1>
					<p>Something bad happened</p>
				</div>
			);

			render(
				<ErrorBoundary fallback={ customFallback }>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect( screen.getByText( 'Error!' ) ).toBeInTheDocument();
			expect(
				screen.getByText( 'Something bad happened' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'onError callback', () => {
		it( 'calls onError callback when error occurs', () => {
			const onError = jest.fn();

			render(
				<ErrorBoundary onError={ onError }>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			expect( onError ).toHaveBeenCalledWith(
				expect.any( Error ),
				expect.objectContaining( {
					componentStack: expect.any( String ),
				} )
			);
		} );

		it( 'onError receives the actual error object', () => {
			const onError = jest.fn();
			const testError = new Error( 'Specific test error' );

			render(
				<ErrorBoundary onError={ onError }>
					<ConditionalThrowingComponent error={ testError } />
				</ErrorBoundary>
			);

			expect( onError ).toHaveBeenCalledWith(
				testError,
				expect.any( Object )
			);
		} );

		it( 'onError is not called when no error occurs', () => {
			const onError = jest.fn();

			render(
				<ErrorBoundary onError={ onError }>
					<div>Normal content</div>
				</ErrorBoundary>
			);

			expect( onError ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'styling', () => {
		it( 'error container has error styling', () => {
			const { container } = render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			const errorContainer = container.firstChild;
			expect( errorContainer ).toHaveStyle( {
				border: '1px solid var(--prpl-color-error, #ef4444)',
			} );
		} );

		it( 'heading has error color', () => {
			render(
				<ErrorBoundary>
					<ThrowingComponent />
				</ErrorBoundary>
			);

			const heading = screen.getByRole( 'heading', { level: 4 } );
			expect( heading ).toHaveStyle( {
				color: 'var(--prpl-color-error, #ef4444)',
			} );
		} );
	} );

	describe( 'isolation', () => {
		it( 'one ErrorBoundary does not affect sibling', () => {
			render(
				<div>
					<ErrorBoundary>
						<ThrowingComponent />
					</ErrorBoundary>
					<ErrorBoundary>
						<div>Sibling content</div>
					</ErrorBoundary>
				</div>
			);

			// First boundary shows error
			expect(
				screen.getByText( 'Something went wrong' )
			).toBeInTheDocument();
			// Second boundary renders normally
			expect( screen.getByText( 'Sibling content' ) ).toBeInTheDocument();
		} );

		it( 'nested ErrorBoundaries catch at correct level', () => {
			render(
				<ErrorBoundary>
					<div>
						<p>Outer content</p>
						<ErrorBoundary>
							<ThrowingComponent />
						</ErrorBoundary>
					</div>
				</ErrorBoundary>
			);

			// Inner error is caught
			expect(
				screen.getByText( 'Something went wrong' )
			).toBeInTheDocument();
			// Outer content still renders
			expect( screen.getByText( 'Outer content' ) ).toBeInTheDocument();
		} );
	} );
} );
