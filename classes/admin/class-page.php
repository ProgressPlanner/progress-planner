<?php
/**
 * Admin page class.
 *
 * Since the wp-admin-ui extraction, the kit's PageRegistrar owns menu
 * registration and page rendering. This class provides:
 *
 * - The widget registry ({@see get_widgets()}), consumed by the kit at
 *   render time via {@see Admin_UI_Kit_Integration::boot()}.
 * - Widget-specific asset enqueue on the kit's page (the kit handles
 *   tokens + layout + masonry itself).
 * - Focus-element script hookups for task providers (fires on any admin
 *   page, not just Progress Planner's).
 * - Miscellaneous admin-area polish: notice stripping, activity-scores
 *   cache invalidation, menu-bubble CSS tweak.
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
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'in_admin_header', [ $this, 'remove_admin_notices' ], PHP_INT_MAX );

		// Clear the cache for the activity scores widget.
		\add_action( 'progress_planner_activity_saved', [ $this, 'clear_activity_scores_cache' ] );
		\add_action( 'progress_planner_activity_deleted', [ $this, 'clear_activity_scores_cache' ] );

		// Add a custom admin footer (notification-bubble positioning).
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
			\progress_planner()->get_admin__widgets__todo(),
			\progress_planner()->get_admin__widgets__monthly_badges(),
			\progress_planner()->get_admin__widgets__badge_streak_content(),
			\progress_planner()->get_admin__widgets__badge_streak_maintenance(),
			\progress_planner()->get_admin__widgets__challenge(),
			\progress_planner()->get_admin__widgets__activity_scores(),
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
		return \apply_filters( 'progress_planner_admin_widgets', $widgets ); // @phpstan-ignore-line parameter.phpDocType
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
	 * Enqueue widget-specific scripts/styles on the kit's admin page.
	 *
	 * The kit handles tokens + layout + masonry; this method only
	 * enqueues the bits specific to progress-planner's widgets.
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

		$default_localization_data = [
			'name' => 'progressPlanner',
			'data' => [
				'onboardNonceURL' => \progress_planner()->get_utils__onboard()->get_remote_url( 'get-nonce' ),
				'onboardAPIUrl'   => \progress_planner()->get_utils__onboard()->get_remote_url( 'onboard' ),
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
			\progress_planner()->get_admin__enqueue()->enqueue_script( 'upgrade-tasks' );
		} else {
			\progress_planner()->get_admin__enqueue()->enqueue_script( 'onboard', $default_localization_data );
		}

		\progress_planner()->get_admin__enqueue()->enqueue_script( 'external-link-accessibility-helper' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-tooltip' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/web-components/prpl-install-plugin' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/upgrade-tasks' );

		if ( ! \progress_planner()->is_privacy_policy_accepted() ) {
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/welcome' );
			\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/onboard' );
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
					'iconUrl'         => \progress_planner()->get_ui__branding()->get_admin_menu_icon(),
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
	 * Remove all admin notices when the user is on the Progress Planner page.
	 *
	 * @return void
	 */
	public function remove_admin_notices() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}
		if ( 'toplevel_page_progress-planner' !== $current_screen->id ) {
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
	 * Add a custom admin footer — positions the notification bubble on
	 * the top-level menu item.
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
