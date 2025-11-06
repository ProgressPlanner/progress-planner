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

/**
 * Main Angie Integration class.
 */
class Integration {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Load REST API endpoints.
		require_once __DIR__ . '/class-angie.php';

		// Initialize REST API.
		add_action( 'rest_api_init', [ $this, 'init_rest_api' ] );

		// Enqueue MCP server script.
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Initialize REST API endpoints.
	 *
	 * @return void
	 */
	public function init_rest_api() {
		new \Progress_Planner\Rest\Angie();
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
		$script_path = PROGRESS_PLANNER_DIR . '/third-party/angie/dist/mcp-server.js';
		$script_url  = PROGRESS_PLANNER_URL . '/third-party/angie/dist/mcp-server.js';

		if ( file_exists( $script_path ) ) {
			wp_enqueue_script(
				'progress-planner-angie-mcp',
				$script_url,
				[],
				filemtime( $script_path ),
				true
			);

			// Pass WordPress site URL and nonce to the script.
			wp_localize_script(
				'progress-planner-angie-mcp',
				'progressPlannerAngie',
				[
					'restUrl'   => rest_url( 'progress-planner/v1/angie' ),
					'nonce'     => wp_create_nonce( 'wp_rest' ),
					'siteUrl'   => get_site_url(),
					'pluginUrl' => PROGRESS_PLANNER_URL,
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
		return class_exists( 'Angie' ) || defined( 'ANGIE_VERSION' );
	}
}
