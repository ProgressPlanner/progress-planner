<?php
/**
 * Terms without description data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Terms without posts data collector class.
 */
class Terms_Without_Description extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'terms_without_description';

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
		\add_action( 'delete_term', [ $this, 'update_terms_without_description_cache' ], 10 );

		// We need to update the cache when a term is edited.
		\add_action( 'edited_term', [ $this, 'on_term_edited' ], 10, 4 );
	}

	/**
	 * Update the cache when a post is term is edited.
	 *
	 * @param int    $term_id The term ID.
	 * @param int    $tt_id The term taxonomy ID.
	 * @param string $taxonomy The taxonomy.
	 * @param array  $args     Arguments passed to wp_update_term().
	 * @return void
	 */
	public function on_term_edited( $term_id, $tt_id, $taxonomy, $args ) {

		// Check if the taxonomy is public and that description is not empty.
		$taxonomy_object = \get_taxonomy( $taxonomy );
		if ( ! $taxonomy_object || ! $taxonomy_object->public || ! isset( $args['description'] ) || '' === trim( $args['description'] ) ) {
			return;
		}

		$this->update_cache();
	}

	/**
	 * Update the cache when term is edited or deleted.
	 *
	 * @return void
	 */
	public function update_terms_without_description_cache() {
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
		$public_taxonomies = get_taxonomies( [ 'public' => true ], 'names' );

		if ( isset( $public_taxonomies['post_format'] ) ) {
			unset( $public_taxonomies['post_format'] );
		}

		if ( isset( $public_taxonomies['product_shipping_class'] ) ) {
			unset( $public_taxonomies['product_shipping_class'] );
		}

		/**
		 * Array of term IDs to exclude from the terms without description query.
		 *
		 * @var array<int> $exclude_term_ids
		 */
		$exclude_term_ids = \apply_filters( 'progress_planner_terms_without_description_exclude_term_ids', [] );

		// We only want to return the first found term.
		$result = [];

		foreach ( $public_taxonomies as $taxonomy ) {

			$query = "
				SELECT t.term_id, t.name, tt.count, tt.taxonomy
				FROM {$wpdb->terms} AS t
				INNER JOIN {$wpdb->term_taxonomy} AS tt ON t.term_id = tt.term_id
				WHERE tt.taxonomy = %s
				AND (tt.description = '' OR tt.description IS NULL OR tt.description = '&nbsp;')
				AND tt.count >= %d";
			if ( ! empty( $exclude_term_ids ) ) {
				$query .= ' AND t.term_id NOT IN (' . implode( ',', array_map( 'intval', $exclude_term_ids ) ) . ')';
			}
			$query .= ' ORDER BY tt.count DESC LIMIT 1';

			$terms = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare( $query, $taxonomy, self::MIN_POSTS ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- We are using array_map to ensure the values are integers.
			);

			// Check if we have terms without posts.
			if ( ! empty( $terms ) ) {
				foreach ( $terms as $term ) {
					$result = (array) $term;
					break 2; // We have found the term, break out of both foreach loops.
				}
			}
		}

		return ! empty( $result ) ? $result : null;
	}
}
