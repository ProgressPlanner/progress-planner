<?php
/**
 * CLI: check Progress Planner against the pp-hosts contract, without WordPress.
 *
 * Usage:
 *   php tests/contract/check-pp-hosts-contract.php [contract.json] [--json]
 *
 * Defaults to tests/contract/pp-hosts-contract.json. Exits 1 on failures.
 * The pp-hosts integration runner (pp-hosts/bin/pp-integration.sh) calls this
 * with the contract freshly generated from the pp-hosts branch under test.
 *
 * @package Progress_Planner\Tests
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput.OutputNotEscaped -- CLI script.

if ( 'cli' !== \PHP_SAPI ) {
	exit( 1 );
}

$prpl_pp_dir = \dirname( __DIR__, 2 );
$prpl_args   = \array_slice( $argv, 1 );
$prpl_json   = \in_array( '--json', $prpl_args, true );
$prpl_files  = \array_values( \array_diff( $prpl_args, [ '--json' ] ) );
$prpl_file   = $prpl_files[0] ?? __DIR__ . '/pp-hosts-contract.json';

// Minimal shims so the autoloader works outside WordPress.
if ( ! \function_exists( 'esc_html' ) ) {
	/**
	 * Shim.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	function esc_html( $text ) { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- WP shim, only defined outside WordPress.
		return \htmlspecialchars( (string) $text, \ENT_QUOTES );
	}
}
if ( ! \defined( 'PROGRESS_PLANNER_DIR' ) ) {
	\define( 'PROGRESS_PLANNER_DIR', $prpl_pp_dir );
}

require_once $prpl_pp_dir . '/autoload.php';
require_once __DIR__ . '/class-pp-hosts-contract-checker.php';

$prpl_checker  = new \Progress_Planner\Tests\PP_Hosts_Contract_Checker( $prpl_pp_dir, $prpl_file );
$prpl_failures = $prpl_checker->check();
$prpl_known    = $prpl_checker->get_known();

if ( $prpl_json ) {
	echo \json_encode(
		[
			'failures' => (object) $prpl_failures,
			'known'    => (object) $prpl_known,
		],
		\JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES
	) . "\n";
	exit( empty( $prpl_failures ) ? 0 : 1 );
}

foreach ( $prpl_known as $prpl_message => $prpl_reason ) {
	echo "known issue: {$prpl_message}\n             ({$prpl_reason})\n";
}

if ( empty( $prpl_failures ) ) {
	echo "pp-hosts contract: OK\n";
} else {
	echo "pp-hosts contract: FAILED\n";
	foreach ( $prpl_failures as $prpl_section => $prpl_messages ) {
		echo "\n[{$prpl_section}]\n";
		foreach ( $prpl_messages as $prpl_message ) {
			echo "  - {$prpl_message}\n";
		}
	}
}

exit( empty( $prpl_failures ) ? 0 : 1 );
