<?php
/**
 * Add tasks for Core blogdescription.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for Core blogdescription.
 */
class Blog_Description extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'core-blogdescription';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'configuration';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return '' === \get_bloginfo( 'description' );
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
			'title'        => \esc_html__( 'Set tagline', 'progress-planner' ),
			'parent'       => 0,
			'priority'     => 'high',
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( \admin_url( 'options-general.php?pp-focus-el=' . $task_id ) ) : '',
			'description'  => '<p>' . sprintf(
				/* translators: %s:<a href="https://prpl.fyi/set-tagline" target="_blank">tagline</a> link */
				\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
				'<a href="https://prpl.fyi/set-tagline" target="_blank">' . \esc_html__( 'tagline', 'progress-planner' ) . '</a>'
			) . '</p>',
			'link_setting' => [
				'hook'   => 'options-general.php',
				'iconEl' => 'th:has(+td #tagline-description)',
			],
		];
	}
}
