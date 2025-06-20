<?php
/**
 * WP CLI commands.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\WP_CLI;

use WP_CLI, WP_CLI_Command;

use Progress_Planner\Base;
use Progress_Planner\Admin\Widgets\Activity_Scores;

if ( ! class_exists( 'WP_CLI_Command' ) ) {
	return;
}

/**
 * Queue command.
 */
class Get_Stats_Command extends \WP_CLI_Command {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\WP_CLI::add_command( 'prpl', '\Progress_Planner\WP_CLI\Get_Stats_Command' ); // @phpstan-ignore-line
	}

	/**
	 * Get the stats.
	 *
	 * @param array $args The arguments.
	 * @param array $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function get_stats( $args, $assoc_args ) {
		$system_status = new \Progress_Planner\Utils\System_Status();
		\WP_CLI::log( wp_json_encode( $system_status->get_system_status() ) ); // @phpstan-ignore-line
	}
}
