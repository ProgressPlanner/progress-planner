<?php
/**
 * Unit tests for System_Status utility class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Utils\System_Status;

/**
 * Utils_System_Status test case.
 *
 * Tests the System_Status utility class that aggregates
 * various system and plugin status information.
 */
class Utils_System_Status_Test extends WP_UnitTestCase {

	/**
	 * System_Status instance.
	 *
	 * @var System_Status
	 */
	private $system_status;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->system_status = new System_Status();
	}

	/**
	 * Test get_system_status returns an array.
	 *
	 * @return void
	 */
	public function test_get_system_status_returns_array() {
		$status = $this->system_status->get_system_status();
		$this->assertIsArray( $status, 'System status should be an array' );
	}

	/**
	 * Test system status has required keys.
	 *
	 * @return void
	 */
	public function test_system_status_has_required_keys() {
		$status = $this->system_status->get_system_status();

		$required_keys = [
			'pending_updates',
			'weekly_posts',
			'activities',
			'website_activity',
			'badges',
			'latest_badge',
			'scores',
			'website',
			'timezone_offset',
			'recommendations',
			'plugin_url',
			'plugins',
			'branding_id',
		];

		foreach ( $required_keys as $key ) {
			$this->assertArrayHasKey( $key, $status, "System status should have '$key' key" );
		}
	}

	/**
	 * Test pending_updates is a number.
	 *
	 * @return void
	 */
	public function test_pending_updates_is_numeric() {
		$status = $this->system_status->get_system_status();
		$this->assertIsNumeric( $status['pending_updates'], 'Pending updates should be numeric' );
		$this->assertGreaterThanOrEqual( 0, $status['pending_updates'], 'Pending updates should be non-negative' );
	}

	/**
	 * Test weekly_posts is a number.
	 *
	 * @return void
	 */
	public function test_weekly_posts_is_numeric() {
		$status = $this->system_status->get_system_status();
		$this->assertIsNumeric( $status['weekly_posts'], 'Weekly posts should be numeric' );
		$this->assertGreaterThanOrEqual( 0, $status['weekly_posts'], 'Weekly posts should be non-negative' );
	}

	/**
	 * Test activities count is a number.
	 *
	 * @return void
	 */
	public function test_activities_is_numeric() {
		$status = $this->system_status->get_system_status();
		$this->assertIsNumeric( $status['activities'], 'Activities should be numeric' );
		$this->assertGreaterThanOrEqual( 0, $status['activities'], 'Activities should be non-negative' );
	}

	/**
	 * Test website_activity has correct structure.
	 *
	 * @return void
	 */
	public function test_website_activity_structure() {
		$status = $this->system_status->get_system_status();

		$this->assertIsArray( $status['website_activity'], 'Website activity should be an array' );
		$this->assertArrayHasKey( 'score', $status['website_activity'], 'Website activity should have score' );
		$this->assertArrayHasKey( 'checklist', $status['website_activity'], 'Website activity should have checklist' );
	}

	/**
	 * Test badges is an array.
	 *
	 * @return void
	 */
	public function test_badges_is_array() {
		$status = $this->system_status->get_system_status();
		$this->assertIsArray( $status['badges'], 'Badges should be an array' );
	}

	/**
	 * Test badges have correct structure if not empty.
	 *
	 * @return void
	 */
	public function test_badges_structure() {
		$status = $this->system_status->get_system_status();

		foreach ( $status['badges'] as $badge_id => $badge ) {
			$this->assertIsString( $badge_id, 'Badge ID should be a string' );
			$this->assertIsArray( $badge, 'Badge should be an array' );
			$this->assertArrayHasKey( 'id', $badge, 'Badge should have id' );
			$this->assertArrayHasKey( 'name', $badge, 'Badge should have name' );
		}
	}

	/**
	 * Test scores is an array.
	 *
	 * @return void
	 */
	public function test_scores_is_array() {
		$status = $this->system_status->get_system_status();
		$this->assertIsArray( $status['scores'], 'Scores should be an array' );
	}

	/**
	 * Test scores have correct structure if not empty.
	 *
	 * @return void
	 */
	public function test_scores_structure() {
		$status = $this->system_status->get_system_status();

		foreach ( $status['scores'] as $score ) {
			$this->assertIsArray( $score, 'Score should be an array' );
			$this->assertArrayHasKey( 'label', $score, 'Score should have label' );
			$this->assertArrayHasKey( 'value', $score, 'Score should have value' );
		}
	}

	/**
	 * Test website is a string.
	 *
	 * @return void
	 */
	public function test_website_is_string() {
		$status = $this->system_status->get_system_status();
		$this->assertIsString( $status['website'], 'Website should be a string' );
		$this->assertNotEmpty( $status['website'], 'Website should not be empty' );
	}

	/**
	 * Test timezone_offset is numeric.
	 *
	 * @return void
	 */
	public function test_timezone_offset_is_numeric() {
		$status = $this->system_status->get_system_status();
		$this->assertIsNumeric( $status['timezone_offset'], 'Timezone offset should be numeric' );
	}

	/**
	 * Test recommendations is an array.
	 *
	 * @return void
	 */
	public function test_recommendations_is_array() {
		$status = $this->system_status->get_system_status();
		$this->assertIsArray( $status['recommendations'], 'Recommendations should be an array' );
	}

	/**
	 * Test recommendations have correct structure if not empty.
	 *
	 * @return void
	 */
	public function test_recommendations_structure() {
		$status = $this->system_status->get_system_status();

		if ( empty( $status['recommendations'] ) ) {
			$this->assertTrue( true, 'No recommendations to test structure' );
			return;
		}

		foreach ( $status['recommendations'] as $recommendation ) {
			$this->assertIsArray( $recommendation, 'Recommendation should be an array' );
			$this->assertArrayHasKey( 'id', $recommendation, 'Recommendation should have id' );
			$this->assertArrayHasKey( 'title', $recommendation, 'Recommendation should have title' );
			$this->assertArrayHasKey( 'url', $recommendation, 'Recommendation should have url' );
			$this->assertArrayHasKey( 'provider_id', $recommendation, 'Recommendation should have provider_id' );
		}
	}

	/**
	 * Test plugin_url is a valid URL.
	 *
	 * @return void
	 */
	public function test_plugin_url_is_valid() {
		$status = $this->system_status->get_system_status();
		$this->assertIsString( $status['plugin_url'], 'Plugin URL should be a string' );
		$this->assertStringContainsString( 'progress-planner', $status['plugin_url'], 'Plugin URL should contain progress-planner' );
	}

	/**
	 * Test plugins is an array.
	 *
	 * @return void
	 */
	public function test_plugins_is_array() {
		$status = $this->system_status->get_system_status();
		$this->assertIsArray( $status['plugins'], 'Plugins should be an array' );
	}

	/**
	 * Test plugins have correct structure if not empty.
	 *
	 * @return void
	 */
	public function test_plugins_structure() {
		$status = $this->system_status->get_system_status();

		if ( empty( $status['plugins'] ) ) {
			$this->assertTrue( true, 'No plugins to test structure' );
			return;
		}

		foreach ( $status['plugins'] as $plugin ) {
			$this->assertIsArray( $plugin, 'Plugin should be an array' );
			$this->assertArrayHasKey( 'plugin', $plugin, 'Plugin should have plugin key' );
			$this->assertArrayHasKey( 'name', $plugin, 'Plugin should have name' );
			$this->assertArrayHasKey( 'version', $plugin, 'Plugin should have version' );
		}
	}

	/**
	 * Test branding_id is an integer.
	 *
	 * @return void
	 */
	public function test_branding_id_is_integer() {
		$status = $this->system_status->get_system_status();
		$this->assertIsInt( $status['branding_id'], 'Branding ID should be an integer' );
	}

	/**
	 * Test system status can be called multiple times.
	 *
	 * @return void
	 */
	public function test_multiple_calls() {
		$status1 = $this->system_status->get_system_status();
		$status2 = $this->system_status->get_system_status();

		$this->assertIsArray( $status1, 'First call should return array' );
		$this->assertIsArray( $status2, 'Second call should return array' );
	}
}
