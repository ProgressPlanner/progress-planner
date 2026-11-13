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
		\add_action( 'rest_api_init', [ $this, 'register_rest_fields' ] );
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
			\register_post_meta(
				$post_type->name,
				'progress_planner_page_todos',
				[
					'type'              => 'string',
					'single'            => true,
					'show_in_rest'      => false,
					'sanitize_callback' => [ $this, 'sanitize_post_meta_progress_planner_page_todos' ],
				]
			);
		}
	}

	/**
	 * Expose to-dos only in editable responses without enabling unrelated custom fields.
	 *
	 * @return void
	 */
	public function register_rest_fields() {
		\register_rest_field(
			\array_keys( \get_post_types( [ 'public' => true ] ) ),
			'progress_planner_page_todos',
			[
				'schema'          => [
					'type'    => 'string',
					'context' => [ 'edit' ],
				],
				'get_callback'    => [ $this, 'get_rest_todos' ],
				'update_callback' => [ $this, 'update_rest_todos' ],
			]
		);
	}

	/**
	 * Read to-dos for a post the user may edit.
	 *
	 * @param array $post Prepared REST post.
	 * @return string
	 */
	public function get_rest_todos( $post ) {
		return \current_user_can( 'edit_post', $post['id'] )
			? (string) \get_post_meta( $post['id'], 'progress_planner_page_todos', true ) : '';
	}

	/**
	 * Update to-dos for a post the user may edit.
	 *
	 * @param string   $value To-dos.
	 * @param \WP_Post $post  Post being updated.
	 * @return true|\WP_Error
	 */
	public function update_rest_todos( $value, $post ) {
		if ( ! \current_user_can( 'edit_post', $post->ID ) ) {
			return new \WP_Error( 'rest_forbidden', \__( 'You cannot edit this post.', 'progress-planner' ), [ 'status' => \rest_authorization_required_code() ] );
		}
		\update_post_meta( $post->ID, 'progress_planner_page_todos', $this->sanitize_post_meta_progress_planner_page_todos( $value ) );
		return true;
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
