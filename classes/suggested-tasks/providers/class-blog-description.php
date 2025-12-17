<?php
/**
 * Add tasks for Core blogdescription.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core blogdescription.
 */
class Blog_Description extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'core-blogdescription';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'core-blogdescription';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/set-tagline';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 2;

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set tagline', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Set the tagline to make your website look more professional.', 'progress-planner' );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => 'th:has(+td #tagline-description)',
		];
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return '' === \get_bloginfo( 'description' );
	}

	// Popover rendering methods removed - now handled by React BlogDescriptionPopover component.

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html( $this->get_task_action_label() ) . '</a>',
		];

		return $actions;
	}

	/**
	 * Get the task action label.
	 *
	 * @return string
	 */
	public function get_task_action_label() {
		return \__( 'Set tagline', 'progress-planner' );
	}

	/**
	 * Complete the task.
	 *
	 * @param array  $args The task data.
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function complete_task( $args = [], $task_id = '' ) {

		if ( ! $this->capability_required() ) {
			return false;
		}

		if ( ! isset( $args['blogdescription'] ) ) {
			return false;
		}

		// update_option will return false if the option value is the same as the one being set.
		\update_option( 'blogdescription', \sanitize_text_field( $args['blogdescription'] ) );

		return true;
	}
}
