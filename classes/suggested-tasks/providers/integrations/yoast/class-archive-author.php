<?php
/**
 * Add task for Yoast SEO: disable the author archive.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;

/**
 * Add task for Yoast SEO: disable the author archive.
 */
class Archive_Author extends Yoast_Provider {

	/**
	 * The minimum number of posts with a post format to add the task.
	 *
	 * @var int
	 */
	protected const MINIMUM_AUTHOR_WITH_POSTS = 1;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-author-archive';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Post_Author();
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/author-archives' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Yoast SEO: disable the author archive', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Yoast SEO can disable the author archive when you have only one author, as it is the same as the homepage. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/yoast-author-archive" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Author Archive', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
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
					'elementSelector' => 'button[data-id="input-wpseo_titles-disable-author"]',
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

		// If the author archive is already disabled, we don't need to add the task.
		if ( YoastSEO()->helpers->options->get( 'disable-author' ) === true ) {
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
		// If there is more than one author, we don't need to add the task.
		if ( $this->data_collector->collect() > self::MINIMUM_AUTHOR_WITH_POSTS ) {
			return false;
		}

		return true;
	}
}
