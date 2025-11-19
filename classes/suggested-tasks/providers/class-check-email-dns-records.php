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
	 * Print popover form contents.
	 * Required by Tasks_Interactive, but we override add_popover() completely.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		// Not used - we use a custom popover view.
	}

	/**
	 * The popover content, WIP until get_file bug is fixed.
	 *
	 * @return void
	 */
	public function the_popover_content() {
		\progress_planner()->the_view(
			'popovers/' . static::POPOVER_ID . '.php',
			[
				'prpl_popover_id'  => static::POPOVER_ID,
				'prpl_provider_id' => $this->get_provider_id(),
			]
		);
	}

	/**
	 * Add the popover for email DNS check task.
	 * Overrides parent to use custom popover view with state management.
	 *
	 * @return void
	 */
	public function add_popover() {
		// Don't add the popover if the task is not published.
		if ( ! $this->is_task_published() ) {
			return;
		}
		?>
		<div id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>" class="prpl-popover prpl-popover-email-dns" popover>
			<?php $this->the_popover_content(); ?>
		</div>
		<?php
	}

	/**
	 * Enqueue scripts for email DNS check.
	 *
	 * @param string $hook The current admin page hook.
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		// Don't enqueue the script if the user is not at least an editor.
		if ( ! \current_user_can( 'edit_others_posts' ) ) {
			return;
		}

		// Enqueue the script only on Progress Planner and WP dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $hook && 'index.php' !== $hook ) {
			return;
		}

		// Don't enqueue the script if the task is not published.
		if ( ! $this->is_task_published() ) {
			return;
		}

		// Enqueue the email DNS check script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/recommendations/check-email-dns-records',
			[
				'file'         => 'recommendations/check-email-dns-records.js',
				'dependencies' => [ 'progress-planner/suggested-task', 'progress-planner/ajax-request' ],
			]
		);

		// Enqueue the email DNS check CSS.
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/check-email-dns-records' );
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

		if ( ! $this->capability_required() ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to check email DNS records.', 'progress-planner' ) ] );
		}

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

		// Tell server which email identifier are we going to use, response should be email address to which we are sending the test email.
		$subject = md5( \get_bloginfo( 'name' ) . ' - ' . \microtime( true ) );

		$pre_request = wp_remote_post(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/email-dns-check',
			[
				'body' => [
					'nonce'            => $remote_nonce,
					'site'             => $site,
					'email_identifier' => $subject,
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
			\error_log( 'Failed to send email: ' . $email_address );
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to send email.', 'progress-planner' ) ] );
		}

		// TODO: Sleep for 10 seconds, wait for the report to be ready.
		sleep( 10 );

		$dns_check_request = wp_remote_get(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/email-dns-check',
			[
				'body' => [
					'nonce'            => $remote_nonce,
					'site'             => $site,
					'email_identifier' => $subject,
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

		// Build the response with DNS records status information.
		$response_html = $this->format_dns_response( $dns_records_status, $spam_score );

		\wp_send_json_success(
			[
				'message'            => \esc_html__( 'Email DNS records checked successfully.', 'progress-planner' ),
				'dns_records_status' => $dns_records_status,
				'spam_score'         => $spam_score,
				'response_html'      => $response_html,
			]
		);
	}

	/**
	 * Format the DNS check response for display.
	 *
	 * @param array|bool $dns_records_status The DNS records status.
	 * @param float|bool $spam_score The spam score.
	 * @return string Formatted HTML response.
	 */
	protected function format_dns_response( $dns_records_status, $spam_score ) {
		$html = '<div class="prpl-dns-results">';

		// Format spam score.
		if ( false !== $spam_score ) {
			$score_class = $spam_score <= 2 ? 'good' : ( $spam_score <= 5 ? 'warning' : 'bad' );
			$html       .= sprintf(
				'<p class="prpl-spam-score prpl-score-%s"><strong>%s</strong> %s</p>',
				\esc_attr( $score_class ),
				\esc_html__( 'Spam Score:', 'progress-planner' ),
				\esc_html( $spam_score )
			);
		}

		// Format DNS records status.
		if ( \is_array( $dns_records_status ) ) {
			$html .= '<ul class="prpl-dns-records-list">';
			foreach ( $dns_records_status as $record_type => $status ) {
				$status_class = $status ? 'pass' : 'fail';
				$status_icon  = $status ? '&#10003;' : '&#10007;';
				$html        .= sprintf(
					'<li class="prpl-dns-record prpl-status-%s"><span class="prpl-status-icon">%s</span> <strong>%s:</strong> %s</li>',
					\esc_attr( $status_class ),
					$status_icon,
					\esc_html( strtoupper( $record_type ) ),
					$status ? \esc_html__( 'Configured', 'progress-planner' ) : \esc_html__( 'Not configured', 'progress-planner' )
				);
			}
			$html .= '</ul>';
		}

		$html .= '</div>';

		return $html;
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Check', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
