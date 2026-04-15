<?php
/**
 * Assets class.
 *
 * Since Phase 3A of the wp-admin-ui extraction, this class is a thin
 * adapter around {@see \ProgressPlanner\AdminUI\Assets\AssetEnqueuer}.
 * Script/style resolution, dependency parsing, and mtime versioning
 * all live in the kit now. This class only retains:
 *
 * - Progress Planner-specific vendor-script handling (particles-confetti,
 *   driver.js) that doesn't fit the kit's generic {prefix}/{handle} model.
 * - `localize_script()` with its domain-specific switch (badges, tasks,
 *   celebrate), which will keep living here for the foreseeable future.
 * - `maybe_empty_session_storage()` — a Progress Planner admin-head shim.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Badges\Monthly;
use ProgressPlanner\AdminUI\Assets\AssetEnqueuer;

/**
 * Enqueue class.
 */
class Enqueue {

	/**
	 * Vendor scripts.
	 *
	 * Internal file-path stem → { WP handle, hard-coded version }. These
	 * don't live at /assets/js/{handle}.js so they can't go through the
	 * kit's generic resolver.
	 *
	 * @var array<string,array{handle:string,version:string}>
	 */
	const VENDOR_SCRIPTS = [
		'vendor/tsparticles.confetti.bundle.min' => [
			'handle'  => 'particles-confetti',
			'version' => '2.11.0',
		],
		'vendor/driver.js.iife'                  => [
			'handle'  => 'driver',
			'version' => '1.3.1',
		],
	];

	/**
	 * Shared kit enqueuer — single instance per Enqueue instance.
	 *
	 * @var AssetEnqueuer|null
	 */
	private $kit_enqueuer = null;

