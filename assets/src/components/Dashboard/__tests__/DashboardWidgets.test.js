/**
 * Tests for DashboardWidgets Component
 */

import { render, screen, act } from '@testing-library/react';
import DashboardWidgets from '../DashboardWidgets';

// Mock WordPress hooks
jest.mock( '@wordpress/hooks', () => ( {
	addAction: jest.fn(),
} ) );

// Mock widgetRegistry
jest.mock( '../../../utils/widgetRegistry', () => ( {
	getRegisteredWidgets: jest.fn( () => [] ),
} ) );

// Mock ErrorBoundary
jest.mock( '../../ErrorBoundary', () => ( { children, widgetName } ) => (
	<div data-testid={ `error-boundary-${ widgetName }` }>{ children }</div>
) );

describe( 'DashboardWidgets', () => {
	const { addAction } = require( '@wordpress/hooks' );
	const { getRegisteredWidgets } = require( '../../../utils/widgetRegistry' );

	beforeEach( () => {
		jest.clearAllMocks();
		getRegisteredWidgets.mockReturnValue( [] );
	} );

	describe( 'basic rendering', () => {
		it( 'renders without crashing', () => {
			const { container } = render( <DashboardWidgets /> );

			expect( container ).toBeInTheDocument();
		} );

		it( 'renders empty when no widgets registered', () => {
			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-widget-wrapper' )
			).not.toBeInTheDocument();
		} );

		it( 'calls getRegisteredWidgets on mount', () => {
			render( <DashboardWidgets /> );

			expect( getRegisteredWidgets ).toHaveBeenCalled();
		} );

		it( 'registers action listener on mount', () => {
			render( <DashboardWidgets /> );

			expect( addAction ).toHaveBeenCalledWith(
				'prpl.dashboard.registerWidget',
				'progress-planner/dashboard-widgets',
				expect.any( Function )
			);
		} );
	} );

	describe( 'widget rendering', () => {
		it( 'renders registered widgets', () => {
			const MockWidget = () => <div>Mock Widget Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'test-widget',
					title: 'Test Widget',
					component: MockWidget,
				},
			] );

			render( <DashboardWidgets /> );

			expect(
				screen.getByText( 'Mock Widget Content' )
			).toBeInTheDocument();
		} );

		it( 'renders multiple widgets', () => {
			const MockWidget1 = () => <div>Widget 1</div>;
			const MockWidget2 = () => <div>Widget 2</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'widget-1',
					title: 'Widget 1',
					component: MockWidget1,
				},
				{
					id: 'widget-2',
					title: 'Widget 2',
					component: MockWidget2,
				},
			] );

			render( <DashboardWidgets /> );

			expect( screen.getByText( 'Widget 1' ) ).toBeInTheDocument();
			expect( screen.getByText( 'Widget 2' ) ).toBeInTheDocument();
		} );

		it( 'does not render widget without component', () => {
			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'empty-widget',
					title: 'Empty Widget',
					component: null,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-empty-widget' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'widget wrapper', () => {
		it( 'creates wrapper with widget ID class', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'my-widget',
					title: 'My Widget',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-my-widget' )
			).toBeInTheDocument();
		} );

		it( 'applies width class from widget config', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'wide-widget',
					title: 'Wide Widget',
					component: MockWidget,
					width: 2,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-widget-width-2' )
			).toBeInTheDocument();
		} );

		it( 'defaults to width 1', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'default-widget',
					title: 'Default Widget',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-widget-width-1' )
			).toBeInTheDocument();
		} );

		it( 'has prpl-widget-wrapper class', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'test-widget',
					title: 'Test Widget',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.prpl-widget-wrapper' )
			).toBeInTheDocument();
		} );

		it( 'has inner container', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'test-widget',
					title: 'Test Widget',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			expect(
				container.querySelector( '.widget-inner-container' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'force last column', () => {
		it( 'sets data-force-last-column attribute to 1 when true', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'last-col-widget',
					title: 'Last Column Widget',
					component: MockWidget,
					forceLastColumn: true,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector( '.prpl-widget-wrapper' );
			expect( wrapper ).toHaveAttribute( 'data-force-last-column', '1' );
		} );

		it( 'sets data-force-last-column attribute to 0 when false', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'normal-widget',
					title: 'Normal Widget',
					component: MockWidget,
					forceLastColumn: false,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector( '.prpl-widget-wrapper' );
			expect( wrapper ).toHaveAttribute( 'data-force-last-column', '0' );
		} );

		it( 'defaults to 0 when not specified', () => {
			const MockWidget = () => <div>Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'default-widget',
					title: 'Default Widget',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector( '.prpl-widget-wrapper' );
			expect( wrapper ).toHaveAttribute( 'data-force-last-column', '0' );
		} );
	} );

	describe( 'error boundary', () => {
		it( 'wraps widgets in ErrorBoundary', () => {
			const MockWidget = () => <div>Widget Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'bounded-widget',
					title: 'Bounded Widget',
					component: MockWidget,
				},
			] );

			render( <DashboardWidgets /> );

			expect(
				screen.getByTestId( 'error-boundary-Bounded Widget' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'widget config passed to component', () => {
		it( 'passes title in config', () => {
			const MockWidget = ( { config } ) => (
				<div data-testid="widget-title">{ config.title }</div>
			);

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'config-widget',
					title: 'Config Widget Title',
					component: MockWidget,
				},
			] );

			render( <DashboardWidgets /> );

			expect( screen.getByTestId( 'widget-title' ) ).toHaveTextContent(
				'Config Widget Title'
			);
		} );

		it( 'passes infoIconSvg in config', () => {
			const MockWidget = ( { config } ) => (
				<div data-testid="widget-icon">
					{ config.infoIconSvg ? 'Has Icon' : 'No Icon' }
				</div>
			);

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'icon-widget',
					title: 'Icon Widget',
					component: MockWidget,
					infoIconSvg: '<svg></svg>',
				},
			] );

			render( <DashboardWidgets /> );

			expect( screen.getByTestId( 'widget-icon' ) ).toHaveTextContent(
				'Has Icon'
			);
		} );
	} );

	describe( 'special widget styles', () => {
		it( 'applies special styles for todo widget', () => {
			const MockWidget = () => <div>Todo Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'todo',
					title: 'Todo',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector( '.prpl-todo' );
			expect( wrapper.style.paddingLeft ).toBe( '0px' );
		} );

		it( 'applies flex styles for badge-streak widget', () => {
			const MockWidget = () => <div>Badge Streak Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'badge-streak',
					title: 'Badge Streak',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector( '.prpl-badge-streak' );
			expect( wrapper.style.display ).toBe( 'flex' );
			expect( wrapper.style.flexDirection ).toBe( 'column' );
		} );

		it( 'applies flex styles for badge-streak-content widget', () => {
			const MockWidget = () => <div>Badge Streak Content</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'badge-streak-content',
					title: 'Badge Streak Content',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector(
				'.prpl-badge-streak-content'
			);
			expect( wrapper.style.display ).toBe( 'flex' );
		} );

		it( 'applies flex styles for badge-streak-maintenance widget', () => {
			const MockWidget = () => <div>Badge Streak Maintenance</div>;

			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'badge-streak-maintenance',
					title: 'Badge Streak Maintenance',
					component: MockWidget,
				},
			] );

			const { container } = render( <DashboardWidgets /> );

			const wrapper = container.querySelector(
				'.prpl-badge-streak-maintenance'
			);
			expect( wrapper.style.display ).toBe( 'flex' );
		} );
	} );

	describe( 'widget registration listener', () => {
		it( 'updates widgets when registration action is triggered', async () => {
			const MockWidget1 = () => <div>Widget 1</div>;
			const MockWidget2 = () => <div>Widget 2</div>;

			// Initial state with one widget
			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'widget-1',
					title: 'Widget 1',
					component: MockWidget1,
				},
			] );

			render( <DashboardWidgets /> );

			expect( screen.getByText( 'Widget 1' ) ).toBeInTheDocument();

			// Simulate widget registration by updating the mock
			getRegisteredWidgets.mockReturnValue( [
				{
					id: 'widget-1',
					title: 'Widget 1',
					component: MockWidget1,
				},
				{
					id: 'widget-2',
					title: 'Widget 2',
					component: MockWidget2,
				},
			] );

			// Get the action callback and call it inside act()
			const actionCallback = addAction.mock.calls[ 0 ][ 2 ];
			await act( async () => {
				actionCallback();
			} );

			expect( screen.getByText( 'Widget 2' ) ).toBeInTheDocument();
		} );
	} );
} );
