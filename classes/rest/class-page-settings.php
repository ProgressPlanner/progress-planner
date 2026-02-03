<?php
/**
 * Page Settings REST API endpoint.
 *
 * Exposes page settings data for React tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Page Settings REST API class.
 */
class Page_Settings extends Base {

	/**
	 * Register the REST API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/page-settings',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_page_settings' ],
				'permission_callback' => [ $this, 'permission_callback' ],
			]
		);
	}

	/**
	 * Get page settings data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response The REST response object.
	 */
	public function get_page_settings( $request ) {
		$settings = \progress_planner()->get_admin__page_settings()->get_settings();

		return new \WP_REST_Response( $settings, 200 );
	}

	/**
	 * Permission callback for page settings endpoint.
	 *
	 * @return bool
	 */
	public function permission_callback() {
		return \current_user_can( 'manage_options' );
	}
}
