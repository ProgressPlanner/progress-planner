/**
 * Tests for Icon Component
 */

import { render } from '@testing-library/react';

import Icon from '../index';

describe( 'Icon', () => {
	const iconNames = [
		'arrow',
		'trash',
		'check',
		'close',
		'chevronDown',
		'warning',
	];

	describe( 'renders each named icon', () => {
		it.each( iconNames )( 'renders "%s" as an svg', ( name ) => {
			const { container } = render( <Icon name={ name } /> );
			expect( container.querySelector( 'svg' ) ).toBeInTheDocument();
		} );
	} );

	it( 'returns null for unknown names', () => {
		const { container } = render( <Icon name="nonexistent" /> );
		expect( container.innerHTML ).toBe( '' );
	} );

	it( 'sets default aria-hidden and focusable attributes', () => {
		const { container } = render( <Icon name="trash" /> );
		const svg = container.querySelector( 'svg' );
		expect( svg ).toHaveAttribute( 'aria-hidden', 'true' );
		expect( svg ).toHaveAttribute( 'focusable', 'false' );
	} );

	it( 'passes className prop through', () => {
		const { container } = render(
			<Icon name="check" className="my-class" />
		);
		const svg = container.querySelector( 'svg' );
		expect( svg ).toHaveAttribute( 'class', 'my-class' );
	} );

	it( 'passes style prop through', () => {
		const { container } = render(
			<Icon name="arrow" style={ { width: '2rem' } } />
		);
		const svg = container.querySelector( 'svg' );
		expect( svg.style.width ).toBe( '2rem' );
	} );

	it( 'uses stroke for chevronDown icon', () => {
		const { container } = render( <Icon name="chevronDown" /> );
		const svg = container.querySelector( 'svg' );
		expect( svg ).toHaveAttribute( 'stroke', 'currentColor' );
		expect( svg ).toHaveAttribute( 'fill', 'none' );
	} );

	it( 'uses fill for non-stroke icons', () => {
		const { container } = render( <Icon name="trash" /> );
		const svg = container.querySelector( 'svg' );
		expect( svg ).toHaveAttribute( 'fill', 'currentColor' );
	} );
} );
