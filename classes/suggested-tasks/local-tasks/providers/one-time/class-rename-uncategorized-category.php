<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;
use Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category as Uncategorized_Category_Data_Collector;

/**
 * Add task to rename the Uncategorized category.
 */
class Rename_Uncategorized_Category extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'rename-uncategorized-category';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_categories';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Uncategorized_Category_Data_Collector();

		$this->title       = \esc_html__( 'Rename Uncategorized category', 'progress-planner' );
		$this->url         = \admin_url( 'edit-tags.php?taxonomy=category&post_type=post' );
		$this->description = sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/rename-uncategorized-category" target="_blank">We recommend</a> link */
			\esc_html__( 'The Uncategorized category is used for posts that don\'t have a category. %1$s renaming it to something that fits your site better.', 'progress-planner' ),
			'<a href="https://prpl.fyi/rename-uncategorized-category" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 !== $this->data_collector->collect();
	}

	/**
	 * Update the Uncategorized category cache.
	 *
	 * @return void
	 */
	public function update_uncategorized_category_cache() {
		$this->data_collector->update_uncategorized_category_cache();
	}
}
