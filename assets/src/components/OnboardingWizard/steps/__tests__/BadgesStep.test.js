/**
 * Tests for BadgesStep Component
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

// Mock OnboardingStep component
jest.mock( '../../OnboardingStep', () => ( props ) => (
	<div data-testid="onboarding-step">
		<button onClick={ props.onNext } data-testid="next-button">
			{ props.buttonText }
		</button>
		{ props.children }
	</div>
) );

// Import after mocks
import BadgesStep from '../BadgesStep';

describe( 'BadgesStep', () => {
	const defaultProps = {
		wizardState: {
			data: {
				firstTaskCompleted: false,
			},
		},
		updateState: jest.fn(),
		config: {},
		onNext: jest.fn(),
		onBack: jest.fn(),
		stepData: {
			id: 'onboarding-step-badges',
			data: {
				badgeId: 'monthly-2024-m12',
				badgeName: 'December Badge',
				maxPoints: 10,
				currentValue: 0,
				brandingId: 'progress-planner',
			},
		},
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders onboarding step wrapper', () => {
			render( <BadgesStep { ...defaultProps } /> );

			expect(
				screen.getByTestId( 'onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders congratulations heading', () => {
			render( <BadgesStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Whoohoo, nice one!/ )
			).toBeInTheDocument();
		} );

		it( 'renders badge explanation text', () => {
			render( <BadgesStep { ...defaultProps } /> );

			expect(
				screen.getByText( /Gather ten points this month/ )
			).toBeInTheDocument();
		} );

		it( 'renders encouragement text', () => {
			render( <BadgesStep { ...defaultProps } /> );

			expect(
				screen.getByText( /off to a great start/ )
			).toBeInTheDocument();
		} );

		it( 'renders monthly badge label', () => {
			render( <BadgesStep { ...defaultProps } /> );

			expect( screen.getByText( 'Monthly badge' ) ).toBeInTheDocument();
		} );

		it( 'renders next button with Got it text', () => {
			render( <BadgesStep { ...defaultProps } /> );

			const button = screen.getByTestId( 'next-button' );
			expect( button ).toHaveTextContent( 'Got it' );
		} );
	} );

	describe( 'gauge component', () => {
		it( 'renders gauge wrapper', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-gauge-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'renders gauge element when badge data available', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			expect(
				container.querySelector( 'prpl-gauge' )
			).toBeInTheDocument();
		} );

		it( 'does not render gauge when no badgeId', () => {
			const propsWithoutBadge = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-badges',
					data: {},
				},
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutBadge } />
			);

			expect(
				container.querySelector( 'prpl-gauge' )
			).not.toBeInTheDocument();
		} );

		it( 'does not render gauge when no badgeName', () => {
			const propsWithoutName = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-badges',
					data: {
						badgeId: 'monthly-2024-m12',
					},
				},
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutName } />
			);

			expect(
				container.querySelector( 'prpl-gauge' )
			).not.toBeInTheDocument();
		} );

		it( 'sets correct gauge attributes', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			const gauge = container.querySelector( 'prpl-gauge' );
			expect( gauge ).toHaveAttribute( 'id', 'prpl-gauge-onboarding' );
			expect( gauge ).toHaveAttribute( 'data-max', '10' );
			expect( gauge ).toHaveAttribute( 'data-value', '0' );
			expect( gauge ).toHaveAttribute(
				'data-badge-id',
				'monthly-2024-m12'
			);
			expect( gauge ).toHaveAttribute(
				'data-badge-name',
				'December Badge'
			);
		} );

		it( 'uses default maxPoints when not provided', () => {
			const propsWithoutMax = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-badges',
					data: {
						badgeId: 'test-badge',
						badgeName: 'Test Badge',
					},
				},
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutMax } />
			);

			const gauge = container.querySelector( 'prpl-gauge' );
			expect( gauge ).toHaveAttribute( 'data-max', '10' );
		} );

		it( 'uses default currentValue when not provided', () => {
			const propsWithoutValue = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-badges',
					data: {
						badgeId: 'test-badge',
						badgeName: 'Test Badge',
					},
				},
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutValue } />
			);

			const gauge = container.querySelector( 'prpl-gauge' );
			expect( gauge ).toHaveAttribute( 'data-value', '0' );
		} );
	} );

	describe( 'layout', () => {
		it( 'renders tour content container', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			expect(
				container.querySelector( '.tour-content' )
			).toBeInTheDocument();
		} );

		it( 'renders columns wrapper', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-columns-wrapper-flex' )
			).toBeInTheDocument();
		} );

		it( 'renders background content', () => {
			const { container } = render( <BadgesStep { ...defaultProps } /> );

			expect(
				container.querySelector( '.prpl-background-content' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'step data handling', () => {
		it( 'handles missing stepData', () => {
			const propsWithoutStepData = {
				...defaultProps,
				stepData: null,
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutStepData } />
			);

			// Should still render without gauge
			expect( screen.getByText( 'Monthly badge' ) ).toBeInTheDocument();
			expect(
				container.querySelector( 'prpl-gauge' )
			).not.toBeInTheDocument();
		} );

		it( 'handles missing stepData.data', () => {
			const propsWithoutData = {
				...defaultProps,
				stepData: {
					id: 'onboarding-step-badges',
				},
			};

			const { container } = render(
				<BadgesStep { ...propsWithoutData } />
			);

			expect( screen.getByText( 'Monthly badge' ) ).toBeInTheDocument();
			expect(
				container.querySelector( 'prpl-gauge' )
			).not.toBeInTheDocument();
		} );
	} );
} );
