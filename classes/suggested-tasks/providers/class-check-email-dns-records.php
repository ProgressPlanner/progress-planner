<?php
/**
 * Add task to check the email DNS records.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to check the email DNS records.
 */
class Check_Email_DNS_Records extends Tasks_Interactive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'check-email-dns-records';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'check-email-dns-records';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_check-email-dns-records', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return '';
	}


	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Check email DNS records', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Check the email DNS records to ensure they are configured correctly.', 'progress-planner' );
	}

	/**
	 * Get the task-action text.
	 *
	 * @return string
	 */
	protected function get_task_action_text() {
		return \esc_html__( 'Check email DNS records', 'progress-planner' );
	}
	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$email_dns_records_activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => static::PROVIDER_ID,
			]
		);

		return ! $email_dns_records_activity;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Check the email DNS records to ensure they are configured correctly.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {

		?>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Check email DNS records', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - setting: (string) The setting to update.
	 * - value: (mixed) The value to update the setting to.
	 * - setting_path: (array) The path to the setting to update.
	 *                         Use an empty array if the setting is not nested.
	 *                         If the value is nested, use an array of keys.
	 *                         Example: [ 'a', 'b', 'c' ] will update the value of $option['a']['b']['c'].
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$site = \get_site_url();

		// Get a nonce from the remote server.
		$nonce_request = wp_remote_post(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/get-nonce',
			[
				'body' => [
					'site' => $site,
				],
			]
		);

		if ( is_wp_error( $nonce_request ) || 200 !== wp_remote_retrieve_response_code( $nonce_request ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to get nonce.', 'progress-planner' ) ] );
		}

		$nonce_response = \json_decode( wp_remote_retrieve_body( $nonce_request ), true );
		$remote_nonce   = $nonce_response['nonce'] ?? '';

		// TODO: Tell server which email are we going to send, response should be email address.
		$subject = \get_bloginfo( 'name' ) . ' - ' . \microtime( true );

		$pre_request = wp_remote_post(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/register-email-for-dns-check',
			[
				'body' => [
					'nonce'   => $remote_nonce,
					'site'    => $site,
					'subject' => $subject,
				],
			]
		);

		if ( is_wp_error( $pre_request ) || 200 !== wp_remote_retrieve_response_code( $pre_request ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to send test email.', 'progress-planner' ) ] );
		}

		$pre_request_response = \json_decode( wp_remote_retrieve_body( $pre_request ), true );
		$email_address        = $pre_request_response['email_address'] ?? '';

		// Send the email.
		$email_sent = wp_mail( $email_address, $subject, '' );

		// TODO: If wp_mail returned false we need to tell the server to not check for the email.
		if ( ! $email_sent ) {
			// TODO: Tell server that the email was not sent.

			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to send email.', 'progress-planner' ) ] );
		}

		// TODO: Sleep for 10 seconds, wait for the report to be ready.
		sleep( 10 );

		$dns_check_request = wp_remote_get(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/check-email-dns-records',
			[
				'body' => [
					'nonce'   => $remote_nonce,
					'site'    => $site,
					'subject' => $subject,
				],
			]
		);

		if ( is_wp_error( $dns_check_request ) || 200 !== wp_remote_retrieve_response_code( $dns_check_request ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to check email DNS records.', 'progress-planner' ) ] );
		}

		$dns_check_response = \json_decode( wp_remote_retrieve_body( $dns_check_request ), true );
		$dns_records_status = $dns_check_response['dns_records_status'] ?? false;
		$spam_score         = $dns_check_response['spam_score'] ?? false; // Lower is better.

		// TODO: If the report is still being processed, we need to let the user know and save the email subject for later.
		// Most likely we will fire another AJAX request (for example up to 5 times) to check if the report is ready.

		// TODO: Handle different statuses, ie SPF set correctly, DKIM is not set, etc.
		if ( $dns_records_status && $spam_score ) {

			// We're not checking for the return value of the update_option calls, because it will return false if the value is the same (for example if gmt_offset is already set to '').
			\wp_send_json_success( [ 'message' => \esc_html__( 'Email DNS records checked successfully.', 'progress-planner' ) ] );
		}

		\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to check email DNS records.', 'progress-planner' ) ] );
	}
}
