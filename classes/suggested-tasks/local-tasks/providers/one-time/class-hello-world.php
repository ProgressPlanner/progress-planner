<?php
/**
 * Add tasks for hello world.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;
use Progress_Planner\Data_Collector\Hello_World as Hello_World_Data_Collector;
/**
 * Add tasks for hello world post.
 */
class Hello_World extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'hello-world';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_posts';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Data_Collector\Hello_World
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Hello_World_Data_Collector();

		$hello_world_post_id = $this->data_collector->collect();

		if ( 0 !== $hello_world_post_id ) {
			$this->url = (string) \get_edit_post_link( $hello_world_post_id );
		}

		$this->title       = \esc_html__( 'Delete the "Hello World!" post.', 'progress-planner' );
		$this->description = sprintf(
			/* translators: %s:<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">Hello World!</a> link */
			\esc_html__( 'On install, WordPress creates a %s post. This post is not needed and should be deleted.', 'progress-planner' ),
			'<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">' . \esc_html__( '"Hello World!"', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 !== $this->data_collector->collect();
	}
}
