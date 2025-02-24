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
	 * Constructor.
	 */
	public function __construct() {
		$this->url          = \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
		$this->title        = \esc_html__( 'Set tagline', 'progress-planner' );
		$this->description  = sprintf(
			/* translators: %s:<a href="https://prpl.fyi/set-tagline" target="_blank">tagline</a> link */
			\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
			'<a href="https://prpl.fyi/set-tagline" target="_blank">' . \esc_html__( 'tagline', 'progress-planner' ) . '</a>'
		);
		$this->link_setting = [
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
}
