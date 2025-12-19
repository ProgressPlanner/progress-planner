<?php
/**
 * Popover Actions REST API controller.
 *
 * Handles popover form submissions for interactive tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Popover Actions REST API controller.
 */
class Popover_Actions extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/popover/submit',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'submit_action' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'setting'      => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function ( $param ) {
								return ! empty( $param );
							},
						],
						'value'        => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							// Allow empty strings as some settings may be empty.
							'validate_callback' => function ( $param ) {
								return null !== $param;
							},
						],
						'setting_path' => [
							'required'          => false,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'default'           => '',
							'description'       => 'JSON string representing the path to nested setting (e.g., \'["key1","key2"]\')',
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
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Handle popover form submission.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function submit_action( $request ) {
		$setting      = $request->get_param( 'setting' );
		$value        = $request->get_param( 'value' );
		$setting_path = $request->get_param( 'setting_path' );

		// Get allowed options from Tasks_Interactive class.
		// We need to instantiate a temporary instance to access the protected method.
		// Since it's abstract, we'll use a reflection-based approach or create a helper.
		$allowed_options = $this->get_allowed_interactive_options();

		if ( ! \in_array( $setting, $allowed_options, true ) ) {
			return new \WP_Error(
				'invalid_setting',
				\esc_html__( 'Invalid setting. This option cannot be updated through interactive tasks.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// Handle nested setting paths.
		if ( ! empty( $setting_path ) ) {
			$setting_path_array = \json_decode( $setting_path, true );
			// Check if JSON decode was successful and result is a non-empty array.
			if ( \json_last_error() !== \JSON_ERROR_NONE || ! \is_array( $setting_path_array ) || empty( $setting_path_array ) ) {
				return new \WP_Error(
					'invalid_setting_path',
					\esc_html__( 'Invalid setting path format. Expected a JSON array.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}
			$setting_value = \get_option( $setting, [] );
			// Ensure setting_value is an array for nested path updates.
			if ( ! \is_array( $setting_value ) ) {
				$setting_value = [];
			}
			\_wp_array_set( $setting_value, $setting_path_array, $value );
			$updated = \update_option( $setting, $setting_value );
			if ( ! $updated ) {
				return new \WP_Error(
					'update_failed',
					\esc_html__( 'Failed to update setting.', 'progress-planner' ),
					[ 'status' => 500 ]
				);
			}
			return new \WP_REST_Response(
				[
					'success' => true,
					'message' => \esc_html__( 'Setting updated.', 'progress-planner' ),
				],
				200
			);
		}

		// Handle simple setting update.
		$updated = \update_option( $setting, $value );
		if ( ! $updated ) {
			return new \WP_Error(
				'update_failed',
				\esc_html__( 'Failed to update setting.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		return new \WP_REST_Response(
			[
				'success' => true,
				'message' => \esc_html__( 'Setting updated.', 'progress-planner' ),
			],
			200
		);
	}

	/**
	 * Get the list of allowed options that can be updated via interactive tasks.
	 *
	 * This mirrors the method from Tasks_Interactive class.
	 *
	 * @return array List of allowed option names.
	 */
	private function get_allowed_interactive_options() {
		$allowed_options = [
			// Core WordPress settings that are safe to update via interactive tasks.
			'blogdescription',          // Site tagline.
			'blog_public',              // Search engine visibility (allow indexing).
			'default_comment_status',   // Comment settings.
			'default_ping_status',      // Pingback settings.
			'timezone_string',          // Site timezone.
			'WPLANG',                   // Site language/locale (deprecated since WP 4.0, but still used by class-select-locale.php).
			'date_format',              // Date format.
			'time_format',              // Time format.
			'default_pingback_flag',    // Pingback flag.
			'comment_registration',     // Comment registration.
			'close_comments_for_old_posts', // Close comments for old posts.
			'thread_comments',          // Threaded comments.
			'comments_per_page',        // Comments per page.
			'comment_order',            // Comment order.
			'page_comments',            // Paginate comments.
		];

		/**
		 * Filter the list of allowed options for interactive tasks.
		 *
		 * WARNING: Be very careful when extending this list. Adding sensitive
		 * options like 'admin_email', 'users_can_register', or plugin-specific
		 * options that control access or permissions could create security vulnerabilities.
		 *
		 * @param array $allowed_options List of allowed option names.
		 *
		 * @return array Modified list of allowed option names.
		 */
		return \apply_filters( 'progress_planner_interactive_task_allowed_options', $allowed_options );
	}
}
