<?php
/**
 * Add task for Yoast SEO: disable the format archives.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format as Archive_Format_Data_Collector;

/**
 * Add task for Yoast SEO: disable the format archives.
 */
class Archive_Format extends Yoast_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-format-archive';

	/**
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_POSTS_WITH_FORMAT = 3;

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Archive_Format_Data_Collector();
		$this->url            = \admin_url( 'admin.php?page=wpseo_page_settings#/format-archives' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Yoast SEO: disable the format archives', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'WordPress creates an archive for each post format. This is not useful and can be disabled in the Yoast SEO settings. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-format-archive" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			[
				'iconElement'  => '.yst-toggle-field__header',
				'valueElement' => [
					'elementSelector' => 'button[data-id="input-wpseo_titles-disable-post_format"]',
					'attributeName'   => 'aria-checked',
					'attributeValue'  => 'false',
					'operator'        => '=',
				],
			],
		];
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! $this->is_task_relevant() ) {
			return false;
		}

		// If the post format archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-post_format' ) === true ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		$archive_format_count = $this->data_collector->collect();

		// If there are more than X posts with a post format, we don't need to add the task. X is set in the class.
		if ( $archive_format_count > static::MINIMUM_POSTS_WITH_FORMAT ) {
			return false;
		}

		return true;
	}
}
