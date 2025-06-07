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
	 * Add a recommendation.
	 *
	 * @param array $data The data to add.
	 *
	 * @return int
	 */
	public function add( $data ) {
		if ( empty( $data['post_title'] ) ) {
			error_log( 'Task not added - missing title: ' . wp_json_encode( $data ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return 0;
		}

		// Check if we have an existing task with the same title.
		$posts = $this->get_tasks_by(
			[
				'post_status' => [ 'publish', 'trash', 'draft', 'pending', 'future', 'pending_celebration' ], // 'any' doesn't include statuses which have 'exclude_from_search' set to true (trash and pending_celebration).
				'numberposts' => 1,
				'meta_query'  => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					[
						'key'     => 'prpl_task_id',
						'value'   => $data['task_id'],
						'compare' => '=',
					],
				],
			]
		);

		// If we have an existing task, skip.
		if ( ! empty( $posts ) ) {
			return $posts[0]->ID;
		}

		$data['post_status'] = $data['post_status'] ?? 'publish';

		$args = [
			'post_type'    => 'prpl_recommendations',
			'post_title'   => $data['post_title'],
			'post_content' => $data['description'] ?? '',
			'menu_order'   => $data['order'] ?? 0,
		];
		switch ( $data['post_status'] ) {
			case 'pending_celebration':
				$args['post_status'] = 'pending_celebration';
				break;

			case 'completed':
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

		$post_id = \wp_insert_post( $args );

		// Add terms if they don't exist.
		foreach ( [ 'category', 'provider_id' ] as $context ) {
			$taxonomy_name = str_replace( '_id', '', $context );
			$term          = \get_term_by( 'name', $data[ $context ], "prpl_recommendations_$taxonomy_name" );
			if ( ! $term ) {
				\wp_insert_term( $data[ $context ], "prpl_recommendations_$taxonomy_name" );
			}
		}

		// Set the task category.
		\wp_set_post_terms( $post_id, $data['category'], 'prpl_recommendations_category' );

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
			'category',
			'provider_id',
			'parent',
			'order',
			'post_status',
		];
		foreach ( $data as $key => $value ) {
			if ( in_array( $key, $default_keys, true ) ) {
				continue;
			}

			\update_post_meta( $post_id, "prpl_$key", $value );
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
		$update_meta    = [];
		$update_terms   = [];
		$update_results = [];
		foreach ( $data as $key => $value ) {
			switch ( $key ) {
				case 'points':
				case 'prpl_points':
					$update_meta[ 'prpl_' . str_replace( 'prpl_', '', (string) $key ) ] = $value;
					break;

				case 'category':
				case 'provider':
					$update_terms[ "prpl_recommendations_$key" ] = $value;
					break;

				default:
					$update_data[ $key ] = $value;
					break;
			}
		}

		if ( 1 < count( $update_data ) ) {
			$update_results[] = (bool) \wp_update_post( $update_data );
		}

		if ( ! empty( $update_meta ) ) {
			foreach ( $update_meta as $key => $value ) {
				$update_results[] = (bool) \update_post_meta( $id, $key, $value );
			}
		}

		if ( ! empty( $update_terms ) ) {
			foreach ( $update_terms as $taxonomy => $term ) {
				$update_results[] = (bool) \wp_set_object_terms( $id, $term->slug, $taxonomy );
			}
		}

		return ! in_array( false, $update_results, true );
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
			$post_data[ str_replace( 'prpl_', '', (string) $key ) ] =
				is_array( $value ) && isset( $value[0] ) && 1 === count( $value )
					? $value[0]
					: $value;
		}

		foreach ( [ 'category', 'provider' ] as $context ) {
			$terms                 = \wp_get_post_terms( $post_data['ID'], "prpl_recommendations_$context" );
			$post_data[ $context ] = is_array( $terms ) && isset( $terms[0] ) ? $terms[0] : null;
		}

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
			is_numeric( $id )
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
	 * @return array
	 */
	public function get_tasks_by( $params ) {
		$args = [];

		foreach ( $params as $param => $value ) {
			switch ( $param ) {
				case 'provider':
				case 'provider_id':
				case 'category':
					$args['tax_query']   = isset( $args['tax_query'] ) ? $args['tax_query'] : []; // phpcs:ignore WordPress.DB.SlowDBQuery
					$args['tax_query'][] = [
						'taxonomy' => 'category' === $param
							? 'prpl_recommendations_category'
							: 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => (array) $value,
					];

					unset( $params[ $param ] );
					break;

				case 'task_id':
					$args['meta_query']   = isset( $args['meta_query'] ) ? $args['meta_query'] : []; // phpcs:ignore WordPress.DB.SlowDBQuery
					$args['meta_query'][] = [
						'key'   => 'prpl_task_id',
						'value' => $value,
					];

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
	 * @return array
	 */
	public function get( $args = [] ) {
		$args = \wp_parse_args(
			$args,
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => [ 'publish', 'trash', 'draft', 'pending', 'future', 'pending_celebration' ], // 'any' doesn't include statuses which have 'exclude_from_search' set to true (trash and pending_celebration).
				'numberposts' => -1,
				'orderby'     => 'menu_order',
				'order'       => 'ASC',
			]
		);

		$cache_key = 'progress-planner-get-tasks-' . md5( (string) \wp_json_encode( $args ) );
		$results   = \wp_cache_get( $cache_key, static::GET_TASKS_CACHE_GROUP );
		if ( $results ) {
			return $results;
		}

		$results = $this->format_recommendations(
			\get_posts( $args )
		);

		\wp_cache_set( $cache_key, $results, static::GET_TASKS_CACHE_GROUP );

		return $results;
	}
}
