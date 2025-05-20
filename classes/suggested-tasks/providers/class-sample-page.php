<?php
/**
 * Add task to delete the Sample Page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page as Sample_Page_Data_Collector;

/**
 * Add task to delete the Sample Page.
 */
class Sample_Page extends Tasks {

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
	protected const PROVIDER_ID = 'sample-page';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_pages';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Sample_Page_Data_Collector::class;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		$sample_page_id = $this->get_data_collector()->collect();

		if ( 0 !== $sample_page_id ) {
			// We don't use the edit_post_link() function because we need to bypass it's current_user_can() check.
			$this->url = \esc_url(
				\add_query_arg(
					[
						'post'   => $sample_page_id,
						'action' => 'edit',
					],
					\admin_url( 'post.php' )
				)
			);
		}

		return $this->url;
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Delete "Sample Page"', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %s:<a href="https://prpl.fyi/delete-sample-page" target="_blank">Sample Page</a> link */
			\esc_html__( 'On install, WordPress creates a %s page. This page is not needed and should be deleted.', 'progress-planner' ),
			'<a href="https://prpl.fyi/delete-sample-page" target="_blank">' . \esc_html__( '"Sample Page"', 'progress-planner' ) . '</a>'
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
}
