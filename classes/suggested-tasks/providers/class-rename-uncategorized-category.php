<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category as Uncategorized_Category_Data_Collector;

/**
 * Add task to rename the Uncategorized category.
 */
class Rename_Uncategorized_Category extends Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

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
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Uncategorized_Category_Data_Collector::class;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'term.php?taxonomy=category&tag_ID=' . $this->get_data_collector()->collect() );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Rename Uncategorized category', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \sprintf(
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
		return 0 !== $this->get_data_collector()->collect();
	}

	/**
	 * Update the Uncategorized category cache.
	 *
	 * @return void
	 */
	public function update_uncategorized_category_cache() {
		$this->get_data_collector()->update_uncategorized_category_cache(); // @phpstan-ignore-line method.notFound
	}
}
