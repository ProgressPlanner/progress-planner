<?php
/**
 * Class Actions_Maintenance_Test
 *
 * @package Progress_Planner\Tests
 * @group actions
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Actions\Maintenance;
use Progress_Planner\Activities\Query;

/**
 * Actions_Maintenance_Test test case.
 *
 * @group actions
 */
class Actions_Maintenance_Test extends \WP_UnitTestCase {

	/**
	 * Maintenance instance.
	 *
	 * @var Maintenance
	 */
	protected $maintenance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->maintenance = new Maintenance();

		// Clean up any existing activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );
	}

	/**
	 * Cleanup after test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );

		parent::tearDown();
	}

	/**
	 * Test hooks are registered.
	 *
	 * @return void
	 */
	public function test_hooks_registered() {
		$this->assertGreaterThan( 0, \has_action( 'upgrader_process_complete', [ $this->maintenance, 'on_upgrade' ] ) );
		$this->assertGreaterThan( 0, \has_action( 'upgrader_process_complete', [ $this->maintenance, 'on_install' ] ) );
		$this->assertGreaterThan( 0, \has_action( 'delete_plugin', [ $this->maintenance, 'on_delete_plugin' ] ) );
		$this->assertGreaterThan( 0, \has_action( 'activated_plugin', [ $this->maintenance, 'on_activate_plugin' ] ) );
		$this->assertGreaterThan( 0, \has_action( 'deactivated_plugin', [ $this->maintenance, 'on_deactivate_plugin' ] ) );
		$this->assertGreaterThan( 0, \has_action( 'switch_theme', [ $this->maintenance, 'on_switch_theme' ] ) );
	}

	/**
	 * Test on_upgrade creates maintenance activity for plugin update.
	 *
	 * @return void
	 */
	public function test_on_upgrade_plugin() {
		$options = [
			'action' => 'update',
			'type'   => 'plugin',
		];

		$this->maintenance->on_upgrade( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'update_plugin', $activities[0]->type );
	}

	/**
	 * Test on_upgrade creates maintenance activity for theme update.
	 *
	 * @return void
	 */
	public function test_on_upgrade_theme() {
		$options = [
			'action' => 'update',
			'type'   => 'theme',
		];

		$this->maintenance->on_upgrade( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'update_theme', $activities[0]->type );
	}

	/**
	 * Test on_upgrade creates maintenance activity for core update.
	 *
	 * @return void
	 */
	public function test_on_upgrade_core() {
		$options = [
			'action' => 'update',
			'type'   => 'core',
		];

		$this->maintenance->on_upgrade( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'update_core', $activities[0]->type );
	}

	/**
	 * Test on_upgrade ignores non-update actions.
	 *
	 * @return void
	 */
	public function test_on_upgrade_ignores_other_actions() {
		$options = [
			'action' => 'install',
			'type'   => 'plugin',
		];

		$this->maintenance->on_upgrade( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertEmpty( $activities );
	}

	/**
	 * Test on_install creates maintenance activity for plugin install.
	 *
	 * @return void
	 */
	public function test_on_install_plugin() {
		$options = [
			'action' => 'install',
			'type'   => 'plugin',
		];

		$this->maintenance->on_install( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'install_plugin', $activities[0]->type );
	}

	/**
	 * Test on_install creates maintenance activity for theme install.
	 *
	 * @return void
	 */
	public function test_on_install_theme() {
		$options = [
			'action' => 'install',
			'type'   => 'theme',
		];

		$this->maintenance->on_install( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'install_theme', $activities[0]->type );
	}

	/**
	 * Test on_install ignores non-install actions.
	 *
	 * @return void
	 */
	public function test_on_install_ignores_other_actions() {
		$options = [
			'action' => 'update',
			'type'   => 'plugin',
		];

		$this->maintenance->on_install( null, $options );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertEmpty( $activities );
	}

	/**
	 * Test on_delete_plugin creates maintenance activity.
	 *
	 * @return void
	 */
	public function test_on_delete_plugin() {
		$this->maintenance->on_delete_plugin();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'delete_plugin', $activities[0]->type );
	}

	/**
	 * Test on_delete_theme creates maintenance activity.
	 *
	 * @return void
	 */
	public function test_on_delete_theme() {
		$this->maintenance->on_delete_theme();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'delete_theme', $activities[0]->type );
	}

	/**
	 * Test on_activate_plugin creates maintenance activity.
	 *
	 * @return void
	 */
	public function test_on_activate_plugin() {
		$this->maintenance->on_activate_plugin();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'activate_plugin', $activities[0]->type );
	}

	/**
	 * Test on_deactivate_plugin creates maintenance activity.
	 *
	 * @return void
	 */
	public function test_on_deactivate_plugin() {
		$this->maintenance->on_deactivate_plugin();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'deactivate_plugin', $activities[0]->type );
	}

	/**
	 * Test on_switch_theme creates maintenance activity.
	 *
	 * @return void
	 */
	public function test_on_switch_theme() {
		$this->maintenance->on_switch_theme();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'maintenance' ]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'switch_theme', $activities[0]->type );
	}

	/**
	 * Test get_update_type returns correct type.
	 *
	 * @return void
	 */
	public function test_get_update_type() {
		$reflection = new \ReflectionClass( $this->maintenance );
		$method     = $reflection->getMethod( 'get_update_type' );
		$method->setAccessible( true );

		$this->assertEquals( 'plugin', $method->invoke( $this->maintenance, [ 'type' => 'plugin' ] ) );
		$this->assertEquals( 'theme', $method->invoke( $this->maintenance, [ 'type' => 'theme' ] ) );
		$this->assertEquals( 'core', $method->invoke( $this->maintenance, [ 'type' => 'core' ] ) );
		$this->assertEquals( 'translation', $method->invoke( $this->maintenance, [ 'type' => 'translation' ] ) );
		$this->assertEquals( 'unknown', $method->invoke( $this->maintenance, [] ) );
	}

	/**
	 * Test get_install_type returns correct type.
	 *
	 * @return void
	 */
	public function test_get_install_type() {
		$reflection = new \ReflectionClass( $this->maintenance );
		$method     = $reflection->getMethod( 'get_install_type' );
		$method->setAccessible( true );

		$this->assertEquals( 'plugin', $method->invoke( $this->maintenance, [ 'type' => 'plugin' ] ) );
		$this->assertEquals( 'theme', $method->invoke( $this->maintenance, [ 'type' => 'theme' ] ) );
		$this->assertEquals( 'unknown', $method->invoke( $this->maintenance, [] ) );
	}
}
