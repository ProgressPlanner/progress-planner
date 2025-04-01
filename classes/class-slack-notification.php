<?php
/**
 * The Slack integration settings page.
 *
 * @package Progress_Planner/Admin
 */

namespace Progress_Planner;

/**
 * Slack Notification class.
 */
class Slack_Notification {

	/**
	 * Send a notification to Slack.
	 *
	 * @param string $message The message to send.
	 * @return bool True if the notification was sent successfully, false otherwise.
	 */
	public static function send_notification( $message ) {
		$access_token = get_option( 'slack_access_token' );
		$channel      = get_option( 'slack_channel' );

		$request_body = wp_json_encode(
			[
				'channel' => $channel,
				'text'    => $message,
			]
		);

		if ( empty( $access_token ) || empty( $channel ) || empty( $request_body ) ) {
			return false;
		}

		// Update last used timestamp on progressplanner.com .
		wp_remote_post(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner/v1/slack/ping',
			[
				'body' => [
					'site_url' => \site_url(),
				],
			]
		);

		$response = wp_remote_post(
			'https://slack.com/api/chat.postMessage',
			[
				'headers' => [
					'Authorization' => 'Bearer ' . $access_token,
					'Content-Type'  => 'application/json',
				],
				'body'    => $request_body,
			]
		);

		if ( is_wp_error( $response ) ) {
			error_log( 'Slack API Error: ' . $response->get_error_message() );
			return false;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( empty( $body['ok'] ) && ! empty( $body['error'] ) ) {
			error_log( 'Slack API Error: ' . $body['error'] );
		}

		return ! empty( $body['ok'] );
	}
}
