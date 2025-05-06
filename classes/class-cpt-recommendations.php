<?php
/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class CPT_Recommendations {

	const STATUS_MAP = [
		'completed'           => 'trash',
		'pending_celebration' => 'pending_celebration',
		'pending'             => 'publish',
		'snoozed'             => 'future',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Register the custom post type.
		\add_action( 'init', [ $this, 'register_post_type' ], 0 );

		// Register the custom taxonomies.
		\add_action( 'init', [ $this, 'register_taxonomy' ], 0 );

		// Add the custom post status.
		\add_action( 'init', [ $this, 'register_post_status' ], 1 );
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
	 * Register a custom post status.
	 *
	 * @return void
	 */
	public function register_post_status() {
		register_post_status(
			'pending_celebration',
			[
				'label'               => _x( 'Pending Celebration', 'post', 'progress-planner' ),
				'public'              => false,
				'exclude_from_search' => true,
				'show_in_admin_bar'   => false,
				'show_in_menu'        => false,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_quick_edit'  => false,
				'show_in_table'       => false,
			]
		);
	}

	/**
	 * Get recommendations, filtered by a parameter.
	 *
	 * @param array $params The parameters to filter by ([ 'provider' => 'provider_id' ] etc).
	 *
	 * @return array
	 */
	public function get_by_param( $params ) {
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
		return $this->format_recommendations(
			\get_posts(
				\wp_parse_args(
					$args,
					[
						'post_type'   => 'prpl_recommendations',
						'numberposts' => -1,
						'orderby'     => 'menu_order',
						'order'       => 'ASC',
					]
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
	 * @return array
	 */
	public function format_recommendation( $post ) {
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
	 * Delete all recommendations.
	 *
	 * @return void
	 */
	public function delete_all_recommendations() {
		// Get all recommendations.
		$recommendations = $this->get();

		// Delete each recommendation.
		foreach ( $recommendations as $recommendation ) {
			$this->delete_recommendation( $recommendation['ID'] );
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
	public function snooze( int $id, string $duration ) {
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
		return 'pending_celebration' === $post_status || 'trash' === $post_status;
	}

	/**
	 * Transition a task from one status to another.
	 *
	 * @param int    $task_id The task ID.
	 * @param string $old_status The old status.
	 * @param string $new_status The new status.
	 *
	 * @return bool
	 */
	public function transition_task_status( $task_id, $old_status, $new_status ) {

		$tasks = $this->get( [ 'ID' => (int) $task_id ] );

		if ( empty( $tasks ) ) {
			return false;
		}

		$task = $tasks[0];

		$old_post_status = isset( self::STATUS_MAP[ $old_status ] )
			? self::STATUS_MAP[ $old_status ]
			: $old_status;
		$new_post_status = isset( self::STATUS_MAP[ $new_status ] )
			? self::STATUS_MAP[ $new_status ]
			: $new_status;

		if ( $old_post_status !== $task['post_status'] || $new_post_status === $task['post_status'] ) {
			return false;
		}

		return (bool) \wp_update_post(
			[
				'post_status' => $new_post_status,
				'ID'          => (int) $task_id,
			]
		);
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
		$update_data    = [];
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

		if ( ! empty( $update_data ) ) {
			$update_results[] = (bool) \wp_update_post( $update_data );
		}

		if ( ! empty( $update_meta ) ) {
			foreach ( $update_meta as $key => $value ) {
				$update_results[] = (bool) \update_post_meta( $id, $key, $value );
			}
		}

		if ( ! empty( $update_terms ) ) {
			foreach ( $update_terms as $taxonomy => $term ) {
				$update_results[] = (bool) \wp_set_post_terms( $id, $term, $taxonomy );
			}
		}

		return ! in_array( false, $update_results, true );
	}
}
