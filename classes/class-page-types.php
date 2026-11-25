<?php
/**
 * The class handling page types.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Class Page_Types
 */
class Page_Types {

	/**
	 * The page types.
	 *
	 * @var array
	 */
	public static $page_types = null;

	/**
	 * The taxonomy name.
	 *
	 * @var string
	 */
	const TAXONOMY_NAME = 'progress_planner_page_types';

	/**
	 * Constructor
	 */
	public function __construct() {
		\add_action( 'init', [ $this, 'create_taxonomy' ] );
		\add_action( 'init', [ $this, 'maybe_add_terms' ] );
		\add_action( 'init', [ $this, 'maybe_update_terms' ] );

		// Drop the page-type from REST post writes by users who can't assign it.
		\add_filter( 'rest_request_before_callbacks', [ $this, 'remove_page_type_if_not_allowed' ], 10, 3 );

		// Add hook when updating the `page_on_front` option.
		\add_action( 'update_option_page_on_front', [ $this, 'update_option_page_on_front' ] );

		// Add activity when a post is added or updated.
		\add_action( 'post_updated', [ $this, 'post_updated' ], 10, 2 );
		\add_action( 'wp_insert_post', [ $this, 'post_updated' ], 10, 2 );
		\add_action( 'transition_post_status', [ $this, 'transition_post_status' ], 10, 3 );
	}

	/**
	 * Create the `progress_planner_page_types` taxonomy.
	 *
	 * @return void
	 */
	public function create_taxonomy() {
		// Register the taxonomy for all public post types.
		\register_taxonomy(
			self::TAXONOMY_NAME,
			\array_keys( \get_post_types( [ 'public' => true ] ) ),
			[
				'public'            => false,
				'hierarchical'      => false,
				'labels'            => [], // Hidden taxonomy, no need for labels.
				'show_ui'           => false,
				'show_admin_column' => false,
				'query_var'         => true,
				'rewrite'           => [ 'slug' => 'site-type' ],
				'show_in_rest'      => true,
				'show_in_menu'      => false,
				// Assigning a page-type says what a page is *for*, which is a site-level
				// editorial decision rather than something an author does on their own
				// post. Without this, assign_terms falls back to `edit_posts` and any
				// author can set it through the standard REST post endpoint.
				'capabilities'      => [
					'manage_terms' => 'manage_categories',
					'edit_terms'   => 'manage_categories',
					'delete_terms' => 'manage_categories',
					'assign_terms' => 'edit_others_posts',
				],
			]
		);
	}

	/**
	 * Remove the page-type from a REST post write when the user can't assign it.
	 *
	 * Without this, WP rejects the whole request with `rest_cannot_assign_term`, so an
	 * author who resubmits the page-type an editor already set loses every other change
	 * in that same save (title, content). Silently dropping the field keeps their edit
	 * working while leaving the existing page-type untouched.
	 *
	 * Hooked on `rest_request_before_callbacks` because the taxonomy permission check
	 * lives in the posts controller's `*_permissions_check()`, which runs before
	 * `rest_pre_insert_{$post_type}` would fire.
	 *
	 * @param \WP_REST_Response|\WP_HTTP_Response|\WP_Error|mixed $response The response.
	 * @param array                                               $handler  The route handler.
	 * @param \WP_REST_Request                                    $request  The request.
	 *
	 * @return \WP_REST_Response|\WP_HTTP_Response|\WP_Error|mixed
	 */
	public function remove_page_type_if_not_allowed( $response, $handler, $request ) {
		if ( null === $request[ self::TAXONOMY_NAME ] ) {
			return $response;
		}

		// Only touch writes; a GET can legitimately carry the field as a query filter.
		if ( ! \in_array( $request->get_method(), [ 'POST', 'PUT', 'PATCH' ], true ) ) {
			return $response;
		}

		$taxonomy = \get_taxonomy( self::TAXONOMY_NAME );
		if ( ! $taxonomy || \current_user_can( $taxonomy->cap->assign_terms ) ) {
			return $response;
		}

		unset( $request[ self::TAXONOMY_NAME ] );

		return $response;
	}

	/**
	 * Maybe add terms to the `progress_planner_page_types` taxonomy.
	 *
	 * @return void
	 */
	public function maybe_add_terms() {
		$lessons = \progress_planner()->get_lessons()->get_items();

		foreach ( $lessons as $lesson ) {
			if ( \term_exists( $lesson['settings']['id'], self::TAXONOMY_NAME ) ) {
				continue;
			}
			\wp_insert_term(
				$lesson['settings']['title'],
				self::TAXONOMY_NAME,
				[
					'slug'        => $lesson['settings']['id'],
					'description' => $lesson['settings']['description'],
				]
			);
		}
	}

