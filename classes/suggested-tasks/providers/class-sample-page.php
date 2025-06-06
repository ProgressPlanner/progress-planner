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
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Sample_Page_Data_Collector();

		$sample_page_id = $this->data_collector->collect();

		if ( 0 !== $sample_page_id ) {
			$this->url = (string) \get_edit_post_link( $sample_page_id );
		}
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Delete "Sample Page"', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
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
		return 0 !== $this->data_collector->collect();
	}
}
