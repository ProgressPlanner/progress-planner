<?php
/**
 * Add tasks for Core updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core updates.
 */
class Core_Update extends Tasks {

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'update-core';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'update_core';

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = true;

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';


	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->url = \admin_url( 'update-core.php' );
	}

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_filter( 'update_bulk_plugins_complete_actions', [ $this, 'add_core_update_link' ] );
		\add_filter( 'update_bulk_theme_complete_actions', [ $this, 'add_core_update_link' ] );
		\add_filter( 'update_translations_complete_actions', [ $this, 'add_core_update_link' ] );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Perform all updates', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s:<a href="http://prpl.fyi/perform-all-updates" target="_blank">See why we recommend this</a> link */
			\esc_html__( 'Regular updates improve security and performance. %s.', 'progress-planner' ),
			'<a href="http://prpl.fyi/perform-all-updates" target="_blank">' . \esc_html__( 'See why we recommend this', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Add the link to the Progress Planner Dashboard to the update complete actions.
	 *
	 * @param array $update_actions The update actions.
	 *
	 * @return array
	 */
	public function add_core_update_link( $update_actions ) {
		$pending_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'status', 'pending' );

		// All updates are completed and there is a 'update-core' task in the pending tasks.
		if ( $pending_tasks && $this->is_task_completed() ) {
			foreach ( $pending_tasks as $task ) {
				if ( $this->get_task_id() === $task['task_id'] ) {
					$update_actions['prpl_core_update'] =
						'<img src="' . \esc_attr( constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_progress_planner.svg' ) . '" style="width:1rem;padding-left:0.25rem;padding-right:0.25rem;vertical-align:middle;" alt="Progress Planner" />' .
						'<a href="' . \esc_url( \admin_url( 'admin.php?page=progress-planner' ) ) . '" target="_parent">' . \esc_html__( 'Click here to celebrate your completed task!', 'progress-planner' ) . '</a>';
					break;
				}
			}
		}

		return $update_actions;
	}
	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Without this \wp_get_update_data() might not return correct data for the core updates (depending on the timing).
		if ( ! function_exists( 'get_core_updates' ) ) {
			require_once ABSPATH . 'wp-admin/includes/update.php'; // @phpstan-ignore requireOnce.fileNotFound
		}
		return 0 < \wp_get_update_data()['counts']['total'];
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
			'task_id'     => $task_id,
			'title'       => $this->get_title(),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'provider_id' => $this->get_provider_id(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'url'         => $this->get_url(),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description(),
		];
	}
}
