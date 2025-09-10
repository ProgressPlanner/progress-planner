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
		if ( isset( $include_post_types ) && ! empty( $include_post_types ) ) {
			return $include_post_types;
		}
		$default            = [ 'post', 'page' ];
		$include_post_types = \array_filter(
			(array) \progress_planner()->get_settings()->get( [ 'include_post_types' ], $default ),
			function ( $post_type ) {
				return $post_type
					&& \is_string( $post_type )
					&& \post_type_exists( $post_type )
					&& \is_post_type_viewable( $post_type );
			}
		);
		return empty( $include_post_types ) ? $default : \array_values( $include_post_types );
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
