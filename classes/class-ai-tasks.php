<?php
/**
 * AI Tasks class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Get AI-powered tasks from the remote SaaS server.
 *
 * @package Progress_Planner
 */
class AI_Tasks {

	/**
	 * The ID for this API object.
	 *
	 * @var string
	 */
	protected $id = 'ai-tasks';

	/**
	 * Get AI tasks from the remote API.
	 *
	 * @param array $args Optional. Arguments to filter tasks.
	 *                    - branding: Filter by branding identifier.
	 * @return array Array of AI tasks.
	 */
	public function get_items( $args = [] ) {
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/suggested-todo';

		$query_args = [
			'site'        => \get_site_url(),
			'license_key' => \get_option( 'progress_planner_license_key' ),
		];

		// Add optional branding parameter if provided.
		if ( ! empty( $args['branding'] ) ) {
			$query_args['branding'] = $args['branding'];
		}

		$url = \add_query_arg( $query_args, $url );

		$cache_key = \md5( $url );

		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( \is_array( $cached ) ) {
			return $cached;
		}

		$response = \wp_remote_get( $url );

		if ( \is_wp_error( $response ) ) {
			\error_log( 'Progress Planner AI Tasks: Failed to fetch tasks from server - ' . $response->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		$response_code = (int) \wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			\error_log( 'Progress Planner AI Tasks: Server returned error code ' . $response_code . ' when fetching tasks' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		$json = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( ! \is_array( $json ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		\progress_planner()->get_utils__cache()->set( $cache_key, $json, HOUR_IN_SECONDS );

		return $json;
	}

	/**
	 * Execute an AI task.
	 *
	 * @param int    $task_id     The task ID to execute.
	 * @param string $site_url    The site URL to analyze.
	 * @param string $license_key The license key.
	 * @return array|WP_Error Response array on success, WP_Error on failure.
	 */
	public function execute_ai_task( $task_id, $site_url, $license_key ) {
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/execute-ai-task';

		// Testing.
		$site_url = 'https://progressplanner.com';

		$post_data = [
			'task_id'     => $task_id,
			'site_url'    => $site_url,
			'license_key' => $license_key,
		];

		$response = \wp_remote_post(
			$url,
			[
				'body'    => $post_data,
				'timeout' => 45, // AI tasks may take longer.
			]
		);

		if ( \is_wp_error( $response ) ) {
			\error_log( 'WP_Error response: ' . $response->get_error_message() );
			return $response;
		}

		$response_code = \wp_remote_retrieve_response_code( $response );
		$body          = \wp_remote_retrieve_body( $response );
		$json          = \json_decode( $body, true );

		// Debug logging for response.
		\error_log( 'SaaS server response:' );
		\error_log( '  Response code: ' . $response_code );
		\error_log( '  Response body: ' . $body );

		if ( 200 !== $response_code ) {
			$error_message = isset( $json['message'] ) ? $json['message'] : 'Unknown error occurred';
			return new \WP_Error( 'ai_execution_failed', $error_message, [ 'status' => $response_code ] );
		}

		if ( ! \is_array( $json ) ) {
			return new \WP_Error( 'invalid_response', 'Invalid response from server', [ 'status' => 500 ] );
		}

		return $json;
	}

	/**
	 * Get a cached AI response for a task.
	 *
	 * @param int $task_id The task ID.
	 * @return string|false The cached response or false if not cached.
	 */
	public function get_cached_response( $task_id ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		return progress_planner()->get_utils__cache()->get( $cache_key );
	}

	/**
	 * Cache an AI response for a task.
	 *
	 * @param int    $task_id  The task ID.
	 * @param string $response The AI response.
	 * @param int    $expiry   Optional. Cache expiry in seconds. Default 1 week.
	 * @return bool True on success, false on failure.
	 */
	public function cache_response( $task_id, $response, $expiry = WEEK_IN_SECONDS ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		return progress_planner()->get_utils__cache()->set( $cache_key, $response, $expiry );
	}

	/**
	 * Clear the cached AI response for a task.
	 *
	 * @param int $task_id The task ID.
	 * @return bool True on success, false on failure.
	 */
	public function clear_cached_response( $task_id ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		return progress_planner()->get_utils__cache()->delete( $cache_key );
	}
}
