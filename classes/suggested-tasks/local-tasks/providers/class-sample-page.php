<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Sample_Page extends Local_Tasks_Abstract {

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
	const ID = 'sample-page';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'edit_pages';

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

		$sample_page = get_page_by_path( 'sample-page' );

		if ( $sample_page !== null ) {
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

		if ( null === get_page_by_path( 'sample-page' ) ) {
			return [];
		}

		return [
			$this->get_task_details(),
		];
	}

	/**
	 * Get the task details.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		$sample_page = get_page_by_path( 'sample-page' );
		if ( null === $sample_page ) {
			return [];
		}

		return [
			'task_id'     => self::ID,
			'title'       => \esc_html__( 'Delete "Sample Page"', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => 'maintenance',
			'points'      => 1,
			'url'         => admin_url( 'post.php?post=' . $sample_page->ID . '&action=edit' ),
			'description' => '<p>' . \esc_html__( 'On install, WordPress creates a Sample Page. This page is not needed and should be deleted.', 'progress-planner' ) . '</p>',
		];
	}
}
