<?php
/**
 * Assets class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

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

		// Register web components.
		foreach ( $this->get_files_in_directory( 'assets/js/web-components' ) as $file ) {
			$handle = 'progress-planner-web-components-' . $file;
			error_log( print_r( [ $handle, $this->get_dependencies( 'web-components/' . $file ) ], true ) );

			\wp_register_script(
				$handle,
				PROGRESS_PLANNER_URL . "/assets/js/web-components/{$file}.js",
				$this->get_dependencies( 'web-components/' . $file ),
				\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/web-components/' . $file . '.js' ),
				true
			);
			$this->localize_script( $handle );
		}

		// Register main scripts.
		foreach ( $this->get_files_in_directory( 'assets/js' ) as $file ) {
			$handle = 'progress-planner-' . $file;
			error_log( print_r( [ $handle, $this->get_dependencies( $file ) ], true ) );
			\wp_register_script(
				$handle,
				PROGRESS_PLANNER_URL . '/assets/js/' . $file . '.js',
				$this->get_dependencies( $file ),
				\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/' . $file . '.js' ),
				true
			);
			$this->localize_script( $handle );
		}

		// Register widget scripts.
		foreach ( $this->get_files_in_directory( 'assets/js/widgets' ) as $file ) {
			$handle = 'progress-planner-widget-' . $file;
			error_log( print_r( [ $handle, $this->get_dependencies( 'widgets/' . $file ) ], true ) );

			\wp_register_script(
				$handle,
				PROGRESS_PLANNER_URL . '/assets/js/widgets/' . $file . '.js',
				$this->get_dependencies( 'widgets/' . $file ),
				\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/widgets/' . $file . '.js' ),
				true
			);
			$this->localize_script( $handle );
		}
	}

	/**
	 * Get dependencies for a script.
	 *
	 * @param string $file The file name.
	 * @return array
	 */
	public function get_dependencies( $file ) {
		$path = PROGRESS_PLANNER_DIR . '/assets/js/' . $file . '.js';
		if ( ! \file_exists( $path ) ) {
			return [];
		}
		$headers = \get_file_data(
			$path,
			[
				'dependencies' => 'Dependencies',
			]
		);
		if ( ! isset( $headers['dependencies'] ) ) {
			return [];
		}

		return \array_filter( \array_map( 'trim', \explode( ',', $headers['dependencies'] ) ) );
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
}
