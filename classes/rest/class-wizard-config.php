<?php
/**
 * Wizard Config REST API controller.
 *
 * Provides wizard configuration via REST API endpoint.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Wizard Config REST API controller.
 */
class Wizard_Config extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/onboarding-wizard/config',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_wizard_config' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Get wizard configuration.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_wizard_config( $request ) {
		$wizard = \progress_planner()->get_onboard_wizard();

		// Get saved progress from user meta.
		$saved_progress = $wizard->get_saved_progress();

		// Get steps using public method.
		$steps = $wizard->get_steps();

		// Format steps for React.
		$steps_formatted = [];
		foreach ( $steps as $index => $step ) {
			$steps_formatted[] = [
				'id'       => $step['template_id'],
				'title'    => \html_entity_decode( $step['title'], ENT_QUOTES, 'UTF-8' ),
				'template' => $step['template_file_name'],
				'data'     => isset( $step['template_data'] ) ? $step['template_data'] : [],
			];
		}

		// Get pages for settings step.
		$pages           = \get_pages(
			[
				'sort_column' => 'post_title',
				'sort_order'  => 'ASC',
			]
		);
		$pages_formatted = [];
		foreach ( $pages as $page ) {
			$pages_formatted[] = [
				'id'    => $page->ID,
				'title' => $page->post_title,
			];
		}

		// Page type descriptions for SettingsStep.
		// Use __() instead of esc_html__() to avoid HTML entity encoding in JSON.
		$page_types = [
			'homepage' => [
				'id'          => 'homepage',
				'title'       => \__( 'Home page', 'progress-planner' ),
				'description' => \__( 'Help us understand your site a little better so we can give you more useful recommendations. Let\'s start with the home page.', 'progress-planner' ),
				'note'        => \__( 'A Home page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
			],
			'about'    => [
				'id'          => 'about',
				'title'       => \__( 'About page', 'progress-planner' ),
				'description' => \__( 'Next up, pick the page you use as your about page.', 'progress-planner' ),
				'note'        => \__( 'An About page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
			],
			'contact'  => [
				'id'          => 'contact',
				'title'       => \__( 'Contact page', 'progress-planner' ),
				'description' => \__( 'Now choose the page you use as your contact page.', 'progress-planner' ),
				'note'        => \__( 'A Contact page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
			],
			'faq'      => [
				'id'          => 'faq',
				'title'       => \__( 'FAQ page', 'progress-planner' ),
				'description' => \__( 'Next, pick the page you use as your FAQ page.', 'progress-planner' ),
				'note'        => \__( 'An FAQ page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
			],
		];

		// Get post types for settings step.
		$post_types           = \progress_planner()->get_settings()->get_public_post_types();
		$post_types_formatted = [];
		foreach ( $post_types as $post_type ) {
			$post_type_obj = \get_post_type_object( $post_type );
			if ( $post_type_obj ) {
				$post_types_formatted[] = [
					'id'    => $post_type,
					'title' => $post_type_obj->labels->name,
				];
			}
		}

		// Check skip_onboarding flag.
		$is_branded      = 0 !== (int) \progress_planner()->get_ui__branding()->get_branding_id();
		$skip_onboarding = \progress_planner()->is_privacy_policy_accepted()
			&& ! \get_option( 'prpl_onboard_progress', false )
			&& ! $is_branded;
		$skip_onboarding = \apply_filters( 'progress_planner_skip_onboarding', $skip_onboarding );

		// Capture logo HTML.
		\ob_start();
		\progress_planner()->get_ui__branding()->the_logo();
		$logo_html = \ob_get_clean();

		// Get current user data for email frequency step.
		$current_user = \wp_get_current_user();

		$config = [
			'enabled'             => ! $skip_onboarding,
			'steps'               => $steps_formatted,
			'savedProgress'       => $saved_progress,
			'ajaxUrl'             => \admin_url( 'admin-ajax.php' ),
			'nonce'               => \wp_create_nonce( 'progress_planner' ),
			'userFirstName'       => $current_user->first_name ? $current_user->first_name : $current_user->display_name,
			'userEmail'           => $current_user->user_email,
			'onboardAPIUrl'       => \progress_planner()->get_utils__onboard()->get_remote_url( 'onboard' ),
			'onboardNonceURL'     => \progress_planner()->get_utils__onboard()->get_remote_url( 'get-nonce' ),
			'site'                => \esc_attr( \set_url_scheme( \site_url() ) ),
			'timezoneOffset'      => (float) ( \wp_timezone()->getOffset( new \DateTime( 'midnight' ) ) / 3600 ),
			'lastStepRedirectUrl' => \esc_url_raw( \admin_url( 'admin.php?page=progress-planner' ) ),
			'hasLicense'          => false !== \progress_planner()->get_license_key(),
			'pages'               => $pages_formatted,
			'postTypes'           => $post_types_formatted,
			'pageTypes'           => $page_types,
			'logoHtml'            => $logo_html,
			'baseUrl'             => \constant( 'PROGRESS_PLANNER_URL' ),
			'privacyPolicyUrl'    => \progress_planner()->get_ui__branding()->get_url( 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ),
			'l10n'                => [
				'next'                  => \esc_html__( 'Next', 'progress-planner' ),
				'startOnboarding'       => \esc_html__( 'Start onboarding', 'progress-planner' ),
				/* translators: %s: Progress Planner name. */
				'privacyPolicyError'    => \sprintf( \esc_html__( 'You need to agree with the privacy policy to use the %s plugin.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) ),
				'dashboard'             => \esc_html__( 'Take me to the dashboard', 'progress-planner' ),
				'backToRecommendations' => \esc_html__( 'Back to recommendations', 'progress-planner' ),
			],
		];

		return new \WP_REST_Response( $config, 200 );
	}
}
