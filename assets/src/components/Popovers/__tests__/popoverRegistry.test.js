/**
 * Tests for popoverRegistry
 */

import { POPOVER_REGISTRY, getPopoverComponent } from '../popoverRegistry';

describe( 'popoverRegistry', () => {
	describe( 'POPOVER_REGISTRY', () => {
		it( 'is an object', () => {
			expect( typeof POPOVER_REGISTRY ).toBe( 'object' );
		} );

		it( 'has entries', () => {
			expect( Object.keys( POPOVER_REGISTRY ).length ).toBeGreaterThan(
				0
			);
		} );

		it( 'maps core-blogdescription', () => {
			expect( POPOVER_REGISTRY[ 'core-blogdescription' ] ).toBeDefined();
		} );

		it( 'maps set-date-format', () => {
			expect( POPOVER_REGISTRY[ 'set-date-format' ] ).toBeDefined();
		} );

		it( 'maps select-timezone', () => {
			expect( POPOVER_REGISTRY[ 'select-timezone' ] ).toBeDefined();
		} );

		it( 'maps core-permalink-structure', () => {
			expect(
				POPOVER_REGISTRY[ 'core-permalink-structure' ]
			).toBeDefined();
		} );

		it( 'maps core-siteicon', () => {
			expect( POPOVER_REGISTRY[ 'core-siteicon' ] ).toBeDefined();
		} );

		it( 'maps select-locale', () => {
			expect( POPOVER_REGISTRY[ 'select-locale' ] ).toBeDefined();
		} );

		it( 'maps disable-comments', () => {
			expect( POPOVER_REGISTRY[ 'disable-comments' ] ).toBeDefined();
		} );

		it( 'maps yoast-author-archive', () => {
			expect( POPOVER_REGISTRY[ 'yoast-author-archive' ] ).toBeDefined();
		} );

		it( 'maps aioseo-author-archive', () => {
			expect( POPOVER_REGISTRY[ 'aioseo-author-archive' ] ).toBeDefined();
		} );

		it( 'maps rename-uncategorized-category to CustomPopover', () => {
			expect(
				POPOVER_REGISTRY[ 'rename-uncategorized-category' ]
			).toBeDefined();
		} );

		it( 'maps hello-world to CustomPopover', () => {
			expect( POPOVER_REGISTRY[ 'hello-world' ] ).toBeDefined();
		} );

		it( 'maps badge-streak', () => {
			expect( POPOVER_REGISTRY[ 'badge-streak' ] ).toBeDefined();
		} );

		it( 'maps subscribe-form', () => {
			expect( POPOVER_REGISTRY[ 'subscribe-form' ] ).toBeDefined();
		} );

		it( 'maps upgrade-tasks', () => {
			expect( POPOVER_REGISTRY[ 'upgrade-tasks' ] ).toBeDefined();
		} );
	} );

	describe( 'getPopoverComponent', () => {
		it( 'returns component for existing task ID', () => {
			const component = getPopoverComponent( 'core-blogdescription' );
			expect( component ).toBeDefined();
			expect( component ).not.toBeNull();
		} );

		it( 'returns null for unknown task ID', () => {
			const component = getPopoverComponent( 'unknown-task-id' );
			expect( component ).toBeNull();
		} );

		it( 'returns null for empty string', () => {
			const component = getPopoverComponent( '' );
			expect( component ).toBeNull();
		} );

		it( 'returns null for undefined', () => {
			const component = getPopoverComponent( undefined );
			expect( component ).toBeNull();
		} );

		it( 'returns same component for tasks sharing popover', () => {
			// disable-comments, disable-comment-pagination, search-engine-visibility share DisableCommentsPopover
			const component1 = getPopoverComponent( 'disable-comments' );
			const component2 = getPopoverComponent(
				'disable-comment-pagination'
			);
			const component3 = getPopoverComponent(
				'search-engine-visibility'
			);

			expect( component1 ).toBe( component2 );
			expect( component2 ).toBe( component3 );
		} );

		it( 'returns same component for yoast tasks', () => {
			const component1 = getPopoverComponent( 'yoast-author-archive' );
			const component2 = getPopoverComponent( 'yoast-date-archive' );
			const component3 = getPopoverComponent( 'yoast-format-archive' );

			expect( component1 ).toBe( component2 );
			expect( component2 ).toBe( component3 );
		} );

		it( 'returns same component for aioseo tasks', () => {
			const component1 = getPopoverComponent( 'aioseo-author-archive' );
			const component2 = getPopoverComponent( 'aioseo-date-archive' );
			const component3 = getPopoverComponent( 'aioseo-media-pages' );

			expect( component1 ).toBe( component2 );
			expect( component2 ).toBe( component3 );
		} );

		it( 'returns same component for custom popover tasks', () => {
			const component1 = getPopoverComponent(
				'rename-uncategorized-category'
			);
			const component2 = getPopoverComponent( 'hello-world' );
			const component3 = getPopoverComponent( 'sample-page' );

			expect( component1 ).toBe( component2 );
			expect( component2 ).toBe( component3 );
		} );
	} );
} );
