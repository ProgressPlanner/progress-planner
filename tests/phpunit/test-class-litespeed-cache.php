<?php
/**
 * Tests for the LiteSpeed Cache task providers.
 *
 * The interesting behaviour is update_litespeed_option(): saving a LiteSpeed
 * setting has to go through LiteSpeed's own Conf::update_confs(), which casts
 * the value, purges the caches the change invalidates and refreshes LiteSpeed's
 * in-memory config. Writing the option row directly skips all of that.
 *
 * LiteSpeed is not installed in CI, so a stub stands in for \LiteSpeed\Conf and
 * records what it was asked to do.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache\Guest_Mode;
use Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache\Page_Cache;

/**
 * LiteSpeed Cache test case.
 */
class Litespeed_Cache_Test extends \WP_UnitTestCase {

	/**
	 * Option keys the providers touch, so they can be restored.
	 *
	 * @var string[]
	 */
	private const OPTION_KEYS = [ 'cache', 'guest' ];

	/**
	 * Clean up.
	 */
	public function tear_down() {
		foreach ( self::OPTION_KEYS as $key ) {
			\delete_option( 'litespeed.conf.' . $key );
		}

		if ( \class_exists( '\LiteSpeed\Conf' ) ) {
			\LiteSpeed\Conf::reset_calls();
		}

		parent::tear_down();
	}

	/**
	 * Call the provider's protected option updater.
	 *
	 * @param object $provider   The provider.
	 * @param string $option_key The LiteSpeed option key.
	 * @param mixed  $value      The value to set.
	 *
	 * @return mixed
	 */
	private function update_option_via( $provider, $option_key, $value ) {
		$method = ( new \ReflectionClass( $provider ) )->getMethod( 'update_litespeed_option' );
		$method->setAccessible( true );

		return $method->invoke( $provider, $option_key, $value );
	}

	/**
	 * With LiteSpeed present, the update goes through its own Conf class.
	 *
	 * Writing the option row directly would leave LiteSpeed's caches unpurged
	 * and its in-memory config stale -- for `guest` it also skips the crawler
	 * disabled-list reset that Conf::update_confs() performs.
	 *
	 * @return void
	 */
	public function test_update_routes_through_litespeed_conf() {
		require_once __DIR__ . '/stubs/class-litespeed-conf-stub.php';

		$result = $this->update_option_via( new Guest_Mode(), 'guest', 1 );

		$this->assertSame(
			[ [ 'guest' => 1 ] ],
			\LiteSpeed\Conf::get_calls(),
			'The value should have been handed to Conf::update_confs().'
		);
		$this->assertTrue( $result, 'The update should report success.' );
	}

	/**
	 * The provider reports failure when LiteSpeed did not store the value.
	 *
	 * Conf::update_confs() returns nothing, so success is read back from the
	 * stored option rather than assumed.
	 *
	 * @return void
	 */
	public function test_update_reports_failure_when_value_is_not_stored() {
		require_once __DIR__ . '/stubs/class-litespeed-conf-stub.php';

		\LiteSpeed\Conf::set_should_store( false );

		$result = $this->update_option_via( new Guest_Mode(), 'guest', 1 );

		$this->assertFalse( $result, 'A value LiteSpeed refused to store is not a success.' );

		\LiteSpeed\Conf::set_should_store( true );
	}

	/**
	 * Each provider hands LiteSpeed its own option key.
	 *
	 * @return void
	 */
	public function test_each_provider_updates_its_own_option() {
		require_once __DIR__ . '/stubs/class-litespeed-conf-stub.php';

		$this->update_option_via( new Page_Cache(), 'cache', 1 );

		$this->assertSame( [ [ 'cache' => 1 ] ], \LiteSpeed\Conf::get_calls() );
	}

	/**
	 * The task is offered while the setting is off, and not once it is on.
	 *
	 * @return void
	 */
	public function test_should_add_task_follows_the_setting() {
		if ( ! \defined( 'LSCWP_V' ) ) {
			\define( 'LSCWP_V', '7.9' );
		}

		$provider = new Guest_Mode();

		\update_option( 'litespeed.conf.guest', 0 );
		$this->assertTrue( $provider->should_add_task(), 'A disabled setting should be suggested.' );

		\update_option( 'litespeed.conf.guest', 1 );
		$this->assertFalse( $provider->should_add_task(), 'An enabled setting should not be suggested.' );
	}

	/**
	 * A string "1" counts as enabled.
	 *
	 * LiteSpeed casts values on save, so the stored option is not necessarily
	 * the integer the provider wrote.
	 *
	 * @return void
	 */
	public function test_should_add_task_treats_string_one_as_enabled() {
		if ( ! \defined( 'LSCWP_V' ) ) {
			\define( 'LSCWP_V', '7.9' );
		}

		\update_option( 'litespeed.conf.guest', '1' );

		$this->assertFalse(
			( new Guest_Mode() )->should_add_task(),
			'A string "1" is still enabled.'
		);
	}
}
