<?php
/**
 * Angie AI Integration for Progress Planner.
 *
 * This class initializes the Angie integration by:
 * - Loading REST API endpoints for task management
 * - Registering MCP server for AI interactions
 * - Enqueuing necessary JavaScript and CSS assets
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Third_Party\Angie;

use Progress_Planner\Third_Party\Angie\Angie_API;
/**
 * Main Angie Integration class.
 */
class Integration {

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Initialize REST API.
		new Angie_API();

		// Enqueue MCP server script.
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Enqueue scripts for Angie integration.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Only load if Angie plugin is active.
		if ( ! $this->is_angie_active() ) {
			return;
		}

		// Enqueue the MCP server script.
		$script_path = \constant( 'PROGRESS_PLANNER_DIR' ) . '/classes/third-party/angie/dist/progress-planner-mcp-server.js';
		$script_url  = \constant( 'PROGRESS_PLANNER_URL' ) . '/classes/third-party/angie/dist/progress-planner-mcp-server.js';

		if ( \file_exists( $script_path ) ) {
			\wp_enqueue_script(
				'progress-planner-angie-mcp',
				$script_url,
				[],
				\filemtime( $script_path ),
				true
			);

			// Add type="module" attribute to the script tag for ES modules.
			\add_filter(
				'script_loader_tag',
				function ( $tag, $handle ) {
					if ( 'progress-planner-angie-mcp' === $handle ) {
						// Ensure type="module" is added and remove any existing type attribute.
						if ( false !== \strpos( $tag, 'type=' ) ) {
							$tag = \preg_replace( '/type=["\'][^"\']*["\']/', 'type="module"', $tag );
						} else {
							$tag = \str_replace( '<script ', '<script type="module" ', $tag );
						}
					}
					return $tag;
				},
				10,
				2
			);

			// Pass WordPress site URL and nonce to the script.
			\wp_localize_script(
				'progress-planner-angie-mcp',
				'progressPlannerAngie',
				[
					'restUrl'   => \rest_url( 'progress-planner/v1/angie' ),
					'nonce'     => \wp_create_nonce( 'wp_rest' ),
					'siteUrl'   => \get_site_url(),
					'pluginUrl' => \constant( 'PROGRESS_PLANNER_URL' ),
				]
			);
		}
	}

	/**
	 * Check if Angie plugin is active.
	 *
	 * @return bool
	 */
	private function is_angie_active() {
		// Check if Angie plugin is active.
		return \class_exists( 'Angie' ) || \defined( 'ANGIE_VERSION' );
	}
}
