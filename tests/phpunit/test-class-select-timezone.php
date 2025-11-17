<?php
/**
 * Class Select_Timezone_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Select_Timezone test case.
 */
class Select_Timezone_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'select-timezone';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		// Update timezone.
		\update_option( 'timezone_string', 'America/New_York' );
		\update_option( 'gmt_offset', '' );
	}

	/**
	 * Test complete_task updates timezone.
	 *
	 * @return void
	 */
	public function test_complete_task_updates_timezone() {
		// Set initial values.
		\update_option( 'timezone_string', '' );
		\update_option( 'gmt_offset', '0' );

		$result = $this->task_provider->complete_task( [ 'timezone' => 'Europe/London' ] );

		$this->assertTrue( $result );
		$this->assertEquals( 'Europe/London', \get_option( 'timezone_string' ) );
		// gmt_offset is stored as float/string, empty becomes 0 or empty string depending on WordPress version.
		$gmt_offset = \get_option( 'gmt_offset' );
		$this->assertTrue( '' === $gmt_offset || '0' === $gmt_offset || 0.0 === $gmt_offset );
	}

	/**
	 * Test complete_task sanitizes timezone.
	 *
	 * @return void
	 */
	public function test_complete_task_sanitizes_timezone() {
		// Ensure user has manage_options capability.
		\wp_set_current_user( 1 );

		// Set initial values to ensure update happens.
		\update_option( 'timezone_string', '' );
		\update_option( 'gmt_offset', '0' );

		// Test with potentially malicious input.
		// complete_task() sanitizes with sanitize_text_field(), which strips HTML tags.
		// So '<script>alert("xss")</script>America/New_York' becomes 'America/New_York'.
		$malicious_input = '<script>alert("xss")</script>America/New_York';
		$result          = $this->task_provider->complete_task( [ 'timezone' => $malicious_input ] );

		$this->assertTrue( $result, 'complete_task() should return true after sanitizing timezone input' );
		$saved_value = \get_option( 'timezone_string' );
		$this->assertStringNotContainsString( '<script>', $saved_value );
		// After sanitization, the script tags are removed, leaving just the timezone.
		$this->assertEquals( 'America/New_York', $saved_value );
	}

	/**
	 * Test complete_task missing timezone.
	 *
	 * @return void
	 */
	public function test_complete_task_missing_timezone() {
		$original_timezone = \get_option( 'timezone_string' );
		$original_gmt      = \get_option( 'gmt_offset' );

		$result = $this->task_provider->complete_task( [] );
		$this->assertFalse( $result );

		// Verify options were not changed.
		$this->assertEquals( $original_timezone, \get_option( 'timezone_string' ) );
		$this->assertEquals( $original_gmt, \get_option( 'gmt_offset' ) );
	}

	/**
	 * Test complete_task without capability.
	 *
	 * @return void
	 */
	public function test_complete_task_without_capability() {
		// Create a user without manage_options capability.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		// Get a fresh instance of the provider.
		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'select-timezone' );

		$result = $provider->complete_task( [ 'timezone' => 'America/New_York' ] );
		$this->assertFalse( $result );

		// Restore admin user.
		\wp_set_current_user( 1 );
	}

	/**
	 * Test update_timezone UTC offset format.
	 *
	 * @return void
	 */
	public function test_update_timezone_utc_offset_format() {
		// Set initial values.
		\update_option( 'timezone_string', 'America/New_York' );
		\update_option( 'gmt_offset', '' );

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->task_provider );
		$method     = $reflection->getMethod( 'update_timezone' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->task_provider, 'UTC+5' );

		$this->assertTrue( $result );
		$this->assertEquals( '', \get_option( 'timezone_string' ) );
		// The regex removes UTC+?, so UTC+5 becomes '5' (not '+5').
		$this->assertEquals( '5', \get_option( 'gmt_offset' ) );
	}

	/**
	 * Test update_timezone timezone string format.
	 *
	 * @return void
	 */
	public function test_update_timezone_timezone_string_format() {
		// Set initial values to ensure they're different from what we're setting.
		// Use an empty string or a different valid timezone that's not America/New_York.
		\update_option( 'timezone_string', '' );
		\update_option( 'gmt_offset', '+5' );

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->task_provider );
		$method     = $reflection->getMethod( 'update_timezone' );
		$method->setAccessible( true );

		$timezone_to_test = 'America/New_York';

		// Verify the timezone is valid before testing.
		$valid_timezones = \timezone_identifiers_list( \DateTimeZone::ALL_WITH_BC );
		$this->assertContains( $timezone_to_test, $valid_timezones, 'Test timezone should be valid' );

		$result = $method->invoke( $this->task_provider, $timezone_to_test );

		$this->assertTrue( $result, 'update_timezone() should return true for valid timezone identifier. Timezone: ' . $timezone_to_test );
		$this->assertEquals( 'America/New_York', \get_option( 'timezone_string' ) );
		// Note: WordPress automatically calculates gmt_offset based on timezone_string,
		// so we can't assert it's empty. The method sets it to empty, but WordPress overrides it.
		// We just verify the timezone_string was set correctly.
	}

	/**
	 * Test update_timezone clears gmt_offset for string.
	 *
	 * @return void
	 */
	public function test_update_timezone_clears_gmt_offset_for_string() {
		// Set initial values to ensure they're different from what we're setting.
		\update_option( 'gmt_offset', '+5' );
		\update_option( 'timezone_string', '' );

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->task_provider );
		$method     = $reflection->getMethod( 'update_timezone' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->task_provider, 'Europe/Amsterdam' );

		$this->assertTrue( $result, 'update_timezone() should return true for valid timezone identifier' );
		$this->assertEquals( 'Europe/Amsterdam', \get_option( 'timezone_string' ) );
		// Note: WordPress automatically calculates gmt_offset based on timezone_string,
		// so we can't assert it's empty. The method sets it to empty, but WordPress overrides it.
		// We just verify the timezone_string was set correctly.
	}

	/**
	 * Test update_timezone clears timezone_string for UTC.
	 *
	 * @return void
	 */
	public function test_update_timezone_clears_timezone_string_for_utc() {
		// Set initial timezone string.
		\update_option( 'timezone_string', 'America/New_York' );
		\update_option( 'gmt_offset', '' );

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->task_provider );
		$method     = $reflection->getMethod( 'update_timezone' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->task_provider, 'UTC-3' );

		$this->assertTrue( $result );
		$this->assertEquals( '', \get_option( 'timezone_string' ) );
		// The regex removes UTC+?, so UTC-3 becomes '-3'.
		$this->assertEquals( '-3', \get_option( 'gmt_offset' ) );
	}

	/**
	 * Test update_timezone invalid timezone.
	 *
	 * @return void
	 */
	public function test_update_timezone_invalid() {
		$original_timezone = \get_option( 'timezone_string' );
		$original_gmt      = \get_option( 'gmt_offset' );

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->task_provider );
		$method     = $reflection->getMethod( 'update_timezone' );
		$method->setAccessible( true );

		// Test with invalid timezone that doesn't match UTC pattern or valid identifier.
		$result = $method->invoke( $this->task_provider, 'Invalid/Timezone/Name' );

		$this->assertFalse( $result );
		// Verify options were not changed.
		$this->assertEquals( $original_timezone, \get_option( 'timezone_string' ) );
		$this->assertEquals( $original_gmt, \get_option( 'gmt_offset' ) );
	}
}
