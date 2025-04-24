<?php
/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Core_Update;
use Progress_Planner\Activities\Suggested_Task as Suggested_Task_Activity;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class Recommendations {

	const QUERY_ARGS = [
		'post_type'   => 'prpl_recommendations',
		'numberposts' => -1,
		'orderby'     => 'menu_order',
		'order'       => 'ASC',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'init' ], -1 );

		// Add the automatic updates complete action.
		\add_action( 'automatic_updates_complete', [ $this, 'on_automatic_updates_complete' ] );
	}

	/**
	 * Initialize the class.
	 *
	 * @return void
	 */
	public function init() {
		// Register the custom post type.
		\add_action( 'init', [ $this, 'register_post_type' ], 0 );

		// Register the custom taxonomies.
		\add_action( 'init', [ $this, 'register_taxonomy' ], 0 );
	}

	/**
	 * Register a custom post type for suggested tasks.
	 *
	 * @return void
	 */
	public function register_post_type() {
		register_post_type(
			'prpl_recommendations',
			[
				'label'               => \__( 'Recommendations', 'progress-planner' ),
				'public'              => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => true,
				'show_in_admin_bar'   => true,
				'show_in_rest'        => true,
				'supports'            => [ 'title', 'editor', 'author', 'custom-fields', 'page-attributes' ],
				'rewrite'             => false,
				'menu_icon'           => 'dashicons-admin-tools',
				'menu_position'       => 5,
				'hierarchical'        => true,
				'exclude_from_search' => true,
				'publicly_queryable'  => true,
			]
		);
	}

	/**
	 * Register a custom taxonomies for suggested tasks.
	 *
	 * @return void
	 */
	public function register_taxonomy() {
		foreach ( [
			'prpl_recommendations_category' => \__( 'Categories', 'progress-planner' ),
			'prpl_recommendations_provider' => \__( 'Providers', 'progress-planner' ),
		] as $taxonomy => $label ) {
			register_taxonomy( $taxonomy, 'prpl_recommendations', [ 'label' => $label ] );
		}
	}

	/**
	 * Get all recommendations.
	 *
	 * @return array
	 */
	public function get_all() {
		return $this->format_recommendations(
			get_posts( \wp_parse_args( [ 'post_status' => 'any' ], self::QUERY_ARGS ) )
		);
	}

	/**
	 * Get pending recommendations.
	 *
	 * @return array
	 */
	public function get_pending() {
		return $this->format_recommendations(
			get_posts( \wp_parse_args( [ 'post_status' => 'publish' ], self::QUERY_ARGS ) )
		);
	}

	/**
	 * Get recommendations by provider.
	 *
	 * @param string $provider The provider.
	 *
	 * @return array
	 */
	public function get_by_provider( $provider ) {
		return $this->format_recommendations(
			get_posts(
				\wp_parse_args(
					[
						'post_status' => 'any',
						'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
							[
								'taxonomy' => 'prpl_recommendations_provider',
								'field'    => 'slug',
								'terms'    => (array) $provider,
							],
						],
					],
					self::QUERY_ARGS
				)
			)
		);
	}

	/**
	 * Format recommendations results.
	 *
	 * @param array $recommendations The recommendations.
	 *
	 * @return array
	 */
	private function format_recommendations( $recommendations ) {
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
	 * @return array
	 */
	private function format_recommendation( $post ) {
		$post = (array) $post;

		// Format the post meta.
		$post_meta = \get_post_meta( $post['ID'] );
		foreach ( $post_meta as $key => $value ) {
			$post[ str_replace( 'prpl_', '', (string) $key ) ] =
				is_array( $value ) && isset( $value[0] ) && 1 === count( $value )
					? $value[0]
					: $value;
		}

		// Category terms.
		$category         = \wp_get_post_terms( $post['ID'], 'prpl_recommendations_category' );
		$post['category'] = is_array( $category ) && isset( $category[0] ) ? $category[0] : null;

		// Provider terms.
		$provider         = \wp_get_post_terms( $post['ID'], 'prpl_recommendations_provider' );
		$post['provider'] = is_array( $provider ) && isset( $provider[0] ) ? $provider[0] : null;

		return $post;
	}

	/**
	 * Delete a recommendation.
	 *
	 * @param int $id The recommendation ID.
	 *
	 * @return bool
	 */
	public function delete_recommendation( int $id ) {
		return (bool) \wp_delete_post( $id, true );
	}

	/**
	 * Snooze a recommendation.
	 *
	 * @param int    $id       The recommendation ID.
	 * @param string $duration The duration to snooze the recommendation.
	 *
	 * @return bool
	 */
	public function snooze_recommendation( int $id, string $duration ) {
		switch ( $duration ) {
			case '1-month':
				$new_date = \strtotime( '+1 month' );
				break;

			case '3-months':
				$new_date = \strtotime( '+3 months' );
				break;

			case '6-months':
				$new_date = \strtotime( '+6 months' );
				break;

			case '1-year':
				$new_date = \strtotime( '+1 year' );
				break;

			case 'forever':
				$new_date = \strtotime( '+10 years' );
				break;

			default:
				$new_date = \strtotime( '+1 week' );
				break;
		}

		return (bool) \wp_update_post(
			[
				'ID'          => $id,
				'post_status' => 'future',
				'post_date'   => \gmdate( 'Y-m-d H:i:s', $new_date ),
			]
		);
	}

	/**
	 * Check if a recommendation is completed.
	 *
	 * @param int $id The recommendation ID.
	 *
	 * @return bool
	 */
	public function is_completed( int $id ) {
		// Get the post status.
		$post_status = \get_post_status( $id );
		return 'draft' === $post_status || 'trash' === $post_status;
	}

	/**
	 * If done via automatic updates, the "core update" task should be marked as "completed" (and skip "pending celebration" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete() {

		$pending_tasks = $this->get_pending();

		if ( empty( $pending_tasks ) ) {
			return;
		}

		foreach ( $pending_tasks as $task_data ) {
			$task_id = $task_data['ID'];

			if ( $task_data['provider'] === ( new Core_Update() )->get_provider_id() &&
				\gmdate( 'YW' ) === $task_data['date']
			) {
				// Change the task status to completed.
				\wp_update_post(
					[
						'ID'          => (int) $task_data['ID'],
						'post_status' => 'trash',
					]
				);

				// Insert an activity.
				$this->insert_activity( $task_id );
				break;
			}
		}
	}

	/**
	 * Insert an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function insert_activity( $task_id ) {
		// Insert an activity.
		$activity          = new Suggested_Task_Activity();
		$activity->type    = 'completed';
		$activity->data_id = (string) $task_id;
		$activity->date    = new \DateTime();
		$activity->user_id = \get_current_user_id();
		$activity->save();

		// Allow other classes to react to the completion of a suggested task.
		do_action( 'progress_planner_suggested_task_completed', $task_id );
	}

	/**
	 * Delete an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function delete_activity( $task_id ) {
		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		if ( empty( $activity ) ) {
			return;
		}

		\progress_planner()->get_activities__query()->delete_activity( $activity[0] );
	}
}
