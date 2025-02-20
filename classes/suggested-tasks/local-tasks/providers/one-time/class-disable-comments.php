<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Disable_Comments extends One_Time {

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
	const ID = 'disable-comments';

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 10 > \wp_count_comments()->approved && 'closed' !== \get_default_comment_status() && \comments_open();
	}

	/**
	 * Check if the task is completed.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return 'closed' === \get_default_comment_status();
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
			'title'        => \esc_html__( 'Disable comments', 'progress-planner' ),
			'parent'       => 0,
			'priority'     => 'high',
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( \admin_url( 'options-discussion.php' ) ) : '', // @phpstan-ignore-line property.nonObject
			'dismissable'  => true,
			'description'  => '<p>' . sprintf(
				\esc_html(
					// translators: %d is the number of approved comments.
					\_n(
						'There is %d comment. If you don\'t need comments on your site, consider disabling them.',
						'There are %d comments. If you don\'t need comments on your site, consider disabling them.',
						(int) \wp_count_comments()->approved,
						'progress-planner'
					)
				),
				(int) \wp_count_comments()->approved
			) . '</p>',
			'link_setting' => [
				'hook'   => 'options-discussion.php',
				'iconEl' => 'tr th:has(+td label[for="default_comment_status"])',
			],
		];
	}
}
