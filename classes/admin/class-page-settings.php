<?php
/**
 * The admin pages and functionality for Progress Planner.
 *
 * @package Progress_Planner/Admin
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Page_Types;

/**
 * Admin class.
 */
class Page_Settings {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Add the admin menu page.
		\add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ] );

		// Add AJAX hooks to save options.
		\add_action( 'wp_ajax_prpl_settings_form', [ $this, 'store_settings_form_options' ] );
	}

	/**
	 * Add admin-menu page, as a submenu in the progress-planner menu.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		\add_submenu_page(
			'progress-planner',
			\esc_html__( 'Settings', 'progress-planner' ),
			\esc_html__( 'Settings', 'progress-planner' ),
			'manage_options',
			'progress-planner-settings',
			[ $this, 'add_admin_page_content' ]
		);
	}

	/**
	 * Add content to the admin page of the free plugin.
	 *
	 * @return void
	 */
	public function add_admin_page_content() {
		require_once PROGRESS_PLANNER_DIR . '/views/admin-page-settings.php';
	}

	/**
	 * Get an array of settings.
	 *
	 * @return array
	 */
	public function get_settings() {
		$settings = [];
		foreach ( \progress_planner()->get_page_types()->get_page_types() as $page_type ) {
			if ( ! $this->should_show_setting( $page_type['slug'] ) ) {
				continue;
			}

			$settings[ $page_type['slug'] ] = [
				'id'          => $page_type['slug'],
				'value'       => '_no_page_needed',
				'isset'       => 'no',
				'title'       => $page_type['title'],
				'description' => $page_type['description'] ?? '',
				'type'        => 'page-select',
				'page'        => $page_type['slug'],
			];

			if ( \progress_planner()->get_page_types()->is_page_needed( $page_type['slug'] ) ) {
				$type_pages = \progress_planner()->get_page_types()->get_posts_by_type( 'any', $page_type['slug'] );
				if ( empty( $type_pages ) ) {
					$settings[ $page_type['slug'] ]['value'] = \progress_planner()->get_page_types()->get_default_page_id_by_type( $page_type['slug'] );
				} else {
					$settings[ $page_type['slug'] ]['value'] = $type_pages[0]->ID;
					$settings[ $page_type['slug'] ]['isset'] = 'yes';

					// If there is more than one page, we need to check if the page has a parent with the same page-type assigned.
					if ( 1 < \count( $type_pages ) ) {
						$type_pages_ids = [];
						foreach ( $type_pages as $type_page ) {
							$type_pages_ids[] = (int) $type_page->ID;
						}
						foreach ( $type_pages as $type_page ) {
							$parent = \get_post_field( 'post_parent', $type_page->ID );
							if ( $parent && \in_array( (int) $parent, $type_pages_ids, true ) ) {
								$settings[ $page_type['slug'] ]['value'] = $parent;
								break;
							}
						}
					}
				}
			}
		}

		return $settings;
	}

	/**
	 * Determine whether the setting for a page-type should be shown or not.
	 *
	 * @param string $page_type The page-type slug.
	 *
	 * @return bool
	 */
	public function should_show_setting( $page_type ) {
		static $lessons;
		if ( ! $lessons ) {
			$lessons = \progress_planner()->get_lessons()->get_items();
		}
		foreach ( $lessons as $lesson ) {
			if ( $lesson['settings']['id'] === $page_type ) {
				return 'no' !== $lesson['settings']['show_in_settings'];
			}
		}

		return true;
	}

	/**
	 * Store the settings form options.
	 *
	 * @return void
	 */
	public function store_settings_form_options() {
		// Check the nonce.
		\check_admin_referer( 'progress_planner' );

		if ( isset( $_POST['pages'] ) ) {
			foreach ( \wp_unslash( $_POST['pages'] ) as $type => $page_args ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

				$need_page = \sanitize_text_field( \wp_unslash( $page_args['have_page'] ) );

				\progress_planner()->get_page_types()->set_no_page_needed(
					$type,
					'not-applicable' === $need_page
				);

				// Remove the post-meta from the existing posts.
				$existing_posts = \progress_planner()->get_page_types()->get_posts_by_type( 'any', $type );
				foreach ( $existing_posts as $post ) {
					if ( $post->ID === (int) $page_args['id'] && 'no' !== $page_args['have_page'] ) {
						continue;
					}

					// Get the term-ID for the type.
					$term = \get_term_by( 'slug', $type, Page_Types::TAXONOMY_NAME );
					if ( ! $term instanceof \WP_Term ) {
						continue;
					}

					// Remove the assigned terms from the `progress_planner_page_types` taxonomy.
					\wp_remove_object_terms( $post->ID, $term->term_id, Page_Types::TAXONOMY_NAME );
				}

				// Skip if the ID is not set.
				if ( ! isset( $page_args['id'] ) || 1 > (int) $page_args['id'] ) {
					continue;
				}

				if ( 'no' !== $page_args['have_page'] ) {
					// Add the term to the `progress_planner_page_types` taxonomy.
					\progress_planner()->get_page_types()->set_page_type_by_id( (int) $page_args['id'], $type );
				}
			}
		}

		$this->save_settings();
		$this->save_post_types();

		\do_action( 'progress_planner_settings_form_options_stored' );

		\wp_send_json_success( \esc_html__( 'Options stored successfully', 'progress-planner' ) );
	}

	/**
	 * Save the settings.
	 *
	 * @return void
	 */
	public function save_settings() {
		// Check the nonce.
		\check_admin_referer( 'progress_planner' );

		$redirect_on_login = isset( $_POST['prpl-redirect-on-login'] )
			? \sanitize_text_field( \wp_unslash( $_POST['prpl-redirect-on-login'] ) )
			: false;

		\update_user_meta( \get_current_user_id(), 'prpl_redirect_on_login', (bool) $redirect_on_login );
	}

	/**
	 * Save the post types.
	 *
	 * @return void
	 */
	public function save_post_types() {
		// Check the nonce.
		\check_admin_referer( 'progress_planner' );

		$include_post_types = isset( $_POST['prpl-post-types-include'] )
			? \array_map( 'sanitize_text_field', \wp_unslash( $_POST['prpl-post-types-include'] ) ) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			// If no post types are selected, use the default post types (post and page can be deregistered).
			: \array_intersect( [ 'post', 'page' ], \progress_planner()->get_settings()->get_public_post_types() );

		\progress_planner()->get_settings()->set( 'include_post_types', $include_post_types );
	}
}
