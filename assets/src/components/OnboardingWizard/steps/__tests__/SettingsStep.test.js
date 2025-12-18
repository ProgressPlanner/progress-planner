/**
 * Tests for SettingsStep Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg ) => {
			result = result.replace( '%s', arg );
		} );
		return result;
	},
} ) );

// Mock ajaxRequest
jest.mock( '../../../../utils/ajaxRequest', () => ( {
	ajaxRequest: jest.fn().mockResolvedValue( {} ),
} ) );

// Mock OnboardingStep component
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">{ props.children }</div>
) );

// Import after mocks
import SettingsStep from '../SettingsStep';

describe( 'SettingsStep', () => {
	const mockPages = [
		{ id: 1, title: 'Home' },
		{ id: 2, title: 'About Us' },
		{ id: 3, title: 'Contact' },
	];

	const mockPostTypes = [
		{ id: 'post', title: 'Posts' },
		{ id: 'page', title: 'Pages' },
	];

	const mockPageTypes = {
		homepage: {
			title: 'Homepage',
			description: 'Select your homepage',
		},
		about: {
			title: 'About Page',
			description: 'Select your about page',
		},
	};

	const defaultConfig = {
		ajaxUrl: '/wp-admin/admin-ajax.php',
		nonce: 'test-nonce',
		pages: mockPages,
		postTypes: mockPostTypes,
		pageTypes: mockPageTypes,
	};

	const defaultProps = {
		wizardState: {
			data: {},
		},
		updateState: jest.fn(),
		config: defaultConfig,
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: { id: 'onboarding-step-settings' },
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders homepage sub-step first', () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '[data-page="homepage"]' )
			).toBeInTheDocument();
		} );

		it( 'renders settings title', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect( screen.getByText( /Settings:/ ) ).toBeInTheDocument();
		} );

		it( 'renders progress indicator', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect( screen.getByText( /1\/6/ ) ).toBeInTheDocument();
		} );

		it( 'renders save button', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: /Save & Continue/ } )
			).toBeInTheDocument();
		} );
	} );

	describe( 'page selection sub-steps', () => {
		it( 'renders page select dropdown', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect( screen.getByRole( 'combobox' ) ).toBeInTheDocument();
		} );

		it( 'renders page options from config', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'option', { name: 'Home' } )
			).toBeInTheDocument();
			expect(
				screen.getByRole( 'option', { name: 'About Us' } )
			).toBeInTheDocument();
			expect(
				screen.getByRole( 'option', { name: 'Contact' } )
			).toBeInTheDocument();
		} );

		it( 'renders default select option', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'option', { name: /Select page/ } )
			).toBeInTheDocument();
		} );

		it( 'renders no page checkbox', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect( screen.getByRole( 'checkbox' ) ).toBeInTheDocument();
		} );

		it( 'renders description from pageTypes', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByText( 'Select your homepage' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'sub-step navigation', () => {
		it( 'advances to about sub-step', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			const saveBtn = screen.getByRole( 'button', {
				name: /Save & Continue/,
			} );
			await act( async () => {
				fireEvent.click( saveBtn );
			} );

			expect(
				container.querySelector( '[data-page="about"]' )
			).toBeInTheDocument();
		} );

		it( 'updates progress indicator', async () => {
			render( <SettingsStep { ...defaultProps } /> );

			const saveBtn = screen.getByRole( 'button', {
				name: /Save & Continue/,
			} );
			await act( async () => {
				fireEvent.click( saveBtn );
			} );

			expect( screen.getByText( /2\/6/ ) ).toBeInTheDocument();
		} );

		it( 'advances through all page sub-steps', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			const pageTypes = [ 'homepage', 'about', 'contact', 'faq' ];

			for ( let index = 0; index < pageTypes.length; index++ ) {
				expect(
					container.querySelector(
						`[data-page="${ pageTypes[ index ] }"]`
					)
				).toBeInTheDocument();

				if ( index < pageTypes.length - 1 ) {
					const saveBtn = screen.getByRole( 'button', {
						name: /Save & Continue/,
					} );
					await act( async () => {
						fireEvent.click( saveBtn );
					} );
				}
			}
		} );
	} );

	describe( 'post-types sub-step', () => {
		it( 'renders post types heading', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			// Navigate to post-types (5th sub-step)
			for ( let i = 0; i < 4; i++ ) {
				const saveBtn = screen.getByRole( 'button', {
					name: /Save & Continue/,
				} );
				await act( async () => {
					fireEvent.click( saveBtn );
				} );
			}

			expect(
				container.querySelector( '[data-page="post-types"]' )
			).toBeInTheDocument();
		} );

		it( 'renders post type checkboxes', async () => {
			render( <SettingsStep { ...defaultProps } /> );

			// Navigate to post-types
			for ( let i = 0; i < 4; i++ ) {
				const saveBtn = screen.getByRole( 'button', {
					name: /Save & Continue/,
				} );
				await act( async () => {
					fireEvent.click( saveBtn );
				} );
			}

			expect( screen.getByLabelText( 'Posts' ) ).toBeInTheDocument();
			expect( screen.getByLabelText( 'Pages' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'login-destination sub-step', () => {
		it( 'renders login destination checkbox', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			// Navigate to login-destination (6th sub-step)
			for ( let i = 0; i < 5; i++ ) {
				const saveBtn = screen.getByRole( 'button', {
					name: /Save & Continue/,
				} );
				await act( async () => {
					fireEvent.click( saveBtn );
				} );
			}

			expect(
				container.querySelector( '[data-page="login-destination"]' )
			).toBeInTheDocument();
		} );

		it( 'renders redirect checkbox', async () => {
			render( <SettingsStep { ...defaultProps } /> );

			// Navigate to login-destination
			for ( let i = 0; i < 5; i++ ) {
				const saveBtn = screen.getByRole( 'button', {
					name: /Save & Continue/,
				} );
				await act( async () => {
					fireEvent.click( saveBtn );
				} );
			}

			expect(
				screen.getByLabelText( /Redirect to Progress Planner/ )
			).toBeInTheDocument();
		} );

		it( 'hides save button on last sub-step', async () => {
			render( <SettingsStep { ...defaultProps } /> );

			// Navigate to login-destination
			for ( let i = 0; i < 5; i++ ) {
				const saveBtn = screen.getByRole( 'button', {
					name: /Save & Continue/,
				} );
				await act( async () => {
					fireEvent.click( saveBtn );
				} );
			}

			expect(
				screen.queryByRole( 'button', { name: /Save & Continue/ } )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'state management', () => {
		it( 'calls updateState when settings change', () => {
			const updateState = jest.fn();

			render(
				<SettingsStep { ...defaultProps } updateState={ updateState } />
			);

			const select = screen.getByRole( 'combobox' );
			fireEvent.change( select, { target: { value: '1' } } );

			expect( updateState ).toHaveBeenCalled();
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders setting item container', () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-setting-item' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper', () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );
	} );
} );
