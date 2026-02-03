/**
 * Tests for QuitConfirmation Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuitConfirmation from '../QuitConfirmation';

describe( 'QuitConfirmation', () => {
	const mockOnConfirm = jest.fn();
	const mockOnCancel = jest.fn();
	const mockConfig = {
		l10n: {
			brandingName: 'Progress Planner',
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-quit-confirmation' )
			).toBeInTheDocument();
		} );

		it( 'renders title', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				screen.getByText( 'Are you sure you want to quit?' )
			).toBeInTheDocument();
		} );

		it( 'renders description with branding name', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				screen.getByText( /Progress Planner/ )
			).toBeInTheDocument();
		} );

		it( 'renders both action buttons', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				screen.getByRole( 'button', { name: /yes, quit/i } )
			).toBeInTheDocument();
			expect(
				screen.getByRole( 'button', { name: /no, let's finish/i } )
			).toBeInTheDocument();
		} );

		it( 'renders error icon', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-error-icon' )
			).toBeInTheDocument();
		} );

		it( 'renders SVG in error icon', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-error-icon svg' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'button actions', () => {
		it( 'calls onConfirm when quit button clicked', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const quitButton = screen.getByRole( 'button', {
				name: /yes, quit/i,
			} );
			fireEvent.click( quitButton );

			expect( mockOnConfirm ).toHaveBeenCalled();
		} );

		it( 'calls onCancel when cancel button clicked', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const cancelButton = screen.getByRole( 'button', {
				name: /no, let's finish/i,
			} );
			fireEvent.click( cancelButton );

			expect( mockOnCancel ).toHaveBeenCalled();
		} );

		it( 'prevents default on button clicks', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const quitButton = screen.getByRole( 'button', {
				name: /yes, quit/i,
			} );
			const cancelButton = screen.getByRole( 'button', {
				name: /no, let's finish/i,
			} );

			// Events should be handled without throwing
			fireEvent.click( quitButton );
			fireEvent.click( cancelButton );

			expect( mockOnConfirm ).toHaveBeenCalled();
			expect( mockOnCancel ).toHaveBeenCalled();
		} );
	} );

	describe( 'branding name', () => {
		it( 'uses custom branding name from config', () => {
			const customConfig = {
				l10n: {
					brandingName: 'My Custom Brand',
				},
			};

			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ customConfig }
				/>
			);

			expect( screen.getByText( /My Custom Brand/ ) ).toBeInTheDocument();
		} );

		it( 'uses default branding name when not in config', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ {} }
				/>
			);

			expect(
				screen.getByText( /Progress Planner/ )
			).toBeInTheDocument();
		} );

		it( 'uses default branding name when config is undefined', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ undefined }
				/>
			);

			expect(
				screen.getByText( /Progress Planner/ )
			).toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has error box class', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-error-box' )
			).toBeInTheDocument();
		} );

		it( 'has quit actions wrapper', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-quit-actions' )
			).toBeInTheDocument();
		} );

		it( 'quit button has correct class', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect( container.querySelector( '#prpl-quit-yes' ) ).toHaveClass(
				'prpl-quit-link'
			);
		} );

		it( 'cancel button has primary class', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect( container.querySelector( '#prpl-quit-no' ) ).toHaveClass(
				'prpl-quit-link-primary'
			);
		} );

		it( 'has columns wrapper', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'layout', () => {
		it( 'renders two columns', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const columns = container.querySelectorAll( '.prpl-column' );
			expect( columns ).toHaveLength( 2 );
		} );

		it( 'second column is hidden on mobile', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const columns = container.querySelectorAll( '.prpl-column' );
			expect( columns[ 1 ] ).toHaveClass( 'prpl-hide-on-mobile' );
		} );

		it( 'has graphic placeholder in second column', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '#prpl-quit-confirmation-graphic' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'accessibility', () => {
		it( 'has title with id for aria-labelledby', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '#prpl-quit-confirmation-title' )
			).toBeInTheDocument();
		} );

		it( 'quit button has type button', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '#prpl-quit-yes' )
			).toHaveAttribute( 'type', 'button' );
		} );

		it( 'cancel button has type button', () => {
			const { container } = render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			expect(
				container.querySelector( '#prpl-quit-no' )
			).toHaveAttribute( 'type', 'button' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles onConfirm not being a function', () => {
			render(
				<QuitConfirmation
					onConfirm={ null }
					onCancel={ mockOnCancel }
					config={ mockConfig }
				/>
			);

			const quitButton = screen.getByRole( 'button', {
				name: /yes, quit/i,
			} );

			// Should not throw
			expect( () => fireEvent.click( quitButton ) ).not.toThrow();
		} );

		it( 'handles onCancel not being a function', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ null }
					config={ mockConfig }
				/>
			);

			const cancelButton = screen.getByRole( 'button', {
				name: /no, let's finish/i,
			} );

			// Should not throw
			expect( () => fireEvent.click( cancelButton ) ).not.toThrow();
		} );

		it( 'handles empty l10n object', () => {
			render(
				<QuitConfirmation
					onConfirm={ mockOnConfirm }
					onCancel={ mockOnCancel }
					config={ { l10n: {} } }
				/>
			);

			expect(
				screen.getByText( /Progress Planner/ )
			).toBeInTheDocument();
		} );
	} );
} );
