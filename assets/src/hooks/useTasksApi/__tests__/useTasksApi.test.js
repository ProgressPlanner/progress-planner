/**
 * Tests for useTasksApi Functions
 */

import apiFetch from '@wordpress/api-fetch';
import {
	fetchTasks,
	createTask,
	completeTask,
	snoozeTask,
	deleteTask,
	updateTask,
	sendTaskAction,
	submitInteractiveTask,
	updateSiteSettings,
	createTaskPost,
	fetchDataCollector,
} from '../index';

// apiFetch is mocked in setup.js

describe( 'useTasksApi', () => {
	beforeEach( () => {
		apiFetch.mockReset();
	} );

	describe( 'fetchTasks', () => {
		it( 'fetches tasks with default options', async () => {
			const mockTasks = [ { id: 1 }, { id: 2 } ];
			const mockResponse = {
				json: jest.fn().mockResolvedValue( mockTasks ),
				headers: {
					get: jest.fn( ( header ) =>
						header === 'X-WP-TotalPages' ? '1' : null
					),
				},
			};
			apiFetch.mockResolvedValue( mockResponse );

			const result = await fetchTasks();

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					parse: false,
				} )
			);
			expect( result.tasks ).toEqual( mockTasks );
			expect( result.totalPages ).toBe( 1 );
			expect( result.hasMore ).toBe( false );
		} );

		it( 'includes status in query', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '1' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			await fetchTasks( { status: 'pending' } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( 'status=pending' ),
				} )
			);
		} );

		it( 'includes perPage in query', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '1' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			await fetchTasks( { perPage: 10 } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( 'per_page=10' ),
				} )
			);
		} );

		it( 'includes excludeProvider in query', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '1' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			await fetchTasks( { excludeProvider: 'user' } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( 'exclude_provider=user' ),
				} )
			);
		} );

		it( 'includes provider in query', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '1' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			await fetchTasks( { provider: 'progress-planner' } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining(
						'provider=progress-planner'
					),
				} )
			);
		} );

		it( 'includes excludeIds in query', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '1' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			await fetchTasks( { excludeIds: [ 1, 2, 3 ] } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: expect.stringContaining( 'exclude=1%2C2%2C3' ),
				} )
			);
		} );

		it( 'calculates hasMore correctly', async () => {
			const mockResponse = {
				json: jest.fn().mockResolvedValue( [] ),
				headers: { get: jest.fn( () => '3' ) },
			};
			apiFetch.mockResolvedValue( mockResponse );

			const result = await fetchTasks( { page: 1 } );

			expect( result.hasMore ).toBe( true );
			expect( result.totalPages ).toBe( 3 );
		} );

		it( 'returns empty result on error', async () => {
			apiFetch.mockRejectedValue( new Error( 'Network error' ) );

			// Expect console.error to be called
			const result = await fetchTasks();

			expect( result.tasks ).toEqual( [] );
			expect( result.totalPages ).toBe( 1 );
			expect( result.hasMore ).toBe( false );
			expect( console ).toHaveErrored();
		} );
	} );

	describe( 'createTask', () => {
		it( 'creates task with correct data', async () => {
			const mockTask = { id: 123, title: 'New Task' };
			apiFetch.mockResolvedValue( mockTask );

			const result = await createTask( {
				title: 'New Task',
				menuOrder: 5,
				providerId: 42,
				points: 10,
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/prpl_recommendations',
				method: 'POST',
				data: {
					title: 'New Task',
					status: 'publish',
					menu_order: 5,
					prpl_recommendations_provider: 42,
					prpl_points: 10,
				},
			} );
			expect( result ).toEqual( mockTask );
		} );

		it( 'uses default values', async () => {
			apiFetch.mockResolvedValue( {} );

			await createTask( { title: 'Test' } );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						menu_order: 0,
						prpl_points: 0,
					} ),
				} )
			);
		} );
	} );

	describe( 'completeTask', () => {
		it( 'changes task status to trash', async () => {
			const mockTask = { id: 123, status: 'trash' };
			apiFetch.mockResolvedValue( mockTask );

			const result = await completeTask( 123 );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/prpl_recommendations/123',
				method: 'POST',
				data: { status: 'trash' },
			} );
			expect( result ).toEqual( mockTask );
		} );
	} );

	describe( 'snoozeTask', () => {
		it( 'snoozes task for 1 week', async () => {
			const mockTask = { id: 123, status: 'future' };
			apiFetch.mockResolvedValue( mockTask );

			// Mock Date.now() for consistent testing
			const now = new Date( '2024-01-15T12:00:00Z' ).getTime();
			jest.spyOn( Date, 'now' ).mockReturnValue( now );

			await snoozeTask( 123, '1-week' );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					path: '/wp/v2/prpl_recommendations/123',
					method: 'POST',
					data: expect.objectContaining( {
						status: 'future',
					} ),
				} )
			);

			// The date should be 7 days in the future
			const callData = apiFetch.mock.calls[ 0 ][ 0 ].data;
			const futureDate = new Date( callData.date );
			const expectedDate = new Date( now + 7 * 24 * 60 * 60 * 1000 );
			expect( futureDate.toDateString() ).toBe(
				expectedDate.toDateString()
			);

			jest.restoreAllMocks();
		} );

		it( 'snoozes task for different durations', async () => {
			apiFetch.mockResolvedValue( {} );
			const now = new Date( '2024-01-15T12:00:00Z' ).getTime();
			jest.spyOn( Date, 'now' ).mockReturnValue( now );

			// Test 2 weeks
			await snoozeTask( 123, '2-weeks' );
			let callData = apiFetch.mock.calls[ 0 ][ 0 ].data;
			let futureDate = new Date( callData.date );
			let expectedDate = new Date( now + 14 * 24 * 60 * 60 * 1000 );
			expect( futureDate.toDateString() ).toBe(
				expectedDate.toDateString()
			);

			// Test 1 month
			apiFetch.mockClear();
			await snoozeTask( 123, '1-month' );
			callData = apiFetch.mock.calls[ 0 ][ 0 ].data;
			futureDate = new Date( callData.date );
			expectedDate = new Date( now + 30 * 24 * 60 * 60 * 1000 );
			expect( futureDate.toDateString() ).toBe(
				expectedDate.toDateString()
			);

			jest.restoreAllMocks();
		} );

		it( 'defaults to 7 days for unknown duration', async () => {
			apiFetch.mockResolvedValue( {} );
			const now = new Date( '2024-01-15T12:00:00Z' ).getTime();
			jest.spyOn( Date, 'now' ).mockReturnValue( now );

			await snoozeTask( 123, 'unknown-duration' );

			const callData = apiFetch.mock.calls[ 0 ][ 0 ].data;
			const futureDate = new Date( callData.date );
			const expectedDate = new Date( now + 7 * 24 * 60 * 60 * 1000 );
			expect( futureDate.toDateString() ).toBe(
				expectedDate.toDateString()
			);

			jest.restoreAllMocks();
		} );
	} );

	describe( 'deleteTask', () => {
		it( 'deletes task with force=true', async () => {
			apiFetch.mockResolvedValue( { deleted: true } );

			await deleteTask( 123 );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/prpl_recommendations/123?force=true',
				method: 'DELETE',
			} );
		} );
	} );

	describe( 'updateTask', () => {
		it( 'updates task with provided data', async () => {
			const mockTask = { id: 123, title: 'Updated' };
			apiFetch.mockResolvedValue( mockTask );

			const result = await updateTask( 123, {
				title: 'Updated',
				menu_order: 10,
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/prpl_recommendations/123',
				method: 'POST',
				data: { title: 'Updated', menu_order: 10 },
			} );
			expect( result ).toEqual( mockTask );
		} );
	} );

	describe( 'sendTaskAction', () => {
		let originalFetch;

		beforeEach( () => {
			originalFetch = global.fetch;
			global.fetch = jest.fn();
		} );

		afterEach( () => {
			global.fetch = originalFetch;
		} );

		it( 'sends action via AJAX', async () => {
			global.fetch.mockResolvedValue( {
				json: jest.fn().mockResolvedValue( { success: true } ),
			} );

			await sendTaskAction( 123, 'complete' );

			expect( global.fetch ).toHaveBeenCalledWith(
				'/wp-admin/admin-ajax.php',
				expect.objectContaining( {
					method: 'POST',
					credentials: 'same-origin',
				} )
			);

			// Verify FormData contains correct fields
			const formData = global.fetch.mock.calls[ 0 ][ 1 ].body;
			expect( formData.get( 'action' ) ).toBe(
				'progress_planner_suggested_task_action'
			);
			expect( formData.get( 'post_id' ) ).toBe( '123' );
			expect( formData.get( 'action_type' ) ).toBe( 'complete' );
		} );

		it( 'uses nonce from config', async () => {
			window.prplDashboardConfig = {
				nonce: 'test-nonce-123',
				ajaxUrl: '/custom-ajax.php',
			};

			global.fetch.mockResolvedValue( {
				json: jest.fn().mockResolvedValue( { success: true } ),
			} );

			await sendTaskAction( 456, 'delete' );

			expect( global.fetch ).toHaveBeenCalledWith(
				'/custom-ajax.php',
				expect.any( Object )
			);

			const formData = global.fetch.mock.calls[ 0 ][ 1 ].body;
			expect( formData.get( 'nonce' ) ).toBe( 'test-nonce-123' );
		} );

		it( 'returns null on error', async () => {
			// Spy on console.error to suppress output and verify it was called
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );

			global.fetch.mockRejectedValue( new Error( 'Network error' ) );

			const result = await sendTaskAction( 123, 'complete' );

			expect( result ).toBeNull();
			expect( errorSpy ).toHaveBeenCalled();

			errorSpy.mockRestore();
		} );
	} );

	describe( 'submitInteractiveTask', () => {
		it( 'submits task via REST API', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitInteractiveTask( {
				setting: 'test_setting',
				value: 'test_value',
			} );

			// Default settingPath is [], which becomes "[]" when JSON stringified
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/popover/submit',
				method: 'POST',
				data: {
					setting: 'test_setting',
					value: 'test_value',
					setting_path: '[]',
				},
			} );
		} );

		it( 'converts settingPath array to JSON', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitInteractiveTask( {
				setting: 'test',
				value: 'val',
				settingPath: [ 'path', 'to', 'setting' ],
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						setting_path: '["path","to","setting"]',
					} ),
				} )
			);
		} );

		it( 'handles string settingPath', async () => {
			apiFetch.mockResolvedValue( { success: true } );

			await submitInteractiveTask( {
				setting: 'test',
				value: 'val',
				settingPath: 'simple_path',
			} );

			expect( apiFetch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					data: expect.objectContaining( {
						setting_path: 'simple_path',
					} ),
				} )
			);
		} );

		it( 'throws error on failure', async () => {
			// Spy on console.error to suppress output and verify it was called
			const errorSpy = jest
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );

			apiFetch.mockRejectedValue( new Error( 'API error' ) );

			await expect(
				submitInteractiveTask( { setting: 'test', value: 'val' } )
			).rejects.toThrow( 'API error' );
			expect( errorSpy ).toHaveBeenCalled();

			errorSpy.mockRestore();
		} );
	} );

	describe( 'updateSiteSettings', () => {
		it( 'updates settings via REST API', async () => {
			apiFetch.mockResolvedValue( { blog_title: 'Updated' } );

			const result = await updateSiteSettings( {
				blog_title: 'Updated',
			} );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { blog_title: 'Updated' },
			} );
			expect( result ).toEqual( { blog_title: 'Updated' } );
		} );
	} );

	describe( 'createTaskPost', () => {
		it( 'creates task via evaluation endpoint', async () => {
			const mockResponse = { id: 123, status: 'created' };
			apiFetch.mockResolvedValue( mockResponse );

			const taskDetails = {
				type: 'content',
				provider: 'test-provider',
			};
			const result = await createTaskPost( taskDetails );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/tasks/evaluate',
				method: 'POST',
				data: { task_details: taskDetails },
			} );
			expect( result ).toEqual( mockResponse );
		} );
	} );

	describe( 'fetchDataCollector', () => {
		it( 'fetches data from collector endpoint', async () => {
			apiFetch.mockResolvedValue( { data: { items: [ 1, 2, 3 ] } } );

			const result = await fetchDataCollector( 'my-collector' );

			expect( apiFetch ).toHaveBeenCalledWith( {
				path: '/progress-planner/v1/data-collectors/my-collector',
			} );
			expect( result ).toEqual( { items: [ 1, 2, 3 ] } );
		} );
	} );
} );
