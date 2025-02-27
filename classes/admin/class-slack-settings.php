<?php
/**
 * The Slack integration settings page.
 *
 * @package Progress_Planner/Admin
 */

namespace Progress_Planner\Admin;

/**
 * Slack Settings class.
 */
class Slack_Settings {

	/**
	 * The Progress Planner OAuth endpoint.
	 *
	 * @var string
	 */
	const OAUTH_ENDPOINT = '/slack/oauth';

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Add the admin submenu page.
		\add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ], 99 );
		\add_action( 'admin_init', [ $this, 'handle_oauth_callback' ] );
		\add_action( 'admin_init', [ $this, 'handle_disconnect' ] );
		\add_action( 'admin_init', [ $this, 'register_settings' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		\add_action( 'wp_ajax_progress_planner_test_slack', [ $this, 'handle_test_message' ] );
	}

	/**
	 * Get the authorization URL for Slack OAuth.
	 *
	 * @return string
	 */
	private function get_auth_url() {
		$site_url = \admin_url( 'admin.php?page=progress-planner-slack' );
		$params   = [
			'site_url'  => \rawurlencode( $site_url ),
			'site_name' => \rawurlencode( \get_bloginfo( 'name' ) ),
		];

		return \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner/v1' . self::OAUTH_ENDPOINT . '?' . \http_build_query( $params );
	}

	/**
	 * Add admin-menu page, as a submenu in the progress-planner menu.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		\add_submenu_page(
			'progress-planner',
			\esc_html__( 'Slack Integration', 'progress-planner' ),
			\esc_html__( 'Slack', 'progress-planner' ),
			'manage_options',
			'progress-planner-slack',
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Handle the OAuth callback from Slack.
	 */
	public function handle_oauth_callback() {
		if ( ! isset( $_GET['slack_token'] ) ) {
			return;
		}

		$token = sanitize_text_field( wp_unslash( $_GET['slack_token'] ) );
		update_option( 'slack_access_token', $token );

		wp_safe_redirect( admin_url( 'admin.php?page=progress-planner-slack' ) );
		exit;
	}

	/**
	 * Handle disconnecting from Slack.
	 */
	public function handle_disconnect() {
		if ( ! isset( $_GET['slack_disconnect'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		delete_option( 'slack_access_token' );
		delete_option( 'slack_channel' );

		wp_safe_redirect( admin_url( 'admin.php?page=progress-planner-slack' ) );
		exit;
	}

	/**
	 * Render the Slack settings page.
	 */
	public function render_page() {
		$access_token     = get_option( 'slack_access_token' );
		$selected_channel = get_option( 'slack_channel' );
		$settings_updated = isset( $_GET['settings-updated'] ) && $_GET['settings-updated'] === 'true';
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Slack Integration', 'progress-planner' ); ?></h1>

			<?php if ( $settings_updated ) : ?>
				<div class="notice notice-success is-dismissible">
					<p><?php esc_html_e( 'Settings saved.', 'progress-planner' ); ?></p>
				</div>
			<?php endif; ?>

			<div class="card">
				<h2><?php esc_html_e( 'Connection Status', 'progress-planner' ); ?></h2>

				<?php if ( empty( $access_token ) ) : ?>
					<p><?php esc_html_e( 'Not connected to Slack', 'progress-planner' ); ?></p>
					<?php
					$auth_url = $this->get_auth_url();
					?>
					<p>
						<a href="<?php echo esc_url( $auth_url ); ?>" class="button button-primary">
							<?php esc_html_e( 'Connect with Slack', 'progress-planner' ); ?>
						</a>
					</p>
				<?php else : ?>
					<p>
						<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
						<?php esc_html_e( 'Connected to Slack', 'progress-planner' ); ?>
					</p>
					<p>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=progress-planner-slack&slack_disconnect=1' ) ); ?>"
							class="button">
							<?php esc_html_e( 'Disconnect', 'progress-planner' ); ?>
						</a>
					</p>
				<?php endif; ?>
			</div>

			<?php if ( ! empty( $access_token ) ) : ?>
				<div class="card">
					<h2><?php esc_html_e( 'Channel Settings', 'progress-planner' ); ?></h2>
					<form method="post" action="<?php echo esc_url( admin_url( 'options.php' ) ); ?>">
						<?php
						\settings_fields( 'slack_settings' );
						\do_settings_sections( 'progress-planner-slack' );
						?>
						<input type="hidden" name="slack_access_token" value="<?php echo esc_attr( get_option( 'slack_access_token' ) ); ?>">
						<table class="form-table">
							<tr>
								<th scope="row"><?php esc_html_e( 'Notification Channel', 'progress-planner' ); ?></th>
								<td>
									<?php
									$channels = $this->get_slack_channels( $access_token );
									if ( ! empty( $channels ) ) :
										?>
										<select name="slack_channel">
											<?php foreach ( $channels as $channel ) : ?>
												<option value="<?php echo esc_attr( $channel['id'] ); ?>"
													<?php selected( $selected_channel, $channel['id'] ); ?>>
													<?php echo esc_html( $channel['name'] ); ?>
												</option>
											<?php endforeach; ?>
										</select>
									<?php else : ?>
										<p><?php esc_html_e( 'No channels found or error fetching channels.', 'progress-planner' ); ?></p>
									<?php endif; ?>
								</td>
							</tr>
						</table>
						<?php submit_button(); ?>
					</form>
				</div>

				<div class="card">
					<h2><?php esc_html_e( 'Test Connection', 'progress-planner' ); ?></h2>
					<p>
						<button class="button" id="test-slack-notification">
							<?php esc_html_e( 'Send Test Message', 'progress-planner' ); ?>
						</button>
					</p>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Get available Slack channels.
	 *
	 * @param string $access_token The Slack access token.
	 * @return array
	 */
	private function get_slack_channels( $access_token ) {
		$response = wp_remote_get(
			'https://slack.com/api/conversations.list',
			[
				'headers' => [
					'Authorization' => 'Bearer ' . $access_token,
				],
			]
		);

		if ( is_wp_error( $response ) ) {
			return [];
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( ! empty( $body['channels'] ) ) {
			return $body['channels'];
		}

		return [];
	}

	/**
	 * Register settings.
	 */
	public function register_settings() {
		\register_setting(
			'slack_settings',
			'slack_access_token',
			[
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
				'show_in_rest'      => false,
			]
		);

		\register_setting(
			'slack_settings',
			'slack_channel',
			[
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
				'show_in_rest'      => false,
			]
		);

		\add_settings_section(
			'slack_settings_section',
			'',
			'__return_empty_string',
			'progress-planner-slack'
		);
	}

	/**
	 * Enqueue scripts and styles.Fv
	 *
	 * @param string $hook The current admin page.
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'progress-planner_page_progress-planner-slack' !== $hook ) {
			return;
		}

		// Register Slack settings script.
		\wp_register_script(
			'progress-planner-slack-settings',
			PROGRESS_PLANNER_URL . '/assets/js/slack-settings.js',
			[ 'jquery' ],
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/slack-settings.js' ),
			true
		);

		\wp_enqueue_script( 'progress-planner-slack-settings' );

		\wp_localize_script(
			'progress-planner-slack-settings',
			'progressPlannerSlack',
			[
				'ajaxUrl' => \admin_url( 'admin-ajax.php' ),
				'nonce'   => \wp_create_nonce( 'progress_planner_slack' ),
				'i18n'    => [
					'testSuccess' => \__( 'Test message sent successfully!', 'progress-planner' ),
					'testError'   => \__( 'Error sending test message. Please check your settings.', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Handle test message AJAX request.
	 */
	public function handle_test_message() {
		\check_ajax_referer( 'progress_planner_slack', 'nonce' );

		$access_token = get_option( 'slack_access_token' );
		$channel      = get_option( 'slack_channel' );

		if ( empty( $access_token ) ) {
			\wp_send_json_error( 'No access token found' );
		}

		if ( empty( $channel ) ) {
			\wp_send_json_error( 'No channel selected' );
		}

		$success = \Progress_Planner\Slack_Notification::send_notification(
			\esc_html__( 'This is a test message from Progress Planner!', 'progress-planner' )
		);

		if ( $success ) {
			\wp_send_json_success();
		} else {
			\wp_send_json_error( 'Failed to send message to Slack' );
		}
	}
}
