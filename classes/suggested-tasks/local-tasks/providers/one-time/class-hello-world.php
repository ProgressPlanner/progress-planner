<?php
/**
 * Add tasks for hello world.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for hello world post.
 */
class Hello_World extends One_Time {

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
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected $is_onboarding_task = true;

	/**
	 * The sample post.
	 *
	 * @var \WP_Post|null|false
	 */
	protected $sample_post = false;

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return null !== $this->get_sample_post();
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

		$hello_world = $this->get_sample_post();

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Delete "Hello World!" post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() && null !== $hello_world ? \esc_url( \get_edit_post_link( $hello_world->ID ) ) : '', // @phpstan-ignore-line property.nonObject
			'description' => '<p>' . sprintf(
				/* translators: %s:<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">Hello World!</a> link */
				\esc_html__( 'On install, WordPress creates a %s post. This post is not needed and should be deleted.', 'progress-planner' ),
				'<a href="https://prpl.fyi/delete-hello-world-post" target="_blank">' . \esc_html__( '"Hello World!"', 'progress-planner' ) . '</a>'
			) . '</p>',
		];
	}

	/**
	 * Get the sample post.
	 *
	 * @return \WP_Post|null
	 */
	protected function get_sample_post() {

		if ( false !== $this->sample_post ) {
			return $this->sample_post;
		}

		$sample_post = get_page_by_path( __( 'hello-world' ), OBJECT, 'post' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		if ( null === $sample_post ) {
			$query = new \WP_Query(
				[
					'post_type'      => 'post',
					'title'          => __( 'Hello world!' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				]
			);

			$sample_post = ! empty( $query->post ) ? $query->post : null;
		}

		$this->sample_post = $sample_post;

		return $sample_post;
	}
}
