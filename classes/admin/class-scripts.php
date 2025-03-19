<?php
/**
 * Assets class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use Progress_Planner\Badges\Monthly;

/**
 * Assets class.
 */
class Scripts {

	/**
	 * Register scripts.
	 *
	 * @return void
	 */
	public function register_scripts() {
		// Register vendor scripts.
		$vendor_scripts = [
			'driver'             => [ 'driver.js.iife.js', '1.3.1' ],
			'particles-confetti' => [ 'tsparticles.confetti.bundle.min.js', '2.11.0' ],
		];
		foreach ( $vendor_scripts as $handle => $file ) {
			\wp_register_script( $handle, PROGRESS_PLANNER_URL . "/assets/js/vendor/{$file[0]}", [], (string) $file[1], true );
		}

		$register_scripts_in_directory = function ( $directory ) {
			if ( 'vendor' === $directory ) {
				return;
			}
			foreach ( $this->get_files_in_directory( trim( 'assets/js/' . $directory, '/' ) ) as $file ) {
				$handle       = str_replace( '--', '-', "progress-planner-{$directory}-{$file}" );
				$file_path    = str_replace( '//', '/', \PROGRESS_PLANNER_DIR . "/assets/js/{$directory}/{$file}.js" );
				$file_headers = \get_file_data( $file_path, [ 'dependencies' => 'Dependencies' ] );
				$dependencies = isset( $file_headers['dependencies'] )
					? \array_filter( \array_map( 'trim', \explode( ',', $file_headers['dependencies'] ) ) )
					: [];
				\wp_register_script(
					$handle,
					PROGRESS_PLANNER_URL . \str_replace( '//', '/', "/assets/js/{$directory}/{$file}.js" ),
					$dependencies,
					\progress_planner()->get_file_version( $file_path ),
					true
				);
				$this->localize_script( $handle );
			}
		};

		// Get an array of folders in the assets/js directory.
		$folders = \glob( PROGRESS_PLANNER_DIR . '/assets/js/*', \GLOB_ONLYDIR );
		$folders = \array_merge( [ '' ], \array_map( 'basename', $folders ) ); // @phpstan-ignore-line array_map.nonIterable

		foreach ( $folders as $folder ) {
			$register_scripts_in_directory( $folder );
		}
	}

