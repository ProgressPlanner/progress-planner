<?php
/**
 * Add task to delete the Sample Page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to delete the Sample Page.
 */
class Unpublished_Content extends Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'unpublished-content';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_posts';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		$post = $this->get_unpublished_post();
		return \get_edit_post_link( $post ) ?? '';
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \sprintf(
			/* translators: %s: post type name */
			\esc_html__( 'Publish "%s"', 'progress-planner' ),
			\get_the_title( $this->get_unpublished_post() )
		);
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		$post       = $this->get_unpublished_post();
		$post_title = \get_the_title( $post );
		$post_url   = \get_edit_post_link( $post ) ?? '';

		return \sprintf(
			/* translators: %s: post title */
			\esc_html__( 'You started writing %1$s, but never finished it. Perhaps you should see if you can publish it?', 'progress-planner' ),
			'<a href="' . \esc_url( $post_url ) . '" target="_blank">' . \esc_html( $post_title ) . '</a>'
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 !== $this->get_unpublished_post();
	}

	/**
	 * Get 1 post in `draft` or `pending` status, created before 1 week ago.
	 *
	 * @return \WP_Post|int
	 */
	protected function get_unpublished_post() {
		static $posts;
		if ( ! isset( $posts ) ) {
			$posts = \get_posts(
				[
					'post_type'      => \progress_planner()->get_settings()->get_post_types_names(),
					'post_status'    => [ 'draft', 'pending' ],
					'posts_per_page' => 1,
					'date_query'     => [
						[
							'before' => '-1 week',
						],
					],
				]
			);
		}

		return $posts[0] ?? 0;
	}
}
