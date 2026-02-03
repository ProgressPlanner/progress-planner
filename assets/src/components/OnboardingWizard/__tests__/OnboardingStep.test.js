/**
 * Tests for OnboardingStep Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingStep from '../OnboardingStep';

describe( 'OnboardingStep', () => {
	const mockWizardState = {
		data: { test: 'value' },
	};

	const mockOnNext = jest.fn();
	const mockOnBack = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Step content</p>
				</OnboardingStep>
			);

			expect(
				container.querySelector( '.onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'renders children content', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Test content inside step</p>
				</OnboardingStep>
			);

			expect(
				screen.getByText( 'Test content inside step' )
			).toBeInTheDocument();
		} );

		it( 'renders tour footer', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				container.querySelector( '.tour-footer' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'next button', () => {
		it( 'renders next button', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				screen.getByRole( 'button', { name: /next/i } )
			).toBeInTheDocument();
		} );

		it( 'calls onNext when clicked', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = screen.getByRole( 'button', { name: /next/i } );
			fireEvent.click( nextButton );

			expect( mockOnNext ).toHaveBeenCalled();
		} );

		it( 'uses custom button text', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					buttonText="Continue"
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				screen.getByRole( 'button', { name: 'Continue' } )
			).toBeInTheDocument();
		} );

		it( 'uses custom button class', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					buttonClass="prpl-btn-success"
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = container.querySelector( '.prpl-tour-next' );
			expect( nextButton ).toHaveClass( 'prpl-btn-success' );
		} );

		it( 'defaults to primary button class', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = container.querySelector( '.prpl-tour-next' );
			expect( nextButton ).toHaveClass( 'prpl-btn-primary' );
		} );
	} );

	describe( 'back button', () => {
		it( 'renders back button when onBack is provided', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					onBack={ mockOnBack }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				screen.getByRole( 'button', { name: /back/i } )
			).toBeInTheDocument();
		} );

		it( 'does not render back button when onBack is null', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					onBack={ null }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				screen.queryByRole( 'button', { name: /back/i } )
			).not.toBeInTheDocument();
		} );

		it( 'calls onBack when back button clicked', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					onBack={ mockOnBack }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const backButton = screen.getByRole( 'button', { name: /back/i } );
			fireEvent.click( backButton );

			expect( mockOnBack ).toHaveBeenCalled();
		} );

		it( 'back button has secondary class', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					onBack={ mockOnBack }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const backButton = container.querySelector( '.prpl-btn-secondary' );
			expect( backButton ).toBeInTheDocument();
		} );
	} );

	describe( 'canProceed', () => {
		it( 'enables next button when canProceed returns true', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ () => true }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = screen.getByRole( 'button', { name: /next/i } );
			expect( nextButton ).not.toBeDisabled();
		} );

		it( 'disables next button when canProceed returns false', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ () => false }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = screen.getByRole( 'button', { name: /next/i } );
			expect( nextButton ).toBeDisabled();
		} );

		it( 'passes wizardState to canProceed', () => {
			const mockCanProceed = jest.fn().mockReturnValue( true );

			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ mockCanProceed }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect( mockCanProceed ).toHaveBeenCalledWith( mockWizardState );
		} );

		it( 'does not call onNext when button is disabled', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ () => false }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = screen.getByRole( 'button', { name: /next/i } );
			fireEvent.click( nextButton );

			expect( mockOnNext ).not.toHaveBeenCalled();
		} );

		it( 'defaults to always allowing proceed', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = screen.getByRole( 'button', { name: /next/i } );
			expect( nextButton ).not.toBeDisabled();
		} );
	} );

	describe( 'disabled button behavior', () => {
		it( 'adds disabled class when canProceed is false', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ () => false }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = container.querySelector( '.prpl-tour-next' );
			expect( nextButton ).toHaveClass( 'prpl-btn-disabled' );
		} );

		it( 'removes disabled class when canProceed becomes true', () => {
			const { rerender, container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					canProceed={ () => false }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			// Re-render with canProceed returning true
			rerender(
				<OnboardingStep
					wizardState={ { data: { updated: true } } }
					onNext={ mockOnNext }
					canProceed={ () => true }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const nextButton = container.querySelector( '.prpl-tour-next' );
			expect( nextButton ).not.toHaveClass( 'prpl-btn-disabled' );
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has prpl-tour-next-wrapper class', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect(
				container.querySelector( '.prpl-tour-next-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'has prpl-btn class on buttons', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					onBack={ mockOnBack }
				>
					<p>Content</p>
				</OnboardingStep>
			);

			const buttons = container.querySelectorAll( '.prpl-btn' );
			expect( buttons ).toHaveLength( 2 );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty children', () => {
			const { container } = render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				/>
			);

			expect(
				container.querySelector( '.onboarding-step' )
			).toBeInTheDocument();
		} );

		it( 'handles multiple children', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
				>
					<h2>Title</h2>
					<p>Paragraph 1</p>
					<p>Paragraph 2</p>
				</OnboardingStep>
			);

			expect( screen.getByText( 'Title' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Paragraph 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Paragraph 2' ) ).toBeInTheDocument();
		} );

		it( 'handles complex button text', () => {
			render(
				<OnboardingStep
					wizardState={ mockWizardState }
					onNext={ mockOnNext }
					buttonText={
						<>
							<span>Get Started</span>
							<span>→</span>
						</>
					}
				>
					<p>Content</p>
				</OnboardingStep>
			);

			expect( screen.getByText( 'Get Started' ) ).toBeInTheDocument();
		} );
	} );
} );
