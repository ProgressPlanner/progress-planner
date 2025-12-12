<?php
/**
 * Plugin Installer REST API controller.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Plugin Installer REST API controller.
 */
class Plugin_Installer extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/plugins/install',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'install_plugin' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'plugin_slug' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function ( $param ) {
								return ! empty( $param );
							},
						],
					],
				],
			]
		);

		\register_rest_route(
			'progress-planner/v1',
			'/plugins/activate',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'activate_plugin' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'plugin_slug' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function ( $param ) {
								return ! empty( $param );
							},
						],
					],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'install_plugins' );
	}

	/**
	 * Install a plugin.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function install_plugin( $request ) {
		$slug = $request->get_param( 'plugin_slug' );

		// If the plugin slug is empty, return an error.
		if ( empty( $slug ) ) {
			return new \WP_Error(
				'empty_plugin_slug',
				\esc_html__( 'An Error Occured', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// If the plugin is already installed, return a success message.
		if ( $this->is_plugin_installed( $slug ) ) {
			return new \WP_REST_Response(
				[
					'code'    => 'plugin_already_installed',
					'message' => \esc_html__( 'Plugin already installed', 'progress-planner' ),
				],
				200
			);
		}

		// Install the plugin.
		$installed = $this->do_install_plugin( $slug );

		// If the plugin is installed, return a success message.
		if ( $installed && ! \is_wp_error( $installed ) ) {
			return new \WP_REST_Response(
				[
					'code'    => 'plugin_installed',
					'message' => \esc_html__( 'Plugin installed', 'progress-planner' ),
				],
				200
			);
		}

		// If the plugin installation returned a WP_Error, use that error.
		if ( \is_wp_error( $installed ) ) {
			return new \WP_Error(
				$installed->get_error_code(),
				$installed->get_error_message(),
				[ 'status' => 500 ]
			);
		}

		// If the plugin is not installed, return an error message.
		return new \WP_Error(
			'install_failed',
			\esc_html__( 'An Error Occured', 'progress-planner' ),
			[ 'status' => 500 ]
		);
	}

	/**
	 * Activate a plugin.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function activate_plugin( $request ) {
		$plugin_slug = $request->get_param( 'plugin_slug' );

		// If the plugin slug is empty, return an error.
		if ( empty( $plugin_slug ) ) {
			return new \WP_Error(
				'empty_plugin_slug',
				\esc_html__( 'An Error Occured', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// Get the plugin path.
		$plugin_path = $this->get_plugin_path( $plugin_slug );

		// If the plugin path is empty, return an error.
		if ( empty( $plugin_path ) ) {
			return new \WP_Error(
				'plugin_not_found',
				\esc_html__( 'An Error Occured', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		// Activate the plugin.
		$activated = \activate_plugin( $plugin_path );

		// If the plugin is not activated, return an error message.
		if ( \is_wp_error( $activated ) ) {
			return new \WP_Error(
				'activate_failed',
				\esc_html__( 'An Error Occured', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		// If the plugin is activated, return a success message.
		return new \WP_REST_Response(
			[
				'code'    => 'plugin_activated',
				'message' => \esc_html__( 'Plugin activated', 'progress-planner' ),
			],
			200
		);
	}

	/**
	 * Install a plugin.
	 *
	 * @param string $plugin The plugin to install.
	 *
	 * @return bool|\WP_Error
	 */
	private function do_install_plugin( $plugin ) {
		// Include the necessary files.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/class-plugin-installer-skin.php'; // @phpstan-ignore-line

		// Get the plugin information.
		$api = \plugins_api(
			'plugin_information',
			[
				'slug'   => $plugin,
				'fields' => [
					'sections' => false,
				],
			]
		);

		// If the plugin information is not found, return an error.
		if ( \is_wp_error( $api ) ) {
			return $api;
		}

		$api = (object) $api;
		// If the plugin download link is not found, return an error.
		if ( ! isset( $api->download_link ) ) {
			return new \WP_Error( 'no_download_link', \__( 'No download link found', 'progress-planner' ) );
		}

		// If the plugin name is not found, return an error.
		if ( ! isset( $api->name ) ) {
			return new \WP_Error( 'no_name', \__( 'No name found', 'progress-planner' ) );
		}

		// If the plugin version is not found, return an error.
		if ( ! isset( $api->version ) ) {
			return new \WP_Error( 'no_version', \__( 'No version found', 'progress-planner' ) );
		}

		// Create a new plugin upgrader.
		$upgrader = new \Plugin_Upgrader(
			new \Plugin_Installer_Skin(
				[
					'type'   => 'web',
					/* translators: %s: Plugin name and version. */
					'title'  => \sprintf( \__( 'Installing Plugin: %s', 'progress-planner' ), $api->name . ' ' . $api->version ),
					'url'    => 'update.php?action=install-plugin&plugin=' . \rawurlencode( $plugin ),
					'nonce'  => 'install-plugin_' . $plugin,
					'plugin' => $plugin,
					'api'    => $api,
				]
			)
		);

		// Install the plugin.
		return $upgrader->install( $api->download_link );
	}

	/**
	 * Checks if plugin is installed.
	 *
	 * @param string $plugin_slug The slug of the plugin we want to check.
	 *
	 * @return bool
	 */
	private function is_plugin_installed( $plugin_slug ) {
		return \Progress_Planner\Utils\Plugin_Utils::is_plugin_installed( $plugin_slug );
	}

	/**
	 * Get the path of the plugin.
	 *
	 * @param string $plugin_slug The slug of the plugin we want to get the path for.
	 *
	 * @return string
	 */
	private function get_plugin_path( $plugin_slug ) {
		return \Progress_Planner\Utils\Plugin_Utils::get_plugin_path( $plugin_slug );
	}
}

