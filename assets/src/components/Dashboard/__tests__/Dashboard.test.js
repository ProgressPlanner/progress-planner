/**
 * Tests for Dashboard Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock dashboardStore
jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => jest.fn() ),
} ) );

// Mock child components
jest.mock( '../DashboardHeader', () => () => (
	<div data-testid="dashboard-header">DashboardHeader</div>
) );

jest.mock( '../DashboardWidgets', () => () => (
	<div data-testid="dashboard-widgets">DashboardWidgets</div>
) );

jest.mock( '../../OnboardingWizard', () => {
	const React = require( 'react' ); // eslint-disable-line import/no-extraneous-dependencies
	return React.forwardRef( ( _props, ref ) => {
		React.useImperativeHandle( ref, () => ( {
			startOnboarding: jest.fn(),
		} ) );
		return <div data-testid="onboarding-wizard">OnboardingWizard</div>;
	} );
} );

// Import after mocks
import Dashboard from '../index';
import { useDashboardStore } from '../../../stores/dashboardStore';

describe( 'Dashboard', () => {
	const mockSetShouldAutoStartWizard = jest.fn();

	const defaultConfig = {
		privacyPolicyAccepted: true,
		baseUrl: '/wp-content/plugins/progress-planner',
	};

	beforeEach( () => {
		jest.clearAllMocks();
		useDashboardStore.mockReturnValue( mockSetShouldAutoStartWizard );
	} );

	describe( 'when privacy policy is accepted', () => {
		it( 'renders dashboard header', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect(
				screen.getByTestId( 'dashboard-header' )
			).toBeInTheDocument();
		} );

		it( 'renders dashboard widgets', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect(
				screen.getByTestId( 'dashboard-widgets' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding wizard', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect(
				screen.getByTestId( 'onboarding-wizard' )
			).toBeInTheDocument();
		} );

		it( 'renders skip to content link', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect(
				screen.getByText( 'Skip to main content' )
			).toBeInTheDocument();
		} );

		it( 'renders screen reader title', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect(
				screen.getByRole( 'heading', { name: 'Progress Planner' } )
			).toBeInTheDocument();
		} );

		it( 'has widgets container with correct ID', () => {
			const { container } = render(
				<Dashboard config={ defaultConfig } />
			);

			expect(
				container.querySelector( '#prpl-main-content' )
			).toBeInTheDocument();
		} );

		it( 'has widgets container with correct class', () => {
			const { container } = render(
				<Dashboard config={ defaultConfig } />
			);

			expect(
				container.querySelector( '.prpl-widgets-container' )
			).toBeInTheDocument();
		} );

		it( 'does not call setShouldAutoStartWizard', () => {
			render( <Dashboard config={ defaultConfig } /> );

			expect( mockSetShouldAutoStartWizard ).not.toHaveBeenCalledWith(
				true
			);
		} );
	} );

	describe( 'when privacy policy is not accepted', () => {
		const configNotAccepted = {
			...defaultConfig,
			privacyPolicyAccepted: false,
		};

		it( 'renders start onboarding button', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			expect(
				screen.getByText( 'Are you ready to work on your site?' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding graphic container', () => {
			const { container } = render(
				<Dashboard config={ configNotAccepted } />
			);

			expect(
				container.querySelector( '.prpl-start-onboarding-container' )
			).toBeInTheDocument();
		} );

		it( 'renders onboarding graphic image', () => {
			const { container } = render(
				<Dashboard config={ configNotAccepted } />
			);

			const img = container.querySelector( 'img' );
			expect( img ).toHaveAttribute(
				'src',
				expect.stringContaining( 'thumbs_up_ravi_rtl.svg' )
			);
		} );

		it( 'does not render dashboard header', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			expect(
				screen.queryByTestId( 'dashboard-header' )
			).not.toBeInTheDocument();
		} );

		it( 'does not render dashboard widgets', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			expect(
				screen.queryByTestId( 'dashboard-widgets' )
			).not.toBeInTheDocument();
		} );

		it( 'renders onboarding wizard', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			expect(
				screen.getByTestId( 'onboarding-wizard' )
			).toBeInTheDocument();
		} );

		it( 'calls setShouldAutoStartWizard with true', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			expect( mockSetShouldAutoStartWizard ).toHaveBeenCalledWith( true );
		} );

		it( 'start button has correct class', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveClass( 'prpl-button-primary' );
		} );

		it( 'start button has correct ID', () => {
			render( <Dashboard config={ configNotAccepted } /> );

			const button = screen.getByRole( 'button' );
			expect( button ).toHaveAttribute(
				'id',
				'prpl-start-onboarding-button'
			);
		} );
	} );

	describe( 'skip link accessibility', () => {
		it( 'skip link has correct href', () => {
			render( <Dashboard config={ defaultConfig } /> );

			const skipLink = screen.getByText( 'Skip to main content' );
			expect( skipLink ).toHaveAttribute( 'href', '#prpl-main-content' );
		} );

		it( 'skip link has screen reader text class', () => {
			render( <Dashboard config={ defaultConfig } /> );

			const skipLink = screen.getByText( 'Skip to main content' );
			expect( skipLink ).toHaveClass( 'screen-reader-text' );
		} );

		it( 'skip link becomes visible on focus', () => {
			render( <Dashboard config={ defaultConfig } /> );

			const skipLink = screen.getByText( 'Skip to main content' );
			fireEvent.focus( skipLink );

			expect( skipLink ).toHaveStyle( { top: '10px' } );
		} );

		it( 'skip link becomes hidden on blur', () => {
			render( <Dashboard config={ defaultConfig } /> );

			const skipLink = screen.getByText( 'Skip to main content' );
			fireEvent.focus( skipLink );
			fireEvent.blur( skipLink );

			expect( skipLink ).toHaveStyle( { top: '-40px' } );
		} );
	} );

	describe( 'config handling', () => {
		it( 'handles missing privacyPolicyAccepted', () => {
			const configWithoutPrivacy = { baseUrl: '/test' };

			render( <Dashboard config={ configWithoutPrivacy } /> );

			// Should default to not accepted
			expect(
				screen.getByText( 'Are you ready to work on your site?' )
			).toBeInTheDocument();
		} );

		it( 'handles empty config', () => {
			render( <Dashboard config={ {} } /> );

			// Should default to not accepted
			expect(
				screen.getByText( 'Are you ready to work on your site?' )
			).toBeInTheDocument();
		} );

		it( 'uses baseUrl for image path', () => {
			const configWithBaseUrl = {
				...defaultConfig,
				privacyPolicyAccepted: false,
				baseUrl: '/custom/path',
			};

			const { container } = render(
				<Dashboard config={ configWithBaseUrl } />
			);

			const img = container.querySelector( 'img' );
			expect( img ).toHaveAttribute(
				'src',
				expect.stringContaining( '/custom/path' )
			);
		} );

		it( 'handles missing baseUrl', () => {
			const configWithoutBaseUrl = {
				privacyPolicyAccepted: false,
			};

			const { container } = render(
				<Dashboard config={ configWithoutBaseUrl } />
			);

			const img = container.querySelector( 'img' );
			expect( img ).toHaveAttribute(
				'src',
				expect.stringContaining( 'thumbs_up_ravi_rtl.svg' )
			);
		} );
	} );
} );
