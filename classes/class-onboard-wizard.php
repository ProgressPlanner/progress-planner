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
	 * Option name for storing onboarding progress.
	 *
	 * @var string
	 */
	public const PROGRESS_OPTION_NAME = 'prpl_onboard_progress';

	/**
	 * Steps and their order.
	 *
	 * @var array
	 */
	protected $steps = [];

	/**
	 * Delete the onboarding progress option.
	 *
	 * @return bool True if the option was deleted, false otherwise.
	 */
	public static function delete_progress() {
		return \delete_option( self::PROGRESS_OPTION_NAME );
	}

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\add_action( 'init', [ $this, 'maybe_register_popover_hooks' ], 10 ); // Wait for the Playground to register its hooks.
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
		$is_branded      = 0 !== (int) \progress_planner()->get_ui__branding()->get_branding_id();
		$show_onboarding = ! \progress_planner()->is_privacy_policy_accepted()
			|| \get_option( self::PROGRESS_OPTION_NAME, false )
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

		// Wizard config is now provided via REST API endpoint (/progress-planner/v1/onboarding-wizard/config)
		// React components fetch the config directly from the API.

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

		// Action labels for onboarding tasks.
		$action_labels = [
			'core-blogdescription' => \esc_html__( 'Verify tagline', 'progress-planner' ),
			'select-timezone'      => \esc_html__( 'Set the timezone', 'progress-planner' ),
			'select-locale'        => \esc_html__( 'Set the locale', 'progress-planner' ),
			'core-siteicon'        => \esc_html__( 'Set site icon', 'progress-planner' ),
		];

		foreach ( $onboarding_tasks as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

			// Tasks are created by React. Skip if task doesn't exist yet.
			if ( empty( $task ) ) {
				continue;
			}

			$task_formatted = [
				'task_id'      => $task[0]->get_task_id(),
				'title'        => $task[0]->post_title ?? '',
				'url'          => $task[0]->url ?? '',
				'provider_id'  => $task[0]->get_provider_id(),
				'points'       => $task[0]->points ?? 0,
				'action_label' => $action_labels[ $task_id ],
			];

			// Add task specific data.
			if ( 'core-blogdescription' === $task_id ) {
				$task_formatted['site_description'] = \get_bloginfo( 'description' );
			}

			// Render task template HTML for React.
			$template_file = \constant( 'PROGRESS_PLANNER_DIR' ) . '/views/onboarding/tasks/' . $task_id . '.php';
			if ( \file_exists( $template_file ) ) {
				\ob_start();
				\progress_planner()->the_view( 'onboarding/tasks/' . $task_id . '.php', [ 'task' => $task_formatted ] );
				$task_formatted['template_html'] = \ob_get_clean();
			}

			$tasks[ $task_id ] = $task_formatted;
		}

		$this->steps = [
			[
				'script_file_name'   => 'WelcomeStep',
				'template_file_name' => 'welcome',
				'template_id'        => 'onboarding-step-welcome',
				/* translators: %s: Progress Planner name. */
				'title'              => \sprintf( \esc_html__( 'Welcome to %s', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) ),
			],
			[
				'script_file_name'   => 'WhatsWhatStep',
				'template_file_name' => 'whats-what',
				'template_id'        => 'onboarding-step-whats-what',
				'title'              => \esc_html__( 'What\'s what?', 'progress-planner' ),
			],
		];

		// Add first task step if there are tasks or if the first task is already completed.
		if ( ! empty( $tasks ) || $was_first_task_completed ) {
			$this->steps[] = [
				'script_file_name'   => 'FirstTaskStep',
				'template_file_name' => 'first-task',
				'template_data'      => ! $was_first_task_completed ? [ 'task' => \array_shift( $tasks ) ] : [],
				'template_id'        => 'onboarding-step-first-task',
				'title'              => \esc_html__( 'Complete your first task!', 'progress-planner' ),
			];
		}

		// Get badge data for BadgesStep.
		// Generate badge data for current month's badge.
		$now           = new \DateTime();
		$year          = $now->format( 'Y' );
		$month         = $now->format( 'n' );
		$badge_id      = "monthly-{$year}-m{$month}";
		$badge_name    = $now->format( 'F' ); // Full month name.
		$branding_id   = (int) \progress_planner()->get_ui__branding()->get_branding_id();
		$max_points    = 10; // Target points for monthly badges.
		$current_value = 0;

		// Get current badge progress from saved stats.
		$badges = \progress_planner()->get_settings()->get( 'badges', [] );
		if ( isset( $badges[ $badge_id ]['points'] ) ) {
			$current_value = (float) $badges[ $badge_id ]['points'];
		}

		$badge_data = [
			'badgeId'      => $badge_id,
			'badgeName'    => $badge_name,
			'brandingId'   => $branding_id,
			'maxPoints'    => $max_points,
			'currentValue' => $current_value,
		];

		$this->steps[] = [
			'script_file_name'   => 'BadgesStep',
			'template_file_name' => 'badges',
			'template_id'        => 'onboarding-step-badges',
			'template_data'      => $badge_data,
			'title'              => \esc_html__( 'Our badges are waiting for you', 'progress-planner' ),
		];

		$this->steps[] = [
			'script_file_name'   => 'EmailFrequencyStep',
			'template_file_name' => 'email-frequency',
			'template_id'        => 'onboarding-step-email-frequency',
			'title'              => \esc_html__( 'Email Frequency', 'progress-planner' ),
		];

		$this->steps[] = [
			'script_file_name'   => 'SettingsStep',
			'template_file_name' => 'settings',
			'template_id'        => 'onboarding-step-settings',
			'title'              => \esc_html__( 'Settings', 'progress-planner' ),
		];

		// Add more-tasks step if there are remaining tasks.
		if ( ! empty( $tasks ) ) {
			// Convert tasks object to array for React.
			$tasks_array   = \array_values( $tasks );
			$this->steps[] = [
				'script_file_name'   => 'MoreTasksStep',
				'template_file_name' => 'more-tasks',
				'template_data'      => [ 'tasks' => $tasks_array ],
				'template_id'        => 'onboarding-step-more-tasks',
				'title'              => \esc_html__( 'Finish onboarding!', 'progress-planner' ),
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
					\__( 'No file uploaded.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}

			$file = $files['file'];

			// Check MIME type.
			if ( \strpos( $file['type'], 'image/' ) !== 0 ) {
				return new \WP_Error(
					'rest_invalid_file_type',
					\__( 'Only images are allowed for this upload.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}
		}

		return $attachment;
	}


	/**
	 * Get wizard steps.
	 *
	 * @return array
	 */
	public function get_steps() {
		// Ensure steps are defined.
		if ( empty( $this->steps ) ) {
			$this->define_steps_and_order();
		}
		return $this->steps;
	}

	/**
	 * Get saved progress from user meta.
	 *
	 * @return array|null
	 */
	public function get_saved_progress() {
		if ( ! \get_current_user_id() ) {
			return null;
		}

		$onboarding_progress = \get_option( self::PROGRESS_OPTION_NAME, true );
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

		// Save as user meta?
		\update_option( self::PROGRESS_OPTION_NAME, $progress );

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

		// Mark the task as completed (skips celebration and sets post status to trash).
		$task_post_marked_as_completed = \progress_planner()->get_suggested_tasks()->mark_task_as_completed( $task_id, null, true );

		if ( ! $task_post_marked_as_completed ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not completed.', 'progress-planner' ) ] );
		}

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
		$redirect_on_login = isset( $_POST['prpl-redirect-on-login'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			? (bool) \sanitize_text_field( \wp_unslash( $_POST['prpl-redirect-on-login'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			: false;
		$page_settings->save_settings( $redirect_on_login );

		\wp_send_json_success( [ 'message' => \esc_html__( 'All settings saved successfully.', 'progress-planner' ) ] );
	}
}
