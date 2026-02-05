/**
 * Tests for TimezoneForm Component
 */

import { render, screen, waitFor } from '@testing-library/react';
import TimezoneForm from '../TimezoneForm';

// Mock apiFetch.
jest.mock( '@wordpress/api-fetch', () =>
	jest.fn( () =>
		Promise.resolve( [
			{ value: 'America/New_York', label: 'New York' },
			{ value: 'Europe/London', label: 'London' },
			{ value: 'Asia/Tokyo', label: 'Tokyo' },
		] )
	)
);

describe( 'TimezoneForm', () => {
	const defaultTask = {
		task_id: 'select-timezone',
		title: 'Set the timezone',
		action_label: 'Set the timezone',
	};

	it( 'renders task title', async () => {
		render( <TimezoneForm task={ defaultTask } /> );

		await waitFor( () => {
			expect(
				screen.getByText( 'Set the timezone' )
			).toBeInTheDocument();
		} );
	} );

	it( 'renders the description text', async () => {
		render( <TimezoneForm task={ defaultTask } /> );

		await waitFor( () => {
			expect(
				screen.getByText( /setting your timezone ensures/i )
			).toBeInTheDocument();
		} );
	} );

	it( 'renders a select with name timezone_string', async () => {
		const { container } = render( <TimezoneForm task={ defaultTask } /> );

		await waitFor( () => {
			const select = container.querySelector(
				'select[name="timezone_string"]'
			);
			expect( select ).toBeInTheDocument();
		} );
	} );

	it( 'loads timezone options from API', async () => {
		render( <TimezoneForm task={ defaultTask } /> );

		await waitFor( () => {
			expect( screen.getByText( 'New York' ) ).toBeInTheDocument();
			expect( screen.getByText( 'London' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Tokyo' ) ).toBeInTheDocument();
		} );
	} );
} );
