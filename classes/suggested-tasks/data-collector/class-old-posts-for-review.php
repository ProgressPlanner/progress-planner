<?php
/**
 * Old Posts For Review data collector.
 *
 * Returns posts that haven't been updated in a long time and need review.
 * Important pages (about, contact, FAQ, privacy policy) are checked for 6+ months.
 * Regular posts are checked for 12+ months.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Old Posts For Review data collector class.
 */
class Old_Posts_For_Review extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'old_posts_for_review';

	/**
	 * Maximum number of posts to return.
	 *
	 * @var int
	 */
	protected const ITEMS_TO_RETURN = 10;

	/**
	 * Calculate the data.
	 *
	 * Returns an array of posts that need review.
	 *
	 * @return array<array{ID: int, post_title: string, post_type: string, post_modified: string}> Array of post data.
	 */
	protected function calculate_data() {
		$posts_to_review = [];

		// Get important page IDs.
		$important_page_ids = $this->get_important_page_ids();

		// Check important pages (6 months threshold).
		if ( ! empty( $important_page_ids ) ) {
			$important_posts = $this->get_old_posts(
				[
					'post__in'   => $important_page_ids,
					'post_type'  => 'any',
					'date_query' => [
						[
							'column' => 'post_modified',
							'before' => '-6 months',
						],
					],
				]
			);

			foreach ( $important_posts as $post ) {
				$posts_to_review[] = $this->format_post_data( $post );
			}
		}

		// Get remaining slots for regular posts (12 months threshold).
		$remaining_slots = static::ITEMS_TO_RETURN - \count( $posts_to_review );

		if ( $remaining_slots > 0 ) {
			$include_post_types = \progress_planner()->get_settings()->get_post_types_names();

			$regular_posts = $this->get_old_posts(
				[
					'posts_per_page' => $remaining_slots,
					'post__not_in'   => $important_page_ids,
					'post_type'      => $include_post_types,
					'date_query'     => [
						[
							'column' => 'post_modified',
							'before' => '-12 months',
						],
					],
				]
			);

			foreach ( $regular_posts as $post ) {
				$posts_to_review[] = $this->format_post_data( $post );
			}
		}

		return $posts_to_review;
	}

	/**
	 * Get important page IDs.
	 *
	 * Includes pages set in page settings and the privacy policy page.
	 *
	 * @return int[] Array of page IDs.
	 */
	protected function get_important_page_ids() {
		$important_page_ids = [];

		// Get pages from page settings (about, contact, FAQ).
		foreach ( \progress_planner()->get_admin__page_settings()->get_settings() as $page_setting ) {
			if ( 0 !== (int) $page_setting['value'] ) {
				$important_page_ids[] = (int) $page_setting['value'];
			}
		}

		// Add privacy policy page.
		$privacy_policy_page_id = \get_option( 'wp_page_for_privacy_policy' );
		if ( $privacy_policy_page_id ) {
			$important_page_ids[] = (int) $privacy_policy_page_id;
		}

		/**
		 * Filters the pages we deem more important for content updates.
		 *
		 * @param int[] $important_page_ids Post & page IDs of the important pages.
		 */
		return \apply_filters( 'progress_planner_update_posts_important_page_ids', $important_page_ids );
	}

	/**
	 * Get old posts based on args.
	 *
	 * @param array $args Query arguments.
	 * @return \WP_Post[] Array of posts.
	 */
	protected function get_old_posts( $args = [] ) {
		$args = \wp_parse_args(
			$args,
			[
				'posts_per_page'      => static::ITEMS_TO_RETURN,
				'post_status'         => 'publish',
				'orderby'             => 'modified',
				'order'               => 'ASC',
				'ignore_sticky_posts' => true,
			]
		);

		/**
		 * Filters the args for the posts & pages we want user to review.
		 *
		 * @param array $args The get_posts args.
		 */
		$args = \apply_filters( 'progress_planner_update_posts_tasks_args', $args );

		$posts = \get_posts( $args );

		return $posts ? $posts : [];
	}

	/**
	 * Format post data for API response.
	 *
	 * @param \WP_Post $post The post object.
	 * @return array{ID: int, post_title: string, post_type: string, post_modified: string} Formatted post data.
	 */
	protected function format_post_data( $post ) {
		return [
			'ID'            => $post->ID,
			'post_title'    => $post->post_title,
			'post_type'     => $post->post_type,
			'post_modified' => $post->post_modified,
		];
	}
}
