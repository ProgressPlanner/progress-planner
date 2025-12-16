<?php
/**
 * Class Utils_System_Status_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Utils\System_Status;

/**
 * System Status utility test case.
 */
class Utils_System_Status_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var System_Status
	 */
	private $status_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->status_instance = new System_Status();
	}

	/**
	 * Test get_system_status returns array.
	 *
	 * @return void
	 */
	public function test_get_system_status_returns_array() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status );
	}

	/**
	 * Test get_system_status includes required keys.
	 *
	 * @return void
	 */
	public function test_get_system_status_includes_required_keys() {
		$status = $this->status_instance->get_system_status();

		$this->assertArrayHasKey( 'pending_updates', $status );
		$this->assertArrayHasKey( 'weekly_posts', $status );
		$this->assertArrayHasKey( 'activities', $status );
		$this->assertArrayHasKey( 'website_activity', $status );
		$this->assertArrayHasKey( 'badges', $status );
		$this->assertArrayHasKey( 'scores', $status );
		$this->assertArrayHasKey( 'website', $status );
		$this->assertArrayHasKey( 'timezone_offset', $status );
		$this->assertArrayHasKey( 'recommendations', $status );
		$this->assertArrayHasKey( 'plugin_url', $status );
		$this->assertArrayHasKey( 'plugins', $status );
		$this->assertArrayHasKey( 'branding_id', $status );
	}

	/**
	 * Test get_system_status pending_updates is numeric.
	 *
	 * @return void
	 */
	public function test_get_system_status_pending_updates() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsNumeric( $status['pending_updates'] );
		$this->assertGreaterThanOrEqual( 0, $status['pending_updates'] );
	}

	/**
	 * Test get_system_status weekly_posts is numeric.
	 *
	 * @return void
	 */
	public function test_get_system_status_weekly_posts() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsNumeric( $status['weekly_posts'] );
		$this->assertGreaterThanOrEqual( 0, $status['weekly_posts'] );
	}

	/**
	 * Test get_system_status activities is numeric.
	 *
	 * @return void
	 */
	public function test_get_system_status_activities() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsNumeric( $status['activities'] );
		$this->assertGreaterThanOrEqual( 0, $status['activities'] );
	}

	/**
	 * Test get_system_status website_activity structure.
	 *
	 * @return void
	 */
	public function test_get_system_status_website_activity() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status['website_activity'] );
		$this->assertArrayHasKey( 'score', $status['website_activity'] );
		$this->assertArrayHasKey( 'checklist', $status['website_activity'] );
	}

	/**
	 * Test get_system_status badges is array.
	 *
	 * @return void
	 */
	public function test_get_system_status_badges() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status['badges'] );
	}

	/**
	 * Test get_system_status scores is array.
	 *
	 * @return void
	 */
	public function test_get_system_status_scores() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status['scores'] );
	}

	/**
	 * Test get_system_status website is string.
	 *
	 * @return void
	 */
	public function test_get_system_status_website() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsString( $status['website'] );
		$this->assertNotEmpty( $status['website'] );
	}

	/**
	 * Test get_system_status timezone_offset is numeric.
	 *
	 * @return void
	 */
	public function test_get_system_status_timezone_offset() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsNumeric( $status['timezone_offset'] );
	}

	/**
	 * Test get_system_status recommendations is array.
	 *
	 * @return void
	 */
	public function test_get_system_status_recommendations() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status['recommendations'] );
	}

	/**
	 * Test get_system_status plugins is array.
	 *
	 * @return void
	 */
	public function test_get_system_status_plugins() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsArray( $status['plugins'] );
	}

	/**
	 * Test get_system_status branding_id is integer.
	 *
	 * @return void
	 */
	public function test_get_system_status_branding_id() {
		$status = $this->status_instance->get_system_status();

		$this->assertIsInt( $status['branding_id'] );
	}

	/**
	 * Test get_system_status includes weekly posts count.
	 *
	 * @return void
	 */
	public function test_get_system_status_weekly_posts_count() {
		// Create a post from last week.
		$old_post = $this->factory->post->create(
			[
				'post_date' => \gmdate( 'Y-m-d H:i:s', \strtotime( '-2 weeks' ) ),
			]
		);

		// Create a post from this week.
		$recent_post = $this->factory->post->create(
			[
				'post_date' => \gmdate( 'Y-m-d H:i:s', \strtotime( '-2 days' ) ),
			]
		);

		$status = $this->status_instance->get_system_status();

		// Should count posts from the past week (limited to 10).
		$this->assertGreaterThanOrEqual( 1, $status['weekly_posts'] );
		$this->assertLessThanOrEqual( 10, $status['weekly_posts'] );
	}
}
