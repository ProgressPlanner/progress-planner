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
					if ( 1 < count( $type_pages ) ) {
						$type_pages_ids = [];
						foreach ( $type_pages as $type_page ) {
							$type_pages_ids[] = (int) $type_page->ID;
						}
						foreach ( $type_pages as $type_page ) {
							$parent = \get_post_field( 'post_parent', $type_page->ID );
							if ( $parent && in_array( (int) $parent, $type_pages_ids, true ) ) {
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
		\check_admin_referer( 'prpl-settings' );

		if ( isset( $_POST['pages'] ) ) {
			foreach ( wp_unslash( $_POST['pages'] ) as $type => $page_args ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

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
				if ( 1 > (int) $page_args['id'] ) {
					continue;
				}

				if ( 'no' !== $page_args['have_page'] ) {
					// Add the term to the `progress_planner_page_types` taxonomy.
					\progress_planner()->get_page_types()->set_page_type_by_id( (int) $page_args['id'], $type );
				}
			}
		}

		$this->save_license();

		do_action( 'progress_planner_settings_form_options_stored' );

		\wp_send_json_success( \esc_html__( 'Options stored successfully', 'progress-planner' ) );
	}

	/**
	 * Save the license key.
	 *
	 * @return void
	 */
	public function save_license() {
		$license = isset( $_POST['prpl-pro-license-key'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			? \sanitize_text_field( \wp_unslash( $_POST['prpl-pro-license-key'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			: '';

		$previous = \get_option( 'progress_planner_pro_license_key' );
		$is_new   = $previous !== $license;

		if ( ! $is_new ) {
			return;
		}

		\update_option( 'progress_planner_pro_license_key', $license );
		\update_option( 'progress_planner_pro_license_status', null );

		// Do nothing if user just cleared the license.
		if ( empty( $license ) ) {
			return;
		}

		// Call the custom API.
		$response = \wp_remote_post(
			'https://progressplanner.com',
			[
				'timeout'   => 15,
				'sslverify' => false,
				'body'      => [
					'edd_action'  => 'activate_license',
					'license'     => $license,
					'item_id'     => 1136,
					'item_name'   => rawurlencode( 'Progress Planner Pro' ),
					'url'         => \home_url(),
					'environment' => function_exists( 'wp_get_environment_type' ) ? \wp_get_environment_type() : 'production',
				],
			]
		);

		// Make sure the response came back okay.
		if ( \is_wp_error( $response ) || 200 !== \wp_remote_retrieve_response_code( $response ) ) {
			if ( \is_wp_error( $response ) ) {
				\wp_send_json_error( $response->get_error_message() );
			}
			\wp_send_json_error( \esc_html__( 'An error occurred, please try again.', 'progress-planner' ) );
		}
		$license_data = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( ! $license_data || ! \is_array( $license_data ) ) {
			\wp_send_json_error( \esc_html__( 'An error occurred, please try again.', 'progress-planner' ) );
		}

		\update_option( 'progress_planner_pro_license_status', $license_data['license'] );

		if ( true === $license_data['success'] ) {
			return;
		}

		if ( false !== $license_data['success'] ) {
			\wp_send_json_error( \esc_html__( 'An error occurred, please try again.', 'progress-planner' ) );
		}

		if ( ! isset( $license_data['error'] ) ) {
			\wp_send_json_error( \esc_html__( 'An error occurred, please try again.', 'progress-planner' ) );
		}

		// phpcs:disable PSR2.ControlStructures.SwitchDeclaration.TerminatingComment
		switch ( $license_data['error'] ) {
			case 'expired':
				\wp_send_json_error( \esc_html__( 'Your license key has expired.', 'progress-planner' ) );

			case 'disabled':
			case 'revoked':
				\wp_send_json_error( \esc_html__( 'Your license key has been disabled.', 'progress-planner' ) );

			case 'missing':
				\wp_send_json_error( \esc_html__( 'Invalid license.', 'progress-planner' ) );

			case 'invalid':
			case 'site_inactive':
				\wp_send_json_error( \esc_html__( 'Your license is not active for this URL.', 'progress-planner' ) );

			case 'item_name_mismatch':
				\wp_send_json_error(
					sprintf(
						/* translators: the plugin name */
						\esc_html__( 'This appears to be an invalid license key for %s.', 'progress-planner' ),
						'Progress Planner Pro'
					)
				);

			case 'no_activations_left':
				\wp_send_json_error( \esc_html__( 'Your license key has reached its activation limit.', 'progress-planner' ) );

			default:
				\wp_send_json_error( \esc_html__( 'An error occurred, please try again.', 'progress-planner' ) );
		}
		// phpcs:enable
	}
}
