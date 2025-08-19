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
class Sample_Page extends Tasks_Interactive {

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
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'sample-page';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/delete-sample-page';

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
		$sample_page_id = $this->get_data_collector()->collect();

		if ( 0 === $sample_page_id ) {
			return \esc_html__( 'On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.', 'progress-planner' );
		}

		$sample_page_url = (string) \get_permalink( $sample_page_id );

		$content  = '<p>';
		$content .= \sprintf(
			/* translators: %s: Link to the post. */
			\esc_html__( 'On install, WordPress creates a "Sample Page" page. You can find yours at %s.', 'progress-planner' ),
			'<a href="' . \esc_attr( $sample_page_url ) . '" target="_blank">' . \esc_html( $sample_page_url ) . '</a>',
		);
		$content .= '</p><p>';
		$content .= \esc_html__( 'This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.', 'progress-planner' );
		$content .= '</p>';

		return $content;
	}

	/**
	 * Get the task-action text.
	 *
	 * @return string
	 */
	protected function get_task_action_text() {
		return \esc_html__( 'Delete', 'progress-planner' );
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
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Delete the "Sample Page" page', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Get the enqueue data.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		return [
			'name' => 'samplePageData',
			'data' => [
				'postId' => $this->get_data_collector()->collect(),
			],
		];
	}
}
