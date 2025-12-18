<?php
/**
 * Data Collectors REST API endpoint.
 *
 * Provides access to data collector results via REST API.
 * Used by React task providers to evaluate task conditions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Data Collectors REST API class.
 */
class Data_Collectors extends Base {

	/**
	 * Register the REST API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/data-collectors/(?P<collector_id>[a-zA-Z0-9_-]+)',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_collector_data' ],
					'permission_callback' => [ $this, 'permission_callback' ],
					'args'                => [
						'collector_id' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_key',
						],
					],
				],
			]
		);
	}

	/**
	 * Permission callback for data collector endpoint.
	 *
	 * @return bool
	 */
	public function permission_callback() {
		return \current_user_can( 'edit_others_posts' );
	}

	/**
	 * Get data collector data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object or error.
	 */
	public function get_collector_data( $request ) {
		$collector_id = $request->get_param( 'collector_id' );

		if ( ! \is_string( $collector_id ) ) {
			return new \WP_Error(
				'rest_invalid_collector_id',
				\esc_html__( 'Invalid collector ID.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// Map collector IDs to data collector classes.
		$collector_map = $this->get_collector_map();

		if ( ! isset( $collector_map[ $collector_id ] ) ) {
			return new \WP_Error(
				'rest_collector_not_found',
				\esc_html__( 'Data collector not found.', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		$collector_class = $collector_map[ $collector_id ];
		// @phpstan-ignore-next-line -- Array key access is validated above.

		if ( ! \class_exists( $collector_class ) ) {
			return new \WP_Error(
				'rest_collector_class_not_found',
				\esc_html__( 'Data collector class not found.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		// Instantiate and collect data.
		$collector = new $collector_class();
		// @phpstan-ignore-next-line -- Dynamic class instantiation.
		$data = $collector->collect();

		return new \WP_REST_Response(
			[
				'collector_id' => $collector_id,
				'data'         => $data,
			],
			200
		);
	}

	/**
	 * Get the map of collector IDs to class names.
	 *
	 * Maps collector IDs (kebab-case) to data collector class names.
	 * Collector IDs should match the DATA_KEY constant values (converted to kebab-case).
	 *
	 * @return array<string, string> Array of collector_id => class_name mappings.
	 */
	protected function get_collector_map() {
		$map = [
			'hello_world_post_id'       => \Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World::class,
			'sample_page_id'            => \Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page::class,
			'inactive_plugins_count'    => \Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins::class,
			'uncategorized_category_id' => \Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category::class,
			'post_author_count'         => \Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author::class,
			'last_published_post_id'    => \Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post::class,
			'archive_format_count'      => \Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format::class,
			'terms_without_posts'       => \Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts::class,
			'terms_without_description' => \Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Description::class,
			'post_tag_count'            => \Progress_Planner\Suggested_Tasks\Data_Collector\Post_Tag_Count::class,
			'published_post_count'      => \Progress_Planner\Suggested_Tasks\Data_Collector\Published_Post_Count::class,
			'unpublished_content'       => \Progress_Planner\Suggested_Tasks\Data_Collector\Unpublished_Content::class,
			'seo_plugin_installed'      => \Progress_Planner\Suggested_Tasks\Data_Collector\SEO_Plugin::class,
			'php_version'               => \Progress_Planner\Suggested_Tasks\Data_Collector\PHP_Version::class,
			'wp_debug_status'           => \Progress_Planner\Suggested_Tasks\Data_Collector\WP_Debug::class,
			'old_posts_for_review'      => \Progress_Planner\Suggested_Tasks\Data_Collector\Old_Posts_For_Review::class,
		];

		/**
		 * Filter the data collector map.
		 *
		 * Allows third-party plugins to register custom data collectors.
		 *
		 * @param array<string, string> $map Array of collector_id => class_name mappings.
		 * @return array<string, string> Modified map.
		 */
		return \apply_filters( 'progress_planner_data_collector_map', $map );
	}
}
