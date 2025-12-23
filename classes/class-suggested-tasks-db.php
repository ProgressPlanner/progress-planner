<?php
/**
 * Recommendations modal class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Task;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class Suggested_Tasks_DB {

	/**
	 * The get tasks cache group.
	 *
	 * @var string
	 */
	const GET_TASKS_CACHE_GROUP = 'progress_planner_get_tasks';

	/**
	 * Add a recommendation (suggested task).
	 *
	 * Creates a new task post with proper locking to prevent race conditions when
	 * multiple processes try to create the same task simultaneously.
	 *
	 * Locking mechanism:
	 * - Uses WordPress options table as a distributed lock via add_option()
	 * - add_option() is atomic: returns false if the option already exists
	 * - Lock key format: "prpl_task_lock_{task_id}"
	 * - Lock value: Current Unix timestamp (for staleness detection)
	 * - Stale lock timeout: 30 seconds (prevents deadlocks from crashed processes)
	 * - Lock is always released in finally block (even if insertion fails)
	 *
	 * This ensures only one process can create a specific task at a time,
	 * preventing duplicate task creation in concurrent scenarios like:
	 * - Multiple cron jobs running simultaneously
	 * - AJAX requests firing in parallel
	 * - Plugin activation on multisite networks
	 *
	 * @param array $data {
	 *     The task data to add.
	 *
	 *     @type string $task_id      Required. The unique task ID (e.g., "update-core").
	 *     @type string $post_title   Required. The task title shown to users.
	 *     @type string $provider_id  Required. The provider ID (e.g., "update-core").
	 *     @type string $description  Optional. The task description/content.
	 *     @type int    $priority     Optional. Display priority (lower = higher priority).
	 *     @type int    $order        Optional. Menu order (defaults to priority if not set).
	 *     @type int    $parent       Optional. Parent task ID for hierarchical tasks.
	 *     @type string $post_status  Optional. Task status: 'publish', 'pending', 'completed', 'trash', 'snoozed'.
	 *     @type int    $time         Optional. Unix timestamp for snoozed tasks (when to show again).
	 * }
	 *
	 * @return int The created post ID, or 0 if creation failed or task already exists.
	 */
	public function add( $data ) {
		if ( empty( $data['post_title'] ) ) {
			\error_log( 'Task not added - missing title: ' . \wp_json_encode( $data ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return 0;
		}

		// Acquire a distributed lock to prevent race conditions during task creation.
		$lock_key   = 'prpl_task_lock_' . $data['task_id'];
		$lock_value = \time();

		// Try to create the lock atomically using add_option().
		// This returns false if the option already exists, indicating another process holds the lock.
		if ( ! \add_option( $lock_key, $lock_value, '', false ) ) {
			$current = \get_option( $lock_key );

			// Check if the lock is stale (older than 30 seconds).
			// This prevents deadlocks if a process crashes while holding the lock.
			if ( $current && ( $current < \time() - 30 ) ) {
				\update_option( $lock_key, $lock_value );
			} else {
				// Lock is held by another active process, abort to avoid duplicates.
				return 0;
			}
		}

		// Check if we have an existing task with the same ID.
		// Search across all post statuses since WordPress 'any' excludes trash and pending.
		$posts = $this->get_tasks_by(
			[
				'post_status' => [ 'publish', 'trash', 'draft', 'future', 'pending' ],
				'numberposts' => 1,
				'name'        => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $data['task_id'] ),
			]
		);

		// Also check for trashed tasks with the "__trashed" suffix.
		// This suffix is appended when tasks are permanently removed to preserve history.
		$posts_trashed = $this->get_tasks_by(
			[
				'post_status' => [ 'trash' ],
				'numberposts' => 1,
				'name'        => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $data['task_id'] ) . '__trashed',
			]
		);

		// If no active task exists but a trashed one does, use the trashed one.
		if ( empty( $posts ) && ! empty( $posts_trashed ) ) {
			$posts = $posts_trashed;
		}

		// If task already exists (in any status), return its ID without creating a duplicate.
		if ( ! empty( $posts ) ) {
			\delete_option( $lock_key );
			return $posts[0]->ID;
		}

		if ( ! isset( $data['order'] ) && isset( $data['priority'] ) ) {
			$data['order'] = $data['priority'];
		}

		$data['post_status'] = $data['post_status'] ?? 'publish';

		$args = [
			'post_type'    => 'prpl_recommendations',
			'post_title'   => $data['post_title'],
			'post_content' => $data['description'] ?? '',
			'menu_order'   => $data['order'] ?? 0,
			'post_name'    => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $data['task_id'] ),
		];
		switch ( $data['post_status'] ) {
			case 'pending':
				$args['post_status'] = 'pending';
				break;

			case 'completed':
			case 'trash':
				$args['post_status'] = 'trash';
				break;

			case 'snoozed':
				$args['post_status'] = 'future';
				$args['post_date']   = \DateTime::createFromFormat( 'U', $data['time'] )->format( 'Y-m-d H:i:s' );
				break;

			default:
				$args['post_status'] = 'publish';
				break;
		}

		try {
			$post_id = \wp_insert_post( $args );

			// Add provider term if it doesn't exist.
			$term = \get_term_by( 'name', $data['provider_id'], 'prpl_recommendations_provider' );
			if ( ! $term ) {
				\wp_insert_term( $data['provider_id'], 'prpl_recommendations_provider' );
			}

			// Set the task provider.
			\wp_set_post_terms( $post_id, $data['provider_id'], 'prpl_recommendations_provider' );

			// Set the task parent.
			if ( ! empty( $data['parent'] ) ) {
				$parent = \get_post( $data['parent'] );
				if ( $parent ) {
					\wp_update_post(
						[
							'ID'          => $post_id,
							'post_parent' => $parent->ID,
						]
					);
				}
			}

			// Set other meta.
			$default_keys = [
				'title',
				'description',
				'status',
				'provider_id',
				'parent',
				'order',
				'post_status',
			];
			foreach ( $data as $key => $value ) {
				if ( \in_array( $key, $default_keys, true ) ) {
					continue;
				}

				\update_post_meta( $post_id, "prpl_$key", $value );
			}
		} finally {
			// Always release the lock, even if an exception occurred during post creation.
			// This ensures the lock doesn't remain indefinitely and block future attempts.
			\delete_option( $lock_key );
		}

		return $post_id;
	}

	/**
	 * Update a recommendation.
	 *
	 * @param int   $id The recommendation ID.
	 * @param array $data The data to update.
	 *
	 * @return bool
	 */
	public function update_recommendation( $id, $data ) {
		if ( ! $id ) {
			return false;
		}

		$update_data    = [ 'ID' => $id ];
		$update_terms   = [];
		$update_results = [];
		foreach ( $data as $key => $value ) {
			switch ( $key ) {
				case 'provider':
					$update_terms['prpl_recommendations_provider'] = $value;
					break;

				default:
					$update_data[ $key ] = $value;
					break;
			}
		}

		if ( 1 < \count( $update_data ) ) {
			$update_results[] = (bool) \wp_update_post( $update_data );
		}

		if ( ! empty( $update_terms ) ) {
			foreach ( $update_terms as $taxonomy => $term ) {
				$update_results[] = (bool) \wp_set_object_terms( $id, $term->slug, $taxonomy ); // @phpstan-ignore-line property.nonObject
			}
		}

		return ! \in_array( false, $update_results, true );
	}

	/**
	 * Delete all recommendations.
	 *
	 * @return void
	 */
	public function delete_all_recommendations() {
		// Get all recommendations.
		$recommendations = $this->get();

		// Delete each recommendation.
		foreach ( $recommendations as $recommendation ) {
			$this->delete_recommendation( $recommendation->ID );
		}
	}

	/**
	 * Delete a recommendation.
	 *
	 * @param int $id The recommendation ID.
	 *
	 * @return bool
	 */
	public function delete_recommendation( int $id ) {
		$result = (bool) \wp_delete_post( $id, true );
		\wp_cache_flush_group( static::GET_TASKS_CACHE_GROUP );
		return $result;
	}

	/**
	 * Format recommendations results.
	 *
	 * @param array $recommendations The recommendations.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task[]
	 */
	public function format_recommendations( $recommendations ) {
		$result = [];
		foreach ( $recommendations as $recommendation ) {
			$result[] = $this->format_recommendation( $recommendation );
		}

		return $result;
	}

	/**
	 * Format a recommendation.
	 *
	 * @param \WP_Post $post The recommendation post.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task
	 */
	public function format_recommendation( $post ) {
		static $cached = [];
		if ( isset( $cached[ $post->ID ] ) ) {
			return $cached[ $post->ID ];
		}

		$post_data = (array) $post;

		// Format the post meta.
		$post_meta = \get_post_meta( $post_data['ID'] );
		foreach ( $post_meta as $key => $value ) {
			$post_data[ \str_replace( 'prpl_', '', (string) $key ) ] =
				\is_array( $value ) && isset( $value[0] ) && 1 === \count( $value )
					? $value[0]
					: $value;
		}

		// Get provider taxonomy term.
		$terms                 = \wp_get_post_terms( $post_data['ID'], 'prpl_recommendations_provider' );
		$post_data['provider'] = \is_array( $terms ) && isset( $terms[0] ) ? $terms[0] : null;

		$cached[ $post_data['ID'] ] = new Task( $post_data );
		return $cached[ $post_data['ID'] ];
	}

	/**
	 * Get the post-ID of a recommendation.
	 *
	 * @param string|int $id The recommendation ID. Can be a task-ID or a post-ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|false The recommendation post or false if not found.
	 */
	public function get_post( $id ) {
		$posts = $this->get_tasks_by(
			\is_numeric( $id )
				? [ 'p' => $id ]
				: [ 'task_id' => $id ]
		);

		return isset( $posts[0] ) ? $posts[0] : false;
	}

	/**
	 * Get recommendations, filtered by a parameter.
	 *
	 * @param array $params The parameters to filter by ([ 'provider' => 'provider_id' ] etc).
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task[]
	 */
	public function get_tasks_by( $params ) {
		$args = [];

		foreach ( $params as $param => $value ) {
			switch ( $param ) {
				case 'provider':
				case 'provider_id':
					$args['tax_query']   = isset( $args['tax_query'] ) ? $args['tax_query'] : []; // phpcs:ignore WordPress.DB.SlowDBQuery
					$args['tax_query'][] = [
						'taxonomy' => 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => (array) $value,
					];

					unset( $params[ $param ] );
					break;

				case 'task_id':
					$args['name'] = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $value );
					unset( $params[ $param ] );
					break;

				default:
					$args[ $param ] = $value;
					break;
			}
		}

		return $this->get( $args );
	}

	/**
	 * Get recommendations.
	 *
	 * @param array $args The arguments.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task[]
	 */
	public function get( $args = [] ) {
		$args = \wp_parse_args(
			$args,
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => [ 'publish', 'trash', 'draft', 'future', 'pending' ], // 'any' doesn't include statuses which have 'exclude_from_search' set to true (trash and pending).
				'numberposts' => -1,
				'orderby'     => 'menu_order',
				'order'       => 'ASC',
			]
		);

		$cache_key = 'progress-planner-get-tasks-' . \md5( (string) \wp_json_encode( $args ) );
		$results   = \wp_cache_get( $cache_key, static::GET_TASKS_CACHE_GROUP );
		if ( $results ) {
			return $results;
		}

		$results = $this->format_recommendations(
			\get_posts( $args )
		);
		if ( ! empty( $args['post_status'] )
			&& \in_array( 'trash', (array) $args['post_status'], true )
			&& isset( $args['name'] )
		) {
			$results_trashed = $this->format_recommendations(
				\get_posts(
					\wp_parse_args(
						$args,
						[
							'post_status' => [ 'trash' ],
							'name'        => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $args['name'] ) . '__trashed',
						]
					)
				)
			);
			$results         = \array_merge( $results, $results_trashed );
		}

		\wp_cache_set( $cache_key, $results, static::GET_TASKS_CACHE_GROUP );

		return $results;
	}
}
