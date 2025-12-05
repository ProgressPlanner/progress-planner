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
	 * Steps and their order.
	 *
	 * @var array
	 */
	protected $steps = [];

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {

		// If the onboarding is finished, do not add the popover.
		if ( $this->is_onboarding_finished() ) {
			return;
		}

		// Add popover on front end.
		\add_action( 'wp_footer', [ $this, 'add_popover' ] );
		\add_action( 'wp_footer', [ $this, 'add_popover_step_templates' ] );
		\add_action( 'wp_enqueue_scripts', [ $this, 'add_popover_scripts' ] );

		// Add popover on admin.
		\add_action( 'admin_footer', [ $this, 'add_popover' ] );
		\add_action( 'admin_footer', [ $this, 'add_popover_step_templates' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'add_popover_scripts' ] );

		// Define steps and their order.
		\add_action( 'init', [ $this, 'define_steps_and_order' ], 101 );

		// Add admin toolbar items.
		// TODO: Remove after testing.
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_items' ] );
		\add_action( 'admin_init', [ $this, 'check_delete_onboarding_progress' ] );

		// Note: AJAX action needs to be registered early (ie wrapping init in is_admin() check will be to late).
		\add_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_onboarding_save_progress', [ $this, 'ajax_save_onboarding_progress' ] );
		\add_action( 'wp_ajax_prpl_save_all_onboarding_settings', [ $this, 'ajax_save_all_onboarding_settings' ] );

		// Allow only images for the front-end upload.
		\add_filter( 'rest_pre_insert_attachment', [ $this, 'rest_pre_insert_attachment' ], 10, 2 );

		// Maybe show user notification that tour is not finished.
		\add_action( 'admin_notices', [ $this, 'maybe_show_user_notification' ] );
	}

	/**
	 * Define steps and their order.
	 *
	 * @return void
	 */
	public function define_steps_and_order() {
		$saved_progress = $this->get_saved_progress();

		// We need to know if the first task is already completed, in case user resumes the onboarding.
		$was_first_task_completed = isset( $saved_progress['data'] ) && ! empty( $saved_progress['data']['firstTaskCompleted'] );

		// Get the onboarding tasks.
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
			if ( empty( $task ) ) {
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
				$task_formatted['site_description'] = \get_bloginfo( 'description' );
			}

			$tasks[ $task_id ] = $task_formatted;
		}

		$this->steps = [
			[
				'script_file_name'   => 'WelcomeStep',
				'template_file_name' => 'welcome',
				'template_id'        => 'onboarding-step-welcome',
				/* translators: %s: Progress Planner name. */
				'title'              => sprintf( esc_html__( 'Welcome to %s', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) ),
			],
			[
				'script_file_name'   => 'WhatsWhatStep',
				'template_file_name' => 'whats-what',
				'template_id'        => 'onboarding-step-whats-what',
				'title'              => esc_html__( 'What\'s what?', 'progress-planner' ),
			],
		];

		// Add first task step if there are tasks or if the first task is already completed.
		if ( ! empty( $tasks ) || $was_first_task_completed ) {
			$this->steps[] = [
				'script_file_name'   => 'FirstTaskStep',
				'template_file_name' => 'first-task',
				'template_data'      => ! $was_first_task_completed ? [ 'task' => \array_shift( $tasks ) ] : [],
				'template_id'        => 'onboarding-step-first-task',
				'title'              => esc_html__( 'Complete your first task!', 'progress-planner' ),
			];
		}

		$this->steps[] = [
			'script_file_name'   => 'BadgesStep',
			'template_file_name' => 'badges',
			'template_id'        => 'onboarding-step-badges',
			'title'              => esc_html__( 'Our badges are waiting for you', 'progress-planner' ),
		];

		$this->steps[] = [
			'script_file_name'   => 'EmailFrequencyStep',
			'template_file_name' => 'email-frequency',
			'template_id'        => 'onboarding-step-email-frequency',
			'title'              => esc_html__( 'Email Frequency', 'progress-planner' ),
		];

		$this->steps[] = [
			'script_file_name'   => 'SettingsStep',
			'template_file_name' => 'settings',
			'template_id'        => 'onboarding-step-settings',
			'title'              => esc_html__( 'Settings', 'progress-planner' ),
		];

		// Add more-tasks step if there are remaining tasks.
		if ( ! empty( $tasks ) ) {
			$this->steps[] = [
				'script_file_name'   => 'MoreTasksStep',
				'template_file_name' => 'more-tasks',
				'template_data'      => [ 'tasks' => $tasks ],
				'template_id'        => 'onboarding-step-more-tasks',
				'title'              => esc_html__( 'Complete more tasks', 'progress-planner' ),
			];
		}
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
	 * Maybe show user notification that tour is not finished.
	 *
	 * @return void
	 */
	public function maybe_show_user_notification() {
		if ( ! \current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( $this->is_onboarding_finished() ) {
			return;
		}

		$screen = \get_current_screen();

		if ( ! $screen ) {
			return;
		}

		// If the user is on the Progress Planner dashboard do not display the notification.
		// This is a 'safety net' since we currently prevent all admin notices on the Progress Planner dashboard screen.
		if ( 'toplevel_page_progress-planner' === $screen->id ) {
			// Do not show the notification.
			return;
		}

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

		// TODO: Clean up the onboarding progress.
		$this->delete_onboarding_progress();
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

		// Enqueue PrplOnboardTask (used by MoreTasksStep).
		\wp_enqueue_script( 'prpl-onboard-task', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/OnboardTask.js', [], \progress_planner()->get_plugin_version(), true );

		// Enqueue LicenseGenerator (used by WelcomeStep).
		\wp_enqueue_script( 'prpl-license-generator', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/js/license-generator.js', [], \progress_planner()->get_plugin_version(), true );

		// Enqueue step components.
		foreach ( $this->steps as $step ) {
			\wp_enqueue_script( 'prpl-onboarding-' . $step['script_file_name'], \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/steps/' . $step['script_file_name'] . '.js', [ 'prpl-onboarding-step' ], \progress_planner()->get_plugin_version(), true );
		}

		\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-gauge' );

		// Enqueue main onboarding.js (depends on all step components).
		\wp_enqueue_script(
			'prpl-popover-onboarding',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/onboarding/js/onboarding.js',
			[],
			\progress_planner()->get_plugin_version(),
			true
		);

		// Get saved progress from user meta.
		$saved_progress = $this->get_saved_progress();

		// Check if we're on the Progress Planner dashboard page.
		$is_dashboard_page = false;
		if ( \is_admin() ) {
			$screen            = \function_exists( 'get_current_screen' ) ? \get_current_screen() : null;
			$is_dashboard_page = $screen && 'toplevel_page_progress-planner' === $screen->id;
		}

		// Check if onboarding was already completed.
		$onboarding_completed = \get_option( 'prpl_onboarding_completed', false );

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
				'lastStepRedirectUrl'  => \esc_url_raw( admin_url( 'admin.php?page=progress-planner' ) ),
				'isDashboardPage'      => $is_dashboard_page,
				'onboardingCompleted'  => (bool) $onboarding_completed,
				'fullscreenMode'       => true, // Enable fullscreen takeover mode.
				'l10n'                 => [
					'next'                  => \esc_html__( 'Next', 'progress-planner' ),
					'startOnboarding'       => \esc_html__( 'Start onboarding', 'progress-planner' ),
					/* translators: %s: Progress Planner name. */
					'privacyPolicyError'    => sprintf( \esc_html__( 'You need to agree with the privacy policy to use the %s plugin.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) ),
					'dashboard'             => \esc_html__( 'Take me to the dashboard', 'progress-planner' ),
					'backToRecommendations' => \esc_html__( 'Back to recommendations', 'progress-planner' ),
				],
				'errorIcon'            => \progress_planner()->get_asset( 'images/icon_exclamation_circle.svg' ),
				'steps'                => array_column( $this->steps, 'script_file_name' ),
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

		$onboarding_progress = \get_option( 'prpl_onboard_progress', false );
		if ( ! $onboarding_progress ) {
			return null;
		}

		$decoded = \json_decode( $onboarding_progress, true );
		if ( ! $decoded || ! \is_array( $decoded ) ) {
			return null;
		}

		return $decoded;
	}

	/**
	 * Clean up the onboarding progress.
	 *
	 * @return void
	 */
	public function delete_onboarding_progress() {
		\delete_option( 'prpl_onboard_progress' );
	}

	/**
	 * Check if the onboarding is finished.
	 *
	 * @return bool
	 */
	public function is_onboarding_finished() {
		$onboarding_progress = $this->get_saved_progress();
		if ( ! $onboarding_progress ) {
			return false;
		}

		return isset( $onboarding_progress['data'] ) && isset( $onboarding_progress['data']['finished'] ) && $onboarding_progress['data']['finished'];
	}

	/**
	 * Add admin toolbar item.
	 *
	 * @return void
	 */
	public function add_admin_toolbar_items() {
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_items_callback' ], 100 );
	}

	/**
	 * Add admin toolbar item callback.
	 *
	 * @param \WP_Admin_Bar $admin_bar The admin bar.
	 * @return void
	 */
	public function add_admin_toolbar_items_callback( $admin_bar ) {
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

		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}

		$current_url = \wp_nonce_url( \esc_url_raw( \wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'prpl_onboarding_wizard' );

		// Add Delete License submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'progress-planner-onboarding-delete-progress',
				'parent' => 'progress-planner-onboarding',
				'title'  => 'Delete Onboarding Progress',
				'href'   => \add_query_arg( 'prpl_delete_onboarding_progress', '1', $current_url ),
			]
		);
	}

	/**
	 * Check and process the delete single task action.
	 *
	 * Deletes a single task if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_delete_onboarding_progress() {
		if (
			! isset( $_GET['prpl_delete_onboarding_progress'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! \current_user_can( 'manage_options' )
		) {
			return;
		}

		// Verify nonce for security.
		if ( ! isset( $_GET['_wpnonce'] ) || ! \wp_verify_nonce( \wp_unslash( $_GET['_wpnonce'] ), 'prpl_onboarding_wizard' ) ) { //  phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			\wp_die( \esc_html__( 'Security check failed', 'progress-planner' ) );
		}

		// Delete the onboarding progress.
		$this->delete_onboarding_progress();

		// Redirect to the same page without the parameter.
		\wp_safe_redirect( \remove_query_arg( [ 'prpl_delete_onboarding_progress', '_wpnonce' ] ) );
		exit;
	}

	/**
	 * Save the tour progress.
	 *
	 * @return void
	 */
	public function ajax_save_onboarding_progress() {
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['state'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'State is required.', 'progress-planner' ) ] );
		}
		$progress = \sanitize_text_field( \wp_unslash( $_POST['state'] ) );

		\error_log( print_r( $progress, true ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r, WordPress.PHP.DevelopmentFunctions.error_log_error_log

		// Save as user meta?
		\update_option( 'prpl_onboard_progress', $progress );

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

		// It will skip the celebration and set the task's post status to trash.
		$task_post_marked_as_completed = \progress_planner()->get_suggested_tasks()->mark_task_as_completed( $task_id, null, true );

		if ( ! $task_completed || ! $task_post_marked_as_completed ) {
			\error_log( 'Task not completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not completed.', 'progress-planner' ) ] );
		}

		\error_log( 'Task completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		\wp_send_json_success( [ 'message' => \esc_html__( 'Task completed.', 'progress-planner' ) ] );
	}

	/**
	 * Handle saving all onboarding settings in a single request.
	 *
	 * @return void
	 */
	public function ajax_save_all_onboarding_settings() {
		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update settings.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$page_settings = \progress_planner()->get_admin__page_settings();

		// Handle page settings (about, contact, faq).
		if ( isset( $_POST['pages'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$pages_json = \sanitize_text_field( \wp_unslash( $_POST['pages'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$pages      = \json_decode( $pages_json, true );

			if ( \is_array( $pages ) ) {
				// Convert to the format expected by set_page_values.
				$pages_formatted = [];
				foreach ( $pages as $page_type => $page_data ) {
					if ( isset( $page_data['id'] ) && isset( $page_data['have_page'] ) ) {
						$pages_formatted[ $page_type ] = [
							'id'        => (int) $page_data['id'],
							'have_page' => $page_data['have_page'],
						];
					}
				}

				if ( ! empty( $pages_formatted ) ) {
					$page_settings->set_page_values( $pages_formatted );
				}
			}
		}

		// Handle post types.
		$include_post_types = isset( $_POST['prpl-post-types-include'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
		? \array_map( 'sanitize_text_field', \wp_unslash( $_POST['prpl-post-types-include'] ) ) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
		: [];
		$page_settings->save_post_types( $include_post_types );

		// Handle login destination.
		$redirect_on_login = isset( $_POST['prpl-redirect-on-login'] ) ? (bool) \sanitize_text_field( \wp_unslash( $_POST['prpl-redirect-on-login'] ) ) : false; // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$page_settings->save_settings( $redirect_on_login );

		\wp_send_json_success( [ 'message' => \esc_html__( 'All settings saved successfully.', 'progress-planner' ) ] );
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-onboarding-fullscreen" class="prpl-onboarding-fullscreen" style="display: none;">
		<div id="prpl-popover-onboarding" class="prpl-popover-onboarding" data-prpl-step="0" popover="manual" tabindex="-1">
			<div class="prpl-onboarding-layout">
				<!-- Left column: Step navigation -->
				<div class="prpl-onboarding-navigation">
					<div>
						<div id="prpl-onboarding-mobile-step-label">
							<?php echo \esc_html( $this->steps[0]['title'] ); ?>
						</div>
						<ol class="prpl-step-list">
							<?php
								$i = 0;
							foreach ( $this->steps as $step ) :
								?>
								<li class="prpl-nav-step-item" data-step="<?php echo esc_attr( $i ); ?>">
									<span class="prpl-step-icon"><?php echo esc_html( $i + 1 ); ?></span>
									<span class="prpl-step-label"><?php echo esc_html( $step['title'] ); ?></span>
								</li>
								<?php
								++$i;
								endforeach;
							?>
						</ol>
					</div>
					<div class="prpl-onboarding-logo">
						<?php \progress_planner()->get_ui__branding()->the_logo(); ?>
					</div>
				</div>

				<!-- Middle and right columns: Step content (rendered by step components) -->
				<div class="prpl-onboarding-content">
					<div class="tour-content-wrapper">
						<!-- Tour content will be rendered here -->
						<!-- Note: Each step template should include its own .prpl-tour-next button -->
					</div>
				</div>
			</div>

			<button id="prpl-tour-close-btn" class="prpl-popover-close" popovertarget="prpl-popover-onboarding" popovertargetaction="hide">
				<span class="dashicons dashicons-no-alt"></span>
			</button>
		</div>
		</div><!-- /#prpl-onboarding-fullscreen -->
		<?php
	}

	/**
	 * Add the popover inline script.
	 *
	 * @return void
	 */
	public function add_popover_step_templates() {
		foreach ( $this->steps as $step ) {
			\progress_planner()->the_view( 'onboarding/' . $step['template_file_name'] . '.php', isset( $step['template_data'] ) ? $step['template_data'] : [] );
		}

		// Add quit confirmation template.
		\progress_planner()->the_view( 'onboarding/quit-confirmation.php' );
		?>
		<script>
			// Initialize tour when DOM is ready
			document.addEventListener('DOMContentLoaded', () => {

				// Initialize tour instance
				window.prplOnboardWizard = new ProgressPlannerOnboardWizard( window.ProgressPlannerOnboardData );

				// WIP: Dispatch event to notify that the onboarding wizard is ready.
				document.dispatchEvent( new Event( 'prplOnboardWizardReady' ) );
			});
		</script>
		<?php
	}
}
