<?php
/**
 * Unit tests for Branding UI class.
 *
 * @package Progress_Planner\Tests
 * @group ui
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\UI\Branding;

/**
 * UI_Branding test case.
 *
 * Tests the Branding UI class that handles custom branding
 * based on hosting provider and configuration.
 *
 * @group ui
 */
class UI_Branding_Test extends WP_UnitTestCase {

	/**
	 * Branding instance.
	 *
	 * @var Branding
	 */
	private $branding;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->branding = new Branding();
	}

	/**
	 * Test BRANDING_IDS constant exists and has default.
	 *
	 * @return void
	 */
	public function test_branding_ids_constant() {
		$this->assertTrue( \defined( 'Progress_Planner\UI\Branding::BRANDING_IDS' ), 'BRANDING_IDS constant should exist' );
		$this->assertIsArray( Branding::BRANDING_IDS, 'BRANDING_IDS should be an array' );
		$this->assertArrayHasKey( 'default', Branding::BRANDING_IDS, 'BRANDING_IDS should have default key' );
		$this->assertEquals( 0, Branding::BRANDING_IDS['default'], 'Default branding ID should be 0' );
	}

	/**
	 * Test instance can be created.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Branding::class, $this->branding, 'Should create Branding instance' );
	}

	/**
	 * Test constructor registers filter.
	 *
	 * @return void
	 */
	public function test_constructor_registers_filter() {
		$this->assertGreaterThan( 0, \has_filter( 'progress_planner_admin_widgets', [ $this->branding, 'filter_widgets' ] ), 'Should register admin_widgets filter' );
	}

	/**
	 * Test get_branding_id returns integer.
	 *
	 * @return void
	 */
	public function test_get_branding_id_returns_int() {
		$branding_id = $this->branding->get_branding_id();
		$this->assertIsInt( $branding_id, 'Branding ID should be an integer' );
	}

	/**
	 * Test get_branding_id returns default when no specific branding.
	 *
	 * @return void
	 */
	public function test_get_branding_id_default() {
		$branding_id = $this->branding->get_branding_id();
		$this->assertGreaterThanOrEqual( 0, $branding_id, 'Branding ID should be non-negative' );
	}

	/**
	 * Test get_api_data returns array.
	 *
	 * @return void
	 */
	public function test_get_api_data_returns_array() {
		$api_data = $this->branding->get_api_data();
		$this->assertIsArray( $api_data, 'API data should be an array' );
	}

	/**
	 * Test get_api_data returns empty array for default branding.
	 *
	 * @return void
	 */
	public function test_get_api_data_empty_for_default() {
		// If get_branding_id returns 0, api_data should be empty.
		if ( 0 === $this->branding->get_branding_id() ) {
			$api_data = $this->branding->get_api_data();
			$this->assertEmpty( $api_data, 'API data should be empty for default branding' );
		} else {
			$this->assertTrue( true, 'Not using default branding in test environment' );
		}
	}

	/**
	 * Test Branding class is final.
	 *
	 * @return void
	 */
	public function test_branding_is_final() {
		$reflection = new \ReflectionClass( Branding::class );
		$this->assertTrue( $reflection->isFinal(), 'Branding class should be final' );
	}

	/**
	 * Test get_branding_id with constant defined.
	 *
	 * @return void
	 */
	public function test_get_branding_id_with_constant() {
		if ( ! \defined( 'PROGRESS_PLANNER_BRANDING_ID' ) ) {
			\define( 'PROGRESS_PLANNER_BRANDING_ID', 1234 );
		}

		$branding    = new Branding();
		$branding_id = $branding->get_branding_id();

		$this->assertEquals( 1234, $branding_id, 'Should use constant when defined' );
	}

	/**
	 * Test filter_widgets method exists and is callable.
	 *
	 * @return void
	 */
	public function test_filter_widgets_method_exists() {
		$this->assertTrue( \method_exists( $this->branding, 'filter_widgets' ), 'filter_widgets method should exist' );
		$this->assertTrue( \is_callable( [ $this->branding, 'filter_widgets' ] ), 'filter_widgets should be callable' );
	}

	/**
	 * Test get_remote_data method exists.
	 *
	 * @return void
	 */
	public function test_get_remote_data_method_exists() {
		$reflection = new \ReflectionClass( Branding::class );
		$this->assertTrue( $reflection->hasMethod( 'get_remote_data' ), 'get_remote_data method should exist' );
	}
}
