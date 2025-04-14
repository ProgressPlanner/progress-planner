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
class Recommendations {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'init' ], -1 );
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
			get_posts(
				[
					'post_type'   => 'prpl_recommendations',
					'numberposts' => -1,
					'post_status' => 'any',
					'orderby'     => 'menu_order',
					'order'       => 'ASC',
				]
			)
		);
	}

	/**
	 * Get pending recommendations.
	 *
	 * @return array
	 */
	public function get_pending() {
		return $this->format_recommendations(
			get_posts(
				[
					'post_type'   => 'prpl_recommendations',
					'numberposts' => -1,
					'post_status' => 'publish',
					'orderby'     => 'menu_order',
					'order'       => 'ASC',
				]
			)
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
				[
					'post_type'   => 'prpl_recommendations',
					'numberposts' => -1,
					'post_status' => 'any',
					'orderby'     => 'menu_order',
					'order'       => 'ASC',
					'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
						[
							'taxonomy' => 'prpl_recommendations_provider',
							'field'    => 'slug',
							'terms'    => (array) $provider,
						],
					],
				]
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
}
