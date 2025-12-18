/**
 * Tests for PointsCounter Component
 */

import { render, screen } from '@testing-library/react';
import PointsCounter from '../PointsCounter';

// Mock WordPress i18n
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

describe( 'PointsCounter', () => {
	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			expect(
				container.querySelector(
					'.prpl-monthly-badges__points-counter'
				)
			).toBeInTheDocument();
		} );

		it( 'renders points value', () => {
			render( <PointsCounter points={ 75 } /> );

			expect( screen.getByText( /75/ ) ).toBeInTheDocument();
		} );

		it( 'renders default label', () => {
			render( <PointsCounter points={ 50 } /> );

			expect(
				screen.getByText( 'Progress monthly badge' )
			).toBeInTheDocument();
		} );

		it( 'renders custom label', () => {
			render( <PointsCounter points={ 50 } label="Custom Label" /> );

			expect( screen.getByText( 'Custom Label' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'unit display', () => {
		it( 'shows pt unit by default', () => {
			render( <PointsCounter points={ 100 } /> );

			expect( screen.getByText( /100pt/ ) ).toBeInTheDocument();
		} );

		it( 'shows pt unit when showUnit is true', () => {
			render( <PointsCounter points={ 100 } showUnit={ true } /> );

			expect( screen.getByText( /100pt/ ) ).toBeInTheDocument();
		} );

		it( 'hides pt unit when showUnit is false', () => {
			render( <PointsCounter points={ 100 } showUnit={ false } /> );

			const numberElement = screen.getByText( '100' );
			expect( numberElement ).toBeInTheDocument();
			expect( numberElement.textContent ).toBe( '100' );
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has points counter class', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			expect(
				container.querySelector(
					'.prpl-monthly-badges__points-counter'
				)
			).toBeInTheDocument();
		} );

		it( 'has points label class', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			expect(
				container.querySelector( '.prpl-monthly-badges__points-label' )
			).toBeInTheDocument();
		} );

		it( 'has points number class', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			expect(
				container.querySelector( '.prpl-monthly-badges__points-number' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'inline styles', () => {
		it( 'container has flex display', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			const counterEl = container.querySelector(
				'.prpl-monthly-badges__points-counter'
			);
			expect( counterEl.style.display ).toBe( 'flex' );
		} );

		it( 'container has space-between justify', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			const counterEl = container.querySelector(
				'.prpl-monthly-badges__points-counter'
			);
			expect( counterEl.style.justifyContent ).toBe( 'space-between' );
		} );

		it( 'number has bold font weight', () => {
			const { container } = render( <PointsCounter points={ 50 } /> );

			const numberEl = container.querySelector(
				'.prpl-monthly-badges__points-number'
			);
			expect( numberEl.style.fontWeight ).toBe( '600' );
		} );
	} );

	describe( 'different point values', () => {
		it( 'displays zero points', () => {
			render( <PointsCounter points={ 0 } /> );

			expect( screen.getByText( /0pt/ ) ).toBeInTheDocument();
		} );

		it( 'displays negative points', () => {
			render( <PointsCounter points={ -10 } /> );

			expect( screen.getByText( /-10pt/ ) ).toBeInTheDocument();
		} );

		it( 'displays large point values', () => {
			render( <PointsCounter points={ 9999 } /> );

			expect( screen.getByText( /9999pt/ ) ).toBeInTheDocument();
		} );

		it( 'displays decimal points', () => {
			render( <PointsCounter points={ 50.5 } /> );

			expect( screen.getByText( /50.5pt/ ) ).toBeInTheDocument();
		} );
	} );

	describe( 'label variations', () => {
		it( 'handles empty label', () => {
			const { container } = render(
				<PointsCounter points={ 50 } label="" />
			);

			const labelEl = container.querySelector(
				'.prpl-monthly-badges__points-label'
			);
			expect( labelEl.textContent ).toBe( '' );
		} );

		it( 'handles long label', () => {
			const longLabel =
				'This is a very long label for the points counter';
			render( <PointsCounter points={ 50 } label={ longLabel } /> );

			expect( screen.getByText( longLabel ) ).toBeInTheDocument();
		} );

		it( 'handles special characters in label', () => {
			render(
				<PointsCounter points={ 50 } label="Points: <special> & more" />
			);

			expect(
				screen.getByText( 'Points: <special> & more' )
			).toBeInTheDocument();
		} );
	} );
} );
