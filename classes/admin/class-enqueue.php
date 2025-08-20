<?php
/**
 * Assets class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Badges\Monthly;

/**
 * Enqueue class.
 */
class Enqueue {

	/**
	 * Have the scripts been registered?
	 *
	 * @var boolean
	 */
	protected static $scripts_registered = false;

	/**
	 * Vendor scripts.
	 *
	 * @var array
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
	 * Enqueued assets.
	 *
	 * @var array
	 */
	protected $enqueued_assets = [
		'js'  => [],
		'css' => [],
	];

	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'admin_head', [ $this, 'maybe_empty_session_storage' ], 1 );
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
		$file_details = $this->get_file_details( 'js', $handle );
		if ( empty( $file_details ) ) {
			return;
		}

		$this->enqueued_assets['js'][] = $file_details['handle'];
		$final_dependencies            = [];

		// Enqueue the script dependencies.
		foreach ( $file_details['dependencies'] as $dependency ) {
			if ( ! \in_array( $dependency, $this->enqueued_assets['js'], true ) ) {
				$this->enqueue_script( $dependency );
				$final_dependencies[] = $dependency;
			}
		}

		// Enqueue the stylesheet.
		\wp_enqueue_script( $file_details['handle'], $file_details['file_url'], $final_dependencies, $file_details['version'], true );

		// Localize the script.
		$this->localize_script( $file_details['handle'], $localize_data );
	}

	/**
	 * Enqueue a style.
	 *
	 * @param string $handle The handle of the style to enqueue.
	 *
	 * @return void
	 */
	public function enqueue_style( $handle ) {
		$file_details = $this->get_file_details( 'css', $handle );
		if ( empty( $file_details ) ) {
			return;
		}

		$this->enqueued_assets['css'][] = $file_details['handle'];
		$final_dependencies             = [];

		// Enqueue the script dependencies.
		foreach ( $file_details['dependencies'] as $dependency ) {
			if ( ! \in_array( $dependency, $this->enqueued_assets['css'], true ) ) {
				$this->enqueue_style( $dependency );
			}
		}
		// Enqueue the stylesheet.
		\wp_enqueue_style( $file_details['handle'], $file_details['file_url'], $final_dependencies, $file_details['version'] );
	}

	/**
	 * Get file details.
	 *
	 * @param string $context The context of the file ( `css` or `js` ).
	 * @param string $handle The handle of the file.
	 *
	 * @return array
	 */
	public function get_file_details( $context, $handle ) {
		if ( \str_starts_with( $handle, 'progress-planner/' ) ) {
			$handle = \str_replace( 'progress-planner/', '', $handle );
		}

		if ( 'js' === $context ) {
			foreach ( self::VENDOR_SCRIPTS as $vendor_script_handle => $vendor_script ) {
				if ( $vendor_script['handle'] === $handle ) {
					$handle = $vendor_script_handle;
					break;
				}
			}
		}
		// The file path.
		$file_path = \constant( 'PROGRESS_PLANNER_DIR' ) . "/assets/{$context}/{$handle}.{$context}";

		// If the file does not exist, bail early.
		if ( ! \file_exists( $file_path ) ) {
			return [];
		}

		// The file URL.
		$file_url = \constant( 'PROGRESS_PLANNER_URL' ) . "/assets/{$context}/{$handle}.{$context}";

		// The handle.
		$handle = 'js' === $context && isset( self::VENDOR_SCRIPTS[ $handle ] )
			? self::VENDOR_SCRIPTS[ $handle ]['handle']
			: 'progress-planner/' . $handle;

		// The version.
		$version = 'js' === $context && isset( self::VENDOR_SCRIPTS[ $handle ] )
			? self::VENDOR_SCRIPTS[ $handle ]['version']
			: \progress_planner()->get_file_version( $file_path );

		// The dependencies.
		$headers      = \get_file_data( $file_path, [ 'dependencies' => 'Dependencies' ] );
		$dependencies = isset( $headers['dependencies'] )
			? \array_filter( \array_map( 'trim', \explode( ',', $headers['dependencies'] ) ) )
			: [];

		return [
			'file_path'    => $file_path,
			'file_url'     => $file_url,
			'handle'       => $handle,
			'version'      => $version,
			'dependencies' => $dependencies,
		];
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

				// Get tasks from task providers.
				$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format(
					[
						'post_status'      => 'publish',
						'exclude_provider' => [ 'user' ],
					]
				);
				// Get pending celebration tasks.
				$pending_celebration_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format(
					[
						'post_status'      => 'pending',
						'posts_per_page'   => 100,
						'exclude_provider' => [ 'user' ],
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
						'nonce'               => \wp_create_nonce( 'progress_planner' ),
						'assets'              => [
							'infoIcon'   => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_info.svg',
							'snoozeIcon' => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_snooze.svg',
						],
						'tasks'               => [
							'pendingTasks'            => $tasks,
							'pendingCelebrationTasks' => $pending_celebration_tasks,
							'userTasks'               => isset( $user_tasks['user'] ) ? $user_tasks['user'] : [],
						],
						'maxItemsPerCategory' => \progress_planner()->get_suggested_tasks()->get_max_items_per_category(),
						'delayCelebration'    => $delay_celebration,
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
						'raviIconUrl'     => \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_progress_planner.svg',
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
			$badge_urls['month'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $monthly_badge->get_id();
		}

		// Get the content and maintenance badge URLs.
		foreach ( [ 'content', 'maintenance' ] as $context ) {
			$set_badges = \progress_planner()->get_badges()->get_badges( $context );
			foreach ( $set_badges as $badge ) {
				$progress = $badge->get_progress();
				if ( $progress['progress'] > 100 ) {
					$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge->get_id();
				}
			}
			if ( ! isset( $badge_urls[ $context ] ) ) {
				// Fallback to the first badge in the set if no badge is completed.
				$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $set_badges[0]->get_id();
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
			'howLong'                      => \esc_html__( 'How long?', 'progress-planner' ),
			'info'                         => \esc_html__( 'Info', 'progress-planner' ),
			'markAsComplete'               => \esc_html__( 'Mark as completed', 'progress-planner' ),
			'nextBtnText'                  => \esc_html__( 'Next &rarr;', 'progress-planner' ),
			'prevBtnText'                  => \esc_html__( '&larr; Previous', 'progress-planner' ),
			'pageType'                     => \esc_html__( 'Page type', 'progress-planner' ),
			'progressPlannerSidebar'       => \esc_html__( 'Progress Planner Sidebar', 'progress-planner' ),
			'progressText'                 => \sprintf(
				/* translators: %1$s: The current step number. %2$s: The total number of steps. */
				\esc_html__( 'Step %1$s of %2$s', 'progress-planner' ),
				'{{current}}',
				'{{total}}'
			),
			'saving'                       => \esc_html__( 'Saving...', 'progress-planner' ),
			'snooze'                       => \esc_html__( 'Snooze', 'progress-planner' ),
			'snoozeDurationOneWeek'        => \esc_html__( '1 week', 'progress-planner' ),
			'snoozeDurationOneMonth'       => \esc_html__( '1 month', 'progress-planner' ),
			'snoozeDurationThreeMonths'    => \esc_html__( '3 months', 'progress-planner' ),
			'snoozeDurationSixMonths'      => \esc_html__( '6 months', 'progress-planner' ),
			'snoozeDurationOneYear'        => \esc_html__( '1 year', 'progress-planner' ),
			'snoozeDurationForever'        => \esc_html__( 'forever', 'progress-planner' ),
			'snoozeThisTask'               => \esc_html__( 'Snooze this task?', 'progress-planner' ),
			'subscribed'                   => \esc_html__( 'Subscribed...', 'progress-planner' ),
			'subscribing'                  => \esc_html__( 'Subscribing...', 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskCompleted'                => \esc_html__( "Task '%s' completed and moved to the bottom", 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskDelete'                   => \esc_html__( "Delete task '%s'", 'progress-planner' ),
			'taskMovedDown'                => \esc_html__( 'Task moved down', 'progress-planner' ),
			'taskMovedUp'                  => \esc_html__( 'Task moved up', 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskMoveDown'                 => \esc_html__( "Move task '%s' down", 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskMoveUp'                   => \esc_html__( "Move task '%s' up", 'progress-planner' ),
			/* translators: %s: The task content. */
			'taskNotCompleted'             => \esc_html__( "Task '%s' marked as not completed and moved to the top", 'progress-planner' ),
			'video'                        => \esc_html__( 'Video', 'progress-planner' ),
			'watchVideo'                   => \esc_html__( 'Watch video', 'progress-planner' ),
			'disabledRRCheckboxTooltip'    => \esc_html__( 'Don\'t worry! This task will be checked off automatically when you\'ve completed it.', 'progress-planner' ),
			'opensInNewWindow'             => \esc_html__( 'Opens in new window', 'progress-planner' ),
			/* translators: %s: The plugin name. */
			'installPlugin'                => \esc_html__( 'Install and activate the "%s" plugin', 'progress-planner' ),
			/* translators: %s: The plugin name. */
			'activatePlugin'               => \esc_html__( 'Activate plugin "%s"', 'progress-planner' ),
			'installing'                   => \esc_html__( 'Installing...', 'progress-planner' ),
			'installed'                    => \esc_html__( 'Installed', 'progress-planner' ),
			'alreadyInstalled'             => \esc_html__( 'Already installed', 'progress-planner' ),
			'installFailed'                => \esc_html__( 'Install failed', 'progress-planner' ),
			'activating'                   => \esc_html__( 'Activating...', 'progress-planner' ),
			'activated'                    => \esc_html__( 'Activated', 'progress-planner' ),
			'activateFailed'               => \esc_html__( 'Activation failed', 'progress-planner' ),
		];
	}

	/**
	 * Maybe empty the session storage for the prpl_recommendations post type.
	 * We need to do it early, before the WP API script reads the cached data from the browser.
	 *
	 * @return void
	 */
	public function maybe_empty_session_storage() {
		$screen = get_current_screen();

		if ( ! $screen ) {
			return;
		}

		// Inject the script only on the Progress Planner Dashboard, Progress Planner Settings and the WordPress dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $screen->id && 'progress-planner_page_progress-planner-settings' !== $screen->id && 'dashboard' !== $screen->id ) {
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
