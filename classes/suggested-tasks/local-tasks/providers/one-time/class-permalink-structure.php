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
class Permalink_Structure extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'core-permalink-structure';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$permalink_structure = \get_option( 'permalink_structure' );
		return '/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure;
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
			$task_id = $this->get_task_id();
		}

		return [
			'task_id'      => $task_id,
			'title'        => \esc_html__( 'Set permalink structure', 'progress-planner' ),
			'parent'       => 0,
			'priority'     => 'high',
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( admin_url( 'options-permalink.php' ) ) : '',
			'description'  => '<p>' . sprintf(
				/* translators: %1$s <a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">We recommend</a> link */
				\esc_html__( 'On install, WordPress sets the permalink structure to a format that is not SEO-friendly. %1$s changing it.', 'progress-planner' ),
				'<a href="https://prpl.fyi/change-default-permalink-structure" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
			) . '</p>',
			'link_setting' => [
				'hook'   => 'options-permalink.php',
				'iconEl' => 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]',
			],
		];
	}
}
