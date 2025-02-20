<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for settings saved.
 */
class Rename_Uncategorized_Category extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'rename-uncategorized-category';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'manage_categories';

	/**
	 * The Uncategorized category.
	 *
	 * @var int|null
	 */
	protected $uncategorized_category = null;

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
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			$task_id = $this->get_provider_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Rename Uncategorized category', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'medium',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'edit-tags.php?taxonomy=category&post_type=post' ) ) : '',
			'description' => '<p>' . \esc_html__( 'The Uncategorized category is used for posts that don\'t have a category. We recommend renaming it to something that fits your site better.', 'progress-planner' ) . '</p>',
		];
	}
}
