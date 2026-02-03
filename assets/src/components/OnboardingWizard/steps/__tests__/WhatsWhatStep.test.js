/**
 * Tests for WhatsWhatStep Component
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock OnboardingStep component
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">{ props.children }</div>
) );

// Import after mocks
import WhatsWhatStep from '../WhatsWhatStep';

describe( 'WhatsWhatStep', () => {
	const defaultProps = {
		wizardState: { data: {} },
		updateState: jest.fn(),
		config: {},
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: { id: 'onboarding-step-whats-what' },
	};

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders recommendations heading', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'heading', { name: 'Recommendations' } )
			).toBeInTheDocument();
		} );

		it( 'renders badges heading', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByRole( 'heading', { name: 'Badges' } )
			).toBeInTheDocument();
		} );

		it( 'renders recommendations description', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Tasks that show you what to work on next/ )
			).toBeInTheDocument();
		} );

		it( 'renders badges description', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByText( /You earn points for every completed task/ )
			).toBeInTheDocument();
		} );

		it( 'renders points badge indicator', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect( screen.getByText( '+1' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render(
				<WhatsWhatStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper', () => {
			const { container } = render(
				<WhatsWhatStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'renders two columns', () => {
			const { container } = render(
				<WhatsWhatStep { ...defaultProps } />
			);

			expect( container.querySelectorAll( '.prpl-column' ) ).toHaveLength(
				2
			);
		} );

		it( 'renders background content sections', () => {
			const { container } = render(
				<WhatsWhatStep { ...defaultProps } />
			);

			expect(
				container.querySelectorAll( '.prpl-background-content' )
			).toHaveLength( 2 );
		} );

		it( 'renders points badge with correct class', () => {
			const { container } = render(
				<WhatsWhatStep { ...defaultProps } />
			);

			expect(
				container.querySelector( '.prpl-suggested-task-points' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'text content', () => {
		it( 'renders step-by-step improvement text', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByText( /help you improve your site step by step/ )
			).toBeInTheDocument();
		} );

		it( 'renders motivation text', () => {
			render( <WhatsWhatStep { ...defaultProps } /> );

			expect(
				screen.getByText(
					/keeps things fun and helps you stay motivated/
				)
			).toBeInTheDocument();
		} );
	} );
} );
