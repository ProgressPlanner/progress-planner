<?php
/**
 * Class Admin_Dashboard_Widget_Score_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Dashboard_Widget_Score;

/**
 * Admin_Dashboard_Widget_Score_Test test case.
 */
class Admin_Dashboard_Widget_Score_Test extends \WP_UnitTestCase {

	/**
	 * Dashboard_Widget_Score instance.
	 *
	 * @var Dashboard_Widget_Score
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Dashboard_Widget_Score();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Dashboard_Widget_Score::class, $this->instance );
	}
}
