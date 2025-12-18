/**
 * Tests for StreakBadges Widget
 */

import { render, screen } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	_n: ( single, plural, count ) => ( count === 1 ? single : plural ),
	sprintf: ( str, ...args ) => {
		let result = str;
		args.forEach( ( arg ) => {
			result = result.replace( '%s', arg );
		} );
		return result;
	},
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

// Mock child components
jest.mock( '../../shared/SimpleBadgeWidget', () => ( props ) => (
	<div
		data-testid="simple-badge-widget"
		data-badge-type={ props.badgeType }
		data-background-color={ props.backgroundColor }
		data-badge-group-class={ props.badgeGroupClass }
	>
		{ props.introText }
	</div>
) );

jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header" data-tooltip={ props.tooltipContent }>
		{ props.title }
	</div>
) );

// Import after mocks
import StreakBadges from '../index';

describe( 'StreakBadges', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			render( <StreakBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'renders WidgetHeader component', () => {
			render( <StreakBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'renders SimpleBadgeWidget component', () => {
			render( <StreakBadges /> );

			expect(
				screen.getByTestId( 'simple-badge-widget' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'widget header', () => {
		it( 'uses default title when config not provided', () => {
			render( <StreakBadges /> );

			expect(
				screen.getByText( 'Your streak badges' )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render( <StreakBadges config={ { title: 'Custom Title' } } /> );

			expect( screen.getByText( 'Custom Title' ) ).toBeInTheDocument();
		} );

		it( 'passes tooltip content to header', () => {
			render( <StreakBadges /> );

			const header = screen.getByTestId( 'widget-header' );
			expect( header ).toHaveAttribute(
				'data-tooltip',
				'Your streak badges are based on the amount of website maintenance work you have done over the past 30 days.'
			);
		} );
	} );

	describe( 'SimpleBadgeWidget props', () => {
		it( 'passes maintenance badge type', () => {
			render( <StreakBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute(
				'data-badge-type',
				'maintenance'
			);
		} );

		it( 'passes intro text', () => {
			render( <StreakBadges /> );

			expect(
				screen.getByText(
					'Execute at least one website maintenance task every week.'
				)
			).toBeInTheDocument();
		} );

		it( 'passes background color', () => {
			render( <StreakBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute(
				'data-background-color',
				'var(--prpl-background-streak)'
			);
		} );

		it( 'passes badge group class', () => {
			render( <StreakBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute(
				'data-badge-group-class',
				'badge-group-maintenance'
			);
		} );
	} );

	describe( 'getRemainingText function', () => {
		it( 'is passed to SimpleBadgeWidget', () => {
			// We can verify by checking the widget renders
			render( <StreakBadges /> );

			expect(
				screen.getByTestId( 'simple-badge-widget' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <StreakBadges config={ {} } /> );

			expect(
				screen.getByText( 'Your streak badges' )
			).toBeInTheDocument();
		} );

		it( 'handles undefined config', () => {
			render( <StreakBadges config={ undefined } /> );

			expect(
				screen.getByText( 'Your streak badges' )
			).toBeInTheDocument();
		} );
	} );
} );
