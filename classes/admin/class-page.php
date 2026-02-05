<?php
/**
 * Create the admin page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Admin page class.
 */
class Page {

	/**
	 * REST API paths to preload for dashboard performance.
	 *
	 * These endpoints are fetched server-side and injected into the page
	 * to eliminate initial API request waterfalls.
	 *
	 * @var string[]
	 */
	private const PRELOAD_PATHS = [
		// Core dashboard data.
		'/progress-planner/v1/activities',
		'/progress-planner/v1/badge-stats',
		'/wp/v2/settings',

		// Tasks - main prefetch for taskRegistry (all statuses for completion tracking).
		'/wp/v2/prpl_recommendations?status=publish,trash,future&per_page=100&_embed=true',
		'/wp/v2/prpl_recommendations_provider?per_page=100',

		// SuggestedTasks - pending celebration tasks.
		'/wp/v2/prpl_recommendations?status=pending&per_page=100&page=1&_embed=true&filter%5Borderby%5D=menu_order&filter%5Border%5D=ASC&exclude_provider=user',

		// TodoWidget - user tasks (publish and trash).
		'/wp/v2/prpl_recommendations?status=publish&per_page=100&page=1&_embed=true&filter%5Borderby%5D=menu_order&filter%5Border%5D=ASC&provider=user',
		'/wp/v2/prpl_recommendations?status=trash&per_page=100&page=1&_embed=true&filter%5Borderby%5D=menu_order&filter%5Border%5D=ASC&provider=user',
		'/progress-planner/v1/page-settings',

		// Data-collectors for task evaluation.
		'/progress-planner/v1/data-collectors/hello_world_post_id',
		'/progress-planner/v1/data-collectors/sample_page_id',
		'/progress-planner/v1/data-collectors/inactive_plugins_count',
		'/progress-planner/v1/data-collectors/uncategorized_category_id',
		'/progress-planner/v1/data-collectors/post_author_count',
		'/progress-planner/v1/data-collectors/last_published_post_id',
		'/progress-planner/v1/data-collectors/archive_format_count',
		'/progress-planner/v1/data-collectors/terms_without_posts',
		'/progress-planner/v1/data-collectors/terms_without_description',
		'/progress-planner/v1/data-collectors/post_tag_count',
		'/progress-planner/v1/data-collectors/published_post_count',
		'/progress-planner/v1/data-collectors/unpublished_content',
		'/progress-planner/v1/data-collectors/seo_plugin_installed',
		'/progress-planner/v1/data-collectors/php_version',
		'/progress-planner/v1/data-collectors/wp_debug_status',
		'/progress-planner/v1/data-collectors/old_posts_for_review',

		// Popovers and misc.
		'/wp/v2/updates',
		'/progress-planner/v1/timezone-options',
		// Note: onboarding-wizard/config is NOT preloaded because React needs to
		// create onboarding tasks first before fetching the config.
	];

