<?php
/**
 * Class Suggested_Tasks_Providers_Core_Update_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-1
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Core_Update;

/**
 * Suggested_Tasks_Providers_Core_Update_Test test case.
 *
 * @group suggested-tasks-providers-1
 */
class Suggested_Tasks_Providers_Core_Update_Test extends \WP_UnitTestCase {

	/**
	 * Core_Update instance.
	 *
	 * @var Core_Update
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Core_Update();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'update-core', $this->provider->get_provider_id() );
	}

	/**
	 * Test init registers filters.
	 *
	 * @return void
	 */
	public function test_init_registers_filters() {
		$this->provider->init();
		$this->assertEquals( 10, \has_filter( 'update_bulk_plugins_complete_actions', [ $this->provider, 'add_core_update_link' ] ) );
		$this->assertEquals( 10, \has_filter( 'update_bulk_theme_complete_actions', [ $this->provider, 'add_core_update_link' ] ) );
		$this->assertEquals( 10, \has_filter( 'update_translations_complete_actions', [ $this->provider, 'add_core_update_link' ] ) );
	}

	/**
	 * Test add_core_update_link returns array.
	 *
	 * @return void
	 */
	public function test_add_core_update_link() {
		$actions = [ 'updates' => 'test' ];
		$result  = $this->provider->add_core_update_link( $actions );
		$this->assertIsArray( $result );
	}

	/**
	 * Test add_task_actions adds update page link.
	 *
	 * @return void
	 */
	public function test_add_task_actions() {
		$actions = $this->provider->add_task_actions( [], [] );
		$this->assertIsArray( $actions );
		$this->assertNotEmpty( $actions );
		$this->assertArrayHasKey( 'priority', $actions[0] );
		$this->assertArrayHasKey( 'html', $actions[0] );
		$this->assertStringContainsString( 'update-core.php', $actions[0]['html'] );
	}

	/**
	 * Test should_add_task returns boolean.
	 *
	 * @return void
	 */
	public function test_should_add_task() {
		$result = $this->provider->should_add_task();
		$this->assertIsBool( $result );
	}

	/**
	 * Test is_task_completed returns boolean.
	 *
	 * @return void
	 */
	public function test_is_task_completed() {
		$result = $this->provider->is_task_completed();
		$this->assertIsBool( $result );
	}
}
