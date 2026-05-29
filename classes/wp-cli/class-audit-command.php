<?php
/**
 * WP CLI commands for the website specification audit.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\WP_CLI;

use WP_CLI;
use WP_CLI_Command;
use Progress_Planner\Suggested_Tasks\Providers\Spec_Audit;
use Progress_Planner\Suggested_Tasks\Data_Collector\Spec_Audit as Spec_Audit_Data_Collector;

if ( ! \class_exists( 'WP_CLI_Command' ) ) {
	return;
}

/**
 * Audit command.
 */
class Audit_Command extends \WP_CLI_Command {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\WP_CLI::add_command( 'prpl audit', '\Progress_Planner\WP_CLI\Audit_Command' ); // @phpstan-ignore-line
	}

	/**
	 * Run the website specification audit and inject any newly surfaced tasks.
	 *
	 * Refreshes the audit cache (re-running the deterministic checks and, when a
	 * WordPress AI connector is configured, the AI audit) and then injects tasks
	 * for failing rules, respecting the per-window throttle.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Accepted values: table, csv, json, yaml. Default: table
	 *
	 * ## EXAMPLES
	 *
	 *     # Run the audit now
	 *     $ wp prpl audit run
	 *
	 *     # Run the audit and show findings as JSON
	 *     $ wp prpl audit run --format=json
	 *
	 * @param array $args       Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function run( $args, $assoc_args ) {
		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'spec-audit' );

		if ( ! $provider instanceof Spec_Audit ) {
			\WP_CLI::error( 'Spec audit provider not found.' ); // @phpstan-ignore-line
			return;
		}

		$injected = $provider->run_audit_now();

		$collector = new Spec_Audit_Data_Collector();
		$findings  = $collector->get_failing_findings();

		$format = isset( $assoc_args['format'] ) ? $assoc_args['format'] : 'table';
		$fields = [ 'rule_id', 'category', 'severity', 'status', 'title' ];

		$rows = [];
		foreach ( $findings as $finding ) {
			$rows[] = [
				'rule_id'  => $finding['rule_id'] ?? '',
				'category' => $finding['category'] ?? '',
				'severity' => $finding['severity'] ?? '',
				'status'   => $finding['status'] ?? '',
				'title'    => $finding['title'] ?? '',
			];
		}

		if ( ! empty( $rows ) ) {
			WP_CLI\Utils\format_items( $format, $rows, $fields ); // @phpstan-ignore-line
		}

		\WP_CLI::success( // @phpstan-ignore-line
			\sprintf(
				'%d failing rule(s); %d task(s) injected this run.',
				\count( $findings ),
				\count( $injected )
			)
		);
	}
}
