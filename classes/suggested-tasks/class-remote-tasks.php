<?php
/**
 * API for suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

/**
 * Remote tasks class.
 */
class Remote_Tasks {

	/**
	 * The cache key to use for remote-API tasks.
	 *
	 * @var string
	 */
	const CACHE_KEY = 'suggested_tasks_remote';

	/**
	 * Initialize the remote tasks.
	 *
	 * @return void
	 */
	public function init() {
		\add_filter( 'progress_planner_suggested_tasks_items', [ $this, 'inject_tasks' ] );
	}

	/**
	 * Inject tasks.
	 *
	 * @param array $tasks The tasks.
	 *
	 * @return array
	 */
	public function inject_tasks( $tasks ) {
		$inject_items = $this->get_tasks_to_inject();
		$items        = [];
		foreach ( $inject_items as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			// If the task with this id is completed, don't add a task.
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( "{$item['task_id']}" ) ) {
				continue;
			}

			$items[] = $item;
		}

		return \array_merge( $items, $tasks );
	}

	/**
	 * Get the tasks from the remote API.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		// Check if we have a cached response.
		$tasks = \progress_planner()->get_utils__cache()->get( self::CACHE_KEY );

		// If we have a cached response, return it.
		if ( \is_array( $tasks ) ) {
			return $tasks;
		}

		// Get the response from the remote server.
		$response = \wp_remote_get( $this->get_api_endpoint() );

		// Bail if the request failed.
		if ( ! \is_wp_error( $response ) ) {
			// Get the body of the response.
			$body = \wp_remote_retrieve_body( $response );

			if ( ! empty( $body ) ) {
				// Decode the JSON body.
				$tasks = \json_decode( $body, true );

				if ( \is_array( $tasks ) ) {
					$valid_tasks = [];
					foreach ( $tasks as $task ) {
						if ( isset( $task['task_id'] ) ) {

							$valid_tasks[] = [
								'task_id'     => str_starts_with( $task['task_id'], 'remote-task-' ) ? $task['task_id'] : "remote-task-{$task['task_id']}",
								'provider_id' => 'remote-' . ( isset( $task['category'] ) ? $task['category'] : 'default' ),
								'category'    => 'remote-' . ( isset( $task['category'] ) ? $task['category'] : 'default' ),
								'title'       => $task['title'] ?? '',
								'description' => $task['description'] ?? '',
								'priority'    => $task['priority'] ?? 'medium',
								'points'      => $task['points'] ?? 1,
								'url'         => $task['url'] ?? '',
								'dismissable' => $task['dismissable'] ?? true,
								'type'        => $task['type'] ?? '', // Not using any more.
								'challenge'   => $task['challenge'] ?? '', // Not using any more.
							];
						}
					}
					// Cache the response for 1 day.
					\progress_planner()->get_utils__cache()->set( self::CACHE_KEY, $valid_tasks, DAY_IN_SECONDS );
					return $valid_tasks;
				}
			}
		}

		// If we don't have a valid response, cache an empty array for 5 minutes. This will prevent the API from being called too often.
		\progress_planner()->get_utils__cache()->set( self::CACHE_KEY, [], 5 * MINUTE_IN_SECONDS );

		return [];
	}

	/**
	 * Get the remote API endpoint.
	 *
	 * @return string
	 */
	protected function get_api_endpoint() {
		$url             = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/suggested-todo/';
		$pro_license_key = \get_option( 'progress_planner_pro_license_key' );
		if ( $pro_license_key ) {
			$url = \add_query_arg(
				[
					'license_key' => $pro_license_key,
					'site'        => \get_site_url(),
				],
				$url
			);
		}
		return $url;
	}
}
