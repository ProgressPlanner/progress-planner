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
				'supports'            => [ 'title', 'editor', 'author', 'custom-fields' ],
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
			$recommendation = (array) $recommendation;

			// Format the post meta.
			$post_meta = \get_post_meta( $recommendation['ID'] );
			foreach ( $post_meta as $key => $value ) {
				$recommendation[ str_replace( 'prpl_', '', (string) $key ) ] =
					is_array( $value ) && isset( $value[0] ) && 1 === count( $value )
						? $value[0]
						: $value;
			}

			// Category terms.
			$category                   = \wp_get_post_terms( $recommendation['ID'], 'prpl_recommendations_category' );
			$recommendation['category'] = is_array( $category ) && isset( $category[0] ) ? $category[0] : null;

			// Provider terms.
			$provider                   = \wp_get_post_terms( $recommendation['ID'], 'prpl_recommendations_provider' );
			$recommendation['provider'] = is_array( $provider ) && isset( $provider[0] ) ? $provider[0] : null;

			$result[] = $recommendation;
		}

		return $result;
	}
}
