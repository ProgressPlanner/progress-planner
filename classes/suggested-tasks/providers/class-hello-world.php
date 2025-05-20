<?php
/**
 * Add tasks for hello world.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World as Hello_World_Data_Collector;

/**
 * Add tasks for hello world post.
 */
class Hello_World extends Tasks {

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
	protected const PROVIDER_ID = 'hello-world';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_posts';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Hello_World_Data_Collector();

		$hello_world_post_id = $this->data_collector->collect();

		if ( 0 !== $hello_world_post_id ) {
			// We don't use the edit_post_link() function because we need to bypass it's current_user_can() check.
			$this->url = \esc_url(
				\add_query_arg(
					[
						'post'   => $hello_world_post_id,
						'action' => 'edit',
					],
					\admin_url( 'post.php' )
				)
			);
		}
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Delete the "Hello World!" post.', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %s:<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">Hello World!</a> link */
			\esc_html__( 'On install, WordPress creates a %s post. This post is not needed and should be deleted.', 'progress-planner' ),
			'<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">' . \esc_html__( '"Hello World!"', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 !== $this->data_collector->collect();
	}
}
