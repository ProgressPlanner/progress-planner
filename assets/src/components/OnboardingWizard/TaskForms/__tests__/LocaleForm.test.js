/**
 * Tests for LocaleForm Component
 */

import { render, screen, waitFor } from '@testing-library/react';
import LocaleForm from '../LocaleForm';

// Mock apiFetch.
jest.mock( '@wordpress/api-fetch', () =>
	jest.fn( () =>
		Promise.resolve( [
			{ value: '', label: 'English (United States)' },
			{ value: 'fr_FR', label: 'French' },
			{ value: 'de_DE', label: 'German' },
		] )
	)
);

describe( 'LocaleForm', () => {
	const defaultTask = {
		task_id: 'select-locale',
		title: 'Set the locale',
		action_label: 'Set the locale',
	};

	it( 'renders task title', async () => {
		render( <LocaleForm task={ defaultTask } /> );

		await waitFor( () => {
			expect( screen.getByText( 'Set the locale' ) ).toBeInTheDocument();
		} );
	} );

	it( 'renders the description text', async () => {
		render( <LocaleForm task={ defaultTask } /> );

		await waitFor( () => {
			expect(
				screen.getByText( /your locale determines/i )
			).toBeInTheDocument();
		} );
	} );

	it( 'renders a select with name WPLANG', async () => {
		const { container } = render( <LocaleForm task={ defaultTask } /> );

		await waitFor( () => {
			const select = container.querySelector( 'select[name="WPLANG"]' );
			expect( select ).toBeInTheDocument();
		} );
	} );

	it( 'loads locale options from API', async () => {
		render( <LocaleForm task={ defaultTask } /> );

		await waitFor( () => {
			expect(
				screen.getByText( 'English (United States)' )
			).toBeInTheDocument();
			expect( screen.getByText( 'French' ) ).toBeInTheDocument();
			expect( screen.getByText( 'German' ) ).toBeInTheDocument();
		} );
	} );
} );
