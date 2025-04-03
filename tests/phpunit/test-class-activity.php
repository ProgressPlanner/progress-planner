<?php
/**
 * Class Date_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Activity;

/**
 * Date test case.
 */
class Activity_Test extends \WP_UnitTestCase {

	/**
	 * Activity object.
	 *
	 * @var Activity
	 */
	protected $activity;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->activity           = new Activity();
		$this->activity->category = 'test_category';
		$this->activity->type     = 'test_type';
		$this->activity->date     = new \DateTime();
		$this->activity->data_id  = '100';
		$this->activity->user_id  = 1;
	}

	/**
	 * Test saving the activity.
	 *
	 * @return void
	 */
	public function test_save() {
		$this->activity->save();

		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => $this->activity->category,
				'type'     => $this->activity->type,
				'user_id'  => 1,
			]
		)[0];

		$this->assertEquals( $this->activity->category, $activity->category );
		$this->assertEquals( $this->activity->type, $activity->type );
		$this->assertEquals( $this->activity->date->format( 'Y-m-d' ), $activity->date->format( 'Y-m-d' ) );
		$this->assertEquals( $this->activity->data_id, $activity->data_id );
		$this->assertEquals( $this->activity->user_id, $activity->user_id );
	}
}
