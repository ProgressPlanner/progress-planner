<?php
/**
 * Class Suggested_Tasks_Data_Collector_Inactive_Plugins_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins;

/**
 * Suggested_Tasks_Data_Collector_Inactive_Plugins_Test test case.
 */
class Suggested_Tasks_Data_Collector_Inactive_Plugins_Test extends \WP_UnitTestCase {

	/**
	 * Inactive_Plugins instance.
	 *
	 * @var Inactive_Plugins
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Inactive_Plugins();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'deleted_plugin', [ $this->collector, 'update_inactive_plugins_cache' ] ) );
		$this->assertEquals( 10, \has_action( 'update_option_active_plugins', [ $this->collector, 'update_inactive_plugins_cache' ] ) );
	}

	/**
	 * Test collect returns integer.
	 *
	 * @return void
	 */
	public function test_collect_returns_integer() {
		$result = $this->collector->collect();
		$this->assertIsInt( $result );
	}

	/**
	 * Test collect returns zero or positive.
	 *
	 * @return void
	 */
	public function test_collect_returns_non_negative() {
		$result = $this->collector->collect();
		$this->assertGreaterThanOrEqual( 0, $result );
	}

	/**
	 * Test update_inactive_plugins_cache callable.
	 *
	 * @return void
	 */
	public function test_update_cache_callable() {
		$this->collector->update_inactive_plugins_cache();
		$result = $this->collector->collect();
		$this->assertIsInt( $result );
	}
}
