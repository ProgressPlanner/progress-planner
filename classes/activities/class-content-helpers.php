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
	 * Get Activity from WP_Post object.
	 *
	 * @param \WP_Post $post The post object.
	 *
	 * @return \Progress_Planner\Activities\Content
	 */
	public function get_activity_from_post( $post ) {
		$type = 'publish' === $post->post_status ? 'publish' : 'update';
		$date = 'publish' === $post->post_status ? $post->post_date : $post->post_modified;

		$activity           = new Activities_Content();
		$activity->category = 'content';
		$activity->type     = $type;
		$activity->date     = \progress_planner()->get_utils__date()->get_datetime_from_mysql_date( $date );
		$activity->data_id  = (string) $post->ID;
		$activity->user_id  = (int) $post->post_author;
		return $activity;
	}
}
