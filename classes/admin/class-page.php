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
	 * Get the widgets objects
	 *
	 * @return array<\Progress_Planner\Admin\Widgets\Widget>
	 */
	public function get_widgets() {
		$widgets = [
			\progress_planner()->get_admin__widgets__suggested_tasks(),
			\progress_planner()->get_admin__widgets__activity_scores(),
			\progress_planner()->get_admin__widgets__todo(),
			\progress_planner()->get_admin__widgets__challenge(),
			\progress_planner()->get_admin__widgets__latest_badge(),
			\progress_planner()->get_admin__widgets__badge_streak(),
			\progress_planner()->get_admin__widgets__content_activity(),
			\progress_planner()->get_admin__widgets__whats_new(),
		];

		/**
		 * Filter the widgets.
		 *
		 * @param array<\Progress_Planner\Admin\Widgets\Widget> $widgets The widgets.
		 *
		 * @return array<\Progress_Planner\Admin\Widgets\Widget>
		 */
		return \apply_filters( 'progress_planner_admin_widgets', $widgets );
	}

	/**
	 * Get a widget object.
	 *
	 * @param string $id The widget ID.
	 *
	 * @return \Progress_Planner\Admin\Widgets\Widget|void
	 */
	public function get_widget( $id ) {
		$widgets = $this->get_widgets();
		foreach ( $widgets as $widget ) {
			if ( $widget->get_id() === $id ) {
				return $widget;
			}
		}
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

		return \sprintf( '<span class="update-plugins count-%1$d" style="background-color:#f9b23c;color:#38296d;"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>', $notification_count, $notifications );
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
		if ( 'toplevel_page_progress-planner' !== $hook && 'progress-planner_page_progress-planner-settings' !== $hook ) {
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
					'onboardNonceURL' => \progress_planner()->get_utils__onboard()->get_remote_nonce_url(),
					'onboardAPIUrl'   => \progress_planner()->get_utils__onboard()->get_remote_url(),
					'ajaxUrl'         => \admin_url( 'admin-ajax.php' ),
					'nonce'           => \wp_create_nonce( 'progress_planner' ),
				],
			];

			if ( true === \progress_planner()->is_privacy_policy_accepted() ) {
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-gauge' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-badge-progress-bar' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-chart-bar' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-chart-line' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-big-counter' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'web-components/prpl-tooltip' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'header-filters', $default_localization_data );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'settings', $default_localization_data );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'grid-masonry' );
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'upgrade-tasks' );
			} else {
				\progress_planner()->get_admin__enqueue()->enqueue_script( 'onboard', $default_localization_data );
			}

			\progress_planner()->get_admin__enqueue()->enqueue_script( 'external-link-accessibility-helper' );
		}

		if ( 'progress-planner_page_progress-planner-settings' === $current_screen->id ) {
			\progress_planner()->get_admin__enqueue()->enqueue_script(
				'settings-page',
				[
					'name' => 'progressPlannerSettingsPage',
					'data' => [
						'siteUrl' => \get_site_url(),
					],
				]
			);

			\progress_planner()->get_admin__enqueue()->enqueue_script( 'external-link-accessibility-helper' );
		}
	}

	/**
	 * Enqueue the focus element script.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function maybe_enqueue_focus_el_script( $hook ) {
		$tasks_providers  = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_providers();
		$tasks_details    = [];
		$total_points     = 0;
		$completed_points = 0;
		foreach ( $tasks_providers as $provider ) {
			if ( 'configuration' !== $provider->get_provider_category() ) {
				continue;
			}

			$link_setting = $provider->get_link_setting();
			if ( ! isset( $link_setting['hook'] ) ||
				$hook !== $link_setting['hook']
			) {
				continue;
			}

			$details = [
				'link_setting' => $link_setting,
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

		if ( empty( $tasks_details ) ) {
			return;
		}

		// Register the scripts.
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

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/admin' );
		if ( ! static::$branding_inline_styles_added ) {
			\wp_add_inline_style( 'progress-planner/admin', \progress_planner()->get_ui__branding()->get_css_variables() );
			\wp_add_inline_style( 'progress-planner/admin', \progress_planner()->get_ui__branding()->get_custom_css() );
			static::$branding_inline_styles_added = true;
		}
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-tooltip' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-install-plugin' );

		if ( 'progress-planner_page_progress-planner-settings' === $current_screen->id ) {
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/settings-page' );
		}

		if ( 'toplevel_page_progress-planner' === $current_screen->id ) {
			// Enqueue ugprading (onboarding) tasks styles, these are needed both when privacy policy is accepted and when it is not.
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/upgrade-tasks' );
		}

		$prpl_privacy_policy_accepted = \progress_planner()->is_privacy_policy_accepted();
		if ( ! $prpl_privacy_policy_accepted ) {
			// Enqueue welcome styles.
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/welcome' );

			// Enqueue onboarding styles.
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/onboard' );
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
				'progress-planner_page_progress-planner-settings',
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
		\progress_planner()->get_settings()->set( \progress_planner()->get_admin__widgets__activity_scores()->get_cache_key(), [] );
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
