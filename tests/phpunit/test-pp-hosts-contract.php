<?php
/**
 * Class PP_Hosts_Contract_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

require_once \dirname( __DIR__ ) . '/contract/class-pp-hosts-contract-checker.php';

/**
 * Guards the Progress Planner API surface that pp-hosts depends on.
 *
 * If this fails, a change here would break pp-hosts. Either keep the old
 * hook/method/asset (deprecate instead of removing), or update pp-hosts in
 * the same release and regenerate tests/contract/pp-hosts-contract.json from
 * pp-hosts (bin/build-pp-contract.php).
 */
class PP_Hosts_Contract_Test extends \WP_UnitTestCase {

	/**
	 * Test that Progress Planner still satisfies the pp-hosts contract.
	 *
	 * @return void
	 */
	public function test_pp_hosts_contract() {
		$checker  = new PP_Hosts_Contract_Checker(
			\dirname( __DIR__, 2 ),
			\dirname( __DIR__ ) . '/contract/pp-hosts-contract.json'
		);
		$failures = $checker->check();

		$message = '';
		foreach ( $failures as $section => $messages ) {
			$message .= "\n[{$section}]\n  - " . \implode( "\n  - ", $messages );
		}

		$this->assertEmpty( $failures, "Progress Planner no longer satisfies the pp-hosts contract:{$message}" );
	}
}
