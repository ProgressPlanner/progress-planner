<?php
/**
 * Front end onboarding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Front_End;

/**
 * Front end onboarding.
 */
class Front_End_Onboarding {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		// Add popover markup.
		\add_action( 'wp_footer', [ $this, 'add_popover' ] );

		\add_action( 'wp_footer', [ $this, 'add_popover_step_templates' ] );

		// Add popover scripts.
		\add_action( 'wp_enqueue_scripts', [ $this, 'add_popover_scripts' ] );

		// Add admin toolbar item.
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item' ] );

		// Note: AJAX action needs to be registered early (ie wrapping init in is_admin() check will be to late).
		\add_action( 'wp_ajax_progress_planner_tour_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_tour_save_progress', [ $this, 'ajax_save_tour_progress' ] );

		// Maybe show user notification that tour is not finished.
		\add_action( 'init', [ $this, 'maybe_show_user_notification' ] );
	}

	/**
	 * Maybe show user notification that tour is not finished.
	 *
	 * @return void
	 */
	public function maybe_show_user_notification() {
		if ( ! is_admin() || ! \get_current_user_id() ) {
			return;
		}

		$tour_data = \get_user_meta( \get_current_user_id(), '_prpl_tour_progress', true );
		if ( ! $tour_data ) {
			return;
		}

		$tour_data = \json_decode( $tour_data, true );

		if ( $tour_data && isset( $tour_data['data'] ) && ! $tour_data['data']['finished'] ) {
			// TODO: Show user notification.
			\error_log( 'Tour is not finished.' );
		}

		// TODO: Clean up the user meta.
	}

	/**
	 * Add popover scripts.
	 *
	 * @return void
	 */
	public function add_popover_scripts() {
		// Enqueue front-end-onboarding.css.
		\wp_enqueue_style( 'prpl-popover-front-end-onboarding', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/front-end-onboarding.css', [], \progress_planner()->get_plugin_version() );

		// Enqueue front-end-onboarding.js.
		\wp_enqueue_script( 'prpl-popover-front-end-onboarding', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/js/front-end-onboarding.js', [], \progress_planner()->get_plugin_version(), true );

		\wp_localize_script(
			'prpl-popover-front-end-onboarding',
			'ProgressPlannerData',
			[
				'adminAjaxUrl'         => \esc_url_raw( admin_url( 'admin-ajax.php' ) ),
				'nonceProgressPlanner' => \esc_js( \wp_create_nonce( 'progress_planner' ) ),
			]
		);
	}

	/**
	 * Add admin toolbar item.
	 *
	 * @return void
	 */
	public function add_admin_toolbar_item() {
		if ( is_admin() ) {
			return;
		}

		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item_callback' ], 100 );
	}

	/**
	 * Add admin toolbar item callback.
	 *
	 * @param \WP_Admin_Bar $admin_bar The admin bar.
	 * @return void
	 */
	public function add_admin_toolbar_item_callback( $admin_bar ) {
		$admin_bar->add_node(
			[
				'id'    => 'progress-planner-tour',
				'title' => 'Progress Planner Tour',
				'href'  => '#',
				'meta'  => [
					'onclick' => 'window.prplTour.startTour(); return false;',
				],
			]
		);
	}

	/**
	 * Save the tour progress.
	 *
	 * @return void
	 */
	public function ajax_save_tour_progress() {
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['state'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'State is required.', 'progress-planner' ) ] );
		}
		$progress = \sanitize_text_field( \wp_unslash( $_POST['state'] ) );

		\error_log( print_r( $progress, true ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r, WordPress.PHP.DevelopmentFunctions.error_log_error_log

		// Save as user meta?
		\update_user_meta( \get_current_user_id(), '_prpl_tour_progress', $progress );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Tour progress saved.', 'progress-planner' ) ] );
	}

	/**
	 * Complete a task.
	 *
	 * @return void
	 */
	public function ajax_complete_task() {

		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to complete this task.', 'progress-planner' ) ] );
		}

		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task ID is required.', 'progress-planner' ) ] );
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );

		// TODO: Actually complete the task, for example delete the hello world post.

		// Aditional data for the task, besides the task ID.
		$form_values = [];
		if ( isset( $_POST['form_values'] ) ) {
			$form_values = \sanitize_text_field( \wp_unslash( $_POST['form_values'] ) );
			$form_values = \json_decode( $form_values, true );
		}

		// Get the task.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );
		if ( ! $task ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
		}

		// To get the provider and complete the task, we need to use the provider.
		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task->get_provider_id() );
		if ( ! $provider ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Provider not found.', 'progress-planner' ) ] );
		}

		// Complete the task.
		$provider->complete_task( $form_values, $task_id );

		// Note: Marking task as completed will set it it to pending, so user will get celebration. Do we want that?
		$result = \progress_planner()->get_suggested_tasks()->mark_task_as_completed( $task_id );

		if ( ! $result ) {
			\error_log( 'Task not completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not completed.', 'progress-planner' ) ] );
		}

		\error_log( 'Task completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		\wp_send_json_success( [ 'message' => \esc_html__( 'Task completed.', 'progress-planner' ) ] );
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-front-end-onboarding" class="prpl-popover prpl-popover-onboarding" data-prpl-step="0" popover="manual">

			<div class="tour-content-wrapper">
				<!-- Tour content will be rendered here -->
			</div>

			<div class="tour-footer">
				<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php esc_html_e( 'Next', 'progress-planner' ); ?></button>
				<button id="prpl-finish-btn" class="prpl-btn prpl-btn-secondary"><?php esc_html_e( 'Close', 'progress-planner' ); ?></button>
				<button id="prpl-dashboard-btn" class="prpl-btn prpl-btn-primary" onclick="window.location.href = '<?php echo \esc_url( admin_url( 'admin.php?page=progress-planner' ) ); ?>';"><?php esc_html_e( 'Take me to the dashboard', 'progress-planner' ); ?></button>
			</div>
		</div>
		<?php
	}

	/**
	 * Add the popover inline script.
	 *
	 * @return void
	 */
	public function add_popover_step_templates() {
		$onboarding_tasks = [
			'core-blogdescription',
			'select-timezone',
			'select-locale',
		];

		foreach ( $onboarding_tasks as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

			// If there is no 'blog description' task, create it.
			if ( ! $task ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_id );

				if ( $task_provider ) {
					$task_data = $task_provider->get_task_details();

					\progress_planner()->get_suggested_tasks_db()->add( $task_data );

					// Now get the task.
					$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
				}
			}

			$task_formatted = [
				'task_id'     => $task[0]->task_id,
				'title'       => $task[0]->post_title,
				'url'         => $task[0]->url,
				'provider_id' => $task[0]->get_provider_id(),
				'points'      => $task[0]->points,
			];

			// WIP, add task specific data.
			if ( 'core-blogdescription' === $task_id ) {
				$task_formatted['site_description'] = \get_bloginfo( 'description' );
			}

			$tasks[ $task_id ] = $task_formatted;
		}

		\progress_planner()->the_view( 'front-end-onboarding/welcome.php' );
		\progress_planner()->the_view( 'front-end-onboarding/first-task.php', [ 'task' => array_shift( $tasks ) ] ); // WIP: We need only 1 task for this step.
		\progress_planner()->the_view( 'front-end-onboarding/badges.php' );
		\progress_planner()->the_view( 'front-end-onboarding/more-tasks.php', [ 'tasks' => $tasks ] ); // WIP: We need up to 5 tasks for this step.
		\progress_planner()->the_view( 'front-end-onboarding/finish.php' );
		?>
		<script>
			// Initialize tour when DOM is ready
			document.addEventListener('DOMContentLoaded', () => {

				// Initialize tour instance
				window.prplTour = new ProgressPlannerTour( window.ProgressPlannerData );
			});
		</script>
		<?php
	}
}
