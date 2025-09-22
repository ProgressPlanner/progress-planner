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

		\add_action( 'wp_footer', [ $this, 'add_popover_inline_script' ] );

		// Add popover scripts.
		\add_action( 'wp_enqueue_scripts', [ $this, 'add_popover_scripts' ] );

		// Add admin toolbar item.
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item' ] );

		// Note: AJAX action needs to be registered early (ie wrapping init in is_admin() check will be to late).
		\add_action( 'wp_ajax_progress_planner_tour_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_tour_save_progress', [ $this, 'ajax_save_tour_progress' ] );
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

		$ravis_recommendations = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => 'user',
						'operator' => 'NOT IN',
					],
				],
			]
		);
		$tasks                 = [];
		foreach ( $ravis_recommendations as $recommendation ) {
			$tasks[] = [
				'task_id'     => $recommendation->task_id,
				'title'       => $recommendation->post_title,
				'url'         => $recommendation->url,
				'provider_id' => $recommendation->get_provider_id(),
				'points'      => $recommendation->points,
			];
		}

		\wp_localize_script(
			'prpl-popover-front-end-onboarding',
			'ProgressPlannerData',
			[
				'adminAjaxUrl'         => \esc_url_raw( admin_url( 'admin-ajax.php' ) ),
				'nonceProgressPlanner' => \esc_js( \wp_create_nonce( 'progress_planner' ) ),
				'tasks'                => $tasks,
			]
		);
	}

	/**
	 * Add admin toolbar item.
	 *
	 * @return void
	 */
	public function add_admin_toolbar_item() {
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
					'onclick' => 'prplStartTour(); return false;',
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

		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task ID is required.', 'progress-planner' ) ] );
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );

		// Note: Completing task will set it it to pending, so user will get celebration.
		// Do we want that?
		$result = \progress_planner()->get_suggested_tasks()->complete_task( $task_id );

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
		<div id="prpl-popover-front-end-onboarding" class="prpl-popover prpl-popover-onboarding" data-prpl-step="0" popover>

			<div class="tour-header">
				<h2 class="tour-title">
					<!-- Tour title will be rendered here -->
				</h2>
			</div>
			<div class="tour-content">
				<!-- Tour content will be rendered here -->
			</div>
			<div class="tour-footer">
				<button class="prpl-tour-prev prpl-btn prpl-btn-primary">Back</button>
				<button class="prpl-tour-next prpl-btn prpl-btn-primary">Next</button>
				<button id="prpl-finish-btn" class="prpl-btn prpl-btn-primary">Finish</button>
			</div>
		</div>
		<?php
	}

	/**
	 * Add the popover inline script.
	 *
	 * @return void
	 */
	public function add_popover_inline_script() {
		$ravis_recommendations = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => 'user',
						'operator' => 'NOT IN',
					],
				],
			]
		);
		$tasks                 = [];
		foreach ( $ravis_recommendations as $recommendation ) {

			$tasks[] = [
				'task_id'     => $recommendation->task_id,
				'title'       => $recommendation->post_title,
				'url'         => $recommendation->url,
				'provider_id' => $recommendation->get_provider_id(),
				'points'      => $recommendation->points,
			];
		}
		?>
		<script>
			// Initialize tour when DOM is ready
			document.addEventListener('DOMContentLoaded', () => {

				// Initialize tour instance
				window.prplTour = new ProgressPlannerTour(window.ProgressPlannerData);

				// Setup event listeners after DOM is ready
				window.prplTour.setupEventListeners();

				// Global function for starting tour (used by admin toolbar)
				window.prplStartTour = () => window.prplTour.startTour();
			});
		</script>

		<!-- Tour step welcome -->
		<script type="text/template" id="tour-step-welcome">
			<p>Welcome to the Progress Planner onboarding.</p>
		</script>

		<!-- Tour step connect -->
		<script type="text/template" id="tour-step-first-task">
			<p>You have pending tasks to complete.</p>
			<?php if ( isset( $tasks[0] ) ) : ?>
			<p class="prpl-complete-task-item">
				<?php echo esc_html( $tasks[0]['title'] ); ?>
				<button id="first-task-btn" data-task-id="<?php echo esc_attr( $tasks[0]['task_id'] ); ?>" class="prpl-complete-task-btn">Complete first task</button>
			</p>
			<div id="first-task-status"></div>
			<?php endif; ?>
		</script>

		<!-- Tour step badges -->
		<script type="text/template" id="tour-step-badges">
			<p>
				Every step you take makes your website better. Progress Planner tracks your progress, celebrating achievements with badges and streaks to keep you motivated and engaged.
			</p>
		</script>

		<!-- Tour step more tasks -->
		<script type="text/template" id="tour-step-more-tasks">
			<p>Check out more tasks to complete:</p>
			<ul id="prpl-more-tasks-list">
				<?php
				for ( $i = 1; $i < 6; $i++ ) :
					if ( ! isset( $tasks[ $i ] ) ) {
						break; }
					?>
					<li class="prpl-complete-task-item">
						<?php echo esc_html( $tasks[ $i ]['title'] ); ?>
						<button id="more-tasks-btn-<?php echo esc_attr( $tasks[ $i ]['task_id'] ); ?>" data-task-id="<?php echo esc_attr( $tasks[ $i ]['task_id'] ); ?>" class="prpl-complete-task-btn">Complete task</button>
					</li>
				<?php endfor; ?>
			</ul>
		</script>

		<!-- Tour step finish -->
		<script type="text/template" id="tour-step-finish">
			<p>Congratulations, setup complete. 🎉</p>
		</script>
		<?php
	}
}
