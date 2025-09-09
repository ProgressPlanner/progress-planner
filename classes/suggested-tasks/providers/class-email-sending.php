<?php
/**
 * Add task for Email sending.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task for Email sending.
 */
class Email_Sending extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'sending-email';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'configuration';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'sending-email';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 1;

	/**
	 * The email title.
	 *
	 * @var string
	 */
	protected $email_subject = '';

	/**
	 * The email content.
	 *
	 * @var string
	 */
	protected $email_content = '';

	/**
	 * The error.
	 *
	 * @var string
	 */
	protected $email_error = '';

	/**
	 * Whether wp_mail is filtered.
	 *
	 * @var bool
	 */
	protected $is_wp_mail_filtered = false;

	/**
	 * Whether wp_mail is overridden.
	 *
	 * @var bool
	 */
	protected $is_wp_mail_overridden = false;

	/**
	 * The troubleshooting guide URL.
	 *
	 * @var string
	 */
	protected $troubleshooting_guide_url = 'https://prpl.fyi/troubleshoot-smtp';

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		// Enqueue the scripts.
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		// Add the AJAX action.
		\add_action( 'wp_ajax_prpl_test_email_sending', [ $this, 'ajax_test_email_sending' ] );

		// Set the email error message.
		\add_action( 'wp_mail_failed', [ $this, 'set_email_error' ] );

		// By now all plugins should be loaded and hopefully add actions registered, so we can check if phpmailer is filtered.
		\add_action( 'init', [ $this, 'check_if_wp_mail_is_filtered' ], PHP_INT_MAX );
		\add_action( 'init', [ $this, 'check_if_wp_mail_has_override' ], PHP_INT_MAX );

		$this->email_subject = \esc_html__( 'Your Progress Planner test message!', 'progress-planner' );
		$this->email_content = \sprintf(
			// translators: %1$s the admin URL.
			\__( 'You just used Progress Planner to verify if sending email works on your website. <br><br> The good news; it does! <a href="%1$s" target="_blank">Click here to mark Ravi\'s Recommendation as completed</a>.', 'progress-planner' ),
			\admin_url( 'admin.php?page=progress-planner&prpl_complete_task=' . $this->get_task_id() )
		);
	}

	/**
	 * We want task to be added always.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return true;
	}

	/**
	 * Task should be completed only manually by the user.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return false;
	}

	/**
	 * Task should be completed only manually by the user.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {
		return false;
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Test if your website can send emails correctly', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return \esc_html__( 'Your website tries to send you important email. Test if sending email from your site works well.', 'progress-planner' );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		// Don't enqueue the script if the task is already completed.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() ) ) {
			return;
		}

		// Enqueue the web component.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/web-components/prpl-task-' . $this->get_provider_id(),
			[
				'name' => 'prplEmailSending',
				'data' => [
					'ajax_url'                  => \admin_url( 'admin-ajax.php' ),
					'nonce'                     => \wp_create_nonce( 'progress_planner' ),
					'unknown_error'             => \esc_html__( 'Unknown error', 'progress-planner' ),
					'troubleshooting_guide_url' => $this->troubleshooting_guide_url,
				],
			]
		);
	}

	/**
	 * Check if wp_mail is filtered.
	 *
	 * @return void
	 */
	public function check_if_wp_mail_is_filtered() {
		global $wp_filter;
		foreach ( [ 'phpmailer_init', 'pre_wp_mail' ] as $filter ) {
			$has_filter                = isset( $wp_filter[ $filter ] ) && ! empty( $wp_filter[ $filter ]->callbacks ) ? true : false;
			$this->is_wp_mail_filtered = $this->is_wp_mail_filtered || $has_filter;
		}
	}

	/**
	 * Check if wp_mail has an override.
	 *
	 * @return void
	 */
	public function check_if_wp_mail_has_override() {
		// Just in case, since it will trigger PHP fatal error if the function doesn't exist.
		if ( \function_exists( 'wp_mail' ) ) {
			$file_path = ( new \ReflectionFunction( 'wp_mail' ) )->getFileName();

			$this->is_wp_mail_overridden = $file_path && $file_path !== ABSPATH . 'wp-includes/pluggable.php';
		}
	}

	/**
	 * Whether there is an email override.
	 *
	 * @return bool
	 */
	protected function is_there_sending_email_override() {
		return $this->is_wp_mail_filtered || $this->is_wp_mail_overridden;
	}

	/**
	 * Test email sending.
	 *
	 * @return void
	 */
	public function ajax_test_email_sending() {
		// Check the nonce.
		\check_admin_referer( 'progress_planner' );

		$email_address = isset( $_GET['email_address'] ) ? \sanitize_email( \wp_unslash( $_GET['email_address'] ) ) : '';

		if ( ! $email_address ) {
			\wp_send_json_error( \esc_html__( 'Invalid email address.', 'progress-planner' ) );
		}

		$headers = [ 'Content-Type: text/html; charset=UTF-8' ];

		$result = \wp_mail( $email_address, $this->email_subject, $this->email_content, $headers );

		if ( $result ) {
			\wp_send_json_success( \esc_html__( 'Email sent successfully.', 'progress-planner' ) );
		}
		\wp_send_json_error( $this->email_error );
	}

	/**
	 * Set the email error.
	 *
	 * @param \WP_Error $e The error message.
	 *
	 * @return void
	 */
	public function set_email_error( $e ) {
		$this->email_error = $e->get_error_message() ? $e->get_error_message() : \esc_html__( 'Unknown error', 'progress-planner' );
	}

	/**
	 * The popover content.
	 *
	 * @return void
	 */
	public function the_popover_content() {
		\progress_planner()->the_view(
			'popovers/email-sending.php',
			[
				'prpl_popover_id'                      => static::POPOVER_ID,
				'prpl_external_link_url'               => $this->get_external_link_url(),
				'prpl_provider_id'                     => $this->get_provider_id(),
				'prpl_email_subject'                   => $this->email_subject,
				'prpl_email_error'                     => $this->email_error,
				'prpl_troubleshooting_guide_url'       => $this->troubleshooting_guide_url,
				'prpl_is_there_sending_email_override' => $this->is_there_sending_email_override(),
				'prpl_task_actions'                    => $this->get_task_actions(),
			]
		);
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		// The form is handled in the popovers/email-sending view.
	}

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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'' . \esc_attr( $data['meta']['prpl_popover_id'] ) . '\')?.showPopover()">' . \esc_html__( 'Test email sending', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
