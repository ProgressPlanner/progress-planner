/**
 * Tests for BadgeProgressBar Component
 */

import { render, screen } from '@testing-library/react';
import BadgeProgressBar from '../index';

// Mock the Badge component
jest.mock( '../../Badge', () => ( { badgeId, badgeName } ) => (
	<img data-testid="badge" alt={ badgeName } data-badge-id={ badgeId } />
) );

describe( 'BadgeProgressBar', () => {
	const defaultProps = {
		badgeId: 'monthly-2025-m01',
		badgeName: 'January 2025',
	};

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			render( <BadgeProgressBar { ...defaultProps } /> );

			expect( screen.getByTestId( 'badge' ) ).toBeInTheDocument();
		} );

		it( 'renders badge with correct props', () => {
			render( <BadgeProgressBar { ...defaultProps } /> );

			const badge = screen.getByTestId( 'badge' );
			expect( badge ).toHaveAttribute(
				'data-badge-id',
				'monthly-2025-m01'
			);
			expect( badge ).toHaveAttribute( 'alt', 'January 2025' );
		} );

		it( 'renders points display', () => {
			render( <BadgeProgressBar { ...defaultProps } points={ 5 } /> );

			expect( screen.getByText( '5pt' ) ).toBeInTheDocument();
		} );

		it( 'uses default points of 0', () => {
			render( <BadgeProgressBar { ...defaultProps } /> );

			expect( screen.getByText( '0pt' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'progress calculation', () => {
		it( 'calculates 50% progress for 5/10 points', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 5 }
					maxPoints={ 10 }
				/>
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			expect( progressBar.style.width ).toBe( '50%' );
		} );

		it( 'calculates 100% progress for 10/10 points', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 10 }
					maxPoints={ 10 }
				/>
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			expect( progressBar.style.width ).toBe( '100%' );
		} );

		it( 'calculates 0% progress for 0/10 points', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 0 }
					maxPoints={ 10 }
				/>
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			expect( progressBar.style.width ).toBe( '0%' );
		} );

		it( 'handles maxPoints of 0 gracefully', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 5 }
					maxPoints={ 0 }
				/>
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			expect( progressBar.style.width ).toBe( '0%' );
		} );

		it( 'handles points exceeding maxPoints', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 15 }
					maxPoints={ 10 }
				/>
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			expect( progressBar.style.width ).toBe( '150%' );
		} );
	} );

	describe( 'complete state', () => {
		it( 'adds complete class when points equals maxPoints', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 10 }
					maxPoints={ 10 }
				/>
			);

			expect(
				container.querySelector( '.prpl-badge-progress-bar--complete' )
			).toBeInTheDocument();
		} );

		it( 'adds complete class when points exceeds maxPoints', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 12 }
					maxPoints={ 10 }
				/>
			);

			expect(
				container.querySelector( '.prpl-badge-progress-bar--complete' )
			).toBeInTheDocument();
		} );

		it( 'does not add complete class when points less than maxPoints', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 9 }
					maxPoints={ 10 }
				/>
			);

			expect(
				container.querySelector( '.prpl-badge-progress-bar--complete' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'alert indicator', () => {
		it( 'shows alert indicator when not complete', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 5 }
					maxPoints={ 10 }
				/>
			);

			const alert = container.querySelector(
				'.prpl-badge-progress-bar__alert'
			);
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( '!' );
		} );

		it( 'hides alert indicator when complete', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 10 }
					maxPoints={ 10 }
				/>
			);

			const alert = container.querySelector(
				'.prpl-badge-progress-bar__alert'
			);
			expect( alert ).not.toBeInTheDocument();
		} );
	} );

	describe( 'remaining points display', () => {
		it( 'shows remaining text when accumulatedRemaining > 0', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					accumulatedRemaining={ 5 }
					daysRemaining={ 10 }
				/>
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			expect( remainingText ).toBeInTheDocument();
		} );

		it( 'hides remaining text when accumulatedRemaining is 0', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					accumulatedRemaining={ 0 }
					daysRemaining={ 10 }
				/>
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			expect( remainingText ).not.toBeInTheDocument();
		} );

		it( 'uses singular form for 1 day remaining', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					accumulatedRemaining={ 5 }
					daysRemaining={ 1 }
				/>
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			// The _n mock returns singular form for count=1
			expect( remainingText.innerHTML ).toContain( 'day left' );
		} );

		it( 'uses plural form for multiple days remaining', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					accumulatedRemaining={ 5 }
					daysRemaining={ 5 }
				/>
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			expect( remainingText.innerHTML ).toContain( 'days left' );
		} );

		it( 'displays remaining points text element', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					accumulatedRemaining={ 7 }
					daysRemaining={ 3 }
				/>
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			// Check that the remaining text element exists and has content
			expect( remainingText ).toBeInTheDocument();
			expect( remainingText.innerHTML ).toContain( 'more points to go' );
		} );
	} );

	describe( 'badge wrapper positioning', () => {
		it( 'positions badge based on progress percentage', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 5 }
					maxPoints={ 10 }
				/>
			);

			const badgeWrapper = container.querySelector(
				'.prpl-badge-progress-bar__badge-wrapper'
			);
			expect( badgeWrapper.style.left ).toBe( 'calc(50% - 3.75rem)' );
		} );

		it( 'positions badge at start for 0 progress', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 0 }
					maxPoints={ 10 }
				/>
			);

			const badgeWrapper = container.querySelector(
				'.prpl-badge-progress-bar__badge-wrapper'
			);
			expect( badgeWrapper.style.left ).toBe( 'calc(0% - 3.75rem)' );
		} );

		it( 'positions badge at end for 100% progress', () => {
			const { container } = render(
				<BadgeProgressBar
					{ ...defaultProps }
					points={ 10 }
					maxPoints={ 10 }
				/>
			);

			const badgeWrapper = container.querySelector(
				'.prpl-badge-progress-bar__badge-wrapper'
			);
			expect( badgeWrapper.style.left ).toBe( 'calc(100% - 3.75rem)' );
		} );
	} );

	describe( 'default props', () => {
		it( 'uses default maxPoints of 10', () => {
			const { container } = render(
				<BadgeProgressBar { ...defaultProps } points={ 5 } />
			);

			const progressBar = container.querySelector(
				'.prpl-badge-progress-bar__progress'
			);
			// 5/10 = 50%
			expect( progressBar.style.width ).toBe( '50%' );
		} );

		it( 'uses default accumulatedRemaining of 0', () => {
			const { container } = render(
				<BadgeProgressBar { ...defaultProps } />
			);

			const remainingText = container.querySelector(
				'.prpl-previous-month-badge-progress-bar-remaining'
			);
			expect( remainingText ).not.toBeInTheDocument();
		} );
	} );
} );
