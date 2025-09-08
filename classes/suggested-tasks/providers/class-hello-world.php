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
class Hello_World extends Tasks_Interactive {

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
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Hello_World_Data_Collector::class;

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'hello-world';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/delete-hello-world-post';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		$hello_world_post_id = $this->get_data_collector()->collect();

		if ( 0 === $hello_world_post_id ) {
			return '';
		}
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

		return $this->url;
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
		$hello_world_post_id = $this->get_data_collector()->collect();

		if ( 0 === $hello_world_post_id ) {
			return \esc_html__( 'On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.', 'progress-planner' );
		}

		$hello_world_post_url = (string) \get_permalink( $hello_world_post_id );

		$content  = '<p>';
		$content .= \sprintf(
			/* translators: %s: Link to the post. */
			\esc_html__( 'On install, WordPress creates a "Hello World!" post. You can find yours at %s.', 'progress-planner' ),
			'<a href="' . \esc_attr( $hello_world_post_url ) . '" target="_blank">' . \esc_html( $hello_world_post_url ) . '</a>',
		);
		$content .= '</p><p>';
		$content .= \esc_html__( 'This post does not add value to your website and solely exists to show what a post can look like. Therefore, "Hello World!" is not needed and should be deleted.', 'progress-planner' );
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
	 * Check if the task condition is satisfied.
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
			<?php \esc_html_e( 'Delete the "Hello World!" post', 'progress-planner' ); ?>
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
			'name' => 'helloWorldData',
			'data' => [
				'postId' => $this->get_data_collector()->collect(),
			],
		];
	}
}
