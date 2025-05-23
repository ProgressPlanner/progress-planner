<?php
/**
 * Helper methods for content activities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Activities;

use Progress_Planner\Activities\Content as Activities_Content;

/**
 * Helper methods for content activities.
 */
class Content_Helpers {

	/**
	 * Get an array of post-types names for the stats.
	 *
	 * @return string[]
	 */
	public function get_post_types_names() {
		static $include_post_types;

		if ( ! doing_action( 'init' ) && ! did_action( 'init' ) ) {
			\trigger_error( // phpcs:ignore
				sprintf(
					'%1$s was called too early. Wait for init hook to be called to have access to the post types.',
					\esc_html( get_class() . '::' . __FUNCTION__ )
				),
				E_USER_WARNING
			);
		}

		// Since we're working with CPTs, dont cache until init.
		if ( isset( $include_post_types ) && ! empty( $include_post_types ) ) {
			return $include_post_types;
		}

		$public_post_types = $this->get_public_post_types();

		// Post or pages can be deregistered.
		$default = array_intersect( [ 'post', 'page' ], $public_post_types );

		// Filter the saved post types.
		$include_post_types = array_intersect( progress_planner()->get_settings()->get( [ 'include_post_types' ], $default ), $public_post_types );

		$include_post_types = ! empty( $include_post_types ) ? $include_post_types : $default;

		return $include_post_types;
	}

	/**
	 * Get the public post types.
	 *
	 * @return string[]
	 */
	public function get_public_post_types() {
		$public_post_types = \array_filter( \get_post_types( [ 'public' => true ] ), 'is_post_type_viewable' );

		unset( $public_post_types['attachment'] );
		unset( $public_post_types['elementor_library'] ); // Elementor templates are not a post type we want to track.

		/**
		 * Filter the public post types.
		 *
		 * @param string[] $public_post_types The public post types.
		 *
		 * @return string[]
		 */
		return \apply_filters( 'progress_planner_public_post_types', $public_post_types );
	}

	/**
	 * Get Activity from WP_Post object.
	 *
	 * @param \WP_Post $post The post object.
	 * @param string   $activity_type The activity type.
	 *
	 * @return \Progress_Planner\Activities\Content
	 */
	public function get_activity_from_post( $post, $activity_type = 'publish' ) {
		$activity           = new Activities_Content();
		$activity->category = 'content';
		$activity->type     = $activity_type;
		$activity->date     = \progress_planner()->get_utils__date()->get_datetime_from_mysql_date( $post->post_modified );
		$activity->data_id  = (string) $post->ID;
		$activity->user_id  = (int) $post->post_author;
		return $activity;
	}
}
