/**
 * Tests for BlogDescriptionPopover Component
 */

import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import BlogDescriptionPopover from '../BlogDescriptionPopover';

// Mock WordPress packages
jest.mock( '@wordpress/api-fetch', () => jest.fn() );
jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
	addAction: jest.fn(),
} ) );

// Mock the usePopoverForms submitSiteSettings
jest.mock( '../../../hooks/usePopoverForms', () => ( {
	submitSiteSettings: jest.fn(),
} ) );

// Mock InteractiveTaskPopover
jest.mock( '../InteractiveTaskPopover', () => ( { children, onClose } ) => (
	<div data-testid="interactive-popover" data-on-close={ !! onClose }>
		{ children }
	</div>
) );

describe( 'BlogDescriptionPopover', () => {
	const mockTask = {
		id: 'task-123',
		slug: 'core-blogdescription',
		title: { rendered: 'Set Blog Description' },
		description: { rendered: 'Add a tagline to your site.' },
	};

	const mockOnSubmit = jest.fn();
	const mockOnClose = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();

		// Setup default apiFetch mock
		const apiFetch = require( '@wordpress/api-fetch' );
		apiFetch.mockResolvedValue( { description: 'Existing tagline' } );

		// Setup default submitSiteSettings mock
		const {
			submitSiteSettings,
		} = require( '../../../hooks/usePopoverForms' );
		submitSiteSettings.mockResolvedValue();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', async () => {
			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByTestId( 'interactive-popover' )
			).toBeInTheDocument();
		} );

		it( 'renders task title', async () => {
			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByText( 'Set Blog Description' )
			).toBeInTheDocument();
		} );

		it( 'renders explanation text', async () => {
			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByText( /explain what this site is about/i )
			).toBeInTheDocument();
		} );

		it( 'renders form with input', async () => {
			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByRole( 'textbox', { name: /blog description/i } )
			).toBeInTheDocument();
		} );

		it( 'renders submit button', async () => {
			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByRole( 'button', { name: /save/i } )
			).toBeInTheDocument();
		} );
	} );

	describe( 'initial data loading', () => {
		it( 'loads current blog description on mount', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( {
				description: 'My existing tagline',
			} );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/settings',
			} );

			expect(
				screen.getByDisplayValue( 'My existing tagline' )
			).toBeInTheDocument();
		} );

		it( 'handles api error gracefully', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockRejectedValue( new Error( 'API Error' ) );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			// Should render without crashing
			expect(
				screen.getByTestId( 'interactive-popover' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'form input', () => {
		it( 'allows typing in input', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'New tagline' } } );

			expect( input.value ).toBe( 'New tagline' );
		} );

		it( 'has placeholder text', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect(
				screen.getByPlaceholderText(
					/catchy phrase to describe your website/i
				)
			).toBeInTheDocument();
		} );
	} );

	describe( 'submit button state', () => {
		it( 'disables submit when input is empty', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const button = screen.getByRole( 'button', { name: /save/i } );
			expect( button ).toBeDisabled();
		} );

		it( 'enables submit when input has value', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'My tagline' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );
			expect( button ).toBeEnabled();
		} );

		it( 'disables submit when input is only whitespace', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: '   ' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );
			expect( button ).toBeDisabled();
		} );
	} );

	describe( 'form submission', () => {
		it( 'calls submitSiteSettings on submit', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'New tagline' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( submitSiteSettings ).toHaveBeenCalledWith(
					expect.objectContaining( {
						settingAPIKey: 'description',
						setting: 'blogdescription',
						popoverId: 'prpl-popover-core-blogdescription',
						value: 'New tagline',
					} )
				);
			} );
		} );

		it( 'calls onSubmit after successful submission', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'New tagline' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( mockOnSubmit ).toHaveBeenCalledWith(
					'task-123',
					mockTask
				);
			} );
		} );

		it( 'trims whitespace from value', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, {
				target: { value: '  Trimmed tagline  ' },
			} );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( submitSiteSettings ).toHaveBeenCalledWith(
					expect.objectContaining( {
						value: 'Trimmed tagline',
					} )
				);
			} );
		} );
	} );

	describe( 'error handling', () => {
		it( 'shows error message on submission failure', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );
			submitSiteSettings.mockRejectedValue( new Error( 'Failed' ) );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'Test' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( screen.getByText( 'Failed' ) ).toBeInTheDocument();
			} );
		} );

		it( 'does not call onSubmit on error', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );
			submitSiteSettings.mockRejectedValue( new Error( 'Failed' ) );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'Test' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( screen.getByText( 'Failed' ) ).toBeInTheDocument();
			} );

			expect( mockOnSubmit ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'task title fallbacks', () => {
		it( 'uses task.title when rendered is not available', async () => {
			const plainTitleTask = {
				...mockTask,
				title: 'Plain Title',
			};

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ plainTitleTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			expect( screen.getByText( 'Plain Title' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'task ID fallbacks', () => {
		it( 'uses task.slug for popover ID', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ mockTask }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'Test' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( submitSiteSettings ).toHaveBeenCalledWith(
					expect.objectContaining( {
						popoverId: 'prpl-popover-core-blogdescription',
					} )
				);
			} );
		} );

		it( 'falls back to task.id when slug not available', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( { description: '' } );

			const {
				submitSiteSettings,
			} = require( '../../../hooks/usePopoverForms' );

			const taskWithoutSlug = {
				id: 'fallback-id',
				title: 'Test Task',
			};

			await act( async () => {
				render(
					<BlogDescriptionPopover
						task={ taskWithoutSlug }
						onSubmit={ mockOnSubmit }
						onClose={ mockOnClose }
					/>
				);
			} );

			const input = screen.getByRole( 'textbox', {
				name: /blog description/i,
			} );
			fireEvent.change( input, { target: { value: 'Test' } } );

			const button = screen.getByRole( 'button', { name: /save/i } );

			await act( async () => {
				fireEvent.click( button );
			} );

			await waitFor( () => {
				expect( submitSiteSettings ).toHaveBeenCalledWith(
					expect.objectContaining( {
						popoverId: 'prpl-popover-fallback-id',
					} )
				);
			} );
		} );
	} );
} );