	/**
	 * Update term names and descriptions once/week.
	 *
	 * @return void
	 */
	public function maybe_update_terms() {
		$updated = \progress_planner()->get_utils__cache()->get( 'page_types_updated' );
		if ( $updated ) {
			return;
		}

		$lessons = \progress_planner()->get_lessons()->get_items();
		foreach ( $lessons as $lesson ) {
			$term = \get_term_by( 'slug', $lesson['settings']['id'], self::TAXONOMY_NAME );
			if ( ! $term instanceof \WP_Term ) {
				continue;
			}
			\wp_update_term(
				$term->term_id,
				self::TAXONOMY_NAME,
				[
					'name'        => $lesson['settings']['title'],
					'description' => $lesson['settings']['description'],
				]
			);
		}

		// Get an array of all terms.
		$terms = \get_terms(
			[
				'taxonomy'   => self::TAXONOMY_NAME,
				'hide_empty' => false,
			]
		);

		if ( ! $terms || \is_wp_error( $terms ) ) {
			return;
		}

		// Remove any terms that are not in the lessons.
		foreach ( $terms as $term ) {
			$found = false;
			foreach ( $lessons as $lesson ) {
				if ( $lesson['settings']['id'] === $term->slug ) {
					$found = true;
					break;
				}
			}
			if ( ! $found ) {
				\wp_delete_term( $term->term_id, self::TAXONOMY_NAME );
			}
		}

		\progress_planner()->get_utils__cache()->set( 'page_types_updated', true, \WEEK_IN_SECONDS );
	}

	/**
	 * Get the page types.
	 *
	 * @return array
	 */
	public function get_page_types() {
		if ( null !== static::$page_types ) {
			return static::$page_types;
		}

		$terms = \get_terms(
			[
				'taxonomy'   => self::TAXONOMY_NAME,
				'hide_empty' => false,
			]
		);

		if ( ! $terms || \is_wp_error( $terms ) ) {
			static::$page_types = [];
			return static::$page_types;
		}

		static::$page_types = [];
		foreach ( $terms as $term ) {
			static::$page_types[] = [
				'id'          => $term->term_id,
				'slug'        => $term->slug,
				'title'       => $term->name,
				'description' => $term->description,
			];
		}

		return static::$page_types;
	}

