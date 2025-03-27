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
			if ( ! in_array( $dependency, $this->enqueued_assets['js'], true ) ) {
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
			if ( ! in_array( $dependency, $this->enqueued_assets['css'], true ) ) {
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
		if ( str_starts_with( $handle, 'progress-planner/' ) ) {
			$handle = str_replace( 'progress-planner/', '', $handle );
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
		$file_path = PROGRESS_PLANNER_DIR . "/assets/{$context}/{$handle}.{$context}";

		// If the file does not exist, bail early.
		if ( ! \file_exists( $file_path ) ) {
			return [];
		}

		// The file URL.
		$file_url = PROGRESS_PLANNER_URL . "/assets/{$context}/{$handle}.{$context}";

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
						'raviIconUrl'     => PROGRESS_PLANNER_URL . '/assets/images/icon_progress_planner.svg',
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
		$monthly_badge       = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );
		$badge_urls['month'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $monthly_badge->get_id();

		// Get the content and maintenance badge URLs.
		foreach ( [ 'content', 'maintenance' ] as $context ) {
			$set_badges        = \progress_planner()->get_badges()->get_badges( $context );
			$badge_url_context = '';
			foreach ( $set_badges as $key => $badge ) {
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
			'checklistProgressDescription' => sprintf(
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
			'progressText'                 => sprintf(
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
		];
	}
}
