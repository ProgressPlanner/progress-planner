<?php
/**
 * Uncategorized category data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Data_Collector;

use Progress_Planner\Data_Collector\Base_Data_Collector;

/**
 * Uncategorized category data collector class.
 */
class Uncategorized_Category extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'uncategorized_category_id';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'edited_category', [ $this, 'update_uncategorized_category_cache' ], 10 );
		\add_action( 'delete_category', [ $this, 'update_uncategorized_category_cache' ], 10 );
	}

	/**
	 * Update the cache when term is edited or deleted.
	 *
	 * @return void
	 */
	public function update_uncategorized_category_cache() {
		$this->update_cache();
	}

	/**
	 * Query the hello world post.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		global $wpdb;
		$default_category_name = __( 'Uncategorized' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		$default_category_slug = sanitize_title( _x( 'Uncategorized', 'Default category slug' ) ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain

		// Get the Uncategorized category by name or slug.
		$uncategorized_category = (int) $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"SELECT $wpdb->terms.term_id FROM {$wpdb->terms}
				LEFT JOIN {$wpdb->term_taxonomy} ON {$wpdb->terms}.term_id = {$wpdb->term_taxonomy}.term_id
				WHERE ({$wpdb->terms}.name = %s OR {$wpdb->terms}.slug = %s)
				AND {$wpdb->term_taxonomy}.taxonomy = 'category'",
				$default_category_name,
				$default_category_slug
			)
		);

		return $uncategorized_category ? $uncategorized_category : 0;
	}
}
