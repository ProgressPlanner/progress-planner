<?php
/**
 * The class handling post-metas for page TODOs.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Class Page_Todos
 */
class Page_Todos {

	/**
	 * Constructor
	 */
	public function __construct() {
		\add_action( 'init', [ $this, 'init' ] );
	}

	/**
	 * Initialize the plugin.
	 *
	 * @return void
	 */
	public function init() {
		// Add the post-metas to all post-types.
		$post_types = \get_post_types( [ 'public' => true ], 'objects' );
		foreach ( $post_types as $post_type ) {
			if ( ! \post_type_supports( $post_type->name, 'custom-fields' ) ) {
				\add_post_type_support( $post_type->name, 'custom-fields' );
			}
			\register_post_meta(
				$post_type->name,
				'progress_planner_page_todos',
				[
					'type'              => 'string',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => [ $this, 'sanitize_post_meta_progress_planner_page_todos' ],
				]
			);
		}
	}

	/**
	 * Sanitize the `progress_planner_page_todos` meta.
	 *
	 * @param string $value The meta value.
	 *
	 * @return string
	 */
	public function sanitize_post_meta_progress_planner_page_todos( $value ) {
		$values = \explode( ',', $value );
		// Remove any empty values.
		$values = \array_filter( $values );
		// Remove any duplicates.
		$values = \array_unique( $values );
		// Trim all values.
		$values = \array_map( 'trim', $values );

		// Return the sanitized value.
		return \sanitize_text_field( \implode( ',', $values ) );
	}
}
