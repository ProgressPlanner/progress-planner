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
	 * Get an array of settings.
	 *
	 * @return array
	 */
	public function get_settings() {
		$settings = [];
		foreach ( \progress_planner()->get_page_types()->get_page_types() as $page_type ) {
			$slug = (string) $page_type['slug']; // @phpstan-ignore offsetAccess.invalidOffset
			if ( ! $this->should_show_setting( $slug ) ) {
				continue;
			}

			$settings[ $slug ] = [
				'id'          => $slug,
				'value'       => '_no_page_needed',
				'isset'       => 'no',
				'title'       => $page_type['title'], // @phpstan-ignore offsetAccess.invalidOffset
				'description' => $page_type['description'] ?? '', // @phpstan-ignore offsetAccess.invalidOffset
				'type'        => 'page-select',
				'page'        => $slug,
			];

			if ( \progress_planner()->get_page_types()->is_page_needed( $slug ) ) {
				$type_pages = \progress_planner()->get_page_types()->get_posts_by_type( 'any', $slug );
				if ( empty( $type_pages ) ) {
					$settings[ $slug ]['value'] = \progress_planner()->get_page_types()->get_default_page_id_by_type( $slug );
				} else {
					$settings[ $slug ]['value'] = $type_pages[0]->ID;
					$settings[ $slug ]['isset'] = 'yes';

					// If there is more than one page, we need to check if the page has a parent with the same page-type assigned.
					if ( 1 < \count( $type_pages ) ) {
						$type_pages_ids = [];
						foreach ( $type_pages as $type_page ) {
							$type_pages_ids[] = (int) $type_page->ID;
						}
						foreach ( $type_pages as $type_page ) {
							$parent = \get_post_field( 'post_parent', $type_page->ID );
							if ( $parent && \in_array( (int) $parent, $type_pages_ids, true ) ) {
								$settings[ $slug ]['value'] = $parent;
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
	 * Set the page value.
	 *
	 * @param array $pages The pages.
	 *
	 * @return void
	 */
	public function set_page_values( $pages ) {

		if ( empty( $pages ) ) {
			return;
		}

		foreach ( $pages as $type => $page_args ) {
			$need_page = isset( $page_args['have_page'] ) ? $page_args['have_page'] : '';

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

	/**
	 * Save the settings.
	 *
	 * @return void
	 */
	public function save_settings() {
		// Nonce is already checked in store_settings_form_options() which calls this method.
		$redirect_on_login = isset( $_POST['prpl-redirect-on-login'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			? \sanitize_text_field( \wp_unslash( $_POST['prpl-redirect-on-login'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			: false;

		\update_user_meta( \get_current_user_id(), 'prpl_redirect_on_login', (bool) $redirect_on_login );
	}

	/**
	 * Save the post types.
	 *
	 * @param array $post_types The post types.
	 *
	 * @return void
	 */
	public function save_post_types( $post_types = [] ) {
		$include_post_types = ! empty( $post_types )
			? $post_types
			: \array_intersect( [ 'post', 'page' ], \progress_planner()->get_settings()->get_public_post_types() );

		\progress_planner()->get_settings()->set( 'include_post_types', $include_post_types );
	}
}