	/**
	 * Get the page ID, based on the slug of the post-meta.
	 *
	 * @param string $post_type The post-type for the query.
	 * @param string $slug      The slug of the taxonomy term.
	 *
	 * @return \WP_Post[] Return the posts.
	 */
	public function get_posts_by_type( $post_type, $slug ) {
		static $cache = [];
		if ( isset( $cache[ $post_type ][ $slug ] ) ) {
			return $cache[ $post_type ][ $slug ];
		}
		if ( ! isset( $cache[ $post_type ] ) ) {
			$cache[ $post_type ] = [];
		}
		$posts = \get_posts(
			[
				'post_type'      => $post_type,
				'posts_per_page' => 100,
				'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => self::TAXONOMY_NAME,
						'field'    => 'slug',
						'terms'    => $slug,
					],
				],
			]
		);
		if ( empty( $posts ) && 'page' === $post_type ) {
			$default_page_id = $this->get_default_page_id_by_type( $slug );
			if ( 0 !== $default_page_id ) {
				$post = \get_post( $default_page_id );
				if ( $post instanceof \WP_Post ) {
					$posts = [ $post ];
				}
			}
		}

		$cache[ $post_type ][ $slug ] = empty( $posts ) ? [] : $posts;
		return $cache[ $post_type ][ $slug ];
	}

	/**
	 * Set the page-type for a post, by ID.
	 *
	 * @param int $post_id The post ID.
	 * @param int $page_type_id The page type ID.
	 *
	 * @return void
	 */
	public function set_page_type_by_id( $post_id, $page_type_id ) {
		\wp_set_object_terms( (int) $post_id, $page_type_id, self::TAXONOMY_NAME );
		$this->assign_child_pages( $post_id, $page_type_id );

		// Get the term.
		$term = \get_term( $page_type_id, self::TAXONOMY_NAME );

		// If the page-type is not found, return.
		if ( ! $term || ! $term instanceof \WP_Term ) {
			return;
		}

		switch ( $term->slug ) {
			case 'homepage':
				\update_option( 'page_on_front', $post_id );
				\update_option( 'show_on_front', 'page' );
				break;
		}
	}

	/**
	 * Get the default page type.
	 *
	 * @param string $post_type The post type.
	 * @param int    $post_id   The post ID.
	 *
	 * @return int
	 */
	public function get_default_page_type( $post_type, $post_id ) {
		// Post-type checks.
		switch ( $post_type ) {
			// Products from WooCommerce & EDD.
			case 'product':
			case 'download':
				$term = \get_term_by( 'slug', 'product-page', self::TAXONOMY_NAME );
				return $term instanceof \WP_Term ? $term->term_id : 0;

			case 'page':
				if (
					$post_id
					&& 'page' === \get_option( 'show_on_front' )
					&& \is_numeric( \get_option( 'page_on_front' ) )
					&& (int) $post_id === (int) \get_option( 'page_on_front' )
				) {
					$term = \get_term_by( 'slug', 'homepage', self::TAXONOMY_NAME );
					return $term instanceof \WP_Term ? $term->term_id : 0;
				}
				// Fall-through.

			case 'post':
			default:
				$term = \get_term_by( 'slug', 'blog', self::TAXONOMY_NAME );
				return $term instanceof \WP_Term ? $term->term_id : 0;
		}
	}

	/**
	 * Get the default page ID for a page-type.
	 *
	 * @param string $page_type The page-type slug.
	 *
	 * @return int
	 */
	public function get_default_page_id_by_type( $page_type ) {
		$homepage_id = \get_option( 'page_on_front' ) ?? 0;

		// Early return for the homepage (no searching needed).
		if ( 'homepage' === $page_type ) {
			return $homepage_id;
		}

		// Build candidate pages for each page type by searching titles.
		// Keys are page types, values are arrays of matching page IDs.
		$types_pages = [
			'homepage' => [ $homepage_id ],
			'contact'  => $this->get_posts_by_title( \__( 'Contact', 'progress-planner' ) ),
			'about'    => $this->get_posts_by_title( \__( 'About', 'progress-planner' ) ),
			'faq'      => \array_merge(
				// FAQ can match either short form or long form.
				$this->get_posts_by_title( \__( 'FAQ', 'progress-planner' ) ),
				$this->get_posts_by_title( \__( 'Frequently Asked Questions', 'progress-planner' ) ),
			),
		];

		$defined_page_types = \array_keys( $types_pages );

		// Validate that the requested page type exists in our definitions.
		if ( ! \in_array( $page_type, $defined_page_types, true ) ) {
			return 0;
		}

		// Get candidate pages for the requested page type.
		$posts = $types_pages[ $page_type ];

		// No candidates found for this page type.
		if ( empty( $posts ) ) {
			return 0;
		}

		// Apply exclusion logic: Remove pages that are already assigned to OTHER page types.
		// This ensures each page is only assigned to one page type, preventing conflicts.
		// Example: If page ID 5 matches both "About" and "Contact", only the first checked type claims it.
		foreach ( $defined_page_types as $defined_page_type ) {
			// Skip the current page-type (we don't want to exclude our own candidates).
			if ( $page_type === $defined_page_type ) {
				continue;
			}

			// Remove any page IDs that belong to other page types.
			// array_diff removes values from $posts that exist in $types_pages[$defined_page_type].
			$posts = \array_diff( $posts, $types_pages[ $defined_page_type ] );
		}

		// Return the first remaining candidate, or 0 if all were excluded.
		return empty( $posts ) ? 0 : $posts[0];
	}

	/**
	 * Get the taxonomy name.
	 *
	 * @return string
	 */
	public function get_taxonomy_name() {
		return self::TAXONOMY_NAME;
	}

	/**
	 * Update the `page_on_front` option.
	 *
	 * @param int $page_id The page ID.
	 *
	 * @return void
	 */
	public function update_option_page_on_front( $page_id ) {
		// Get the posts for the homepage.
		$posts = $this->get_posts_by_type( 'page', 'homepage' );
		$term  = \get_term_by( 'slug', 'homepage', self::TAXONOMY_NAME );

		if ( ! $term ) {
			return;
		}

		$same_page = false;
		foreach ( $posts as $post ) {
			if ( (int) $post->ID === (int) $page_id ) {
				$same_page = true;
				continue;
			}

			// Remove the term from the post.
			\wp_remove_object_terms( $post->ID, $term->term_id, self::TAXONOMY_NAME );
		}

		if ( ! $same_page ) {
			// Add the term to the new homepage.
			\wp_set_object_terms( $page_id, $term->term_id, self::TAXONOMY_NAME );
			self::assign_child_pages( $page_id, $term->term_id );
		}
	}

	/**
	 * Post updated.
	 *
	 * Runs on post_updated hook.
	 *
	 * @param int           $post_id The post ID.
	 * @param \WP_Post|null $post    The post object.
	 *
	 * @return void
	 */
	public function post_updated( $post_id, $post ) {
		// Check if the post is set as a homepage.
		if ( ! $post || 'page' !== $post->post_type || 'publish' !== $post->post_status ) {
			return;
		}

		$terms = \get_the_terms( $post_id, self::TAXONOMY_NAME );
		if ( ! \is_array( $terms ) || ! isset( $terms[0] ) ) {
			return;
		}

		if ( 'homepage' === $terms[0]->slug ) {
			\update_option( 'page_on_front', $post_id );
			\update_option( 'show_on_front', 'page' );
		}
	}

	/**
	 * Run actions when transitioning a post status.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post       The post object.
	 *
	 * @return void
	 */
	public function transition_post_status( $new_status, $old_status, $post ) {
		$this->post_updated( $post->ID, $post );
	}

	/**
	 * Assign child pages to the same page-type as the parent.
	 *
	 * @param int $post_id The parent post ID.
	 * @param int $term_id The term ID.
	 *
	 * @return void
	 */
	public function assign_child_pages( $post_id, $term_id ) {
		$children = \get_children( [ 'post_parent' => $post_id ] );

		if ( ! $children ) {
			return;
		}

		foreach ( $children as $child ) {
			if ( ! $child instanceof \WP_Post ) {
				continue;
			}
			\wp_set_object_terms( $child->ID, $term_id, self::TAXONOMY_NAME );
		}
	}

	/**
	 * Get the term for when no page is needed.
	 *
	 * @param string $type The type.
	 *
	 * @return \WP_Term|false
	 */
	public function get_term_by_type( $type ) {
		static $cache = [];
		if ( isset( $cache[ $type ] ) ) {
			return $cache[ $type ];
		}
		$term           = \get_term_by( 'slug', $type, self::TAXONOMY_NAME );
		$cache[ $type ] = $term instanceof \WP_Term ? $term : false;
		return $cache[ $type ];
	}

	/**
	 * Check if a page is needed for a type.
	 *
	 * @param string $type The type.
	 *
	 * @return bool
	 */
	public function is_page_needed( $type ) {
		$term = $this->get_term_by_type( $type );
		if ( ! $term ) {
			return false;
		}
		return '' !== \get_term_meta( $term->term_id, '_progress_planner_no_page', true ) ? false : true;
	}

	/**
	 * Set or delete the `_progress_planner_no_page` term-meta.
	 *
	 * @param string $type  The type.
	 * @param bool   $value The value. `true` to set, `false` to delete.
	 *
	 * @return void
	 */
	public function set_no_page_needed( $type, $value ) {
		$term = $this->get_term_by_type( $type );
		if ( ! $term ) {
			return;
		}

		if ( $value ) {
			\update_term_meta( $term->term_id, '_progress_planner_no_page', '1' );
			return;
		}
		\delete_term_meta( $term->term_id, '_progress_planner_no_page' );
	}

	/**
	 * Get the posts by title.
	 *
	 * @param string $title The title.
	 *
	 * @return array
	 */
	private function get_posts_by_title( $title ) {
		global $wpdb;
		// Check if we have a cached result.
		$cache_key   = 'pp_posts_by_title_' . \sanitize_title( $title );
		$cache_group = \Progress_Planner\Activities\Query::CACHE_GROUP;
		$posts_ids   = \wp_cache_get( $cache_key, $cache_group );
		if ( false !== $posts_ids ) {
			return $posts_ids;
		}

		// Cache the query.
		$posts     = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT ID FROM $wpdb->posts WHERE post_type = 'page' AND post_status != 'trash' AND post_title LIKE %s", // @phpstan-ignore-line property.nonObject
				'%' . $wpdb->esc_like( $title ) . '%'
			)
		);
		$posts_ids = [];
		foreach ( $posts as $post ) {
			$posts_ids[] = (int) $post->ID; // @phpstan-ignore-line property.nonObject
		}
		\wp_cache_set( $cache_key, $posts_ids, $cache_group );
		return $posts_ids;
	}
}
