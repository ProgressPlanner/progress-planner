/**
 * Tests for taskRegistry Service - Lazy Evaluation System
 */

import {
	registerTask,
	evaluateTasksUntil,
	resetEvaluationState,
	getEvaluationProgress,
	hasMoreTasksToEvaluate,
	getTaskProviderClass,
	getTaskProviderInstance,
	getBufferSize,
} from '../taskRegistry';

// Mock @wordpress/hooks
jest.mock( '@wordpress/hooks', () => ( {
	addAction: jest.fn(),
	addFilter: jest.fn(),
	applyFilters: jest.fn( () => new Map() ),
} ) );

// Mock useTasksApi
jest.mock( '../../hooks/useTasksApi', () => ( {
	createTaskPost: jest.fn(),
	createTasksBatch: jest.fn(),
	fetchDataCollector: jest.fn( () => Promise.resolve( null ) ),
} ) );

// Mock @wordpress/api-fetch
jest.mock( '@wordpress/api-fetch', () => jest.fn() );

describe( 'taskRegistry', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		resetEvaluationState();
	} );

	describe( 'registerTask', () => {
		it( 'registers a task class with providerId', () => {
			const { addFilter } = require( '@wordpress/hooks' );

			class MockTask {
				static providerId = 'test-task';
				static priority = 10;
			}

			registerTask( MockTask );

			expect( addFilter ).toHaveBeenCalledWith(
				'prpl.tasks.classes',
				'prpl/task/test-task',
				expect.any( Function ),
				10
			);
		} );

		it( 'uses default priority of 50 when not specified', () => {
			const { addFilter } = require( '@wordpress/hooks' );

			class MockTaskNoPriority {
				static providerId = 'no-priority-task';
			}

			registerTask( MockTaskNoPriority );

			expect( addFilter ).toHaveBeenCalledWith(
				'prpl.tasks.classes',
				'prpl/task/no-priority-task',
				expect.any( Function ),
				50
			);
		} );

		it( 'warns and skips tasks without providerId', () => {
			const warnSpy = jest
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );
			const { addFilter } = require( '@wordpress/hooks' );

			class TaskWithoutId {}

			registerTask( TaskWithoutId );

			expect( warnSpy ).toHaveBeenCalledWith(
				expect.stringContaining( 'missing providerId' ),
				expect.anything()
			);
			expect( addFilter ).not.toHaveBeenCalled();

			warnSpy.mockRestore();
		} );
	} );

	describe( 'getBufferSize', () => {
		it( 'returns the buffer size constant', () => {
			const bufferSize = getBufferSize();
			expect( typeof bufferSize ).toBe( 'number' );
			expect( bufferSize ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'resetEvaluationState', () => {
		it( 'resets evaluation state', () => {
			resetEvaluationState();

			const progress = getEvaluationProgress();
			expect( progress.current ).toBe( 0 );
			expect( progress.isEvaluating ).toBe( false );
		} );
	} );

	describe( 'getEvaluationProgress', () => {
		it( 'returns progress information', () => {
			const progress = getEvaluationProgress();

			expect( progress ).toHaveProperty( 'current' );
			expect( progress ).toHaveProperty( 'total' );
			expect( progress ).toHaveProperty( 'complete' );
			expect( progress ).toHaveProperty( 'isEvaluating' );
		} );

		it( 'starts with current at 0', () => {
			resetEvaluationState();
			const progress = getEvaluationProgress();
			expect( progress.current ).toBe( 0 );
		} );
	} );

	describe( 'hasMoreTasksToEvaluate', () => {
		it( 'returns true initially (before pre-fetch)', () => {
			resetEvaluationState();
			expect( hasMoreTasksToEvaluate() ).toBe( true );
		} );
	} );

	describe( 'getTaskProviderClass', () => {
		it( 'returns null for non-existent provider', () => {
			const result = getTaskProviderClass( 'non-existent-provider' );
			expect( result ).toBeNull();
		} );

		it( 'returns null for null providerId', () => {
			const result = getTaskProviderClass( null );
			expect( result ).toBeNull();
		} );

		it( 'returns null for undefined providerId', () => {
			const result = getTaskProviderClass( undefined );
			expect( result ).toBeNull();
		} );

		it( 'returns null for empty string providerId', () => {
			const result = getTaskProviderClass( '' );
			expect( result ).toBeNull();
		} );

		it( 'returns null for falsy values', () => {
			expect( getTaskProviderClass( 0 ) ).toBeNull();
			expect( getTaskProviderClass( false ) ).toBeNull();
		} );
	} );

	describe( 'getTaskProviderInstance', () => {
		it( 'returns null for non-existent provider', () => {
			const result = getTaskProviderInstance( 'non-existent-provider' );
			expect( result ).toBeNull();
		} );

		it( 'returns null for null providerId', () => {
			const result = getTaskProviderInstance( null );
			expect( result ).toBeNull();
		} );

		it( 'returns null for undefined providerId', () => {
			const result = getTaskProviderInstance( undefined );
			expect( result ).toBeNull();
		} );

		it( 'returns null for empty string providerId', () => {
			const result = getTaskProviderInstance( '' );
			expect( result ).toBeNull();
		} );
	} );

	describe( 'evaluateTasksUntil', () => {
		it( 'returns an object with complete and tasksAdded', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( [] );

			const onTaskReady = jest.fn();
			const result = await evaluateTasksUntil( 5, onTaskReady );

			expect( result ).toHaveProperty( 'complete' );
			expect( result ).toHaveProperty( 'tasksAdded' );
		} );

		it( 'pre-fetches existing tasks on first call', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( [] );

			const onTaskReady = jest.fn();
			await evaluateTasksUntil( 5, onTaskReady );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( 'prpl_recommendations' ),
				} )
			);
		} );

		it( 'does not make duplicate pre-fetch calls', async () => {
			const apiFetch = require( '@wordpress/api-fetch' );
			apiFetch.mockResolvedValue( [] );

			const onTaskReady = jest.fn();

			// First call
			await evaluateTasksUntil( 5, onTaskReady );

			// Second call
			await evaluateTasksUntil( 5, onTaskReady );

			// Should only have called apiFetch once for pre-fetch
			expect( apiFetch ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'getTaskProviderClass handles special characters in ID', () => {
			const result = getTaskProviderClass( 'provider-with-dashes' );
			expect( result ).toBeNull();
		} );

		it( 'getTaskProviderClass handles numeric string ID', () => {
			const result = getTaskProviderClass( '12345' );
			expect( result ).toBeNull();
		} );

		it( 'getTaskProviderInstance handles special characters in ID', () => {
			const result = getTaskProviderInstance( 'provider/with/slashes' );
			expect( result ).toBeNull();
		} );
	} );
} );
