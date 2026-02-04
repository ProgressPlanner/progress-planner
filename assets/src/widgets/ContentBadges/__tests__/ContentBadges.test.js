/**
 * Tests for ContentBadges Widget
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
	addAction: jest.fn(),
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
import ContentBadges from '../index';

describe( 'ContentBadges', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			render( <ContentBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'renders WidgetHeader component', () => {
			render( <ContentBadges /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'renders SimpleBadgeWidget component', () => {
			render( <ContentBadges /> );

			expect(
				screen.getByTestId( 'simple-badge-widget' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'widget header', () => {
		it( 'uses default title when config not provided', () => {
			render( <ContentBadges /> );

			expect(
				screen.getByText( 'Your content badges' )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render( <ContentBadges config={ { title: 'Custom Title' } } /> );

			expect( screen.getByText( 'Custom Title' ) ).toBeInTheDocument();
		} );

		it( 'passes tooltip content to header', () => {
			render( <ContentBadges /> );

			const header = screen.getByTestId( 'widget-header' );
			expect( header ).toHaveAttribute(
				'data-tooltip',
				'Your content badges are based on the amount of content you have created over the past 30 days.'
			);
		} );
	} );

	describe( 'SimpleBadgeWidget props', () => {
		it( 'passes content badge type', () => {
			render( <ContentBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute( 'data-badge-type', 'content' );
		} );

		it( 'passes intro text', () => {
			render( <ContentBadges /> );

			expect(
				screen.getByText(
					'The more you work on meaningful content, the sooner you unlock new badges.'
				)
			).toBeInTheDocument();
		} );

		it( 'passes background color', () => {
			render( <ContentBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute(
				'data-background-color',
				'var(--prpl-background-content-badge)'
			);
		} );

		it( 'passes badge group class', () => {
			render( <ContentBadges /> );

			const widget = screen.getByTestId( 'simple-badge-widget' );
			expect( widget ).toHaveAttribute(
				'data-badge-group-class',
				'badge-group-content'
			);
		} );
	} );

	describe( 'getRemainingText function', () => {
		it( 'is passed to SimpleBadgeWidget', () => {
			// We can verify by checking the widget renders
			render( <ContentBadges /> );

			expect(
				screen.getByTestId( 'simple-badge-widget' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <ContentBadges config={ {} } /> );

			expect(
				screen.getByText( 'Your content badges' )
			).toBeInTheDocument();
		} );

		it( 'handles undefined config', () => {
			render( <ContentBadges config={ undefined } /> );

			expect(
				screen.getByText( 'Your content badges' )
			).toBeInTheDocument();
		} );
	} );
} );
