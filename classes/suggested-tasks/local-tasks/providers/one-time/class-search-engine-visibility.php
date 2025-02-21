<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Search_Engine_Visibility extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	private const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	private const ID = 'search-engine-visibility';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	private const IS_ONBOARDING_TASK = true;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 === (int) \get_option( 'blog_public' );
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
			'task_id'      => $task_id,
			'title'        => \esc_html__( 'Allow your site to be indexed by search engines', 'progress-planner' ),
			'parent'       => 0,
			'priority'     => 'high',
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( \admin_url( 'options-reading.php' ) ) : '',
			'dismissible'  => true,
			'description'  => '<p>' . sprintf(
				/* translators: %1$s <a href="https://prpl.fyi/blog-indexing-settings" target="_blank">allowing search engines</a> link */
				\esc_html__( 'Your site is not currently visible to search engines. Consider %1$s to index your site.', 'progress-planner' ),
				'<a href="https://prpl.fyi/blog-indexing-settings" target="_blank">' . \esc_html__( 'allowing search engines', 'progress-planner' ) . '</a>',
			) . '</p>',
			'link_setting' => [
				'hook'   => 'options-reading.php',
				'iconEl' => 'label[for="blog_public"]',
			],
		];
	}
}
