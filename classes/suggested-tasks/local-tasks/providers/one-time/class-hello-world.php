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
	 * The sample post.
	 *
	 * @var \WP_Post|null|false
	 */
	protected $sample_post = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->sample_post = $this->get_sample_post();

		if ( is_a( $this->sample_post, \WP_Post::class ) ) {
			$this->url = \get_edit_post_link( $this->sample_post->ID );
		}

		$this->title        = \esc_html__( 'Delete the "Hello World!" post.', 'progress-planner' );
		$this->description  = sprintf(
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
		if ( is_a( $this->sample_post, \WP_Post::class ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Get the sample post.
	 *
	 * @return \WP_Post|null
	 */
	protected function get_sample_post() {
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

		return $sample_post;
	}
}
