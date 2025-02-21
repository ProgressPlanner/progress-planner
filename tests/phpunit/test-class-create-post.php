<?php
/**
 * Class Update_Posts_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Update posts test case.
 */
class Update_Create_Posts_Test extends \WP_UnitTestCase {

	/**
	 * Test transforming task data to task id and back.
	 *
	 * @return void
	 */
	public function test_task_id_data() {

		$task_data = [
			[
				'type'    => 'create-post',
				'date'    => \gmdate( 'YW' ),
				'post_id' => 1,
				'long'    => false,
			],
			[
				'type'    => 'create-post',
				'date'    => \gmdate( 'YW' ),
				'post_id' => 2,
				'long'    => true,
			],
		];

		foreach ( $task_data as $data ) {
			$task_id           = \progress_planner()->get_suggested_tasks()->get_local()->get_create_post()->get_task_id_from_data( $data );
			$task_data_from_id = \progress_planner()->get_suggested_tasks()->get_local()->get_create_post()->get_data_from_task_id( $task_id );

			$this->assertEquals( $data, $task_data_from_id );
		}
	}
}
