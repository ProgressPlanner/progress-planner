/**
 * Tests for useTaskProvider Hook
 */

import { renderHook } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';
import { useTaskProvider } from '../index';

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'useTaskProvider', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'initial state', () => {
		it( 'returns fetchDataCollector function', () => {
			const { result } = renderHook( () => useTaskProvider() );

			expect( typeof result.current.fetchDataCollector ).toBe(
				'function'
			);
		} );

		it( 'returns createTaskPost function', () => {
			const { result } = renderHook( () => useTaskProvider() );

			expect( typeof result.current.createTaskPost ).toBe( 'function' );
		} );
	} );

	describe( 'fetchDataCollector', () => {
		it( 'fetches data from correct endpoint', async () => {
			apiFetch.mockResolvedValue( { data: { key: 'value' } } );

			const { result } = renderHook( () => useTaskProvider() );

			const data =
				await result.current.fetchDataCollector( 'my-collector' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/data-collectors/my-collector',
			} );
			expect( data ).toEqual( { key: 'value' } );
		} );

		it( 'returns response.data property', async () => {
			apiFetch.mockResolvedValue( {
				data: { count: 42, items: [ 'a', 'b' ] },
				meta: { status: 'ok' },
			} );

			const { result } = renderHook( () => useTaskProvider() );

			const data = await result.current.fetchDataCollector( 'test' );

			expect( data ).toEqual( { count: 42, items: [ 'a', 'b' ] } );
		} );

		it( 'throws error on API failure', async () => {
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );
			apiFetch.mockRejectedValue( new Error( 'Network error' ) );

			const { result } = renderHook( () => useTaskProvider() );

			await expect(
				result.current.fetchDataCollector( 'broken' )
			).rejects.toThrow( 'Network error' );

			expect( errorSpy ).toHaveBeenCalledWith(
				'Error fetching data collector "broken":',
				expect.any( Error )
			);

			errorSpy.mockRestore();
		} );

		it( 'handles different collector IDs', async () => {
			apiFetch.mockResolvedValue( { data: {} } );

			const { result } = renderHook( () => useTaskProvider() );

			await result.current.fetchDataCollector( 'collector-one' );
			await result.current.fetchDataCollector( 'collector-two' );

			expect( apiFetch ).toHaveBeenNthCalledWith( 1, {
				path: '/progress-planner/v1/data-collectors/collector-one',
			} );
			expect( apiFetch ).toHaveBeenNthCalledWith( 2, {
				path: '/progress-planner/v1/data-collectors/collector-two',
			} );
		} );
	} );

	describe( 'createTaskPost', () => {
		it( 'posts to correct endpoint', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			const { result } = renderHook( () => useTaskProvider() );

			const taskDetails = { id: 'task-1', title: 'My Task' };
			await result.current.createTaskPost( taskDetails );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/tasks/evaluate',
				method: 'POST',
				data: {
					task_details: taskDetails,
				},
			} );
		} );

		it( 'returns full response', async () => {
			const mockResponse = {
				success: true,
				task_id: 123,
				points_awarded: 10,
			};
			apiFetch.mockResolvedValue( mockResponse );

			const { result } = renderHook( () => useTaskProvider() );

			const response = await result.current.createTaskPost( {} );

			expect( response ).toEqual( mockResponse );
		} );

		it( 'throws error on API failure', async () => {
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );
			apiFetch.mockRejectedValue( new Error( 'Server error' ) );

			const { result } = renderHook( () => useTaskProvider() );

			await expect(
				result.current.createTaskPost( { id: 'test' } )
			).rejects.toThrow( 'Server error' );

			expect( errorSpy ).toHaveBeenCalledWith(
				'Error creating task post:',
				expect.any( Error )
			);

			errorSpy.mockRestore();
		} );

		it( 'sends complex task details', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			const { result } = renderHook( () => useTaskProvider() );

			const complexDetails = {
				id: 'complex-task',
				title: 'Complex Task',
				metadata: {
					priority: 'high',
					tags: [ 'urgent', 'review' ],
				},
				settings: {
					enabled: true,
					value: 42,
				},
			};

			await result.current.createTaskPost( complexDetails );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: {
						task_details: complexDetails,
					},
				} )
			);
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable fetchDataCollector reference', () => {
			const { result, rerender } = renderHook( () => useTaskProvider() );

			const firstFunc = result.current.fetchDataCollector;
			rerender();
			const secondFunc = result.current.fetchDataCollector;

			expect( firstFunc ).toBe( secondFunc );
		} );

		it( 'returns stable createTaskPost reference', () => {
			const { result, rerender } = renderHook( () => useTaskProvider() );

			const firstFunc = result.current.createTaskPost;
			rerender();
			const secondFunc = result.current.createTaskPost;

			expect( firstFunc ).toBe( secondFunc );
		} );
	} );
} );
