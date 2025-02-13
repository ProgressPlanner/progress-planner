<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for settings saved.
 */
class Rename_Uncategorized_Category extends Local_OneTime_Tasks_Abstract {

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
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$uncategorized_category = \get_terms(
			[
				'taxonomy'   => 'category',
				'name'       => __( 'Uncategorized' ),  // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
				'hide_empty' => false,
			]
		);

		return ! empty( $uncategorized_category );
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
			'description' => '<p>' . sprintf(
				/* translators: %s: php version */
				\esc_html__( 'The Uncategorized category is used for posts that don\'t have a category. We recommend renaming it to something more descriptive, like "Posts without a category".', 'progress-planner' ),
				phpversion()
			) . '</p>',
		];
	}
}
