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
	 * Enqueue script.
	 *
	 * @param string $handle The handle of the script to enqueue.
	 *
	 * @return void
	 */
	public function enqueue_script( $handle ) {
		if ( str_starts_with( $handle, 'progress-planner/' ) ) {
			$handle = str_replace( 'progress-planner/', '', $handle );
		}
		foreach ( self::VENDOR_SCRIPTS as $vendor_script_handle => $vendor_script ) {
			if ( $vendor_script['handle'] === $handle ) {
				$handle = $vendor_script_handle;
				break;
			}
		}
		// The file path.
		$file_path = PROGRESS_PLANNER_DIR . "/assets/js/{$handle}.js";
		// If the file does not exist, bail early.
		if ( ! \file_exists( $file_path ) ) {
			return;
		}
		// The file URL.
		$file_url = PROGRESS_PLANNER_URL . "/assets/js/{$handle}.js";
		// The handle.
		$handle = isset( self::VENDOR_SCRIPTS[ $handle ] )
			? self::VENDOR_SCRIPTS[ $handle ]['handle']
			: 'progress-planner/' . $handle;
		// The version.
		$version = isset( self::VENDOR_SCRIPTS[ $handle ] )
			? self::VENDOR_SCRIPTS[ $handle ]['version']
			: \progress_planner()->get_file_version( $file_path );
		// The dependencies.
		$headers      = \get_file_data( $file_path, [ 'dependencies' => 'Dependencies' ] );
		$dependencies = isset( $headers['dependencies'] )
			? \array_filter( \array_map( 'trim', \explode( ',', $headers['dependencies'] ) ) )
			: [];
		// Enqueue the script dependencies.
		foreach ( $dependencies as $dependency ) {
			$this->enqueue_script( $dependency );
		}
		// Enqueue the script.
		\wp_enqueue_script( $handle, $file_url, $dependencies, $version, true );
		// Localize the script.
		$this->localize_script( $handle );
	}

	/**
	 * Localize a script
	 *
	 * @param string $handle The script handle.
	 * @return void
	 */
	public function localize_script( $handle ) {
		switch ( $handle ) {
			case 'progress-planner/l10n':
				\wp_localize_script(
					$handle,
					'prplL10nStrings',
					$this->get_localized_strings()
				);
				break;

			case 'progress-planner/web-components/prpl-badge':
				\wp_localize_script(
					$handle,
					'progressPlannerBadge',
					[
						'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
						'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
					]
				);
				break;

			case 'progress-planner/web-components/prpl-suggested-task':
				\wp_localize_script(
					$handle,
					'prplSuggestedTask',
					[
						'nonce'  => \wp_create_nonce( 'progress_planner' ),
						'assets' => [
							'infoIcon'   => PROGRESS_PLANNER_URL . '/assets/images/icon_info.svg',
							'snoozeIcon' => PROGRESS_PLANNER_URL . '/assets/images/icon_snooze.svg',
						],
					]
				);
				break;

			case 'progress-planner/tour':
				\wp_localize_script(
					$handle,
					'progressPlannerTour',
					[
						'steps' => \progress_planner()->get_admin__tour()->get_steps(),
					]
				);
				break;

			case 'progress-planner/onboard':
			case 'progress-planner/header-filters':
			case 'progress-planner/settings':
				$data = [
					'onboardNonceURL' => \progress_planner()->get_onboard()->get_remote_nonce_url(),
					'onboardAPIUrl'   => \progress_planner()->get_onboard()->get_remote_url(),
					'ajaxUrl'         => \admin_url( 'admin-ajax.php' ),
					'nonce'           => \wp_create_nonce( 'progress_planner' ),
				];
				\wp_localize_script( $handle, 'progressPlanner', $data );
				break;

			case 'progress-planner/settings-page':
				\wp_localize_script(
					$handle,
					'progressPlannerSettingsPage',
					[
						'siteUrl' => \get_site_url(),
					]
				);
				break;

			default:
				return;
		}
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
			'progressPlanner'              => \esc_html__( 'Progress Planner', 'progress-planner' ),
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
		];
	}
}
