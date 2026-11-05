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
	 * Get a cached AI response for a task.
	 *
	 * @param int $task_id The task ID.
	 * @return string|false The cached response or false if not cached.
	 */
	public function get_cached_response( $task_id ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		return \progress_planner()->get_utils__cache()->get( $cache_key );
	}

	/**
	 * Cache an AI response for a task.
	 *
	 * @param int    $task_id  The task ID.
	 * @param string $response The AI response.
	 * @param int    $expiry   Optional. Cache expiry in seconds. Default 1 week.
	 * @return void
	 */
	public function cache_response( $task_id, $response, $expiry = WEEK_IN_SECONDS ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		\progress_planner()->get_utils__cache()->set( $cache_key, $response, $expiry );
	}

	/**
	 * Clear the cached AI response for a task.
	 *
	 * @param int $task_id The task ID.
	 * @return void
	 */
	public function clear_cached_response( $task_id ) {
		$cache_key = 'prpl_ai_response_' . $task_id;
		\progress_planner()->get_utils__cache()->delete( $cache_key );
	}
}
