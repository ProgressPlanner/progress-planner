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
		\add_action( 'init', [ $this, 'maybe_register_popover_hooks' ], 0 );
	}

	/**
	 * Maybe register popover hooks.
	 *
	 * @return void
	 */
	public function maybe_register_popover_hooks() {

		// Only show onboarding to users who can manage options.
		if ( ! \current_user_can( 'manage_options' ) ) {
			return;
		}

		// Register AJAX actions early - these must be available even after privacy is accepted
		// during the first step, so subsequent steps can still make AJAX calls.
		\add_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_onboarding_save_progress', [ $this, 'ajax_save_onboarding_progress' ] );
		\add_action( 'wp_ajax_prpl_save_all_onboarding_settings', [ $this, 'ajax_save_all_onboarding_settings' ] );

		// Show onboarding when:
		// 1. Privacy not yet accepted (new install, non-branded).
		// 2. Onboarding already in progress.
		// 3. Branded site (privacy auto-accepted, but still needs onboarding).
		$is_branded       = 0 !== (int) \progress_planner()->get_ui__branding()->get_branding_id();
		$show_onboarding  = ! \progress_planner()->is_privacy_policy_accepted()
			|| \get_option( 'prpl_onboard_progress', false )
			|| $is_branded;

		/**
		 * Filter whether to show the onboarding wizard.
		 *
		 * Hosting integrations can use this filter to force showing
		 * or hiding the onboarding wizard.
		 *
		 * @param bool $show_onboarding Whether to show the onboarding wizard.
		 */
		$show_onboarding = \apply_filters( 'progress_planner_show_onboarding', $show_onboarding );

		if ( ! $show_onboarding ) {
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

		// Trigger the onboarding wizard on the front end.
		\add_action( 'wp_footer', [ $this, 'trigger_onboarding' ] );
		\add_action( 'admin_footer', [ $this, 'trigger_onboarding' ] );

		// Define steps and their order.
		\add_action( 'init', [ $this, 'define_steps_and_order' ], 101 );

		// Allow only images for the front-end upload.
		\add_filter( 'rest_pre_insert_attachment', [ $this, 'rest_pre_insert_attachment' ], 10, 2 );
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
			$task          = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
			$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_id );

			// If there is no task, create it.
			if ( ! $task && $task_provider ) {
				$task_data = $task_provider->get_task_details();

				// Task will not be inserted if it already exists.
				\progress_planner()->get_suggested_tasks_db()->add( $task_data );

				// Now get the task.
				$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
			}

			// Safety check: Skip if task could not be created or retrieved.
			if ( empty( $task ) ) {
				\error_log( 'Onboarding: Could not retrieve or create task: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
				continue;
			}

			$task_formatted = [
				'task_id'      => $task[0]->get_task_id(),
				'title'        => $task[0]->post_title ?? '',
				'url'          => $task[0]->url ?? '',
				'provider_id'  => $task[0]->get_provider_id(),
				'points'       => $task[0]->points ?? 0,
				'action_label' => $task_provider ? $task_provider->get_task_action_label() : \esc_html__( 'Do it', 'progress-planner' ),
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
				'title'              => esc_html__( 'Finish onboarding!', 'progress-planner' ),
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
	 * Add popover scripts.
	 *
	 * @return void
	 */
	public function add_popover_scripts() {
		// Enqueue variables-color.css.
		\wp_enqueue_style( 'prpl-variables-color', \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/variables-color.css', [], \progress_planner()->get_plugin_version() );

		\wp_add_inline_style( 'prpl-variables-color', \progress_planner()->get_ui__branding()->get_custom_css() );

		// Enqueue onboarding.css.
		progress_planner()->get_admin__enqueue()->enqueue_style( 'onboarding/onboarding' );

		// Enqueue PrplOnboardTask (used by MoreTasksStep).
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'onboarding/OnboardTask' );

		// Enqueue base step class.
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'onboarding/steps/OnboardingStep' );

		// Enqueue step components.
		foreach ( $this->steps as $step ) {
			\progress_planner()->get_admin__enqueue()->enqueue_script( 'onboarding/steps/' . $step['script_file_name'] );
		}

		\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-gauge' );

		// Get saved progress from user meta.
		$saved_progress = $this->get_saved_progress();

		// Enqueue main onboarding.js (depends on all step components).
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'onboarding/onboarding',
			[
				'name' => 'ProgressPlannerOnboardData',
				'data' => [
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
					'fullscreenMode'       => true, // Enable fullscreen takeover mode.
					'hasLicense'           => false !== \progress_planner()->get_license_key(),
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

		$onboarding_progress = \get_option( 'prpl_onboard_progress', true );
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
	 * Verify AJAX security (capability and nonce).
	 *
	 * @return void
	 */
	protected function verify_ajax_security() {
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to perform this action.', 'progress-planner' ) ] );
		}

		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}
	}

	/**
	 * Save the tour progress.
	 *
	 * @return void
	 */
	public function ajax_save_onboarding_progress() {
		$this->verify_ajax_security();

		if ( ! isset( $_POST['state'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().
			\wp_send_json_error( [ 'message' => \esc_html__( 'State is required.', 'progress-planner' ) ] );
		}
		$progress = \sanitize_text_field( \wp_unslash( $_POST['state'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().

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
		$this->verify_ajax_security();

		if ( ! isset( $_POST['task_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task ID is required.', 'progress-planner' ) ] );
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().

		// Aditional data for the task, besides the task ID.
		$form_values = [];
		if ( isset( $_POST['form_values'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().
			$form_values = \sanitize_text_field( \wp_unslash( $_POST['form_values'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in verify_ajax_security().
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
		$this->verify_ajax_security();

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
	 * Trigger the onboarding wizard on the front end.
	 *
	 * @return void
	 */
	public function trigger_onboarding() {

		// If the request is an AJAX request, do not trigger the onboarding wizard.
		if ( \wp_doing_ajax() ) {
			return;
		}

		// Dont trigger it if user is not logged in and is not a admin.
		if ( ! \is_user_logged_in() || ! \current_user_can( 'manage_options' ) ) {
			return;
		}

		$get_saved_progress = $this->get_saved_progress();

		// If there is no saved progress, trigger the onboarding wizard.
		if ( ! $get_saved_progress ) {
			?>
			<script>
				document.addEventListener( 'prplOnboardWizardReady', () => {
					window.prplOnboardWizard.startOnboarding();
				});
			</script>
			<?php
		}
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
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
									<span class="prpl-step-label"><?php echo \wp_kses( $step['title'], [ 'br' => [] ] ); ?></span>
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
			( function () {
				'use strict';

				function init() {
					// Initialize tour instance
					window.prplOnboardWizard = new ProgressPlannerOnboardWizard( window.ProgressPlannerOnboardData );

					// Dispatch event to notify that the onboarding wizard is ready.
					document.dispatchEvent( new Event( 'prplOnboardWizardReady' ) );
				}

				// Initialize when DOM is ready
				if ( document.readyState === 'loading') {
					document.addEventListener( 'DOMContentLoaded', init );
				} else {
					init();
				}
			} )();
		</script>
		<?php
	}
}
