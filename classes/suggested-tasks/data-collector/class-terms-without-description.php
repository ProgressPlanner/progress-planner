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

		// Check if the taxonomy is public.
		$taxonomy_object = \get_taxonomy( $taxonomy );
		if ( ! $taxonomy_object || ! $taxonomy_object->public ) {
			return;
		}

		// TODO: Check if this can be more performant, by checking specifically if the description has changed.

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
		$public_taxonomies = get_taxonomies( [ 'public' => true ], 'names' );

		// We only want to return the first found term.
		$result = [];

		foreach ( $public_taxonomies as $taxonomy ) {

			$terms = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare(
					"
				SELECT t.term_id, t.name, tt.count, tt.taxonomy
				FROM {$wpdb->terms} AS t
				INNER JOIN {$wpdb->term_taxonomy} AS tt ON t.term_id = tt.term_id
				WHERE tt.taxonomy = %s
				AND (tt.description = '' OR tt.description IS NULL)
				ORDER BY tt.count DESC
				LIMIT 1
			",
					$taxonomy
				)
			);

			// Check if we have terms without posts.
			if ( ! empty( $terms ) ) {
				foreach ( $terms as $term ) {
					$result = (array) $term;
					break;
				}
			}
		}

		return ! empty( $result ) ? $result : null;
	}
}
