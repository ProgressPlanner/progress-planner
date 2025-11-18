<?php
/**
 * Onboarding wizard.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Onboarding wizard.
 */
class Onboard_Wizard {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		// Add popover markup.
		\add_action( 'wp_footer', [ $this, 'add_popover' ] );
		\add_action( 'wp_footer', [ $this, 'add_popover_step_templates' ] );
		\add_action( 'admin_footer', [ $this, 'add_popover' ] );
		\add_action( 'admin_footer', [ $this, 'add_popover_step_templates' ] );

		// Add popover scripts.
		\add_action( 'wp_enqueue_scripts', [ $this, 'add_popover_scripts' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'add_popover_scripts' ] );

		// Add admin toolbar item.
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item' ] );

		// Note: AJAX action needs to be registered early (ie wrapping init in is_admin() check will be to late).
		\add_action( 'wp_ajax_progress_planner_tour_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_tour_save_progress', [ $this, 'ajax_save_tour_progress' ] );

		// Allow only images for the front-end upload.
		\add_filter( 'rest_pre_insert_attachment', [ $this, 'rest_pre_insert_attachment' ], 10, 2 );

		// Maybe show user notification that tour is not finished.
		\add_action( 'admin_notices', [ $this, 'maybe_show_user_notification' ] );

		// Maybe clean up the user meta.
		\add_action( 'current_screen', [ $this, 'maybe_clean_up_user_meta' ] );
	}

	/**
	 * Allow only images for the front-end upload.
	 *
	 * @param array            $attachment The attachment.
	 * @param \WP_REST_Request $request The request.
	 * @return array|\WP_Error The attachment or WP_Error.
	 */
	public function rest_pre_insert_attachment( $attachment, $request ) {

		// Only run for our file upload.
		if ( isset( $request['prplFileUpload'] ) && $request['prplFileUpload'] ) {

			$files = $request->get_file_params();

			if ( empty( $files['file'] ) ) {
				return new \WP_Error(
					'rest_no_file',
					__( 'No file uploaded.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}

			$file = $files['file'];

			// Check MIME type.
			if ( strpos( $file['type'], 'image/' ) !== 0 ) {
				return new \WP_Error(
					'rest_invalid_file_type',
					__( 'Only images are allowed for this upload.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}
		}

		return $attachment;
	}

	/**
	 * Maybe clean up the user meta.
	 *
	 * @return void
	 */
	public function maybe_clean_up_user_meta() {
		// TODO: When to cleanup the user meta?
		return;

		if ( ! \get_current_user_id() ) {
			return;
		}

		$screen = \get_current_screen();

		// If the user is on the Progress Planner dashboard delete the user meta.
		if ( ! $screen || 'toplevel_page_progress-planner' !== $screen->id ) {
			return;
		}

		$tour_data = \get_user_meta( \get_current_user_id(), '_prpl_onboard_progress', true );
		if ( ! $tour_data ) {
			return;
		}

		\delete_user_meta( \get_current_user_id(), '_prpl_onboard_progress' );
	}


	/**
	 * Maybe show user notification that tour is not finished.
	 *
	 * @return void
	 */
	public function maybe_show_user_notification() {
		if ( ! \get_current_user_id() ) {
			return;
		}

		$tour_data = \get_user_meta( \get_current_user_id(), '_prpl_onboard_progress', true );
		if ( ! $tour_data ) {
			return;
		}

		$screen = \get_current_screen();

		if ( ! $screen ) {
			return;
		}

		// If the user is on the Progress Planner dashboard do not display the notification and delete the user meta.
		// This is a 'safety net' since we currently prevent all admin notices on the Progress Planner dashboard screen.
		if ( 'toplevel_page_progress-planner' === $screen->id ) {
			\delete_user_meta( \get_current_user_id(), '_prpl_onboard_progress' );

			// Do not show the notification.
			return;
		}

		$tour_data = \json_decode( $tour_data, true );

		if ( $tour_data && isset( $tour_data['data'] ) && ! $tour_data['data']['finished'] ) {
			?>
			<div class="notice notice-success is-dismissible">
				<p>
				<?php
					printf(
						/* Translators: %1$s: Opening the anchor tag. %2$s: Closing the anchor tag. */
						\esc_html__( 'You haven\'t completed the onboarding yet. Go the %1$s Recommendations dashboard %2$s to complete it.', 'progress-planner' ),
						'<a href="' . \esc_url( admin_url( 'admin.php?page=progress-planner' ) ) . '">',
						'</a>'
					);
				?>
				</p>
			</div>
			<?php
		}

		// Clean up the user meta.
		\delete_user_meta( \get_current_user_id(), '_prpl_onboard_progress' );
	}

	/**
	 * Add popover scripts.
	 *
	 * @return void
	 */
	public function add_popover_scripts() {
		// Enqueue variables-color.css.
		\wp_enqueue_style( 'prpl-variables-color', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/variables-color.css', [], \progress_planner()->get_plugin_version() );

		\wp_add_inline_style( 'prpl-variables-color', \progress_planner()->get_ui__branding()->get_custom_css() );

		// Enqueue onboarding.css.
		\wp_enqueue_style( 'prpl-onboarding', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/css/onboarding.css', [], \progress_planner()->get_plugin_version() );

		// Enqueue base step class.
		\wp_enqueue_script( 'prpl-onboarding-step', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/OnboardingStep.js', [], \progress_planner()->get_plugin_version(), true );

		// Enqueue PopoverTask (used by MoreTasksStep).
		\wp_enqueue_script( 'prpl-popover-task', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/PopoverTask.js', [], \progress_planner()->get_plugin_version(), true );

		// Enqueue LicenseGenerator (used by WelcomeStep).
		\wp_enqueue_script( 'prpl-license-generator', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/LicenseGenerator.js', [], \progress_planner()->get_plugin_version(), true );

		// Enqueue step components.
		\wp_enqueue_script( 'prpl-onboarding-welcome-step', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/WelcomeStep.js', [ 'prpl-onboarding-step', 'prpl-license-generator' ], \progress_planner()->get_plugin_version(), true );
		\wp_enqueue_script( 'prpl-onboarding-first-task-step', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/FirstTaskStep.js', [ 'prpl-onboarding-step' ], \progress_planner()->get_plugin_version(), true );
		\wp_enqueue_script( 'prpl-onboarding-badges-step', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/BadgesStep.js', [ 'prpl-onboarding-step' ], \progress_planner()->get_plugin_version(), true );
		\wp_enqueue_script( 'prpl-onboarding-more-tasks-step', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/MoreTasksStep.js', [ 'prpl-onboarding-step', 'prpl-popover-task' ], \progress_planner()->get_plugin_version(), true );

		// Enqueue main onboarding.js (depends on all step components).
		\wp_enqueue_script(
			'prpl-popover-onboarding',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/onboarding.js',
			[
				'prpl-onboarding-step',
				'prpl-onboarding-welcome-step',
				'prpl-onboarding-first-task-step',
				'prpl-onboarding-badges-step',
				'prpl-onboarding-more-tasks-step',
			],
			\progress_planner()->get_plugin_version(),
			true
		);

		// Get saved progress from user meta.
		$saved_progress = $this->get_saved_progress();

		\wp_localize_script(
			'prpl-popover-onboarding',
			'ProgressPlannerOnboardData',
			[
				'adminAjaxUrl'         => \esc_url_raw( admin_url( 'admin-ajax.php' ) ),
				'nonceProgressPlanner' => \esc_js( \wp_create_nonce( 'progress_planner' ) ),
				'nonceWPAPI'           => \esc_js( \wp_create_nonce( 'wp_rest' ) ),
				'popoverId'            => 'prpl-popover-onboarding',
				'onboardAPIUrl'        => \progress_planner()->get_utils__onboard()->get_remote_url( 'onboard' ),
				'onboardNonceURL'      => \progress_planner()->get_utils__onboard()->get_remote_url( 'get-nonce' ),
				'site'                 => \esc_attr( \set_url_scheme( \site_url() ) ),
				'timezone_offset'      => (float) ( \wp_timezone()->getOffset( new \DateTime( 'midnight' ) ) / 3600 ),
				'savedProgress'        => $saved_progress,
				'l10n'                 => [
					'next'            => \esc_html__( 'Next', 'progress-planner' ),
					'startOnboarding' => \esc_html__( 'Start onboarding', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Get saved progress from user meta.
	 *
	 * @return array|null
	 */
	protected function get_saved_progress() {
		if ( ! \get_current_user_id() ) {
			return null;
		}

		$tour_data = \get_user_meta( \get_current_user_id(), '_prpl_onboard_progress', true );
		if ( ! $tour_data ) {
			return null;
		}

		$decoded = \json_decode( $tour_data, true );
		if ( ! $decoded || ! \is_array( $decoded ) ) {
			return null;
		}

		return $decoded;
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
				'id'    => 'progress-planner-onboarding',
				'title' => 'Progress Planner Onboarding',
				'href'  => '#',
				'meta'  => [
					'onclick' => 'window.prplOnboardWizard.startOnboarding(); return false;',
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
		\update_user_meta( \get_current_user_id(), '_prpl_onboard_progress', $progress );

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

		// Aditional data for the task, besides the task ID.
		$form_values = [];
		if ( isset( $_POST['form_values'] ) ) {
			$form_values = \sanitize_text_field( \wp_unslash( $_POST['form_values'] ) );
			$form_values = \json_decode( $form_values, true );
		}

		// Safety check: Ensure form_values is an array after decoding.
		if ( ! \is_array( $form_values ) ) {
			$form_values = [];
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
		$task_completed = $provider->complete_task( $form_values, $task_id );

		// Note: Marking task as completed will set it it to pending, so user will get celebration. Do we want that?
		$task_post_marked_as_completed = \progress_planner()->get_suggested_tasks()->mark_task_as_completed( $task_id );

		if ( ! $task_completed || ! $task_post_marked_as_completed ) {
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
		<div id="prpl-popover-onboarding" class="prpl-popover prpl-popover-onboarding" data-prpl-step="0" popover="manual">
			<div class="prpl-onboarding-layout">
				<!-- Left column: Step navigation -->
				<div class="prpl-onboarding-navigation">
					<ol class="prpl-step-list">
						<li class="prpl-step-item" data-step="0">
							<span class="prpl-step-icon">1</span>
							<span class="prpl-step-label"><?php esc_html_e( 'Welcome to Progress Planner', 'progress-planner' ); ?></span>
						</li>
						<li class="prpl-step-item" data-step="1">
							<span class="prpl-step-icon">2</span>
							<span class="prpl-step-label"><?php esc_html_e( 'Complete your first task!', 'progress-planner' ); ?></span>
						</li>
						<li class="prpl-step-item" data-step="2">
							<span class="prpl-step-icon">3</span>
							<span class="prpl-step-label"><?php esc_html_e( 'Our badges are waiting for you', 'progress-planner' ); ?></span>
						</li>
						<li class="prpl-step-item" data-step="3">
							<span class="prpl-step-icon">4</span>
							<span class="prpl-step-label"><?php esc_html_e( 'Complete more tasks', 'progress-planner' ); ?></span>
						</li>
					</ol>
				</div>

				<!-- Middle and right columns: Step content (rendered by step components) -->
				<div class="prpl-onboarding-content">
					<div class="tour-content-wrapper">
						<!-- Tour content will be rendered here -->
					</div>

					<div class="tour-footer">
						<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php esc_html_e( 'Next', 'progress-planner' ); ?></button>
						<button id="prpl-dashboard-btn" class="prpl-btn prpl-btn-primary" data-redirect-to="<?php echo \esc_url( admin_url( 'admin.php?page=progress-planner' ) ); ?>"><?php esc_html_e( 'Take me to the Recommendations dashboard', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>

			<button id="prpl-tour-close-btn" class="prpl-popover-close" popovertarget="prpl-popover-onboarding" popovertargetaction="hide">
				<span class="dashicons dashicons-no-alt"></span>
			</button>
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
			'core-siteicon',
		];

		$tasks = [];

		foreach ( $onboarding_tasks as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

			// If there is no task, create it.
			if ( ! $task ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_id );

				if ( $task_provider ) {
					$task_data = $task_provider->get_task_details();

					// Task will not be inserted if it already exists.
					\progress_planner()->get_suggested_tasks_db()->add( $task_data );

					// Now get the task.
					$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
				}
			}

			// Safety check: Skip if task could not be created or retrieved.
			if ( ! $task || ! isset( $task[0] ) || ! \is_object( $task[0] ) ) {
				\error_log( 'Onboarding: Could not retrieve or create task: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
				continue;
			}

			$task_formatted = [
				'task_id'     => $task[0]->get_task_id(),
				'title'       => $task[0]->post_title ?? '',
				'url'         => $task[0]->url ?? '',
				'provider_id' => $task[0]->get_provider_id(),
				'points'      => $task[0]->points ?? 0,
			];

			// Add task specific data.
			if ( 'core-blogdescription' === $task_id ) {
				$task_formatted['site_description'] = \get_bloginfo( 'description' ) ?? '';
			}

			$tasks[ $task_id ] = $task_formatted;
		}

		// Safety check: Ensure we have at least one task before rendering views.
		if ( empty( $tasks ) ) {
			\error_log( 'Onboarding: No tasks available to render onboarding templates.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return;
		}

		\progress_planner()->the_view( 'onboarding/welcome.php' );

		// Get the first task for the first-task step.
		if ( isset(  $tasks[0] ) && 'core-blogdescription' === $tasks[0]['task_id'] ) {
			\progress_planner()->the_view( 'onboarding/first-task.php', [ 'task' => \array_shift( $tasks ) ] );
		}

		\progress_planner()->the_view( 'onboarding/badges.php' );

		// Only render more-tasks view if we have remaining tasks.
		if ( ! empty( $tasks ) ) {
			\progress_planner()->the_view( 'onboarding/more-tasks.php', [ 'tasks' => $tasks ] );
		}
		?>
		<script>
			// Initialize tour when DOM is ready
			document.addEventListener('DOMContentLoaded', () => {

				// Initialize tour instance
				window.prplOnboardWizard = new ProgressPlannerOnboardWizard( window.ProgressPlannerOnboardData );
			});
		</script>
		<?php
	}
}
