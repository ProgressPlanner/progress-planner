<?php
/**
 * Terms without posts data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Terms without posts data collector class.
 */
class Terms_Without_Posts extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'terms_without_posts';

	/**
	 * The minimum number of posts.
	 *
	 * @var int
	 */
	protected const MIN_POSTS = 1;

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'delete_term', [ $this, 'update_terms_without_posts_cache' ], 10 );

		// We need to update the cache when a term is added or removed from a post.
		\add_action( 'set_object_terms', [ $this, 'on_terms_changed' ], 10, 6 );
	}

	/**
	 * Update the cache when a post is term is added or removed from the term.
	 *
	 * @param int    $object_id The post ID.
	 * @param array  $terms The terms.
	 * @param array  $tt_ids The term taxonomy IDs.
	 * @param string $taxonomy The taxonomy.
	 * @param bool   $append Whether to append the terms.
	 * @param array  $old_tt_ids The old term taxonomy IDs.
	 * @return void
	 */
	public function on_terms_changed( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {
		// Check if the taxonomy is public.
		$taxonomy_object = \get_taxonomy( $taxonomy );
		if ( ! $taxonomy_object || ! $taxonomy_object->public ) {
			return;
		}

		// Check if the post type is public.
		$post_type        = \get_post_type( $object_id );
		$post_type_object = $post_type ? \get_post_type_object( $post_type ) : null;
		if ( ! $post_type_object || ! $post_type_object->public ) {
			return;
		}

		$this->update_cache();
	}

	/**
	 * Update the cache when term is edited or deleted.
	 *
	 * @return void
	 */
	public function update_terms_without_posts_cache() {
		$this->update_cache();
	}

	/**
	 * Query the terms without posts.
	 *
	 * @return array|null
	 */
	protected function calculate_data() {
		global $wpdb;

		// Get registered and public taxonomies.
		/**
		 * Array of public taxonomy names where both keys and values are taxonomy names.
		 *
		 * @var array<string, string> $public_taxonomies
		 */
		$public_taxonomies = \get_taxonomies( [ 'public' => true ], 'names' );

		/**
		 * Array of public taxonomies to exclude from the terms without posts query.
		 *
		 * @var array<string> $exclude_public_taxonomies
		 */
		$exclude_public_taxonomies = \apply_filters(
			'progress_planner_exclude_public_taxonomies',
			[
				'post_format',
				'product_shipping_class',
				'prpl_recommendations_category',
				'prpl_recommendations_provider',
			]
		);

		foreach ( $exclude_public_taxonomies as $taxonomy ) {
			if ( isset( $public_taxonomies[ $taxonomy ] ) ) {
				unset( $public_taxonomies[ $taxonomy ] );
			}
		}

		/**
		 * Array of term IDs to exclude from the terms without description query.
		 *
		 * @var array<int> $exclude_term_ids
		 */
		$exclude_term_ids = \apply_filters( 'progress_planner_terms_without_posts_exclude_term_ids', [] );

		// We only want to return the first found term.
		$result = [];

		foreach ( $public_taxonomies as $taxonomy ) {
			// Term which cannot be removed.
			$default_taxonomy_term_id = (int) \get_option( 'default_' . $taxonomy, 0 );

			// If the default taxonomy term (which cannot be removed) is set, we need to query 2 terms.
			$query_limit = $default_taxonomy_term_id ? 2 : 1;

			$query = "
				SELECT t.term_id, t.name, tt.count, tt.taxonomy
				FROM {$wpdb->terms} AS t
				INNER JOIN {$wpdb->term_taxonomy} AS tt ON t.term_id = tt.term_id
				WHERE tt.taxonomy = %s AND tt.count <= %d
			";

			if ( ! empty( $exclude_term_ids ) ) {
				$query .= ' AND t.term_id NOT IN (' . \implode( ',', \array_map( 'intval', $exclude_term_ids ) ) . ')';
			}

			$query .= ' LIMIT %d';

			$terms = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare( $query, $taxonomy, self::MIN_POSTS, $query_limit ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- We are using array_map to ensure the values are integers.
			);

			// Check if we have terms without posts.
			if ( ! empty( $terms ) ) {
				foreach ( $terms as $term ) {
					// Default categories can not be removed.
					if ( $default_taxonomy_term_id !== (int) $term->term_id ) {
						$result = (array) $term;
						break 2; // We have found the term, break out of both foreach loops.
					}
				}
			}
		}

		return ! empty( $result ) ? $result : null;
	}
}
