<?php
/**
 * Orphaned content data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;
use Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World;
use Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page;

/**
 * Post author data collector class.
 */
class Yoast_Orphaned_Content extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'yoast_orphaned_content';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! function_exists( 'YoastSEO' ) ) {
			return;
		}

		\add_action( 'transition_post_status', [ $this, 'update_orphaned_content_cache' ], 10, 3 );
	}

	/**
	 * Update the cache when post status changes.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post The post.
	 *
	 * @return void
	 */
	public function update_orphaned_content_cache( $new_status, $old_status, $post ) {
		if ( $new_status === 'publish' || $old_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Query the posts with no links.
	 *
	 * @return array
	 */
	protected function calculate_data() {
		if ( ! function_exists( 'YoastSEO' ) ) {
			return [];
		}

		global $wpdb;
		$where_clause = "1=1 AND p.post_status = 'publish'";

		// Get the public post types.
		$public_post_types = \progress_planner()->get_settings()->get_public_post_types();
		$post_types_in     = '';

		if ( ! empty( $public_post_types ) ) {
			$post_types_in = array_map(
				function ( $type ) {
					return (string) esc_sql( $type );
				},
				array_values( $public_post_types )
			);
			$post_types_in = "p.post_type IN ('" . implode( "','", $post_types_in ) . "')";

			$where_clause .= " AND $post_types_in";
		}

		// Exclude "Hello World" and "Sample Page" posts, use array_filter() to remove empty values.
		$exclude_post_ids = array_filter(
			[
				( new Hello_World() )->collect(),
				( new Sample_Page() )->collect(),
			]
		);

		/**
		 * Array of post IDs to exclude from the orphaned content query.
		 *
		 * @var array<int> $exclude_post_ids
		 */
		$exclude_post_ids = \apply_filters( 'progress_planner_yoast_orphaned_content_exclude_post_ids', $exclude_post_ids );

		if ( ! empty( $exclude_post_ids ) ) {
			$exclude_post_ids = array_map( 'intval', $exclude_post_ids );
			$where_clause    .= ' AND p.ID NOT IN (' . implode( ',', $exclude_post_ids ) . ')';
		}

		$query = "
			SELECT p.ID AS post_id, p.post_title AS post_title
			FROM {$wpdb->posts} p
			LEFT JOIN (
				SELECT DISTINCT target_post_id
				FROM {$wpdb->prefix}yoast_seo_links
				WHERE type = 'internal'
				AND target_post_id IS NOT NULL
			) l ON p.ID = l.target_post_id
			WHERE {$where_clause}
			AND l.target_post_id IS NULL
			ORDER BY p.post_date DESC
			LIMIT 1
		";

		$post_to_update = $wpdb->get_row( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$query, // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- The query is prepared in the $where_clause variable.
			ARRAY_A
		);

		return $post_to_update ? $post_to_update : [];
	}
}
