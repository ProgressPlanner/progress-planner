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
	 * The threshold for a post to be considered long.
	 *
	 * @var int
	 */
	const LONG_POST_THRESHOLD = 350;

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
			\progress_planner()->get_settings()->get( [ 'include_post_types' ], $default ),
			function ( $post_type ) {
				return $post_type && \post_type_exists( $post_type ) && \is_post_type_viewable( $post_type );
			}
		);
		return empty( $include_post_types ) ? $default : \array_values( $include_post_types );
	}

	/**
	 * Get words count from content.
	 *
	 * This method will render shortcodes, blocks,
	 * and strip HTML before counting the words.
	 *
	 * @param string $content The content.
	 * @param int    $post_id The post ID. Used for caching the number of words per post.
	 *
	 * @return int
	 */
	public function get_word_count( $content, $post_id = 0 ) {
		$counts = \progress_planner()->get_settings()->get( [ 'word_count' ], [] );
		if ( $post_id && isset( $counts[ $post_id ] ) && false !== $counts[ $post_id ] ) {
			return $counts[ $post_id ];
		}

		if ( empty( $content ) && $post_id ) {
			\progress_planner()->get_settings()->set( [ 'word_count', $post_id ], 0 );
			return 0;
		}

		$word_count_type = function_exists( 'wp_get_word_count_type' ) ? wp_get_word_count_type() : 'words';
		if ( function_exists( 'wp_word_count' ) ) {
			$count = \wp_word_count( $content, $word_count_type );
		} else {
			$content = \wp_strip_all_tags( // Strip HTML.
				\do_blocks( // Parse blocks.
					\do_shortcode( $content ) // Parse shortcodes.
				),
				true
			);

			switch ( $word_count_type ) {
				case 'characters_excluding_spaces':
					$content = \preg_replace( '/\s+/', '', $content );
					// Fall through.

				case 'characters_including_spaces':
					$count = \strlen( (string) $content );
					break;

				default:
					$count = \str_word_count( $content );
			}
		}

		if ( $post_id ) {
			\progress_planner()->get_settings()->set( [ 'word_count', (int) $post_id ], $count );
		}

		return $count;
	}

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
		$activity->date     = \progress_planner()->get_date()->get_datetime_from_mysql_date( $date );
		$activity->data_id  = (string) $post->ID;
		$activity->user_id  = (int) $post->post_author;
		return $activity;
	}

	/**
	 * Figure out if a post is short, or long.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function is_post_long( $post_id ) {
		$word_count = $this->get_word_count( \get_post_field( 'post_content', $post_id ), $post_id );
		return $word_count >= self::LONG_POST_THRESHOLD;
	}
}
