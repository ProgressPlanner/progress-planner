<?php
/**
 * Test upgrade migrations for version 1.9.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Test upgrade migrations for version 1.9.0.
 */
class Upgrade_Migrations_190_Test extends \WP_UnitTestCase {

	/**
	 * Test migrating task priorities to the new priority system.
	 *
	 * @return void
	 */
	public function test_migrate_task_priorities() {
		// Delete all existing tasks first.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Create tasks with old/incorrect menu_order values.
		$tasks_to_create = [
			[
				'provider_id'       => 'update-core',
				'old_priority'      => 50, // Was using default priority.
				'expected_priority' => 0, // Should be PRIORITY_CRITICAL.
			],
			[
				'provider_id'       => 'review-post',
				'old_priority'      => 30, // Was using old HIGH value.
				'expected_priority' => 60, // Should be PRIORITY_LOW.
			],
			[
				'provider_id'       => 'wp-debug-display',
				'old_priority'      => 50, // Was using default priority.
				'expected_priority' => 5, // Should be PRIORITY_CRITICAL + 5.
			],
			[
				'provider_id'       => 'settings-saved',
				'old_priority'      => 1, // Old hardcoded value.
				'expected_priority' => 10, // Should be PRIORITY_URGENT.
			],
			[
				'provider_id'       => 'email-sending',
				'old_priority'      => 1, // Old hardcoded value.
				'expected_priority' => 11, // Should be PRIORITY_URGENT + 1.
			],
			[
				'provider_id'       => 'search-engine-visibility',
				'old_priority'      => 50, // Was using default priority.
				'expected_priority' => 12, // Should be PRIORITY_URGENT + 2.
			],
			[
				'provider_id'       => 'core-permalink-structure',
				'old_priority'      => 50, // Was using default priority.
				'expected_priority' => 20, // Should be PRIORITY_HIGH.
			],
			[
				'provider_id'       => 'remove-terms-without-posts',
				'old_priority'      => 60, // Old hardcoded value.
				'expected_priority' => 60, // Should be PRIORITY_LOW (no change).
			],
		];

		$created_task_ids = [];

		// Create the tasks with old menu_order values.
		foreach ( $tasks_to_create as $task_data ) {
			$task_id = \progress_planner()->get_suggested_tasks_db()->add(
				[
					'task_id'     => $task_data['provider_id'] . '-test-' . \time(),
					'provider_id' => $task_data['provider_id'],
					'post_title'  => 'Test Task for ' . $task_data['provider_id'],
					'post_status' => 'publish',
					'priority'    => $task_data['old_priority'],
				]
			);

			$created_task_ids[ $task_data['provider_id'] ] = [
				'task_id'           => $task_id,
				'old_priority'      => $task_data['old_priority'],
				'expected_priority' => $task_data['expected_priority'],
			];
		}

		// Verify tasks were created with old priorities.
		foreach ( $created_task_ids as $provider_id => $data ) {
			$post = \get_post( $data['task_id'] );
			$this->assertNotNull( $post, "Task for provider {$provider_id} should exist" );
			$this->assertEquals(
				$data['old_priority'],
				(int) $post->menu_order,
				"Task for provider {$provider_id} should have old priority before migration"
			);
		}

		// Run the migration.
		$migration = new \Progress_Planner\Update\Update_190();
		$migration->run();

		// Call migrate_task_priorities directly since init hook has already run in tests.
		$migration->migrate_task_priorities();

		// Verify tasks have been updated with new priorities.
		foreach ( $created_task_ids as $provider_id => $data ) {
			$post = \get_post( $data['task_id'] );
			$this->assertNotNull( $post, "Task for provider {$provider_id} should still exist after migration" );
			$this->assertEquals(
				$data['expected_priority'],
				(int) $post->menu_order,
				"Task for provider {$provider_id} should have new priority after migration (expected {$data['expected_priority']}, got {$post->menu_order})"
			);
		}
	}

