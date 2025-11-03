<?php
/**
 * Class Settings_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Settings;

/**
 * Settings_Test test case.
 */
class Settings_Test extends \WP_UnitTestCase {

	/**
	 * Settings instance.
	 *
	 * @var Settings
	 */
	protected $settings;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->settings = new Settings();
		$this->settings->delete_all();
	}

	/**
	 * Teardown the test case.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		$this->settings->delete_all();
		parent::tearDown();
	}

	/**
	 * Test get returns default value when setting doesn't exist.
	 *
	 * @return void
	 */
	public function test_get_returns_default() {
		$result = $this->settings->get( 'nonexistent', 'default' );
		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test set and get string setting.
	 *
	 * @return void
	 */
	public function test_set_and_get_string() {
		$this->settings->set( 'test_key', 'test_value' );
		$result = $this->settings->get( 'test_key' );
		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * Test set and get array setting.
	 *
	 * @return void
	 */
	public function test_set_and_get_array() {
		$test_array = [
			'a' => 1,
			'b' => 2,
		];
		$this->settings->set( 'test_array', $test_array );
		$result = $this->settings->get( 'test_array' );
		$this->assertEquals( $test_array, $result );
	}

	/**
	 * Test nested array get.
	 *
	 * @return void
	 */
	public function test_nested_array_get() {
		$this->settings->set( 'nested', [ 'level1' => [ 'level2' => 'value' ] ] );
		$result = $this->settings->get( [ 'nested', 'level1', 'level2' ] );
		$this->assertEquals( 'value', $result );
	}

	/**
	 * Test nested array set.
	 *
	 * @return void
	 */
	public function test_nested_array_set() {
		$this->settings->set( [ 'nested', 'level1', 'level2' ], 'new_value' );
		$result = $this->settings->get( [ 'nested', 'level1', 'level2' ] );
		$this->assertEquals( 'new_value', $result );
	}

	/**
	 * Test delete setting.
	 *
	 * @return void
	 */
	public function test_delete() {
		$this->settings->set( 'to_delete', 'value' );
		$this->settings->delete( 'to_delete' );
		$result = $this->settings->get( 'to_delete', 'default' );
		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test delete all settings.
	 *
	 * @return void
	 */
	public function test_delete_all() {
		$this->settings->set( 'key1', 'value1' );
		$this->settings->set( 'key2', 'value2' );
		$this->settings->delete_all();
		$this->assertNull( $this->settings->get( 'key1' ) );
		$this->assertNull( $this->settings->get( 'key2' ) );
	}

	/**
	 * Test get_public_post_types returns array.
	 *
	 * @return void
	 */
	public function test_get_public_post_types() {
		$result = $this->settings->get_public_post_types();
		$this->assertIsArray( $result );
		$this->assertContains( 'post', $result );
		$this->assertContains( 'page', $result );
		$this->assertNotContains( 'attachment', $result );
	}
}
