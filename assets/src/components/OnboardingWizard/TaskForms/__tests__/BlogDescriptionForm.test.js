/**
 * Tests for BlogDescriptionForm Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import BlogDescriptionForm from '../BlogDescriptionForm';

describe( 'BlogDescriptionForm', () => {
	const defaultTask = {
		task_id: 'core-blogdescription',
		title: 'Set your tagline',
		site_description: 'Just another WordPress site',
		action_label: 'Verify tagline',
	};

	it( 'renders a text input with name blogdescription', () => {
		render( <BlogDescriptionForm task={ defaultTask } /> );

		const input = screen.getByRole( 'textbox' );
		expect( input ).toBeInTheDocument();
		expect( input ).toHaveAttribute( 'name', 'blogdescription' );
	} );

	it( 'pre-fills the input with site_description', () => {
		render( <BlogDescriptionForm task={ defaultTask } /> );

		const input = screen.getByRole( 'textbox' );
		expect( input ).toHaveValue( 'Just another WordPress site' );
	} );

	it( 'renders a placeholder when no description is set', () => {
		render(
			<BlogDescriptionForm
				task={ { ...defaultTask, site_description: '' } }
			/>
		);

		const input = screen.getByRole( 'textbox' );
		expect( input ).toHaveValue( '' );
		expect( input ).toHaveAttribute( 'placeholder' );
	} );

	it( 'renders task title', () => {
		render( <BlogDescriptionForm task={ defaultTask } /> );

		expect( screen.getByText( 'Set your tagline' ) ).toBeInTheDocument();
	} );

	it( 'renders the description text', () => {
		render( <BlogDescriptionForm task={ defaultTask } /> );

		expect(
			screen.getByText( /explain what this site is about/i )
		).toBeInTheDocument();
	} );

	it( 'allows typing in the input', () => {
		render( <BlogDescriptionForm task={ defaultTask } /> );

		const input = screen.getByRole( 'textbox' );
		fireEvent.change( input, {
			target: { value: 'My awesome blog' },
		} );
		expect( input ).toHaveValue( 'My awesome blog' );
	} );
} );