	/**
	 * Whether the branding inline styles have been added.
	 *
	 * @var boolean
	 */
	protected static $branding_inline_styles_added = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register the hooks.
	 *
	 * @return void
	 */
	private function register_hooks() {
		\add_action( 'admin_menu', [ $this, 'add_page' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'in_admin_header', [ $this, 'remove_admin_notices' ], PHP_INT_MAX );

		// Clear the cache for the activity scores widget.
		\add_action( 'progress_planner_activity_saved', [ $this, 'clear_activity_scores_cache' ] );
		\add_action( 'progress_planner_activity_deleted', [ $this, 'clear_activity_scores_cache' ] );

		// Add a custom admin footer.
		\add_action( 'admin_footer', [ $this, 'admin_footer' ] );
	}


	/**
	 * Add the admin page.
	 *
	 * @return void
	 */
	public function add_page() {
		global $admin_page_hooks;

		$page_identifier = 'progress-planner';

		\add_menu_page(
			\progress_planner()->get_ui__branding()->get_admin_submenu_name(),
			\progress_planner()->get_ui__branding()->get_admin_menu_name() . $this->get_notification_counter(),
			'manage_options',
			$page_identifier,
			'__return_empty_string',
			\progress_planner()->get_ui__branding()->get_admin_menu_icon(),
			\progress_planner()->get_ui__branding()->get_admin_submenu_position()
		);

		\add_submenu_page(
			$page_identifier,
			\progress_planner()->get_ui__branding()->get_admin_submenu_name(),
			\progress_planner()->get_ui__branding()->get_admin_submenu_name() . $this->get_notification_counter(),
			'manage_options',
			$page_identifier,
			[ $this, 'render_page' ],
		);

		// Wipe notification bits from hooks.
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride -- This is a deliberate action.
		$admin_page_hooks[ $page_identifier ] = $page_identifier;
	}

	/**
	 * Returns the notification count in HTML format.
	 *
	 * @return string The notification count in HTML format.
	 */
	protected function get_notification_counter() {
		$notification_count = \wp_count_posts( 'prpl_recommendations' )->pending;

		if ( 0 === $notification_count ) {
			return '';
		}

		/* translators: Hidden accessibility text; %s: number of notifications. */
		$notifications = \sprintf( \_n( '%s pending celebration', '%s pending celebrations', $notification_count, 'progress-planner' ), \number_format_i18n( $notification_count ) );

		return \sprintf( '<span class="update-plugins count-%1$d" style="background-color:var(--prpl-background-banner);color:#38296d;"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>', $notification_count, $notifications );
	}

	/**
	 * Render the admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		\progress_planner()->the_view( 'admin-page.php' );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'toplevel_page_progress-planner' !== $hook ) {
			return;
		}

		$this->enqueue_scripts();
		$this->enqueue_styles();
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}

		if ( 'toplevel_page_progress-planner' === $current_screen->id ) {
			$default_localization_data = [
				'name' => 'progressPlanner',
				'data' => [
					'onboardNonceURL' => \progress_planner()->get_utils__onboard()->get_remote_url( 'get-nonce' ),
					'onboardAPIUrl'   => \progress_planner()->get_utils__onboard()->get_remote_url( 'onboard' ),
					'ajaxUrl'         => \admin_url( 'admin-ajax.php' ),
					'nonce'           => \wp_create_nonce( 'progress_planner' ),
				],
			];

			// Always enqueue dashboard - React handles both welcome and dashboard states.
			$this->enqueue_dashboard_script();

			if ( true === \progress_planner()->is_privacy_policy_accepted() ) {
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'settings', $default_localization_data );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'upgrade-tasks' );
			}

			\progress_planner()->get_admin__enqueue()->enqueue_script( 'external-link-accessibility-helper' );
		}
	}

	/**
	 * Enqueue the unified dashboard React script and widget entry points.
	 *
	 * @return void
	 */
	private function enqueue_dashboard_script() {
		$asset_file = \PROGRESS_PLANNER_DIR . '/build/dashboard.asset.php';
		if ( ! \file_exists( $asset_file ) ) {
			return;
		}
		$asset = include $asset_file;

		// Enqueue main dashboard script.
		\wp_enqueue_script(
			'progress-planner/dashboard',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/dashboard.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Enqueue dashboard styles (includes FormInputs component styles).
		\wp_enqueue_style(
			'progress-planner/dashboard',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/dashboard.css',
			[],
			$asset['version']
		);

		// Preload REST API data to eliminate initial API request waterfalls.
		// Must be called after script is enqueued but before it runs.
		$this->preload_rest_data();

		// Enqueue webpack runtime (shared across all entry points).
		// This ensures modules like Zustand store are instantiated only once.
		$runtime_asset_file = \PROGRESS_PLANNER_DIR . '/build/runtime.asset.php';
		if ( \file_exists( $runtime_asset_file ) ) {
			$runtime_asset = include $runtime_asset_file;
			\wp_enqueue_script(
				'progress-planner/runtime',
				\constant( 'PROGRESS_PLANNER_URL' ) . '/build/runtime.js',
				$runtime_asset['dependencies'],
				$runtime_asset['version'],
				true
			);
		}

		// Enqueue individual widget scripts.
		$widget_scripts = [
			'widget-suggested-tasks',
			'widget-todo',
			'widget-monthly-badges',
			'widget-streak-badges',
			'widget-content-badges',
			'widget-activity-scores',
			'widget-content-activity',
			'widget-whats-new',
		];

		foreach ( $widget_scripts as $script_handle ) {
			$widget_asset_file = \PROGRESS_PLANNER_DIR . '/build/' . $script_handle . '.asset.php';
			if ( ! \file_exists( $widget_asset_file ) ) {
				continue;
			}
			$widget_asset = include $widget_asset_file;

			// Widget scripts depend on dashboard and runtime to ensure shared modules.
			$widget_dependencies = \array_merge(
				$widget_asset['dependencies'],
				[ 'progress-planner/dashboard', 'progress-planner/runtime' ]
			);

			\wp_enqueue_script(
				'progress-planner/' . $script_handle,
				\constant( 'PROGRESS_PLANNER_URL' ) . '/build/' . $script_handle . '.js',
				$widget_dependencies,
				$widget_asset['version'],
				true
			);
		}

		// Get header configuration.
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$current_range     = isset( $_GET['range'] )
			? \sanitize_text_field( \wp_unslash( $_GET['range'] ) )
			: '-6 months';
		$current_frequency = isset( $_GET['frequency'] )
			? \sanitize_text_field( \wp_unslash( $_GET['frequency'] ) )
			: 'monthly';
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		// Get logo HTML using output buffering.
		\ob_start();
		\progress_planner()->get_ui__branding()->the_logo();
		$logo_html = \ob_get_clean();

		// Get tour icon SVG.
		$tour_icon_svg = \progress_planner()->get_asset( 'images/icon_tour.svg' );

		// Get register/subscribe icon SVG.
		$register_icon_svg = \progress_planner()->get_asset( 'images/register_icon.svg' );

		// Get progress icon SVG for welcome page.
		$progress_icon_svg = \progress_planner()->get_asset( 'images/icon_progress_planner.svg' );

		// Get current user data for welcome/onboarding form.
		$current_user = \wp_get_current_user();

		// Localize dashboard config.
		$dashboard_config = [
			'privacyPolicyAccepted' => \progress_planner()->is_privacy_policy_accepted(),
			// Header configuration.
			'licenseKey'            => \progress_planner()->get_license_key() ? \progress_planner()->get_license_key() : 'no-license',
			// Welcome/onboarding configuration.
			'onboardNonceURL'       => \progress_planner()->get_utils__onboard()->get_remote_url( 'get-nonce' ),
			'onboardAPIUrl'         => \progress_planner()->get_utils__onboard()->get_remote_url( 'onboard' ),
			'ajaxUrl'               => \admin_url( 'admin-ajax.php' ),
			'nonce'                 => \wp_create_nonce( 'progress_planner' ),
			'userFirstName'         => $current_user->user_firstname,
			'userEmail'             => $current_user->user_email,
			'siteUrl'               => \site_url(),
			'timezoneOffset'        => (float) \get_option( 'gmt_offset', 0 ),
			'baseUrl'               => \constant( 'PROGRESS_PLANNER_URL' ),
			'branding'              => [
				'logoHtml'         => $logo_html,
				'tourIconHtml'     => $tour_icon_svg ? $tour_icon_svg : '',
				'registerIconHtml' => $register_icon_svg ? $register_icon_svg : '',
				'progressIconHtml' => $progress_icon_svg ? $progress_icon_svg : '',
				'homeUrl'          => \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/home' ),
				'privacyPolicyUrl' => \progress_planner()->get_ui__branding()->get_url( 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ),
			],
			'currentRange'          => $current_range,
			'currentFrequency'      => $current_frequency,
			'rangeOptions'          => [
				[
					'value' => '-3 months',
					'label' => \__( 'Activity over the past 3 months', 'progress-planner' ),
				],
				[
					'value' => '-6 months',
					'label' => \__( 'Activity over the past 6 months', 'progress-planner' ),
				],
				[
					'value' => '-12 months',
					'label' => \__( 'Activity over the past 12 months', 'progress-planner' ),
				],
				[
					'value' => '-18 months',
					'label' => \__( 'Activity over the past 18 months', 'progress-planner' ),
				],
				[
					'value' => '-24 months',
					'label' => \__( 'Activity over the past 24 months', 'progress-planner' ),
				],
			],
			'frequencyOptions'      => [
				[
					'value' => 'weekly',
					'label' => \__( 'Weekly', 'progress-planner' ),
				],
				[
					'value' => 'monthly',
					'label' => \__( 'Monthly', 'progress-planner' ),
				],
			],
		];

		// Apply filter to allow Onboard_Wizard to add wizard config.
		$dashboard_config = \apply_filters( 'progress_planner_dashboard_config', $dashboard_config );

		\wp_localize_script(
			'progress-planner/dashboard',
			'prplDashboardConfig',
			$dashboard_config
		);

		// Localize celebration data for confetti.
		$confetti_options = [];
		// Check if current date is between Feb 12-16 to use hearts confetti.
		// February 12 will be (string) '0212', and when converted to int it will be 212.
		// February 16 will be (string) '0216', and when converted to int it will be 216.
		// The integer conversion makes it easier and faster to compare the dates.
		$date_md = (int) \gmdate( 'md' );

		if ( 212 <= $date_md && $date_md <= 216 ) {
			$confetti_options = [
				[
					'particleCount' => 50,
					'scalar'        => 2.2,
					'shapes'        => [ 'heart' ],
					'colors'        => [ 'FFC0CB', 'FF69B4', 'FF1493', 'C71585' ],
				],
				[
					'particleCount' => 20,
					'scalar'        => 3.2,
					'shapes'        => [ 'heart' ],
					'colors'        => [ 'FFC0CB', 'FF69B4', 'FF1493', 'C71585' ],
				],
			];
		}

		$celebration_data = [
			'raviIconUrl'     => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_progress_planner.svg',
			'confettiOptions' => $confetti_options,
		];

		// Get badge URLs from enqueue class.
		$enqueue    = \progress_planner()->get_admin__enqueue();
		$badge_urls = $enqueue->get_badge_urls();
		foreach ( $badge_urls as $context => $url ) {
			$celebration_data[ $context . 'IconUrl' ] = $url;
		}

		\wp_localize_script(
			'progress-planner/dashboard',
			'prplCelebrate',
			$celebration_data
		);

		// Localize badge configuration for React Badge component.
		\wp_localize_script(
			'progress-planner/dashboard',
			'progressPlannerBadge',
			[
				'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
				'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
			]
		);
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/variables-color' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/admin' );
		if ( ! static::$branding_inline_styles_added ) {
			\wp_add_inline_style( 'progress-planner/admin', \progress_planner()->get_ui__branding()->get_custom_css() );
			static::$branding_inline_styles_added = true;
		}
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-install-plugin' );

		if ( 'toplevel_page_progress-planner' === $current_screen->id ) {
			// Enqueue upgrading (onboarding) tasks styles, these are needed both when privacy policy is accepted and when it is not.
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/upgrade-tasks' );
			// Enqueue onboarding wizard CSS.
			\wp_enqueue_style(
				'progress-planner-onboarding',
				\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/onboarding/onboarding.css',
				[],
				\progress_planner()->get_plugin_version()
			);
		}
	}

	/**
	 * Remove all admin notices when the user is on the Progress Planner page.
	 *
	 * @return void
	 */
	public function remove_admin_notices() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}
		if ( ! \in_array(
			$current_screen->id,
			[
				'toplevel_page_progress-planner',
			],
			true
		) ) {
			return;
		}

