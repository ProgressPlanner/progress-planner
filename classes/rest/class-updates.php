<?php
/**
 * Updates REST API endpoint.
 *
 * Exposes WordPress update data (core, plugins, themes) for React tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Updates REST API class.
 */
class Updates extends Base {

	/**
	 * Register the REST API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'wp/v2',
			'/updates',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_updates' ],
				'permission_callback' => [ $this, 'permission_callback' ],
			]
		);
	}

	/**
	 * Get update data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object or error.
	 */
	public function get_updates( $request ) {
		// Ensure update functions are loaded.
		if ( ! \function_exists( 'get_core_updates' ) ) {
			// @phpstan-ignore-next-line requireOnce.fileNotFound
			require_once ABSPATH . 'wp-admin/includes/update.php';
		}

		// Get update data.
		$update_data = \wp_get_update_data();

		// Format response.
		$response = [
			'core'    => [],
			'plugins' => [],
			'themes'  => [],
			'counts'  => [
				'total'        => $update_data['counts']['total'] ?? 0,
				'core'         => $update_data['counts']['core'] ?? 0,
				'plugins'      => $update_data['counts']['plugins'] ?? 0,
				'themes'       => $update_data['counts']['themes'] ?? 0,
				'translations' => $update_data['counts']['translations'] ?? 0,
			],
		];

		// Get core updates.
		$core_updates = \get_core_updates();
		if ( \is_array( $core_updates ) && ! empty( $core_updates ) ) {
			$response['core'] = \array_map(
				function ( $update ) {
					return [
						'version'     => $update->version ?? '',
						'current'     => $update->current ?? '',
						'download'    => $update->download ?? '',
						'locale'      => $update->locale ?? '',
						'packages'    => $update->packages ?? [],
						'response'    => $update->response ?? '',
						'php_version' => $update->php_version ?? '',
					];
				},
				\array_filter( $core_updates, 'is_object' )
			);
		}

		// Get plugin updates.
		$plugin_updates = \get_plugin_updates();
		if ( $plugin_updates ) {
			$response['plugins'] = \array_map(
				function ( $file, $data ) {
					$update = isset( $data->update ) && \is_object( $data->update ) ? $data->update : null;
					return [
						'file'        => $file,
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
						'name'        => $data->Name ?? '',
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
						'version'     => $data->Version ?? '',
						'new_version' => $update->new_version ?? '',
						'url'         => $update->url ?? '',
						'package'     => $update->package ?? '',
					];
				},
				\array_keys( $plugin_updates ),
				$plugin_updates
			);
		}

		// Get theme updates.
		$theme_updates = \get_theme_updates();
		if ( $theme_updates ) {
			$response['themes'] = \array_map(
				function ( $stylesheet, $data ) {
					return [
						'stylesheet' => $stylesheet,
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
						'name'       => $data->Name ?? '',
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
						'version'    => $data->Version ?? '',
						'new_version' => $data->update['new_version'] ?? '',
						'url'        => $data->update['url'] ?? '',
						'package'    => $data->update['package'] ?? '',
					];
				},
				\array_keys( $theme_updates ),
				$theme_updates
			);
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Permission callback for updates endpoint.
	 *
	 * @return bool
	 */
	public function permission_callback() {
		return \current_user_can( 'update_core' );
	}
}
