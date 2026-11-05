<?php
/**
 * Minimal stand-in for LiteSpeed's Conf class.
 *
 * LiteSpeed Cache is not installed in CI, so this records what
 * update_litespeed_option() asks it to do and stores the value the way the real
 * Conf does, letting the tests assert the update is routed through LiteSpeed
 * rather than written straight to the option row.
 *
 * @package Progress_Planner\Tests
 */

// The stub has to occupy LiteSpeed's own namespace to stand in for its class.
namespace LiteSpeed; // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound

if ( ! \class_exists( '\LiteSpeed\Conf' ) ) {

	/**
	 * Conf stub.
	 */
	class Conf {

		/**
		 * The calls made to update_confs().
		 *
		 * @var array[]
		 */
		private static $calls = [];

		/**
		 * Whether the stub should actually store values.
		 *
		 * @var bool
		 */
		private static $should_store = true;

		/**
		 * Get the singleton.
		 *
		 * @return self
		 */
		public static function cls() {
			return new self();
		}

		/**
		 * Record and apply a config update.
		 *
		 * @param array $the_matrix Option key => value pairs.
		 *
		 * @return void
		 */
		public function update_confs( $the_matrix = [] ) {
			self::$calls[] = $the_matrix;

			if ( ! self::$should_store ) {
				return;
			}

			foreach ( $the_matrix as $key => $value ) {
				\update_option( 'litespeed.conf.' . $key, $value );
			}
		}

		/**
		 * Get the recorded calls.
		 *
		 * @return array[]
		 */
		public static function get_calls() {
			return self::$calls;
		}

		/**
		 * Forget the recorded calls.
		 *
		 * @return void
		 */
		public static function reset_calls() {
			self::$calls = [];
		}

		/**
		 * Set whether the stub stores values.
		 *
		 * @param bool $should_store Whether to store.
		 *
		 * @return void
		 */
		public static function set_should_store( $should_store ) {
			self::$should_store = (bool) $should_store;
		}
	}
}
