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

	/**
	 * Helper: advance one sub-step by checking the "I don't have a page" checkbox
	 * then clicking Save setting.
	 */
	const advanceSubStep = async () => {
		// Check the "I don't have a ..." checkbox to enable the Save button
		const checkbox = screen.getByRole( 'checkbox' );
		fireEvent.click( checkbox );

		const saveBtn = screen.getByRole( 'button', {
			name: /Save setting/,
		} );
		await act( async () => {
			fireEvent.click( saveBtn );
		} );
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
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			// SUB_STEPS has 5 items, so progress is "1/5"
			const progressSpan = container.querySelector(
				'.prpl-settings-progress'
			);
			expect( progressSpan ).toBeInTheDocument();
			expect( progressSpan ).toHaveTextContent( '1/5' );
		} );

		it( 'renders save button', () => {
			render( <SettingsStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: /Save setting/ } )
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

			await advanceSubStep();

			expect(
				container.querySelector( '[data-page="about"]' )
			).toBeInTheDocument();
		} );

		it( 'updates progress indicator', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			await advanceSubStep();

			const progressSpan = container.querySelector(
				'.prpl-settings-progress'
			);
			expect( progressSpan ).toHaveTextContent( '2/5' );
		} );

		it( 'advances through all page sub-steps', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			// SUB_STEPS: homepage, about, contact, faq, post-types
			const pageTypes = [ 'homepage', 'about', 'contact', 'faq' ];

			for ( let index = 0; index < pageTypes.length; index++ ) {
				expect(
					container.querySelector(
						`[data-page="${ pageTypes[ index ] }"]`
					)
				).toBeInTheDocument();

				if ( index < pageTypes.length - 1 ) {
					await advanceSubStep();
				}
			}
		} );
	} );

	describe( 'post-types sub-step', () => {
		it( 'renders post types sub-step', async () => {
			const { container } = render(
				<SettingsStep { ...defaultProps } />
			);

			// Navigate through 4 page sub-steps to reach post-types
			for ( let i = 0; i < 4; i++ ) {
				await advanceSubStep();
			}

			expect(
				container.querySelector( '[data-page="post-types"]' )
			).toBeInTheDocument();
		} );

		it( 'renders post type toggle switches', async () => {
			render( <SettingsStep { ...defaultProps } /> );

			// Navigate through 4 page sub-steps to reach post-types
			for ( let i = 0; i < 4; i++ ) {
				await advanceSubStep();
			}

			// ToggleSwitch renders labels with post type titles
			expect( screen.getByText( 'Posts' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Pages' ) ).toBeInTheDocument();
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
