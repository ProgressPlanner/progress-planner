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
			\progress_planner()->get_ui__branding()->get_admin_menu_icon()
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
		$this->maybe_enqueue_focus_el_script( $hook );
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
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-tooltip' );
				// Enqueue prpl-badge web component for React Badge components.
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-badge' );
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

			// Widget scripts depend on dashboard script to ensure widgetRegistry is initialized.
			$widget_dependencies = \array_merge(
				$widget_asset['dependencies'],
				[ 'progress-planner/dashboard' ]
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

		// Localize dashboard config.
		\wp_localize_script(
			'progress-planner/dashboard',
			'prplDashboardConfig',
			[
				'privacyPolicyAccepted' => \progress_planner()->is_privacy_policy_accepted(),
				// Header configuration.
				'licenseKey'            => \progress_planner()->get_license_key() ? \progress_planner()->get_license_key() : 'no-license',
				'branding'              => [
					'logoHtml'         => $logo_html,
					'tourIconHtml'     => $tour_icon_svg ? $tour_icon_svg : '',
					'registerIconHtml' => $register_icon_svg ? $register_icon_svg : '',
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
			]
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
	}

	/**
	 * Enqueue the focus element script.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function maybe_enqueue_focus_el_script( $hook ) {
		// Get all registered task providers from the task manager.
		$tasks_providers  = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_providers();
		$tasks_details    = [];
		$total_points     = 0;
		$completed_points = 0;

		// Filter providers to only those relevant to the current admin page.
		foreach ( $tasks_providers as $provider ) {
			$link_setting = $provider->get_link_setting();

			// Skip tasks that aren't configured for this admin page.
			if ( ! isset( $link_setting['hook'] ) ||
				$hook !== $link_setting['hook']
			) {
				continue;
			}

			// Build task details for JavaScript.
			$details = [
				'link_setting' => $link_setting, // Contains selector, hook, and highlight config.
				'task_id'      => $provider->get_task_id(),
				'points'       => $provider->get_points(),
				'is_complete'  => $provider->is_task_completed(),
			];

			$tasks_details[] = $details;
			$total_points   += $details['points'];
			if ( $details['is_complete'] ) {
				$completed_points += $details['points'];
			}
		}

		// No tasks for this page - don't enqueue the script.
		if ( empty( $tasks_details ) ) {
			return;
		}

		// Enqueue the focus element script with task data.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'focus-element',
			[
				'name' => 'progressPlannerFocusElement',
				'data' => [
					'tasks'           => $tasks_details,
					'totalPoints'     => $total_points,
					'completedPoints' => $completed_points,
					'base_url'        => \constant( 'PROGRESS_PLANNER_URL' ),
					'l10n'            => [
						/* translators: %d: The number of points. */
						'fixThisIssue' => \esc_html__( 'Fix this issue to get %d point(s) in Progress Planner', 'progress-planner' ),
					],
				],
			]
		);
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/focus-element' );
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
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-tooltip' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-install-plugin' );

		if ( 'toplevel_page_progress-planner' === $current_screen->id ) {
			// Enqueue ugprading (onboarding) tasks styles, these are needed both when privacy policy is accepted and when it is not.
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/upgrade-tasks' );
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
