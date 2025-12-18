/**
 * Tests for Task ID Resolver Utility
 */

import { resolveTaskId } from '../index';

describe( 'taskIdResolver', () => {
	describe( 'resolveTaskId', () => {
		it( 'returns null when both task and popoverId are null', () => {
			expect( resolveTaskId( null, null ) ).toBeNull();
		} );

		it( 'returns null when task is undefined and popoverId is undefined', () => {
			expect( resolveTaskId( undefined, undefined ) ).toBeNull();
		} );

		it( 'returns task.slug when available', () => {
			const task = { slug: 'my-task-slug' };
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'my-task-slug' );
		} );

		it( 'returns task.prpl_provider.slug as second priority', () => {
			const task = { prpl_provider: { slug: 'provider-task-slug' } };
			expect( resolveTaskId( task, 'fallback' ) ).toBe(
				'provider-task-slug'
			);
		} );

		it( 'prefers task.slug over task.prpl_provider.slug', () => {
			const task = {
				slug: 'direct-slug',
				prpl_provider: { slug: 'provider-slug' },
			};
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'direct-slug' );
		} );

		it( 'returns popoverId as fallback when task has no slug', () => {
			const task = { id: 123, title: 'Some task' };
			expect( resolveTaskId( task, 'fallback-id' ) ).toBe(
				'fallback-id'
			);
		} );

		it( 'returns popoverId when task is null', () => {
			expect( resolveTaskId( null, 'popover-fallback' ) ).toBe(
				'popover-fallback'
			);
		} );

		it( 'returns popoverId when task is empty object', () => {
			expect( resolveTaskId( {}, 'empty-task-fallback' ) ).toBe(
				'empty-task-fallback'
			);
		} );

		it( 'returns null when task has no slug and popoverId is null', () => {
			const task = { id: 123 };
			expect( resolveTaskId( task, null ) ).toBeNull();
		} );

		it( 'handles task with null slug property', () => {
			const task = { slug: null };
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'fallback' );
		} );

		it( 'handles task with empty string slug', () => {
			const task = { slug: '' };
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'fallback' );
		} );

		it( 'handles nested prpl_provider with null slug', () => {
			const task = { prpl_provider: { slug: null } };
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'fallback' );
		} );

		it( 'handles prpl_provider as null', () => {
			const task = { prpl_provider: null };
			expect( resolveTaskId( task, 'fallback' ) ).toBe( 'fallback' );
		} );
	} );
} );
