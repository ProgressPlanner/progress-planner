<?php
/**
 * Class Uninstall_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Uninstall test case.
 */
class Uninstall_Test extends \WP_UnitTestCase {

	/**
	 * Test that the uninstall file runs without fatal error.
	 *
	 * @return void
	 */
	public function test_uninstall_file_runs_without_fatal_error() {
		$uninstall_file = \plugin_dir_path( __DIR__ ) . '../uninstall.php';

		$this->assertFileExists( $uninstall_file, 'Uninstall file does not exist.' );

		// Catch fatal errors.
		$errors = [];
		\set_error_handler( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
			function ( $errno, $errstr ) use ( &$errors ) {
				$errors[] = "$errno: $errstr";
				return true; // prevent default error handler.
			}
		);

		// Needed to simulate WordPress uninstall context.
		\define( 'WP_UNINSTALL_PLUGIN', true );

		// Include the uninstall script.
		try {
			require $uninstall_file;
		} catch ( \Throwable $e ) {
			$this->fail( 'Fatal error during uninstall.php: ' . $e->getMessage() );
		}

		\restore_error_handler();

		$this->assertEmpty( $errors, 'Uninstall file caused PHP warnings or errors: ' . \implode( ', ', $errors ) );
	}
}
