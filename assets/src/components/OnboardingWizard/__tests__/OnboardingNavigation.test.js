/**
 * Tests for OnboardingNavigation Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingNavigation from '../OnboardingNavigation';

describe( 'OnboardingNavigation', () => {
	const mockSteps = [
		{ id: 'step-1', title: 'Welcome' },
		{ id: 'step-2', title: 'Setup' },
		{ id: 'step-3', title: 'Finish' },
	];

	const mockOnStepClick = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			expect(
				container.querySelector( '.prpl-onboarding-navigation' )
			).toBeInTheDocument();
		} );

		it( 'renders step list', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			expect(
				container.querySelector( '.prpl-step-list' )
			).toBeInTheDocument();
		} );

		it( 'renders all step items', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const items = container.querySelectorAll( '.prpl-nav-step-item' );
			expect( items ).toHaveLength( 3 );
		} );

		it( 'renders step titles', () => {
			render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			// Titles appear in both mobile label and step list, use getAllByText
			expect( screen.getAllByText( 'Welcome' ).length ).toBeGreaterThan(
				0
			);
			expect( screen.getAllByText( 'Setup' ).length ).toBeGreaterThan(
				0
			);
			expect( screen.getAllByText( 'Finish' ).length ).toBeGreaterThan(
				0
			);
		} );
	} );

	describe( 'step numbers', () => {
		it( 'shows step numbers for upcoming steps', () => {
			render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			expect( screen.getByText( '1' ) ).toBeInTheDocument();
			expect( screen.getByText( '2' ) ).toBeInTheDocument();
			expect( screen.getByText( '3' ) ).toBeInTheDocument();
		} );

		it( 'shows checkmark for completed steps', () => {
			render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 2 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			// Steps 1 and 2 (indices 0, 1) are completed
			const stepIcons = screen.getAllByText( '✓' );
			expect( stepIcons ).toHaveLength( 2 );
		} );
	} );

	describe( 'active step', () => {
		it( 'marks current step as active', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 1 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const items = container.querySelectorAll( '.prpl-nav-step-item' );
			expect( items[ 1 ] ).toHaveClass( 'prpl-active' );
		} );

		it( 'marks completed steps', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 2 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const items = container.querySelectorAll( '.prpl-nav-step-item' );
			expect( items[ 0 ] ).toHaveClass( 'prpl-completed' );
			expect( items[ 1 ] ).toHaveClass( 'prpl-completed' );
			expect( items[ 2 ] ).not.toHaveClass( 'prpl-completed' );
		} );
	} );

	describe( 'mobile step label', () => {
		it( 'shows current step title in mobile label', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 1 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const mobileLabel = container.querySelector(
				'#prpl-onboarding-mobile-step-label'
			);
			expect( mobileLabel ).toHaveTextContent( 'Setup' );
		} );
	} );

	describe( 'step click handling', () => {
		it( 'calls onStepClick when step is clicked', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const buttons = container.querySelectorAll(
				'.prpl-nav-step-button'
			);
			fireEvent.click( buttons[ 1 ] );

			expect( mockOnStepClick ).toHaveBeenCalledWith( 1 );
		} );

		it( 'calls onStepClick on keyboard Enter', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const buttons = container.querySelectorAll(
				'.prpl-nav-step-button'
			);
			fireEvent.keyDown( buttons[ 2 ], { key: 'Enter' } );

			expect( mockOnStepClick ).toHaveBeenCalledWith( 2 );
		} );

		it( 'calls onStepClick on keyboard Space', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const buttons = container.querySelectorAll(
				'.prpl-nav-step-button'
			);
			fireEvent.keyDown( buttons[ 0 ], { key: ' ' } );

			expect( mockOnStepClick ).toHaveBeenCalledWith( 0 );
		} );

		it( 'renders without buttons when onStepClick is null', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ null }
					logoHtml=""
				/>
			);

			const buttons = container.querySelectorAll(
				'.prpl-nav-step-button'
			);
			expect( buttons ).toHaveLength( 0 );
		} );
	} );

	describe( 'logo', () => {
		it( 'renders logo container', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			expect(
				container.querySelector( '.prpl-onboarding-logo' )
			).toBeInTheDocument();
		} );

		it( 'renders logo HTML', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml="<img src='logo.png' alt='Logo' />"
				/>
			);

			const logoContainer = container.querySelector(
				'.prpl-onboarding-logo'
			);
			expect( logoContainer.querySelector( 'img' ) ).toBeInTheDocument();
		} );

		it( 'handles empty logoHtml', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const logoContainer = container.querySelector(
				'.prpl-onboarding-logo'
			);
			expect( logoContainer ).toBeInTheDocument();
			expect( logoContainer.innerHTML ).toBe( '' );
		} );
	} );

	describe( 'data attributes', () => {
		it( 'sets data-step attribute on items', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ mockSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const items = container.querySelectorAll( '.prpl-nav-step-item' );
			expect( items[ 0 ] ).toHaveAttribute( 'data-step', '0' );
			expect( items[ 1 ] ).toHaveAttribute( 'data-step', '1' );
			expect( items[ 2 ] ).toHaveAttribute( 'data-step', '2' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty steps array', () => {
			const { container } = render(
				<OnboardingNavigation
					steps={ [] }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			const items = container.querySelectorAll( '.prpl-nav-step-item' );
			expect( items ).toHaveLength( 0 );
		} );

		it( 'handles single step', () => {
			render(
				<OnboardingNavigation
					steps={ [ { id: 'only', title: 'Only Step' } ] }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			// Title appears in both mobile label and step list
			expect( screen.getAllByText( 'Only Step' ).length ).toBeGreaterThan(
				0
			);
		} );

		it( 'handles step title with special characters', () => {
			const specialSteps = [
				{ id: 'special', title: "Step's <Name> & More" },
			];

			render(
				<OnboardingNavigation
					steps={ specialSteps }
					currentStep={ 0 }
					onStepClick={ mockOnStepClick }
					logoHtml=""
				/>
			);

			// Title appears in both mobile label and step list
			expect(
				screen.getAllByText( "Step's <Name> & More" ).length
			).toBeGreaterThan( 0 );
		} );
	} );
} );
