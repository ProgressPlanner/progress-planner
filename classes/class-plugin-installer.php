<?php
/**
 * Plugin installer class.
 *
 * @package Progress_Planner
 *
 * Inspired by https://github.com/aristath/edd-remote-installer-client
 */

namespace Progress_Planner;

/**
 * Plugin installer class.
 */
class Plugin_Installer {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'wp_ajax_progress_planner_install_plugin', [ $this, 'install' ] );
		\add_action( 'wp_ajax_progress_planner_activate_plugin', [ $this, 'activate' ] );
	}

	/**
	 * Tries to install the plugin
	 *
	 * @return void
	 */
	public function install() {
		$can_install = $this->check_capabilities();
		if ( ! $can_install ) {
			\wp_die( \esc_html( $can_install ) );
		}

		\check_ajax_referer( 'progress_planner', 'nonce' );

		$download = isset( $_POST['plugin_slug'] )
			? \sanitize_text_field( \wp_unslash( $_POST['plugin_slug'] ) )
			: '';

		if ( empty( $download ) ) {
			\wp_send_json_error(
				[
					'code'    => 'empty_plugin_slug',
					'message' => \esc_attr__( 'An Error Occured', 'progress-planner' ),
				]
			);
		}

		if ( $this->is_plugin_installed( $download ) ) {
			\wp_send_json_success(
				[
					'code'    => 'plugin_already_installed',
					'message' => \esc_html__( 'Plugin already installed', 'progress-planner' ),
				]
			);
		}

		$installed = $this->install_plugin( $download );
		if ( $installed && ! \is_wp_error( $installed ) ) {
			\wp_send_json_success(
				[
					'code'    => 'plugin_installed',
					'message' => \esc_html__( 'Plugin installed', 'progress-planner' ),
				]
			);
		}
		\wp_send_json_error(
			[
				'code'    => 'install_failed',
				'message' => \esc_html__( 'An Error Occured', 'progress-planner' ),
			]
		);
	}

	/**
	 * Tries to activate the plugin
	 *
	 * @return void
	 */
	public function activate() {
		$can_activate = $this->check_capabilities();
		if ( ! $can_activate ) {
			\wp_die( \esc_html( $can_activate ) );
		}

		\check_ajax_referer( 'progress_planner', 'nonce' );

		$plugin_slug = isset( $_POST['plugin_slug'] )
			? \sanitize_text_field( \wp_unslash( $_POST['plugin_slug'] ) )
			: '';

		if ( empty( $plugin_slug ) ) {
			\wp_send_json_error(
				[
					'code'    => 'empty_plugin_slug',
					'message' => \esc_attr__( 'An Error Occured', 'progress-planner' ),
				]
			);
		}

		$plugin_path = '';
		foreach ( \array_keys( \get_plugins() ) as $plugin ) {
			if ( \explode( '/', $plugin )[0] === $plugin_slug ) {
				$plugin_path = $plugin;
				break;
			}
		}

		if ( empty( $plugin_path ) ) {
			\wp_send_json_error(
				[
					'code'    => 'plugin_not_found',
					'message' => \esc_attr__( 'An Error Occured', 'progress-planner' ),
				]
			);
		}

		$activated = \activate_plugin( $plugin_path );
		if ( \is_wp_error( $activated ) ) {
			\wp_send_json_error(
				[
					'code'    => 'activate_failed',
					'message' => \esc_attr__( 'An Error Occured', 'progress-planner' ),
				]
			);
		}

		\wp_send_json_success(
			[
				'code'    => 'plugin_activated',
				'message' => \esc_html__( 'Plugin activated', 'progress-planner' ),
			]
		);
	}

	/**
	 * Install a plugin.
	 *
	 * @param string $plugin The plugin to install.
	 *
	 * @return bool|\WP_Error
	 */
	private function install_plugin( $plugin ) {
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php'; // @phpstan-ignore-line
		require_once ABSPATH . 'wp-admin/includes/class-plugin-installer-skin.php'; // @phpstan-ignore-line
		$api = \plugins_api(
			'plugin_information',
			[
				'slug'   => $plugin,
				'fields' => [
					'sections' => false,
				],
			]
		);

		if ( \is_wp_error( $api ) ) {
			\wp_die( $api ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		$api = (object) $api;
		if ( ! isset( $api->download_link ) ) {
			return new \WP_Error( 'no_download_link', \__( 'No download link found', 'progress-planner' ) );
		}
		if ( ! isset( $api->name ) ) {
			return new \WP_Error( 'no_name', \__( 'No name found', 'progress-planner' ) );
		}
		if ( ! isset( $api->version ) ) {
			return new \WP_Error( 'no_version', \__( 'No version found', 'progress-planner' ) );
		}

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
		return $upgrader->install( $api->download_link );
	}

	/**
	 * Check if the user is allowed to install the plugin.
	 *
	 * @return string|true Error message, or true if the user is allowed to install the plugin.
	 */
	public function check_capabilities() {
		return \current_user_can( 'install_plugins' )
			? true
			: \esc_html__( 'Sorry, you are not allowed to install plugins on this site.', 'progress-planner' );
	}

	/**
	 * Checks if plugin is intalled
	 *
	 * @param string $plugin_slug The slug of the plugin we want to install.
	 *
	 * @return bool
	 */
	public function is_plugin_installed( $plugin_slug ) {
		return ! empty( $this->get_plugin_path( $plugin_slug ) );
	}

	/**
	 * Checks if plugin is activated
	 *
	 * @param string $plugin_slug The slug of the plugin we want to install.
	 *
	 * @return bool
	 */
	public function is_plugin_activated( $plugin_slug ) {
		$plugin_path = $this->get_plugin_path( $plugin_slug );
		if ( empty( $plugin_path ) ) {
			return false;
		}
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore-line
		}
		return \is_plugin_active( $plugin_path );
	}

	/**
	 * Get the path of the plugin
	 *
	 * @param string $plugin_slug The slug of the plugin we want to install.
	 *
	 * @return string
	 */
	private function get_plugin_path( $plugin_slug ) {
		if ( empty( $plugin_slug ) ) {
			return '';
		}
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore-line
		}
		foreach ( \array_keys( \get_plugins() ) as $plugin ) {
			if ( \explode( '/', $plugin )[0] === $plugin_slug ) {
				return $plugin;
			}
		}
		return '';
	}
}