		\remove_all_actions( 'admin_notices' );
		\remove_all_actions( 'all_admin_notices' );
	}

	/**
	 * Get REST API paths to preload for dashboard.
	 *
	 * Combines static paths from PRELOAD_PATHS constant with dynamic paths
	 * that depend on URL parameters.
	 *
	 * @return string[] Array of REST API paths to preload.
	 */
	private function get_preload_paths(): array {
		// Get current range/frequency from URL params or defaults.
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$current_range     = isset( $_GET['range'] )
			? \sanitize_text_field( \wp_unslash( $_GET['range'] ) )
			: '-6 months';
		$current_frequency = isset( $_GET['frequency'] )
			? \sanitize_text_field( \wp_unslash( $_GET['frequency'] ) )
			: 'monthly';
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		// Merge static paths with dynamic activity-scores path.
		$preload_paths   = self::PRELOAD_PATHS;
		$preload_paths[] = '/progress-planner/v1/widgets/activity-scores?range=' . \rawurlencode( $current_range ) . '&frequency=' . \rawurlencode( $current_frequency );
		return $preload_paths;
	}

	/**
	 * Preload REST API data and inject into page.
	 *
	 * Fetches critical REST API data server-side and injects it as inline JSON.
	 * JavaScript middleware then intercepts apiFetch calls and returns this
	 * preloaded data instantly, bypassing network requests.
	 *
	 * @return void
	 */
	private function preload_rest_data(): void {
		$paths        = $this->get_preload_paths();
		$preload_data = [];

		foreach ( $paths as $path ) {
			// Parse the path to separate route from query params.
			$parsed     = \wp_parse_url( $path );
			$route_path = \is_array( $parsed ) && isset( $parsed['path'] ) ? $parsed['path'] : $path;

			// Create REST request.
			$request = new \WP_REST_Request( 'GET', $route_path );

			// Set query params if present.
			if ( ! empty( $parsed['query'] ) ) {
				\parse_str( $parsed['query'], $query_params );
				foreach ( $query_params as $key => $value ) {
					$request->set_param( $key, $value );
				}
			}

			// Execute the request internally.
			$response = \rest_do_request( $request );

			// Only store successful responses.
			if ( ! $response->is_error() ) {
				// Use the full path (with query params) as the key for JS to match.
				$preload_data[ $path ] = [
					'body'    => $response->get_data(),
					'headers' => $response->get_headers(),
				];
			}
		}

		// Inject preloaded data as inline script BEFORE the dashboard script runs.
		if ( ! empty( $preload_data ) ) {
			\wp_add_inline_script(
				'progress-planner/dashboard',
				'window.prplPreloadedData = ' . \wp_json_encode( $preload_data ) . ';',
				'before'
			);
		}
	}

	/**
	 * Clear the cache.
	 *
	 * @param \Progress_Planner\Activities\Activity $activity The activity.
	 *
	 * @return void
	 */
	public function clear_activity_scores_cache( $activity ) {
		if ( 'content' !== $activity->category ) {
			return;
		}

		// Clear the cache for the activity scores widget.
		\progress_planner()->get_settings()->set( 'activities_weekly_post_record', [] );
	}

	/**
	 * Add a custom admin footer.
	 *
	 * @return void
	 */
	public function admin_footer() {
		?>
		<style>
			#toplevel_page_progress-planner {
				position: relative;
				.update-plugins {
					position: absolute;
					left: 18px;
					bottom: 0px;
					min-width: 15px;
					height: 15px;
					line-height: 1.5;
				}

				.wp-submenu {
					.update-plugins {
						display: none;
					}
				}
			}
		</style>
		<?php
	}
}
