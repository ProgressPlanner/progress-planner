/**
 * Tests for DashboardHeader Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHeader from '../DashboardHeader';

// Mock WordPress i18n
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

describe( 'DashboardHeader', () => {
	const mockConfig = {
		licenseKey: 'valid-license',
		branding: {
			logoHtml: '<img src="logo.png" alt="Logo" />',
			tourIconHtml: '<svg class="tour-icon"></svg>',
			registerIconHtml: '<svg class="register-icon"></svg>',
		},
		rangeOptions: [
			{ value: '-1 month', label: 'Last month' },
			{ value: '-3 months', label: 'Last 3 months' },
			{ value: '-6 months', label: 'Last 6 months' },
		],
		frequencyOptions: [
			{ value: 'daily', label: 'Daily' },
			{ value: 'weekly', label: 'Weekly' },
			{ value: 'monthly', label: 'Monthly' },
		],
		currentRange: '-6 months',
		currentFrequency: 'monthly',
	};

	// Store original location
	const originalLocation = window.location;

	beforeEach( () => {
		jest.clearAllMocks();

		// Mock window.location
		delete window.location;
		window.location = {
			href: 'http://localhost/wp-admin/admin.php?page=progress-planner',
		};

		// Mock wp.hooks
		window.wp = {
			hooks: {
				doAction: jest.fn(),
			},
		};
	} );

	afterEach( () => {
		window.location = originalLocation;
		delete window.wp;
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '.prpl-header' )
			).toBeInTheDocument();
		} );

		it( 'renders logo container', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '.prpl-header-logo' )
			).toBeInTheDocument();
		} );

		it( 'renders logo HTML when provided', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const logoContainer =
				container.querySelector( '.prpl-header-logo' );
			expect( logoContainer.querySelector( 'img' ) ).toBeInTheDocument();
		} );

		it( 'renders header right section', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '.prpl-header-right' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'tour button', () => {
		it( 'renders tour button', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '#prpl-start-tour-icon-button' )
			).toBeInTheDocument();
		} );

		it( 'tour button has correct type', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const button = container.querySelector(
				'#prpl-start-tour-icon-button'
			);
			expect( button ).toHaveAttribute( 'type', 'button' );
		} );

		it( 'tour button has prpl-info-icon class', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const button = container.querySelector(
				'#prpl-start-tour-icon-button'
			);
			expect( button ).toHaveClass( 'prpl-info-icon' );
		} );

		it( 'renders tour icon HTML when provided', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const button = container.querySelector(
				'#prpl-start-tour-icon-button'
			);
			expect( button.querySelector( '.tour-icon' ) ).toBeInTheDocument();
		} );

		it( 'renders screen reader text for tour button', () => {
			render( <DashboardHeader config={ mockConfig } /> );

			expect( screen.getByText( 'Start tour' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'subscribe button', () => {
		it( 'does not render subscribe button when license is valid', () => {
			render( <DashboardHeader config={ mockConfig } /> );

			expect( screen.queryByText( 'Subscribe' ) ).not.toBeInTheDocument();
		} );

		it( 'renders subscribe button when licenseKey is no-license', () => {
			const configNoLicense = {
				...mockConfig,
				licenseKey: 'no-license',
			};

			render( <DashboardHeader config={ configNoLicense } /> );

			expect( screen.getByText( 'Subscribe' ) ).toBeInTheDocument();
		} );

		it( 'renders register icon when licenseKey is no-license', () => {
			const configNoLicense = {
				...mockConfig,
				licenseKey: 'no-license',
			};

			const { container } = render(
				<DashboardHeader config={ configNoLicense } />
			);

			expect(
				container.querySelector( '.register-icon' )
			).toBeInTheDocument();
		} );

		it( 'calls wp.hooks.doAction when subscribe button clicked', () => {
			const configNoLicense = {
				...mockConfig,
				licenseKey: 'no-license',
			};

			render( <DashboardHeader config={ configNoLicense } /> );

			const subscribeButton = screen
				.getByText( 'Subscribe' )
				.closest( 'button' );
			fireEvent.click( subscribeButton );

			expect( window.wp.hooks.doAction ).toHaveBeenCalledWith(
				'prpl.popover.open',
				'subscribe-form',
				expect.objectContaining( {
					id: 'subscribe-form',
					slug: 'subscribe-form',
				} )
			);
		} );

		it( 'uses fallback showPopover when wp.hooks not available', () => {
			const configNoLicense = {
				...mockConfig,
				licenseKey: 'no-license',
			};

			// Remove wp.hooks
			delete window.wp;

			// Create mock popover element
			const mockPopover = document.createElement( 'div' );
			mockPopover.id = 'prpl-popover-subscribe-form';
			mockPopover.showPopover = jest.fn();
			document.body.appendChild( mockPopover );

			render( <DashboardHeader config={ configNoLicense } /> );

			const subscribeButton = screen
				.getByText( 'Subscribe' )
				.closest( 'button' );
			fireEvent.click( subscribeButton );

			expect( mockPopover.showPopover ).toHaveBeenCalled();

			// Cleanup
			document.body.removeChild( mockPopover );
		} );
	} );

	describe( 'range selector', () => {
		it( 'renders range select', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '#prpl-select-range' )
			).toBeInTheDocument();
		} );

		it( 'renders range options', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-range' );
			const options = select.querySelectorAll( 'option' );

			expect( options ).toHaveLength( 3 );
		} );

		it( 'has correct initial value from config', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-range' );
			expect( select.value ).toBe( '-6 months' );
		} );

		it( 'updates URL on range change', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-range' );
			fireEvent.change( select, { target: { value: '-1 month' } } );

			expect( window.location.href ).toContain( 'range=-1+month' );
		} );

		it( 'has accessible label', () => {
			render( <DashboardHeader config={ mockConfig } /> );

			expect(
				screen.getByLabelText( 'Select range:' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'frequency selector', () => {
		it( 'renders frequency select', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '#prpl-select-frequency' )
			).toBeInTheDocument();
		} );

		it( 'renders frequency options', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-frequency' );
			const options = select.querySelectorAll( 'option' );

			expect( options ).toHaveLength( 3 );
		} );

		it( 'has correct initial value from config', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-frequency' );
			expect( select.value ).toBe( 'monthly' );
		} );

		it( 'updates URL on frequency change', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const select = container.querySelector( '#prpl-select-frequency' );
			fireEvent.change( select, { target: { value: 'weekly' } } );

			expect( window.location.href ).toContain( 'frequency=weekly' );
		} );

		it( 'has accessible label', () => {
			render( <DashboardHeader config={ mockConfig } /> );

			expect(
				screen.getByLabelText( 'Select frequency:' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'default values', () => {
		it( 'uses default range when currentRange not in config', () => {
			const configWithoutRange = {
				...mockConfig,
				currentRange: undefined,
			};

			const { container } = render(
				<DashboardHeader config={ configWithoutRange } />
			);

			const select = container.querySelector( '#prpl-select-range' );
			expect( select.value ).toBe( '-6 months' );
		} );

		it( 'uses default frequency when currentFrequency not in config', () => {
			const configWithoutFrequency = {
				...mockConfig,
				currentFrequency: undefined,
			};

			const { container } = render(
				<DashboardHeader config={ configWithoutFrequency } />
			);

			const select = container.querySelector( '#prpl-select-frequency' );
			expect( select.value ).toBe( 'monthly' );
		} );

		it( 'handles empty rangeOptions', () => {
			const configEmptyOptions = {
				...mockConfig,
				rangeOptions: [],
			};

			const { container } = render(
				<DashboardHeader config={ configEmptyOptions } />
			);

			const select = container.querySelector( '#prpl-select-range' );
			expect( select.querySelectorAll( 'option' ) ).toHaveLength( 0 );
		} );

		it( 'handles empty frequencyOptions', () => {
			const configEmptyOptions = {
				...mockConfig,
				frequencyOptions: [],
			};

			const { container } = render(
				<DashboardHeader config={ configEmptyOptions } />
			);

			const select = container.querySelector( '#prpl-select-frequency' );
			expect( select.querySelectorAll( 'option' ) ).toHaveLength( 0 );
		} );

		it( 'handles missing branding object', () => {
			const configNoBranding = {
				...mockConfig,
				branding: undefined,
			};

			const { container } = render(
				<DashboardHeader config={ configNoBranding } />
			);

			expect(
				container.querySelector( '.prpl-header' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'logo rendering', () => {
		it( 'does not render logo when logoHtml is empty', () => {
			const configNoLogo = {
				...mockConfig,
				branding: {
					...mockConfig.branding,
					logoHtml: '',
				},
			};

			const { container } = render(
				<DashboardHeader config={ configNoLogo } />
			);

			const logoContainer =
				container.querySelector( '.prpl-header-logo' );
			expect( logoContainer.innerHTML ).toBe( '' );
		} );

		it( 'does not render logo when logoHtml is null', () => {
			const configNoLogo = {
				...mockConfig,
				branding: {
					...mockConfig.branding,
					logoHtml: null,
				},
			};

			const { container } = render(
				<DashboardHeader config={ configNoLogo } />
			);

			const logoContainer =
				container.querySelector( '.prpl-header-logo' );
			expect( logoContainer.innerHTML ).toBe( '' );
		} );
	} );

	describe( 'tour icon rendering', () => {
		it( 'does not render tour icon when tourIconHtml is empty', () => {
			const configNoTourIcon = {
				...mockConfig,
				branding: {
					...mockConfig.branding,
					tourIconHtml: '',
				},
			};

			const { container } = render(
				<DashboardHeader config={ configNoTourIcon } />
			);

			const tourButton = container.querySelector(
				'#prpl-start-tour-icon-button'
			);
			expect(
				tourButton.querySelector( '.tour-icon' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has prpl-header-select-range wrapper', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			expect(
				container.querySelector( '.prpl-header-select-range' )
			).toBeInTheDocument();
		} );

		it( 'screen reader labels have correct class', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const srLabels = container.querySelectorAll(
				'.screen-reader-text'
			);
			expect( srLabels.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'inline styles', () => {
		it( 'header has flex display', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const header = container.querySelector( '.prpl-header' );
			expect( header.style.display ).toBe( 'flex' );
		} );

		it( 'header has margin bottom', () => {
			const { container } = render(
				<DashboardHeader config={ mockConfig } />
			);

			const header = container.querySelector( '.prpl-header' );
			expect( header.style.marginBottom ).toBe( '2rem' );
		} );
	} );
} );