	/**
	 * Localize a script
	 *
	 * @param string $script_handle The script handle.
	 * @return void
	 */
	public function localize_script( $script_handle ) {
		switch ( $script_handle ) {
			case 'progress-planner-web-components-prpl-badge':
				$localized_handle = 'progressPlannerBadge';
				$localized_data   = [
					'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
					'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
					'l10n'                => [
						'badge' => \esc_html__( 'Badge', 'progress-planner' ),
					],
				];
				break;

			case 'progress-planner-web-components-prpl-suggested-task':
				$localized_handle = 'prplSuggestedTask';
				$localized_data   = [
					'nonce'  => \wp_create_nonce( 'progress_planner' ),
					'assets' => [
						'infoIcon'   => PROGRESS_PLANNER_URL . '/assets/images/icon_info.svg',
						'snoozeIcon' => PROGRESS_PLANNER_URL . '/assets/images/icon_snooze.svg',
					],
					'i18n'   => [
						'info'           => \esc_html__( 'Info', 'progress-planner' ),
						'snooze'         => \esc_html__( 'Snooze', 'progress-planner' ),
						'snoozeThisTask' => \esc_html__( 'Snooze this task?', 'progress-planner' ),
						'howLong'        => \esc_html__( 'How long?', 'progress-planner' ),
						'snoozeDuration' => [
							'oneWeek'     => \esc_html__( '1 week', 'progress-planner' ),
							'oneMonth'    => \esc_html__( '1 month', 'progress-planner' ),
							'threeMonths' => \esc_html__( '3 months', 'progress-planner' ),
							'sixMonths'   => \esc_html__( '6 months', 'progress-planner' ),
							'oneYear'     => \esc_html__( '1 year', 'progress-planner' ),
							'forever'     => \esc_html__( 'forever', 'progress-planner' ),
						],
						'close'          => \esc_html__( 'Close', 'progress-planner' ),
						'markAsComplete' => \esc_html__( 'Mark as completed', 'progress-planner' ),
						'delete'         => \esc_html__( 'Delete', 'progress-planner' ),
						'moveUp'         => \esc_html__( 'Move up', 'progress-planner' ),
						'moveDown'       => \esc_html__( 'Move down', 'progress-planner' ),
					],
				];
				break;

			case 'progress-planner-tour':
				$localized_handle = 'progressPlannerTour';
				$localized_data   = [
					'steps'        => \progress_planner()->get_admin__tour()->get_steps(),
					'progressText' => sprintf(
						/* translators: %1$s: The current step number. %2$s: The total number of steps. */
						\esc_html__( 'Step %1$s of %2$s', 'progress-planner' ),
						'{{current}}',
						'{{total}}'
					),
					'nextBtnText'  => \esc_html__( 'Next &rarr;', 'progress-planner' ),
					'prevBtnText'  => \esc_html__( '&larr; Previous', 'progress-planner' ),
					'doneBtnText'  => \esc_html__( 'Finish', 'progress-planner' ),
				];
				break;

			case 'progress-planner-onboard':
			case 'progress-planner-header-filters':
			case 'progress-planner-settings':
				$localized_handle = 'progressPlanner';
				$localized_data   = [
					'onboardNonceURL' => \progress_planner()->get_onboard()->get_remote_nonce_url(),
					'onboardAPIUrl'   => \progress_planner()->get_onboard()->get_remote_url(),
					'ajaxUrl'         => \admin_url( 'admin-ajax.php' ),
					'nonce'           => \wp_create_nonce( 'progress_planner' ),
				];
				if ( 'progress-planner-settings' === $script_handle ) {
					$localized_data['l10n'] = [
						'saving'      => \esc_html__( 'Saving...', 'progress-planner' ),
						'subscribing' => \esc_html__( 'Subscribing...', 'progress-planner' ),
						'subscribed'  => \esc_html__( 'Subscribed...', 'progress-planner' ),
					];
				}
				break;

			case 'progress-planner-settings-page':
				$localized_handle = 'progressPlannerSettingsPage';
				$localized_data   = [
					'siteUrl'    => \get_site_url(),
					'savingText' => \esc_html__( 'Saving...', 'progress-planner' ),
				];
				break;

			case 'progress-planner-celebrate':
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
				$localized_handle = 'prplCelebrate';
				$localized_data   = [
					'raviIconUrl'     => PROGRESS_PLANNER_URL . '/assets/images/icon_progress_planner.svg',
					'confettiOptions' => $confetti_options,
				];

				foreach ( $this->get_badge_urls() as $context => $url ) {
					$localized_data[ $context . 'IconUrl' ] = $url;
				}
				break;

			default:
				return;
		}

		\wp_localize_script(
			$script_handle,
			apply_filters( 'progress_planner_script_localized_handle', $localized_handle, $script_handle ),
			apply_filters( 'progress_planner_script_localized_data', $localized_data, $script_handle )
		);
	}

	/**
	 * Get files in the assets directory.
	 *
	 * @param string $directory The directory to get files from.
	 * @param string $trim The extension to trim from the files.
	 *
	 * @return array
	 */
	public function get_files_in_directory( $directory, $trim = '.js' ) {
		$files = \glob( PROGRESS_PLANNER_DIR . '/' . $directory . '/*.js' );
		foreach ( $files as $index => $file ) { // @phpstan-ignore-line foreach.nonIterable
			$files[ $index ] = \str_replace( $trim, '', \basename( $file ) ); // @phpstan-ignore-line offsetAccess.nonOffsetAccessible
		}

		return $files;
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
}
