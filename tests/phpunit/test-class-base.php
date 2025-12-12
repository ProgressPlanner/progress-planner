<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Class Base_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Base;

/**
 * Base plugin class test case.
 */
class Base_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Base
	 */
	private $base_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->base_instance = new Base();
	}

	/**
	 * Test get_settings returns Settings instance.
	 *
	 * @return void
	 */
	public function test_get_settings() {
		$settings = $this->base_instance->get_settings();

		$this->assertInstanceOf( \Progress_Planner\Settings::class, $settings );
	}

	/**
	 * Test get_settings returns same instance (singleton pattern).
	 *
	 * @return void
	 */
	public function test_get_settings_singleton() {
		$settings_1 = $this->base_instance->get_settings();
		$settings_2 = $this->base_instance->get_settings();

		$this->assertSame( $settings_1, $settings_2 );
	}

	/**
	 * Test get_suggested_tasks_db returns Suggested_Tasks_DB instance.
	 *
	 * @return void
	 */
	public function test_get_suggested_tasks_db() {
		$db = $this->base_instance->get_suggested_tasks_db();

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks_DB::class, $db );
	}

	/**
	 * Test get_suggested_tasks_db returns same instance (singleton pattern).
	 *
	 * @return void
	 */
	public function test_get_suggested_tasks_db_singleton() {
		$db_1 = $this->base_instance->get_suggested_tasks_db();
		$db_2 = $this->base_instance->get_suggested_tasks_db();

		$this->assertSame( $db_1, $db_2 );
	}

	/**
	 * Test get_admin__page returns Admin\Page instance.
	 *
	 * @return void
	 */
	public function test_get_admin_page() {
		$page = $this->base_instance->get_admin__page();

		$this->assertInstanceOf( \Progress_Planner\Admin\Page::class, $page );
	}

	/**
	 * Test get_rest__tasks returns Rest\Tasks instance.
	 *
	 * @return void
	 */
	public function test_get_rest_tasks() {
		$tasks = $this->base_instance->get_rest__tasks();

		$this->assertInstanceOf( \Progress_Planner\Rest\Tasks::class, $tasks );
	}

	/**
	 * Test get_rest__stats returns Rest\Stats instance.
	 *
	 * @return void
	 */
	public function test_get_rest_stats() {
		$stats = $this->base_instance->get_rest__stats();

		$this->assertInstanceOf( \Progress_Planner\Rest\Stats::class, $stats );
	}

	/**
	 * Test get_utils__cache returns Utils\Cache instance.
	 *
	 * @return void
	 */
	public function test_get_utils_cache() {
		$cache = $this->base_instance->get_utils__cache();

		$this->assertInstanceOf( \Progress_Planner\Utils\Cache::class, $cache );
	}

	/**
	 * Test get_todo returns Todo instance.
	 *
	 * @return void
	 */
	public function test_get_todo() {
		$todo = $this->base_instance->get_todo();

		$this->assertInstanceOf( \Progress_Planner\Todo::class, $todo );
	}

	/**
	 * Test get_badges returns Badges instance.
	 *
	 * @return void
	 */
	public function test_get_badges() {
		$badges = $this->base_instance->get_badges();

		$this->assertInstanceOf( \Progress_Planner\Badges::class, $badges );
	}

	/**
	 * Test SCORE_TARGET constant.
	 *
	 * @return void
	 */
	public function test_score_target_constant() {
		$this->assertEquals( 200, Base::SCORE_TARGET );
	}

	/**
	 * Test init method registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->base_instance->init();

		// Verify REST API endpoints are registered.
		$this->assertNotFalse( \has_action( 'rest_api_init', [ $this->base_instance->get_rest__tasks(), 'register_rest_endpoint' ] ) );
		$this->assertNotFalse( \has_action( 'rest_api_init', [ $this->base_instance->get_rest__stats(), 'register_rest_endpoint' ] ) );

		// Verify plugin action links filter is registered.
		$this->assertNotFalse( \has_filter( 'plugin_action_links_' . \plugin_basename( PROGRESS_PLANNER_FILE ), [ $this->base_instance, 'add_action_links' ] ) );
	}

	/**
	 * Test add_action_links adds correct links.
	 *
	 * @return void
	 */
	public function test_add_action_links() {
		$links = $this->base_instance->add_action_links( [] );

		$this->assertIsArray( $links );
		$this->assertNotEmpty( $links );

		// Verify links contain expected URLs.
		$link_strings = \implode( ' ', $links );
		$this->assertStringContainsString( 'progress-planner', $link_strings );
	}

	/**
	 * Test is_privacy_policy_accepted checks license key option.
	 *
	 * @return void
	 */
	public function test_is_privacy_policy_accepted() {
		// Set license key (privacy policy accepted).
		\update_option( 'progress_planner_license_key', 'test-license-key' );
		$result = $this->base_instance->is_privacy_policy_accepted();
		$this->assertTrue( $result );

		// Remove license key (privacy policy not accepted).
		\delete_option( 'progress_planner_license_key' );
		$result = $this->base_instance->is_privacy_policy_accepted();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_debug_mode_enabled checks PRPL_DEBUG constant and option.
	 *
	 * @return void
	 */
	public function test_is_debug_mode_enabled() {
		// Test with option set.
		\update_option( 'prpl_debug', true );
		$result = $this->base_instance->is_debug_mode_enabled();
		$this->assertTrue( $result );

		// Test with option not set.
		\delete_option( 'prpl_debug' );
		$result = $this->base_instance->is_debug_mode_enabled();
		// Should be false unless PRPL_DEBUG constant is defined and true.
		$this->assertIsBool( $result );
	}
}

// phpcs:enable Generic.Commenting.Todo
