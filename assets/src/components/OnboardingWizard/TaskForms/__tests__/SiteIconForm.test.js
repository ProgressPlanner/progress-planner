/**
 * Tests for SiteIconForm Component
 */

import { render, screen } from '@testing-library/react';
import SiteIconForm from '../SiteIconForm';

describe( 'SiteIconForm', () => {
	const defaultTask = {
		task_id: 'core-siteicon',
		title: 'Set site icon',
		action_label: 'Set site icon',
	};

	it( 'renders task title', () => {
		render( <SiteIconForm task={ defaultTask } /> );

		expect( screen.getByText( 'Set site icon' ) ).toBeInTheDocument();
	} );

	it( 'renders the description text', () => {
		render( <SiteIconForm task={ defaultTask } /> );

		expect( screen.getByText( /upload an image/i ) ).toBeInTheDocument();
	} );

	it( 'renders a file input', () => {
		const { container } = render( <SiteIconForm task={ defaultTask } /> );

		const fileInput = container.querySelector( 'input[type="file"]' );
		expect( fileInput ).toBeInTheDocument();
		expect( fileInput ).toHaveAttribute( 'accept' );
	} );

	it( 'renders a hidden post_id input', () => {
		const { container } = render( <SiteIconForm task={ defaultTask } /> );

		const hiddenInput = container.querySelector( 'input[name="post_id"]' );
		expect( hiddenInput ).toBeInTheDocument();
		expect( hiddenInput ).toHaveAttribute( 'type', 'hidden' );
	} );

	it( 'renders the drop zone', () => {
		const { container } = render( <SiteIconForm task={ defaultTask } /> );

		const dropZone = container.querySelector( '.prpl-file-drop-zone' );
		expect( dropZone ).toBeInTheDocument();
	} );

	it( 'renders the remove button (hidden initially)', () => {
		render( <SiteIconForm task={ defaultTask } /> );

		const removeBtn = screen.getByText( /remove icon/i );
		expect( removeBtn ).toBeInTheDocument();
	} );
} );
