<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add task to rename the Uncategorized category.
 */
class Rename_Uncategorized_Category extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'rename-uncategorized-category';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_categories';

	/**
	 * The Uncategorized category.
	 *
	 * @var int|null
	 */
	protected $uncategorized_category = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title       = \esc_html__( 'Rename Uncategorized category', 'progress-planner' );
		$this->url         = \admin_url( 'edit-tags.php?taxonomy=category&post_type=post' );
		$this->description = sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">We recommend</a> link */
			\esc_html__( 'The Uncategorized category is used for posts that don\'t have a category. %1$s renaming it to something that fits your site better.', 'progress-planner' ),
			'<a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		global $wpdb;

		if ( null === $this->uncategorized_category ) {

			$default_category_name = __( 'Uncategorized' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
			$default_category_slug = sanitize_title( _x( 'Uncategorized', 'Default category slug' ) ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain

			// Get the Uncategorized category by name or slug.
			$this->uncategorized_category = (int) $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare(
					"SELECT $wpdb->terms.term_id FROM {$wpdb->terms}
					LEFT JOIN {$wpdb->term_taxonomy} ON {$wpdb->terms}.term_id = {$wpdb->term_taxonomy}.term_id
					WHERE ({$wpdb->terms}.name = %s OR {$wpdb->terms}.slug = %s)
					AND {$wpdb->term_taxonomy}.taxonomy = 'category'",
					$default_category_name,
					$default_category_slug
				)
			);

		}

		return ! empty( $this->uncategorized_category );
	}

	/**
	 * Set the Uncategorized category.
	 *
	 * @param int|null $uncategorized_category The Uncategorized category.
	 *
	 * @return void
	 */
	public function set_uncategorized_category( $uncategorized_category ) {
		$this->uncategorized_category = $uncategorized_category;
	}
}
