<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Suggested_Tasks test case.
 *
 * Tests the Suggested_Tasks class that manages the suggested tasks system.
 */
class Suggested_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Tasks instance.
	 *
	 * @var \Progress_Planner\Suggested_Tasks
	 */
	private $suggested_tasks;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->suggested_tasks = \progress_planner()->get_suggested_tasks();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $admin_id );
	}

	/**
	 * Test the task_cleanup method.
	 *
	 * @return void
	 */
	public function test_task_cleanup() {
		// Tasks that should not be removed.
		$tasks_to_keep = [
			[
				'post_title'  => 'review-post-14-' . \gmdate( 'YW' ),
				'task_id'     => 'review-post-14-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'content-update',
				'provider_id' => 'review-post',
			],
			[
				'post_title'  => 'create-post-' . \gmdate( 'YW' ),
				'task_id'     => 'create-post-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'content-new',
				'provider_id' => 'create-post',
			],
			[
				'post_title'  => 'update-core-' . \gmdate( 'YW' ),
				'task_id'     => 'update-core-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],
			[
				'post_title'  => 'settings-saved-' . \gmdate( 'YW' ),
				'task_id'     => 'settings-saved-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'provider_id' => 'settings-saved',
				'category'    => 'configuration',
			],

			// Not repetitive task, but with past date.
			[
				'post_title'  => 'settings-saved-202451',
				'task_id'     => 'settings-saved-202451',
				'date'        => '202451',
				'provider_id' => 'settings-saved',
				'category'    => 'configuration',
			],

			// User task, with past date.
			[
				'post_title'  => 'user-task-1',
				'task_id'     => 'user-task-1',
				'provider_id' => 'user',
				'category'    => 'user',
				'date'        => '202451',
			],
		];

		foreach ( $tasks_to_keep as $task ) {
			\progress_planner()->get_suggested_tasks_db()->add( $task );
		}

		// Tasks that should be removed.
		$tasks_to_remove = [

			// Repetitive task with past date.
			[
				'post_title'  => 'update-core-202451',
				'task_id'     => 'update-core-202451',
				'date'        => '202451',
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],

			// Task with invalid provider.
			[
				'post_title'  => 'invalid-task-1',
				'task_id'     => 'invalid-task-1',
				'date'        => '202451',
				'category'    => 'invalid-category',
				'provider_id' => 'invalid-provider',
			],
		];

		foreach ( $tasks_to_remove as $task ) {
			\progress_planner()->get_suggested_tasks_db()->add( $task );
		}

		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->cleanup_pending_tasks();
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP ); // Clear the cache.
		$this->assertEquals( \count( $tasks_to_keep ), \count( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] ) ) );
	}

	/**
	 * Test STATUS_MAP constant.
	 */
	public function test_status_map_constant() {
		$status_map = \Progress_Planner\Suggested_Tasks::STATUS_MAP;

		$this->assertIsArray( $status_map );
		$this->assertArrayHasKey( 'completed', $status_map );
		$this->assertEquals( 'trash', $status_map['completed'] );
	}

	/**
	 * Test get_tasks_manager returns Tasks_Manager.
	 */
	public function test_get_tasks_manager() {
		$manager = $this->suggested_tasks->get_tasks_manager();

		$this->assertInstanceOf(
			\Progress_Planner\Suggested_Tasks\Tasks_Manager::class,
			$manager
		);
	}

	/**
	 * Test get_task_id_from_slug.
	 */
	public function test_get_task_id_from_slug() {
		$this->assertEquals(
			'task-123',
			$this->suggested_tasks->get_task_id_from_slug( 'task-123' )
		);

		$this->assertEquals(
			'task-456',
			$this->suggested_tasks->get_task_id_from_slug( 'task-456__trashed' )
		);
	}

	/**
	 * Test generate_task_completion_token.
	 */
	public function test_generate_task_completion_token() {
		$task_id = 'test-task';
		$user_id = get_current_user_id();

		$token = $this->suggested_tasks->generate_task_completion_token( $task_id, $user_id );

		$this->assertIsString( $token );
		$this->assertNotEmpty( $token );

		// Verify token is stored.
		$stored = get_transient( 'prpl_complete_' . $task_id . '_' . $user_id );
		$this->assertEquals( $token, $stored );
	}

	/**
	 * Test insert_activity creates activity.
	 */
	public function test_insert_activity() {
		$task_id = 'test-task-activity-insert';

		$this->suggested_tasks->insert_activity( $task_id );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertNotEmpty( $activities );
		$this->assertEquals( $task_id, $activities[0]->data_id );
	}

	/**
	 * Test delete_activity removes activity.
	 */
	public function test_delete_activity() {
		$task_id = 'test-task-activity-delete';

		// Create activity first.
		$this->suggested_tasks->insert_activity( $task_id );

		// Delete it.
		$this->suggested_tasks->delete_activity( $task_id );

		// Verify deleted.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertEmpty( $activities );
	}

	/**
	 * Test was_task_completed.
	 */
	public function test_was_task_completed() {
		$result = $this->suggested_tasks->was_task_completed( 99999 );
		$this->assertFalse( $result );
	}

	/**
	 * Test register_post_type.
	 */
	public function test_register_post_type() {
		$this->suggested_tasks->register_post_type();

		$this->assertTrue( post_type_exists( 'prpl_recommendations' ) );
	}

	/**
	 * Test register_taxonomy.
	 */
	public function test_register_taxonomy() {
		$this->suggested_tasks->register_taxonomy();

		$this->assertTrue( taxonomy_exists( 'prpl_recommendations_provider' ) );
	}

	/**
	 * Test change_trashed_posts_lifetime.
	 */
	public function test_change_trashed_posts_lifetime() {
		$recommendation_post = (object) [ 'post_type' => 'prpl_recommendations' ];
		$regular_post        = (object) [ 'post_type' => 'post' ];

		$this->assertEquals(
			60,
			$this->suggested_tasks->change_trashed_posts_lifetime( 30, $recommendation_post )
		);

		$this->assertEquals(
			30,
			$this->suggested_tasks->change_trashed_posts_lifetime( 30, $regular_post )
		);
	}

	/**
	 * Test get_tasks_in_rest_format.
	 */
	public function test_get_tasks_in_rest_format() {
		$tasks = $this->suggested_tasks->get_tasks_in_rest_format();

		$this->assertIsArray( $tasks );
	}

	/**
	 * Test rest_api_tax_query.
	 */
	public function test_rest_api_tax_query() {
		$request = new \WP_REST_Request();
		$args    = [];

		$result = $this->suggested_tasks->rest_api_tax_query( $args, $request );

		$this->assertArrayHasKey( 'tax_query', $result );
	}
}