	/**
	 * Vendor handles already enqueued (guards against double enqueue).
	 *
	 * @var array<string,true>
	 */
	private $registered_vendors = [];

	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'admin_head', [ $this, 'maybe_empty_session_storage' ], 1 );
	}

	/**
	 * Lazily build the kit enqueuer.
	 *
	 * handle_prefix is set to 'progress-planner' so existing `Dependencies:
	 * progress-planner/foo` file headers across the plugin round-trip
	 * cleanly through the kit's resolver.
	 *
	 * version_strategy delegates to Progress_Planner\Base::get_file_version()
	 * so debug-mode behavior is preserved.
	 */
	private function get_kit_enqueuer(): AssetEnqueuer {
		if ( null === $this->kit_enqueuer ) {
			$this->kit_enqueuer = new AssetEnqueuer(
				'progress-planner',
				[
					[
						'path' => \constant( 'PROGRESS_PLANNER_DIR' ) . '/assets',
						'url'  => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets',
					],
				],
				static function ( $file_path ) {
					return \progress_planner()->get_file_version( $file_path );
				}
			);

			// Register vendor bundles as external handles with a resolver.
			// When the kit encounters them as a dep of another script, the
			// resolver fires and we wp_enqueue_script() the vendor file —
			// keeping loads lazy.
			foreach ( self::VENDOR_SCRIPTS as $file_handle => $vendor_meta ) {
				$resolver = function () use ( $file_handle, $vendor_meta ): void {
					$this->enqueue_vendor_script( $file_handle, $vendor_meta );
				};
				$this->kit_enqueuer->register_external( $vendor_meta['handle'], $resolver );
			}
		}

		return $this->kit_enqueuer;
	}

	/**
	 * Enqueue script.
	 *
	 * @param string $handle        The handle of the script to enqueue.
	 * @param array  $localize_data The data to localize.
	 *                                 [
	 *                                     'name' => 'varName',
	 *                                     'data' => [
	 *                                         'foo' => 'bar',
	 *                                     ],
	 *                                 ].
	 * @return void
	 */
	public function enqueue_script( $handle, $localize_data = [] ) {
		$lookup = $handle;
		if ( \str_starts_with( $lookup, 'progress-planner/' ) ) {
			$lookup = \substr( $lookup, \strlen( 'progress-planner/' ) );
		}

		// Vendor scripts use a fixed path/version — enqueue them directly.
		foreach ( self::VENDOR_SCRIPTS as $file_handle => $vendor_meta ) {
			if ( $vendor_meta['handle'] === $lookup || $file_handle === $lookup ) {
				$this->enqueue_vendor_script( $file_handle, $vendor_meta );
				$this->localize_script( $vendor_meta['handle'], $localize_data );
				return;
			}
		}

		// Everything else goes through the kit.
		$this->get_kit_enqueuer()->enqueue_script( $handle );

		// Pass the kit-prefixed handle to localize_script() so existing
		// switch-cases match (they already use 'progress-planner/xxx').
		$this->localize_script( 'progress-planner/' . $lookup, $localize_data );
	}

	/**
	 * Enqueue a style.
	 *
	 * @param string $handle The handle of the style to enqueue.
	 *
	 * @return void
	 */
	public function enqueue_style( $handle ) {
		$this->get_kit_enqueuer()->enqueue_style( $handle );
	}

	/**
	 * Enqueue a vendor script (plain wp_enqueue_script, no dep resolution).
	 *
	 * @param string                                $file_handle The internal file stem, e.g. 'vendor/driver.js.iife'.
	 * @param array{handle:string,version:string}   $vendor_meta Handle + version.
	 */
	private function enqueue_vendor_script( $file_handle, $vendor_meta ): void {
		if ( isset( $this->registered_vendors[ $vendor_meta['handle'] ] ) ) {
			return;
		}
		$this->registered_vendors[ $vendor_meta['handle'] ] = true;

		\wp_enqueue_script(
			$vendor_meta['handle'],
			\constant( 'PROGRESS_PLANNER_URL' ) . "/assets/js/{$file_handle}.js",
			[],
			$vendor_meta['version'],
			true
		);
	}

	/**
	 * Localize a script.
	 *
	 * @param string $handle        The script handle.
	 * @param array  $localize_data The data to localize.
	 * @return void
	 */
	public function localize_script( $handle, $localize_data = [] ) {
		$localize_data = [
			'name' => $localize_data['name'] ?? false,
			'data' => $localize_data['data'] ?? [],
		];
		switch ( $handle ) {
			case 'progress-planner/l10n':
				$localize_data = [
					'name' => 'prplL10nStrings',
					'data' => $this->get_localized_strings(),
				];
				break;

			case 'progress-planner/web-components/prpl-badge':
				$localize_data = [
					'name' => 'progressPlannerBadge',
					'data' => [
						'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
						'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
					],
				];
				break;

			case 'progress-planner/suggested-task':
				// Celebrate only on the Progress Planner Dashboard page.
				$delay_celebration = true;
				if ( \progress_planner()->is_on_progress_planner_dashboard_page() ) {
					// should_show_upgrade_popover() also checks if we're on the Progress Planner Dashboard page - but let's be explicit since that method might change in the future.
					$delay_celebration = \progress_planner()->get_plugin_upgrade_tasks()->should_show_upgrade_popover();
				}

				// Get the providers available for the user.
				$include_providers            = [];
				$providers_available_for_user = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_providers_available_for_user();
				foreach ( $providers_available_for_user as $provider ) {
					// Skip user provider.
					if ( 'user' === $provider->get_provider_id() ) {
						continue;
					}
					$include_providers[] = $provider->get_provider_id();
				}

				// Check if user wants to see all recommendations.
				$show_all_recommendations = isset( $_GET['prpl_show_all_recommendations'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$tasks_per_page           = $show_all_recommendations ? -1 : \Progress_Planner\Admin\Widgets\Suggested_Tasks::get_per_page();

				// Get tasks from task providers (limited to 5 by default, or unlimited if showing all).
				$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format(
					[
						'post_status'      => 'publish',
						'posts_per_page'   => $tasks_per_page,
						'include_provider' => $include_providers, // User provider is already excluded.
					]
				);
				// Get pending celebration tasks.
				$pending_celebration_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format(
					[
						'post_status'      => 'pending',
						'posts_per_page'   => 100,
						'include_provider' => $include_providers, // User provider is already excluded.
					]
				);

				// Get user tasks.
				$user_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format(
					[
						'post_status'      => [ 'publish', 'trash' ],
						'include_provider' => [ 'user' ],
					]
				);

				$localize_data = [
					'name' => 'prplSuggestedTask',
					'data' => [
						'nonce'            => \wp_create_nonce( 'progress_planner' ),
						'assets'           => [
							'infoIcon'   => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_info.svg',
							'snoozeIcon' => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_snooze.svg',
						],
						'tasks'            => [
							'pendingTasks'            => $tasks,
							'pendingCelebrationTasks' => $pending_celebration_tasks,
							'userTasks'               => $user_tasks,
						],
						'delayCelebration' => $delay_celebration,
						'tasksPerPage'     => $tasks_per_page,
						'perPageDefault'   => \Progress_Planner\Admin\Widgets\Suggested_Tasks::get_per_page(),
					],
				];
				break;

			case 'progress-planner/celebrate':
				// Check if current date is between Feb 12-16 to use hearts confetti.
				$confetti_options = [];
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
				$localize_data = [
					'name' => 'prplCelebrate',
					'data' => [
						'raviIconUrl'     => \progress_planner()->get_ui__branding()->get_admin_menu_icon(),
						'confettiOptions' => $confetti_options,
					],
				];

				foreach ( $this->get_badge_urls() as $context => $url ) {
					$localize_data['data'][ $context . 'IconUrl' ] = $url;
				}
				break;
		}

		if ( ! $localize_data['name'] ) {
			return;
		}

		\wp_localize_script( $handle, $localize_data['name'], $localize_data['data'] );
	}

	/**
	 * Get the badge URLs.
	 *
	 * @return string[] The badge URLs.
	 */
	private function get_badge_urls() {
		// Get the monthly badge URL.
		$monthly_badge = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );

		if ( $monthly_badge ) {
			$badge_urls['month'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $monthly_badge->get_id() . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
		}

		// Get the content and maintenance badge URLs.
		foreach ( [ 'content', 'maintenance' ] as $context ) {
			$set_badges = \progress_planner()->get_badges()->get_badges( $context );
			foreach ( $set_badges as $badge ) {
				$progress = $badge->get_progress();
				if ( $progress['progress'] > 100 ) {
					$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge->get_id() . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
				}
			}
			if ( ! isset( $badge_urls[ $context ] ) ) {
				// Fallback to the first badge in the set if no badge is completed.
				$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $set_badges[0]->get_id() . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
			}
		}

		return $badge_urls;
	}

	/**
	 * Get an array of localized strings.
	 *
	 * @return array<string, string>
	 */
	public function get_localized_strings() {
		// Strings alphabetically ordered.
		return [
			'badge'                        => \esc_html__( 'Badge', 'progress-planner' ),
			'checklistProgressDescription' => \sprintf(
				/* translators: %s: the checkmark icon. */
				\esc_html__( 'Check off all required elements %s in the element checks below', 'progress-planner' ),
				'<span style="background-color:#14b8a6;padding:0.35em;margin:0 0.25em;border-radius:50%;display:inline-block;"></span>'
			),
			'close'                        => \esc_html__( 'Close', 'progress-planner' ),
			'doneBtnText'                  => \esc_html__( 'Finish', 'progress-planner' ),
			'info'                         => \esc_html__( 'Info', 'progress-planner' ),
			'markAsComplete'               => \esc_html__( 'Mark as completed', 'progress-planner' ),
			'nextBtnText'                  => \esc_html__( 'Next &rarr;', 'progress-planner' ),
			'prevBtnText'                  => \esc_html__( '&larr; Previous', 'progress-planner' ),
			'pageType'                     => \esc_html__( 'Page type', 'progress-planner' ),
			'progressPlannerSidebar'       => \sprintf(
				/* translators: %s: The plugin name. */
				\esc_html__( '%s Sidebar', 'progress-planner' ),
				\progress_planner()->get_ui__branding()->get_admin_menu_name()
			),
			'progressText'                 => \sprintf(
				/* translators: %1$s: The current step number. %2$s: The total number of steps. */
				\esc_html__( 'Step %1$s of %2$s', 'progress-planner' ),
				'{{current}}',
				'{{total}}'
			),
			'saving'                       => \esc_html__( 'Saving...', 'progress-planner' ),
			'snooze'                       => \esc_html__( 'Snooze', 'progress-planner' ),
			'subscribed'                   => \esc_html__( 'Subscribed...', 'progress-planner' ),
			'subscribing'                  => \esc_html__( 'Subscribing...', 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskDelete'                   => \esc_html__( "Delete task '%s'", 'progress-planner' ),
			'delete'                       => \esc_html__( 'Delete', 'progress-planner' ),
			'video'                        => \esc_html__( 'Video', 'progress-planner' ),
			'watchVideo'                   => \esc_html__( 'Watch video', 'progress-planner' ),
			'disabledRRCheckboxTooltip'    => \esc_html__( 'Don\'t worry! This task will be checked off automatically when you\'ve completed it.', 'progress-planner' ),
			'opensInNewWindow'             => \esc_html__( 'Opens in new window', 'progress-planner' ),
			'whyIsThisImportant'           => \esc_html__( 'Why is this important?', 'progress-planner' ),
			/* translators: %s: The plugin name. */
			'installPlugin'                => \esc_html__( 'Install and activate the "%s" plugin', 'progress-planner' ),
			/* translators: %s: The plugin name. */
			'activatePlugin'               => \esc_html__( 'Activate plugin "%s"', 'progress-planner' ),
			'installing'                   => \esc_html__( 'Installing...', 'progress-planner' ),
			'installed'                    => \esc_html__( 'Installed', 'progress-planner' ),
			'activating'                   => \esc_html__( 'Activating...', 'progress-planner' ),
			'activated'                    => \esc_html__( 'Activated', 'progress-planner' ),
			'somethingWentWrong'           => \esc_html__( 'Something went wrong.', 'progress-planner' ),
			'showAllRecommendations'       => \esc_html__( 'Show all recommendations', 'progress-planner' ),
			'showFewerRecommendations'     => \esc_html__( 'Show fewer recommendations', 'progress-planner' ),
			'loadingTasks'                 => \esc_html__( 'Loading tasks...', 'progress-planner' ),
			'taskAddedSuccessfully'        => \esc_html__( 'Task added successfully', 'progress-planner' ),
			'tasksDeleted'                 => \esc_html__( 'Completed tasks deleted', 'progress-planner' ),
			'taskDeleted'                  => \esc_html__( 'Completed task deleted', 'progress-planner' ),
			'moveUp'                       => \esc_html__( 'Move up', 'progress-planner' ),
			'moveDown'                     => \esc_html__( 'Move down', 'progress-planner' ),
			/* translators: %d: The number of points. */
			'fixThisIssue'                 => \esc_html__( 'Fix this issue for %d points', 'progress-planner' ),
		];
	}

	/**
	 * Maybe empty the session storage for the prpl_recommendations post type.
	 * We need to do it early, before the WP API script reads the cached data from the browser.
	 *
	 * @return void
	 */
	public function maybe_empty_session_storage() {
		$screen = \get_current_screen();

		if ( ! $screen ) {
			return;
		}

		// Inject the script only on the Progress Planner Dashboard and the WordPress dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $screen->id && 'dashboard' !== $screen->id ) {
			return;
		}
		?>
		<script type="text/javascript">
			if ( 'sessionStorage' in window ) {
				try {
					for ( const key in sessionStorage ) {
						if (
							-1 < key.indexOf( 'wp-api-schema-model' ) &&
							-1 === sessionStorage.getItem( key ).indexOf( '/wp/v2/prpl_recommendations' )
						) {
							sessionStorage.removeItem( key );
							break;
						}
					}
				} catch ( er ) {}
			}
		</script>
		<?php
	}
}
