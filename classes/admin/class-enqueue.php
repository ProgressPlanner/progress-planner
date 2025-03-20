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
			case 'progress-planner/web-components/prpl-badge':
				\wp_localize_script(
					$handle,
					'progressPlannerBadge',
					[
						'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
						'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
						'l10n'                => [
							'badge' => \esc_html__( 'Badge', 'progress-planner' ),
						],
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
						],
					]
				);
				break;

			case 'progress-planner/web-components/prpl-todo-item':
				\wp_localize_script(
					$handle,
					'progressPlannerTodoItem',
					[
						'i18n' => [
							/* translators: %s: The task content. */
							'taskDelete'       => \esc_html__( "Delete task '%s'", 'progress-planner' ),
							/* translators: %s: The task content. */
							'taskMoveUp'       => \esc_html__( "Move task '%s' up", 'progress-planner' ),
							/* translators: %s: The task content. */
							'taskMoveDown'     => \esc_html__( "Move task '%s' down", 'progress-planner' ),
							'taskMovedUp'      => \esc_html__( 'Task moved up', 'progress-planner' ),
							'taskMovedDown'    => \esc_html__( 'Task moved down', 'progress-planner' ),
							/* translators: %s: The task content. */
							'taskCompleted'    => \esc_html__( "Task '%s' completed and moved to the bottom", 'progress-planner' ),
							/* translators: %s: The task content. */
							'taskNotCompleted' => \esc_html__( "Task '%s' marked as not completed and moved to the top", 'progress-planner' ),
						],
					]
				);
				break;

			case 'progress-planner/tour':
				\wp_localize_script(
					$handle,
					'progressPlannerTour',
					[
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
				if ( 'progress-planner/settings' === $handle ) {
					$data['l10n'] = [
						'saving'      => \esc_html__( 'Saving...', 'progress-planner' ),
						'subscribing' => \esc_html__( 'Subscribing...', 'progress-planner' ),
						'subscribed'  => \esc_html__( 'Subscribed...', 'progress-planner' ),
					];
				}
				\wp_localize_script( $handle, 'progressPlanner', $data );
				break;

			case 'progress-planner/settings-page':
				\wp_localize_script(
					$handle,
					'progressPlannerSettingsPage',
					[
						'siteUrl'    => \get_site_url(),
						'savingText' => \esc_html__( 'Saving...', 'progress-planner' ),
					]
				);
				break;
			case 'progress-planner/web-components/prpl-task-sending-email':
				\wp_localize_script(
					$handle,
					'prplEmailSending',
					[
						'ajax_url' => \admin_url( 'admin-ajax.php' ),
					]
				);
				break;
			default:
				return;
		}
	}
}
