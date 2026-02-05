/**
 * Tests for DeactivationModal Component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeactivationModal from '../DeactivationModal';

// Mock fetch.
global.fetch = jest.fn( () =>
	Promise.resolve( {
		json: () => Promise.resolve( { nonce: 'test-nonce' } ),
	} )
);

describe( 'DeactivationModal', () => {
	const defaultConfig = {
		reasons: [
			{
				id: 'not-working',
				label: 'The plugin is not working',
				feedback_type: 'textarea',
				feedback_placeholder: 'What happened?',
			},
			{
				id: 'found-better',
				label: 'I found a better plugin',
				feedback_type: 'text',
				feedback_placeholder: "What's the name?",
			},
			{
				id: 'temporary',
				label: 'Temporary deactivation',
				feedback_type: false,
				feedback_placeholder: false,
			},
		],
		remoteServerUrl: 'https://example.com',
		deactivateUrl: '/wp-admin/plugins.php?action=deactivate',
		pluginSlug: 'progress-planner',
		siteUrl: 'https://mysite.com',
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'renders all reason options', () => {
		render( <DeactivationModal config={ defaultConfig } isOpen /> );

		expect(
			screen.getByText( 'The plugin is not working' )
		).toBeInTheDocument();
		expect(
			screen.getByText( 'I found a better plugin' )
		).toBeInTheDocument();
		expect(
			screen.getByText( 'Temporary deactivation' )
		).toBeInTheDocument();
	} );

	it( 'renders submit and dismiss buttons', () => {
		render( <DeactivationModal config={ defaultConfig } isOpen /> );

		expect( screen.getByText( 'Submit & Deactivate' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Skip & Deactivate' ) ).toBeInTheDocument();
	} );

	it( 'shows feedback field when reason with feedback is selected', () => {
		render( <DeactivationModal config={ defaultConfig } isOpen /> );

		const reason = screen.getByLabelText( 'The plugin is not working' );
		fireEvent.click( reason );

		expect(
			screen.getByPlaceholderText( 'What happened?' )
		).toBeInTheDocument();
	} );

	it( 'does not show feedback for reason without feedback_type', () => {
		render( <DeactivationModal config={ defaultConfig } isOpen /> );

		const reason = screen.getByLabelText( 'Temporary deactivation' );
		fireEvent.click( reason );

		expect(
			screen.queryByPlaceholderText( 'What happened?' )
		).not.toBeInTheDocument();
	} );

	it( 'calls dismiss handler on Skip & Deactivate click', () => {
		const onDismiss = jest.fn();
		render(
			<DeactivationModal
				config={ defaultConfig }
				isOpen
				onDismiss={ onDismiss }
			/>
		);

		fireEvent.click( screen.getByText( 'Skip & Deactivate' ) );
		expect( onDismiss ).toHaveBeenCalled();
	} );

	it( 'calls remote API on Submit & Deactivate', async () => {
		const onDismiss = jest.fn();
		render(
			<DeactivationModal
				config={ defaultConfig }
				isOpen
				onDismiss={ onDismiss }
			/>
		);

		// Select a reason.
		fireEvent.click( screen.getByLabelText( 'Temporary deactivation' ) );

		// Click submit.
		fireEvent.click( screen.getByText( 'Submit & Deactivate' ) );

		await waitFor( () => {
			expect( global.fetch ).toHaveBeenCalled();
		} );
	} );

	it( 'renders nothing when not open', () => {
		const { container } = render(
			<DeactivationModal config={ defaultConfig } isOpen={ false } />
		);

		expect( container.innerHTML ).toBe( '' );
	} );

	it( 'renders the heading text', () => {
		render( <DeactivationModal config={ defaultConfig } isOpen /> );

		expect(
			screen.getByText( "We're sorry to see you go" )
		).toBeInTheDocument();
	} );
} );
