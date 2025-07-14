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
		\add_action( 'wp_ajax_progress_planner_install', [ $this, 'install' ] );
	}

	/**
	 * Tries to install the plugin
	 *
	 * @access public
	 *
	 * @return void
	 */
	public function install() {
		$can_install = $this->check_capabilities();
		if ( ! $can_install ) {
			\wp_die( \esc_html( $can_install ) );
		}

		\check_ajax_referer( 'progress_planner', 'nonce' );

		$download = isset( $_POST['item_name'] )
			? \sanitize_text_field( \wp_unslash( $_POST['item_name'] ) )
			: '';

		// Throw error if the product is not free and license it empty.
		if ( empty( $download ) ) {
			\wp_send_json_error( \esc_attr__( 'An Error Occured', 'progress-planner' ) );
		}

		// Install the plugin.
		$installed = $this->install_plugin( $download );
		if ( $installed && ! \is_wp_error( $installed ) ) {
			\wp_send_json_success( $installed );
		}
		\wp_send_json_error( \esc_html__( 'An Error Occured', 'progress-planner' ) );
	}

	/**
	 * Install a plugin.
	 *
	 * @param string $plugin The plugin to install.
	 *
	 * @return bool|\WP_Error
	 */
	public function install_plugin( $plugin ) {

		// Check if the user has the necessary capabilities.
		$can_install = $this->check_capabilities();
		if ( ! $can_install ) {
			\wp_die( \esc_html( $can_install ) );
		}

		require_once ABSPATH . 'wp-admin/includes/plugin-install.php'; // @phpstan-ignore-line

		\check_admin_referer( 'install-plugin_' . $plugin );
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
	 * @param string $plugin_name The name of the plugin we want to install.
	 *
	 * @return bool
	 */
	public function is_plugin_installed( $plugin_name ) {
		if ( empty( $plugin_name ) ) {
			return false;
		}
		foreach ( \get_plugins() as $plugin ) {
			if ( $plugin['Name'] === $plugin_name ) {
				return true;
			}
		}
		return false;
	}
}
