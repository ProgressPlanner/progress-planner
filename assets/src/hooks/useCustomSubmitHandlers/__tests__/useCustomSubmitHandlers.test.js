/**
 * Tests for useCustomSubmitHandlers Hook
 */

import { renderHook } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';
import { useCustomSubmitHandlers } from '../index';
import { deletePost } from '../../usePopoverForms';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

// Mock usePopoverForms
jest.mock( '../../usePopoverForms', () => ( {
	deletePost: jest.fn(),
} ) );

describe( 'useCustomSubmitHandlers', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		deletePost.mockResolvedValue( { deleted: true } );
		apiFetch.mockResolvedValue( { deleted: true } );

		// Reset window globals
		delete window.helloWorldData;
		delete window.samplePageData;
		delete window.removeTermsWithoutPostsData;
	} );

	describe( 'basic behavior', () => {
		it( 'returns a function', () => {
			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			expect( typeof result.current ).toBe( 'function' );
		} );

		it( 'returns success:false when no taskId provided', async () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			const response = await result.current( null );

			expect( response ).toEqual( { success: false } );
			expect( warnSpy ).toHaveBeenCalledWith(
				'useCustomSubmitHandlers: No taskId provided'
			);

			warnSpy.mockRestore();
		} );

		it( 'returns success:true for unknown task IDs', async () => {
			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			const response = await result.current( 'unknown-task' );

			expect( response ).toEqual( { success: true } );
		} );
	} );

	describe( 'hello-world handler', () => {
		it( 'deletes post from task data', async () => {
			const task = {
				prpl_task_data: { postId: 123 },
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			const response = await result.current( 'hello-world' );

			expect( deletePost ).toHaveBeenCalledWith( 123, 'posts' );
			expect( response ).toEqual( { success: true } );
		} );

		it( 'uses task.postId fallback', async () => {
			const task = {
				postId: 456,
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			await result.current( 'hello-world' );

			expect( deletePost ).toHaveBeenCalledWith( 456, 'posts' );
		} );

		it( 'uses window fallback', async () => {
			window.helloWorldData = { postId: 789 };

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			await result.current( 'hello-world' );

			expect( deletePost ).toHaveBeenCalledWith( 789, 'posts' );
		} );

		it( 'returns success without deleting when no postId', async () => {
			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			const response = await result.current( 'hello-world' );

			expect( deletePost ).not.toHaveBeenCalled();
			expect( response ).toEqual( { success: true } );
		} );
	} );

	describe( 'sample-page handler', () => {
		it( 'deletes page from task data', async () => {
			const task = {
				prpl_task_data: { pageId: 100 },
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			const response = await result.current( 'sample-page' );

			expect( deletePost ).toHaveBeenCalledWith( 100, 'pages' );
			expect( response ).toEqual( { success: true } );
		} );

		it( 'uses task.pageId fallback', async () => {
			const task = {
				pageId: 200,
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			await result.current( 'sample-page' );

			expect( deletePost ).toHaveBeenCalledWith( 200, 'pages' );
		} );

		it( 'uses window fallback', async () => {
			window.samplePageData = { postId: 300 };

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			await result.current( 'sample-page' );

			expect( deletePost ).toHaveBeenCalledWith( 300, 'pages' );
		} );
	} );

	describe( 'remove-terms-without-posts handler', () => {
		it( 'deletes terms from task data', async () => {
			const task = {
				prpl_task_data: {
					termIds: [ 1, 2, 3 ],
					taxonomy: 'category',
				},
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			const response = await result.current(
				'remove-terms-without-posts'
			);

			expect( apiFetch ).toHaveBeenCalledTimes( 3 );
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/categories/1?force=true',
				method: 'DELETE',
			} );
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/categories/2?force=true',
				method: 'DELETE',
			} );
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/categories/3?force=true',
				method: 'DELETE',
			} );
			expect( response ).toEqual( { success: true } );
		} );

		it( 'uses custom taxonomy endpoint', async () => {
			const task = {
				prpl_task_data: {
					termIds: [ 10 ],
					taxonomy: 'post_tag',
				},
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			await result.current( 'remove-terms-without-posts' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/post_tag/10?force=true',
				method: 'DELETE',
			} );
		} );

		it( 'returns success for empty termIds', async () => {
			const task = {
				prpl_task_data: {
					termIds: [],
				},
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			const response = await result.current(
				'remove-terms-without-posts'
			);

			expect( apiFetch ).not.toHaveBeenCalled();
			expect( response ).toEqual( { success: true } );
		} );

		it( 'uses window fallback', async () => {
			window.removeTermsWithoutPostsData = {
				termIds: [ 5 ],
				taxonomy: 'category',
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( null )
			);

			await result.current( 'remove-terms-without-posts' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/categories/5?force=true',
				method: 'DELETE',
			} );
		} );

		it( 'defaults taxonomy to category', async () => {
			const task = {
				termIds: [ 7 ],
			};

			const { result } = renderHook( () =>
				useCustomSubmitHandlers( task )
			);

			await result.current( 'remove-terms-without-posts' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/categories/7?force=true',
				method: 'DELETE',
			} );
		} );
	} );

	describe( 'passthrough handlers', () => {
		const passthroughTasks = [
			'rename-uncategorized-category',
			'core-siteicon',
			'yoast-organization-logo',
			'update-term-description',
		];

		it.each( passthroughTasks )(
			'returns success for %s',
			async ( taskId ) => {
				const { result } = renderHook( () =>
					useCustomSubmitHandlers( null )
				);

				const response = await result.current( taskId );

				expect( response ).toEqual( { success: true } );
			}
		);
	} );
} );
