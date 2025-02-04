<?php
/**
 * Add tasks for hello world.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for hello world post.
 */
class Hello_World extends Local_Tasks_Abstract {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'hello-world';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'edit_posts';

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		$hello_world = get_page_by_path( 'hello-world', OBJECT, 'post' );

		if ( null === $hello_world ) {
			return $task_id;
		}
		return false;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		// Early bail if the user does not have the capability to manage options or if the task is snoozed.
		if ( true === $this->is_task_type_snoozed() || ! $this->capability_required() ) {
			return [];
		}

		if ( null === get_page_by_path( 'hello-world', OBJECT, 'post' ) ) {
			return [];
		}

		// If the task with this id is completed, don't add a task.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( static::ID ) ) {
			return [];
		}

		return [
			$this->get_task_details(),
		];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		$hello_world = get_page_by_path( 'hello-world', OBJECT, 'post' );

		return [
			'task_id'     => static::ID,
			'title'       => \esc_html__( 'Delete "Hello World!" post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => static::TYPE,
			'points'      => 1,
			'url'         => $this->capability_required() && null !== $hello_world ? \esc_url( \get_edit_post_link( $hello_world->ID ) ) : '', // @phpstan-ignore-line property.nonObject
			'description' => '<p>' . \esc_html__( 'On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.', 'progress-planner' ) . '</p>',
		];
	}
}
