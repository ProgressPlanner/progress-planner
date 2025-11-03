<?php
/**
 * Class Suggested_Tasks_Data_Collector_SEO_Plugin_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 * @group suggested-tasks-data-collectors-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\SEO_Plugin;

/**
 * Suggested_Tasks_Data_Collector_SEO_Plugin_Test test case.
 */
class Suggested_Tasks_Data_Collector_SEO_Plugin_Test extends \WP_UnitTestCase {

	/**
	 * SEO_Plugin instance.
	 *
	 * @var SEO_Plugin
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new SEO_Plugin();
	}

	/**
	 * Test collect returns boolean.
	 *
	 * @return void
	 */
	public function test_collect_returns_boolean() {
		$result = $this->collector->collect();
		$this->assertIsBool( $result );
	}

	/**
	 * Test get_seo_plugins returns array.
	 *
	 * @return void
	 */
	public function test_get_seo_plugins_returns_array() {
		$result = $this->collector->get_seo_plugins();
		$this->assertIsArray( $result );
		$this->assertNotEmpty( $result );
	}
}