	/**
	 * Test that migration handles tasks with multiple statuses.
	 *
	 * @return void
	 */
	public function test_migrate_task_priorities_multiple_statuses() {
		// Delete all existing tasks first.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		$statuses      = [ 'publish', 'trash', 'draft', 'future', 'pending' ];
		$created_tasks = [];

		// Create a task for each status.
		foreach ( $statuses as $status ) {
			$task_id = \progress_planner()->get_suggested_tasks_db()->add(
				[
					'task_id'     => 'update-core-' . $status . '-' . \time(),
					'provider_id' => 'update-core',
					'post_title'  => 'Test Task with status ' . $status,
					'post_status' => $status,
					'priority'    => 50, // Old incorrect priority.
				]
			);

			$created_tasks[ $status ] = $task_id;
		}

		// Run the migration.
		$migration = new \Progress_Planner\Update\Update_190();
		$migration->run();

		// Call migrate_task_priorities directly since init hook has already run in tests.
		$migration->migrate_task_priorities();

		// Verify all tasks have been updated regardless of status.
		foreach ( $created_tasks as $status => $task_id ) {
			$post = \get_post( $task_id );
			$this->assertNotNull( $post, "Task with status {$status} should exist after migration" );
			$this->assertEquals(
				0, // PRIORITY_CRITICAL.
				(int) $post->menu_order,
				"Task with status {$status} should have updated priority"
			);
		}
	}

	/**
	 * Test that migration doesn't break when provider doesn't exist.
	 *
	 * @return void
	 */
	public function test_migrate_task_priorities_missing_provider() {
		// Delete all existing tasks first.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Create a task with a non-existent provider.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'non-existent-provider-' . \time(),
				'provider_id' => 'non-existent-provider',
				'post_title'  => 'Test Task with non-existent provider',
				'post_status' => 'publish',
				'priority'    => 99,
			]
		);

		$post_before = \get_post( $task_id );
		$this->assertEquals( 99, (int) $post_before->menu_order );

		// Run the migration - should not throw errors.
		$migration = new \Progress_Planner\Update\Update_190();
		$migration->run();

		// Call migrate_task_priorities directly since init hook has already run in tests.
		$migration->migrate_task_priorities();

		// Task should still exist and priority should be unchanged.
		$post_after = \get_post( $task_id );
		$this->assertNotNull( $post_after, 'Task with non-existent provider should still exist' );
		$this->assertEquals(
			99,
			(int) $post_after->menu_order,
			'Task with non-existent provider should keep original priority'
		);
	}

	/**
	 * Test that migration only updates tasks that need updating.
	 *
	 * @return void
	 */
	public function test_migrate_task_priorities_only_updates_changed() {
		// Delete all existing tasks first.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Create a task that already has the correct priority.
		$task_id_correct = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'update-core-correct-' . \time(),
				'provider_id' => 'update-core',
				'post_title'  => 'Test Task with correct priority',
				'post_status' => 'publish',
				'priority'    => 0, // Already correct (PRIORITY_CRITICAL).
			]
		);

		// Create a task that needs updating.
		$task_id_incorrect = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'update-core-incorrect-' . \time(),
				'provider_id' => 'update-core',
				'post_title'  => 'Test Task with incorrect priority',
				'post_status' => 'publish',
				'priority'    => 50, // Incorrect, needs updating.
			]
		);

		// Get the post_modified time before migration.
		$post_correct_before  = \get_post( $task_id_correct );
		$modified_time_before = $post_correct_before->post_modified;

		// Run the migration.
		$migration = new \Progress_Planner\Update\Update_190();
		$migration->run();

		// Call migrate_task_priorities directly since init hook has already run in tests.
		$migration->migrate_task_priorities();

		// Verify both tasks have correct priority after migration.
		$post_correct_after   = \get_post( $task_id_correct );
		$post_incorrect_after = \get_post( $task_id_incorrect );

		$this->assertEquals( 0, (int) $post_correct_after->menu_order );
		$this->assertEquals( 0, (int) $post_incorrect_after->menu_order );

		// The task that already had correct priority should not have been touched.
		// (post_modified timestamp should be the same).
		$this->assertEquals(
			$modified_time_before,
			$post_correct_after->post_modified,
			'Task with already correct priority should not be modified'
		);
	}
}
