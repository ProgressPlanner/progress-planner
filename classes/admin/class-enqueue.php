<?php
/**
 * Assets class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

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
		'vendor/driver.js.iife' => [
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
	public function get_badge_urls() {
		$badge_urls = [];

		// Get the monthly badge URL.
		$now                 = new \DateTime();
		$badge_id            = 'monthly-' . $now->format( 'Y' ) . '-m' . $now->format( 'n' );
		$badge_urls['month'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge_id . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();

		// Get the content and maintenance badge URLs from saved stats.
		$settings = \progress_planner()->get_settings()->get( 'badges', [] );

		// Content badges.
		$content_badge_ids = [ 'content-curator', 'revision-ranger', 'purposeful-publisher' ];
		foreach ( $content_badge_ids as $badge_id ) {
			if ( isset( $settings[ $badge_id ] ) && (int) ( $settings[ $badge_id ]['progress'] ?? 0 ) >= 100 ) {
				$badge_urls['content'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge_id . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
				break;
			}
		}
		if ( ! isset( $badge_urls['content'] ) ) {
			// Fallback to the first badge in the set if no badge is completed.
			$badge_urls['content'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=content-curator&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
		}

		// Maintenance badges.
		$maintenance_badge_ids = [ 'progress-padawan', 'maintenance-maniac', 'super-site-specialist' ];
		foreach ( $maintenance_badge_ids as $badge_id ) {
			if ( isset( $settings[ $badge_id ] ) && (int) ( $settings[ $badge_id ]['progress'] ?? 0 ) >= 100 ) {
				$badge_urls['maintenance'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge_id . '&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
				break;
			}
		}
		if ( ! isset( $badge_urls['maintenance'] ) ) {
			// Fallback to the first badge in the set if no badge is completed.
			$badge_urls['maintenance'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=progress-padawan&branding_id=' . (int) \progress_planner()->get_ui__branding()->get_branding_id();
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
			'progressPlannerSidebar'       => \esc_html__( 'Progress Planner Sidebar', 'progress-planner' ),
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

		// Inject the script only on the Progress Planner Dashboard, Progress Planner Settings and the WordPress dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $screen->id ) {
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
