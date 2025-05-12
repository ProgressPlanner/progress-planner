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
			'Progress Planner',
			'Progress Planner' . $this->get_notification_counter(),
			'manage_options',
			$page_identifier,
			[ $this, 'render_page' ],
			'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjggNTAwIj48cGF0aCBmaWxsPSIjMzgyOTZkIiBkPSJNMjE3LjQ2IDE3Mi45YzMuMjEuMTIgNS45NyAxLjc0IDcuNzMgNC4xNS0xLjg3LTEwLjI0LTEwLjY0LTE4LjE3LTIxLjQ4LTE4LjU2LTEyLjUyLS40NS0yMy4wMyA5LjMzLTIzLjQ4IDIxLjg1LS40NSAxMi41MiA5LjMzIDIzLjAzIDIxLjg1IDIzLjQ4IDkuNC4zNCAxNy42Ny01LjEgMjEuNC0xMy4xMy0xLjgzIDEuNTEtNC4xOCAyLjQyLTYuNzQgMi4zMy01LjU1LS4yLTkuODktNC44Ni05LjY5LTEwLjQxLjItNS41NSA0Ljg2LTkuODkgMTAuNDEtOS42OVpNMjQxLjUxIDMwNS44NGMuNTggMS45MiAxLjEzIDMuODYgMS43MyA1Ljc3IDE0LjA0IDQ0Ljk3IDMzLjk0IDg4Ljc1IDU2LjQyIDEyNC4yN2w2Ny43NS0xMzAuMDRoLTEyNS45Wk0yOTcuOTYgMjA1Ljk3YzEyLjEyLTQuNSAyMy41NC03LjE4IDMzLjY0LTguOTYtMjIuNTEtMjIuMjctNjEuMjQtMjcuMDYtNjEuNDctMjcuMDkgMS4yNyA2LjE3LjU4IDE1LjgtMi40NCAyNi40Ni0zLjMgMTEuNjYtOS4zOCAyNC41NC0xOC43IDM1LjQ4LTMuNDUgNC4wNi03LjM2IDcuODMtMTEuNzMgMTEuMTloLjA3di0uMDFjLjE2LjYyLjM4IDEuMi41OCAxLjc5IDIuNzQgOC4yNyA4LjYxIDEzLjc0IDE0LjkzIDE3LjE0IDYuNDggMy40OSAxMy4zNyA0LjgzIDE3LjY4IDQuODMgNi40IDAgMTEuODgtMy43OSAxNC40My05LjIyLjk3LTIuMDYgMS41NS00LjMzIDEuNTUtNi43NiAwLTMuODUtMS40Mi03LjM0LTMuNjktMTAuMS0xLjkyLTIuMzMtNC40Ni00LjA4LTcuMzktNS4wM2w0NC44Mi04LjY1Yy02LjYzLTYuMTItMTQuNzItMTEuNTktMjIuNzMtMTYuMjMtMS45Ny0xLjE0LTEuNjktNC4wNS40NS00Ljg0WiIvPjxwYXRoIGZpbGw9IiNmYWEzMTAiIGQ9Ik0yODEuMzcgNDU4LjM3Yy0yNS43OS0zOC44NC00OC42OC04OC4wNC02NC40NS0xMzguNTQtMS40NS00LjYzLTIuODMtOS4zMS00LjE3LTEzLjk5LTEuMTItMy45NC0yLjIyLTcuODgtMy4yNS0xMS44LTIuMDktNy45Mi05LjI4LTEzLjQ2LTE3LjQ4LTEzLjQ2aC0yNy45NWMtOC4yIDAtMTUuMzkgNS41My0xNy40OCAxMy40NS0yLjI4IDguNjUtNC43OCAxNy4zMi03LjQyIDI1Ljc5LTE1Ljc3IDUwLjUtMzguNjUgOTkuNy02NC40NSAxMzguNTQtNC4wMSA2LjAzLTEuNzggMTEuNjMtLjY0IDEzLjc2IDIuNCA0LjQ3IDYuODYgNy4xNCAxMS45NCA3LjE0aDY2LjAxbDMuOTcgNi45MmM0LjU0IDcuOSAxMi45OSAxMi44MSAyMi4wNSAxMi44MXMxNy41MS00LjkxIDIyLjA2LTEyLjgxbDMuOTgtNi45Mmg2NmMzLjIyIDAgNi4xOS0xLjA4IDguNTUtMy4wMiAxLjM1LTEuMTEgMi41MS0yLjQ5IDMuMzgtNC4xMy41Ny0xLjA3IDEuNDItMy4wMiAxLjYxLTUuNDYuMTktMi40MS0uMjYtNS4zMS0yLjI1LTguMzFaIi8+PHBhdGggZmlsbD0iIzM4Mjk2ZCIgZD0iTTI5NS43IDc2LjA2Yy03LjU0LTEyLjA1LTMyLjM4IDEtNTkuNTQgMi44Ni0xNS4wNCAxLjAzLTM3LjA1LTExMC42My03MS43Ny01Ni45OS0zOS41NiA2MS4xLTc5LjEyLTQ0LjY4LTg4LjY2LTE1LjgzLTIxLjExIDQzLjI3IDI1LjE1IDg0LjYxIDI1LjE1IDg0LjYxcy0xMi44NCA3LjkyLTIwLjYzIDEzLjkzYy01LjQ3IDQuMTctMTAuODIgOC42NS0xNi4wMyAxMy41MS0yMC40NSAxOS4wMy0zNi4wNCA0MC4zMi00Ni43NyA2My44NkM2LjcyIDIwNS41NSAxLjExIDIyOS41OS42MiAyNTQuMTVjLS40OSAyNC41NiA0LjAxIDQ5LjEgMTMuNTQgNzMuNjMgOS41MiAyNC41MyAyNC4xNyA0Ny40MiA0My45NSA2OC42OCA0LjAyIDQuMzIgOC4xMiA4LjQxIDEyLjMxIDEyLjMgNC4xLTYuMzEgNy45Ny0xMi43NCAxMS42NC0xOS4yNiA0LjM5LTcuOCA4LjUtMTUuNzIgMTIuMjUtMjMuNzgtLjMzLS4zNS0uNjYtLjY5LS45OS0xLjAzLS4xNy0uMTgtLjM0LS4zNS0uNTEtLjUzLTE1LjUzLTE2LjY5LTI3LjE3LTM0LjU5LTM0LjkzLTUzLjcyLTcuNzctMTkuMTMtMTEuNS0zOC4yNS0xMS4yLTU3LjM2LjI5LTE5LjEgNC40Ny0zNy42OCAxMi41My01NS43MiA4LjA2LTE4LjA1IDIwLjAyLTM0LjQ1IDM1LjktNDkuMjIgMTMuOTktMTMuMDIgMjguODQtMjIuODMgNDQuNTUtMjkuNDEgMTUuNy02LjU5IDMxLjYzLTkuOTggNDcuNzYtMTAuMTggOS4wNS0uMTEgMTkuMTEgMS4xNSAyOS41MSA0LjUgMTAuMzIgNC4yNyAxOS4yMiA5LjQ0IDI2LjYzIDE1LjM1IDEwLjE5IDguMTMgMTcuNjEgMTcuNjUgMjIuMjIgMjguMSAxLjkxIDQuMzIgMy4zNyA4LjggNC4zMiAxMy40MSAxNi4yNy0yOC4yNyAzNi43NS03NS45NiAyNS41Ny05My44M1oiLz48L3N2Zz4='
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

		$pending_celebration_tasks = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'post_status' => 'pending_celebration' ] );
		$notification_count        = count( $pending_celebration_tasks );

		if ( 0 === $notification_count ) {
			return '';
		}

		/* translators: Hidden accessibility text; %s: number of notifications. */
		$notifications = sprintf( _n( '%s pending celebration', '%s pending celebrations', $notification_count, 'progress-planner' ), number_format_i18n( $notification_count ) );

		return sprintf( '<span class="update-plugins count-%1$d" style="background-color:#f9b23c;color:#38296d;"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>', $notification_count, $notifications );
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
		$suggested_tasks  = \progress_planner()->get_suggested_tasks();
		$tasks_providers  = $suggested_tasks->get_tasks_manager()->get_task_providers();
		$tasks_details    = [];
		$total_points     = 0;
		$completed_points = 0;
		foreach ( $tasks_providers as $provider ) {
			if ( 'configuration' !== $provider->get_provider_category() ) {
				continue;
			}
			$details = $provider->get_task_details();
			if ( ! isset( $details['link_setting']['hook'] ) ||
				$hook !== $details['link_setting']['hook']
			) {
				continue;
			}
			$details['is_complete'] = $provider->is_task_completed();
			$tasks_details[]        = $details;
			$total_points          += $details['points'];
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
					'base_url'        => constant( 'PROGRESS_PLANNER_URL' ),
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
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-tooltip' );

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
