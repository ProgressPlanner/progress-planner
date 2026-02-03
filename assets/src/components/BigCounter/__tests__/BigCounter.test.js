/**
 * Tests for BigCounter Component
 */

import { render, screen, act } from '@testing-library/react';
import BigCounter from '../index';

describe( 'BigCounter', () => {
	let originalAddEventListener;
	let originalRemoveEventListener;
	let resizeListeners;

	beforeEach( () => {
		resizeListeners = [];
		originalAddEventListener = window.addEventListener;
		originalRemoveEventListener = window.removeEventListener;

		window.addEventListener = jest.fn( ( event, handler ) => {
			if ( event === 'resize' ) {
				resizeListeners.push( handler );
			}
			originalAddEventListener.call( window, event, handler );
		} );

		window.removeEventListener = jest.fn( ( event, handler ) => {
			if ( event === 'resize' ) {
				resizeListeners = resizeListeners.filter(
					( h ) => h !== handler
				);
			}
			originalRemoveEventListener.call( window, event, handler );
		} );
	} );

	afterEach( () => {
		window.addEventListener = originalAddEventListener;
		window.removeEventListener = originalRemoveEventListener;
	} );

	describe( 'basic rendering', () => {
		it( 'renders the number', () => {
			render( <BigCounter number="42" label="Total Items" /> );

			expect( screen.getByText( '42' ) ).toBeInTheDocument();
		} );

		it( 'renders the label', () => {
			render( <BigCounter number="10" label="Active Users" /> );

			expect( screen.getByText( 'Active Users' ) ).toBeInTheDocument();
		} );

		it( 'renders both number and label', () => {
			render( <BigCounter number="100" label="Points Earned" /> );

			expect( screen.getByText( '100' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Points Earned' ) ).toBeInTheDocument();
		} );

		it( 'renders string numbers correctly', () => {
			render( <BigCounter number="1,234" label="Count" /> );

			expect( screen.getByText( '1,234' ) ).toBeInTheDocument();
		} );

		it( 'renders empty label', () => {
			render( <BigCounter number="5" label="" /> );

			expect( screen.getByText( '5' ) ).toBeInTheDocument();
		} );

		it( 'renders zero value', () => {
			render( <BigCounter number="0" label="No items" /> );

			expect( screen.getByText( '0' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'styling', () => {
		it( 'uses default background color', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			const counter = container.querySelector( '.prpl-big-counter' );
			expect( counter ).toHaveStyle( {
				backgroundColor: 'var(--prpl-background-content)',
			} );
		} );

		it( 'accepts custom background color', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" backgroundColor="#ff0000" />
			);

			const counter = container.querySelector( '.prpl-big-counter' );
			expect( counter ).toHaveStyle( {
				backgroundColor: '#ff0000',
			} );
		} );

		it( 'applies flex layout to container', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			const counter = container.querySelector( '.prpl-big-counter' );
			expect( counter ).toHaveStyle( {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			} );
		} );

		it( 'applies font weight to number', () => {
			const { container } = render(
				<BigCounter number="99" label="Test" />
			);

			const numberElement = container.querySelector(
				'.prpl-big-counter__number'
			);
			expect( numberElement ).toHaveStyle( {
				fontWeight: '600',
			} );
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has main container class', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			expect(
				container.querySelector( '.prpl-big-counter' )
			).toBeInTheDocument();
		} );

		it( 'has number class', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			expect(
				container.querySelector( '.prpl-big-counter__number' )
			).toBeInTheDocument();
		} );

		it( 'has label wrapper class', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			expect(
				container.querySelector( '.prpl-big-counter__label-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'has label class', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			expect(
				container.querySelector( '.prpl-big-counter__label' )
			).toBeInTheDocument();
		} );

		it( 'has width reference class', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			expect(
				container.querySelector( '.prpl-big-counter__width-reference' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'event listeners', () => {
		it( 'adds resize event listener on mount', () => {
			render( <BigCounter number="1" label="Test" /> );

			expect( window.addEventListener ).toHaveBeenCalledWith(
				'resize',
				expect.any( Function )
			);
		} );

		it( 'removes resize event listener on unmount', () => {
			const { unmount } = render(
				<BigCounter number="1" label="Test" />
			);

			unmount();

			expect( window.removeEventListener ).toHaveBeenCalledWith(
				'resize',
				expect.any( Function )
			);
		} );

		it( 'handles resize events', () => {
			render( <BigCounter number="1" label="Test" /> );

			// Trigger resize event should not throw
			act( () => {
				resizeListeners.forEach( ( listener ) => listener() );
			} );

			// Component should still be rendered
			expect( screen.getByText( '1' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'responsive behavior', () => {
		it( 'sets initial font size on label', () => {
			const { container } = render(
				<BigCounter number="1" label="Test Label" />
			);

			const label = container.querySelector( '.prpl-big-counter__label' );
			// Initial style is 100%
			expect( label ).toHaveStyle( {
				fontSize: '100%',
			} );
		} );

		it( 'sets width reference to 100%', () => {
			const { container } = render(
				<BigCounter number="1" label="Test" />
			);

			const widthRef = container.querySelector(
				'.prpl-big-counter__width-reference'
			);
			expect( widthRef ).toHaveStyle( {
				width: '100%',
			} );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles very long numbers', () => {
			render( <BigCounter number="999,999,999,999" label="Total" /> );

			expect( screen.getByText( '999,999,999,999' ) ).toBeInTheDocument();
		} );

		it( 'handles very long labels', () => {
			const longLabel =
				'This is a very long label that might need to be resized';
			render( <BigCounter number="1" label={ longLabel } /> );

			expect( screen.getByText( longLabel ) ).toBeInTheDocument();
		} );

		it( 'handles special characters in number', () => {
			render( <BigCounter number="$1,000" label="Price" /> );

			expect( screen.getByText( '$1,000' ) ).toBeInTheDocument();
		} );

		it( 'handles special characters in label', () => {
			render(
				<BigCounter number="5" label="Items & Things (Special)" />
			);

			expect(
				screen.getByText( 'Items & Things (Special)' )
			).toBeInTheDocument();
		} );

		it( 'handles CSS variable as background color', () => {
			const { container } = render(
				<BigCounter
					number="1"
					label="Test"
					backgroundColor="var(--custom-color)"
				/>
			);

			const counter = container.querySelector( '.prpl-big-counter' );
			expect( counter ).toHaveStyle( {
				backgroundColor: 'var(--custom-color)',
			} );
		} );
	} );
} );
