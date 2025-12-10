<?php
/**
 * REST API endpoint for What's New widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Whats_New REST API endpoint class.
 */
class Whats_New extends \Progress_Planner\Rest\Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/whats-new',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_whats_new' ],
					'permission_callback' => [ $this, 'check_permissions' ],
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
		return \current_user_can( 'edit_posts' );
	}

	/**
	 * Get what's new data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_whats_new( $request ) {
		$widget = \progress_planner()->get_admin__widgets__whats_new();
		$posts  = $widget->get_blog_feed();

		// Return empty array if no posts.
		if ( empty( $posts ) ) {
			return new \WP_REST_Response(
				[
					'posts'   => [],
					'blogUrl' => '',
				]
			);
		}

		// Format posts for frontend.
		$formatted_posts = \array_map(
			function ( $post ) {
				$image_url = $post['featured_media']['media_details']['sizes']['medium_large']['source_url'] ?? null;
				return [
					'title'    => $post['title']['rendered'],
					'link'     => $post['link'],
					'excerpt'  => \wp_trim_words( \wp_strip_all_tags( $post['content']['rendered'] ), 55 ),
					'imageUrl' => $image_url,
				];
			},
			$posts
		);

		return new \WP_REST_Response(
			[
				'posts'   => $formatted_posts,
				'blogUrl' => \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/blog' ),
			]
		);
	}
}
