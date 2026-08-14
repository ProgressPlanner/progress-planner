<?php
/**
 * Monitor WordPress core for pending security updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Detects pending WordPress core security releases.
 *
 * Every core patch release (same major.minor, higher patch) is treated
 * as a security release.
 */
class Security_Update_Monitor {

	/**
	 * The option holding the last offered version we alerted about.
	 *
	 * @var string
	 */
	const ALERTED_VERSION_OPTION = 'progress_planner_security_update_alerted_version';

	/**
	 * The option used as a short-lived lock while sending alerts.
	 *
	 * @var string
	 */
	const LOCK_OPTION = 'prpl_security_alert_lock';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Fires whenever wp_version_check() refreshes the transient, including on front-end cron.
		\add_action( 'set_site_transient_update_core', [ $this, 'maybe_alert' ] );

		// Fallback re-check, before Suggested_Tasks::init() runs on admin_init:20.
		\add_action( 'admin_init', [ $this, 'maybe_alert_from_stored_transient' ], 5 );
	}

	/**
	 * Re-check the stored transient (fallback for sites where the hook never fired).
	 *
	 * @return void
	 */
	public function maybe_alert_from_stored_transient() {
		$this->maybe_alert( \get_site_transient( 'update_core' ) );
	}

	/**
	 * Alert site admins (and the SaaS) about a pending security update, once per offered version.
	 *
	 * @param mixed $transient The update_core site transient value.
	 *
	 * @return void
	 */
	public function maybe_alert( $transient ) {
		if ( \is_multisite() && ! \is_main_site() ) {
			return;
		}

		$update = self::get_pending_security_update( \is_object( $transient ) ? $transient : null );
		if ( null === $update ) {
			return;
		}

		// One alert per offered version.
		if ( \get_site_option( self::ALERTED_VERSION_OPTION ) === $update['offered'] ) {
			return;
		}

		// Cron and a concurrent admin pageview can both fire this; take a short-lived lock.
		if ( ! \add_option( self::LOCK_OPTION, \time(), '', false ) ) {
			$lock_time = (int) \get_option( self::LOCK_OPTION );
			if ( $lock_time > \time() - 30 ) {
				return;
			}
			\update_option( self::LOCK_OPTION, \time(), false );
		}

		try {
			$this->send_admin_email( $update['installed'], $update['offered'] );

			// Mark as alerted even if sending failed, to avoid alert storms on every request.
			// The subscriber email is sent by progressplanner.com, which watches the
			// wordpress.org releases feed and reads this site's version via get-stats.
			\update_site_option( self::ALERTED_VERSION_OPTION, $update['offered'] );
		} finally {
			\delete_option( self::LOCK_OPTION );
		}
	}

	/**
	 * Email every user who can install core updates about the security release.
	 *
	 * @param string $installed The installed version.
	 * @param string $offered   The offered version.
	 *
	 * @return void
	 */
	private function send_admin_email( $installed, $offered ) {
		$subject = \sprintf(
			/* translators: 1: The site name, 2: The offered WordPress version. */
			\__( '[%1$s] Critical: WordPress %2$s security update available', 'progress-planner' ),
			\wp_specialchars_decode( (string) \get_option( 'blogname' ), ENT_QUOTES ),
			$offered
		);

		$message = \sprintf(
			/* translators: 1: The offered WordPress version, 2: The installed WordPress version, 3: The URL of the updates page. */
			\__(
				'A WordPress security release is available: version %1$s (your site runs %2$s).

Security issues in WordPress are typically exploited within hours of a release, so please update as soon as possible:

%3$s

If your site has automatic updates enabled, it may install this update by itself — in that case, please verify on the page above that the update has been applied.

This alert was sent by the Progress Planner plugin.',
				'progress-planner'
			),
			$offered,
			$installed,
			\admin_url( 'update-core.php' )
		);

		foreach ( $this->get_recipients() as $email ) {
			\wp_mail( $email, $subject, $message );
		}
	}

	/**
	 * Get the email addresses of all users who can install core updates.
	 *
	 * @return string[]
	 */
	private function get_recipients() {
		if ( \is_multisite() ) {
			$emails = [];
			foreach ( \get_super_admins() as $login ) {
				$user = \get_user_by( 'login', $login );
				if ( $user ) {
					$emails[] = $user->user_email;
				}
			}

			return \array_values( \array_unique( $emails ) );
		}

		$emails = [];
		foreach ( \get_users( [ 'capability' => 'update_core' ] ) as $user ) {
			if ( $user instanceof \WP_User ) {
				$emails[] = $user->user_email;
			}
		}

		return \array_values( \array_unique( $emails ) );
	}

	/**
	 * Check whether a security-update task is currently published.
	 *
	 * While one is published, the recommendations UI is locked down to that task.
	 *
	 * @return bool
	 */
	public function is_security_lockdown_active() {
		return ! empty(
			\progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'post_status' => 'publish',
					'provider_id' => 'security-update',
					'numberposts' => 1,
				]
			)
		);
	}

	/**
	 * Check whether an offered version is a security release, compared to the installed one.
	 *
	 * A security release is a patch release on the same branch: same major.minor,
	 * with a higher patch number. Non-stable versions (alpha/beta/RC) never qualify.
	 *
	 * @param string $installed The installed WordPress version.
	 * @param string $offered   The offered WordPress version.
	 *
	 * @return bool
	 */
	public static function is_security_release( $installed, $offered ) {
		// Non-stable versions (e.g. 6.9-alpha-59000, 6.9-RC1) never qualify.
		if ( false !== \strpos( $installed, '-' ) || false !== \strpos( $offered, '-' ) ) {
			return false;
		}

		$installed_parts = self::get_version_parts( $installed );
		$offered_parts   = self::get_version_parts( $offered );

		if ( null === $installed_parts || null === $offered_parts ) {
			return false;
		}

		return $installed_parts[0] === $offered_parts[0]
			&& $installed_parts[1] === $offered_parts[1]
			&& $offered_parts[2] > $installed_parts[2];
	}

	/**
	 * Get the pending security update from an update_core transient, if any.
	 *
	 * @param object|null $transient The update_core site transient. Defaults to the stored transient.
	 * @param string|null $installed The installed version. Defaults to the running WordPress version.
	 *
	 * @return array{installed: string, offered: string}|null
	 */
	public static function get_pending_security_update( $transient = null, $installed = null ) {
		if ( null === $transient ) {
			$transient = \get_site_transient( 'update_core' );
		}

		if ( null === $installed ) {
			$installed = self::get_installed_version();
		}

		if ( ! \is_object( $transient ) || ! isset( $transient->updates ) || ! \is_array( $transient->updates ) ) {
			return null;
		}

		$offered = null;
		foreach ( $transient->updates as $update ) {
			// Same-branch point releases are offered with response "autoupdate" (only the
			// newest release gets "upgrade"), so a branch-behind site (e.g. 6.9.1 when
			// 7.0.x is current) receives its 6.9.x security patch as an autoupdate offer.
			if ( ! \is_object( $update )
				|| ! isset( $update->response, $update->current )
				|| ! \in_array( $update->response, [ 'upgrade', 'autoupdate' ], true )
				|| ! \is_string( $update->current )
				|| ! self::is_security_release( $installed, $update->current )
			) {
				continue;
			}

			if ( null === $offered || \version_compare( $update->current, $offered, '>' ) ) {
				$offered = $update->current;
			}
		}

		return null === $offered
			? null
			: [
				'installed' => $installed,
				'offered'   => $offered,
			];
	}

	/**
	 * Get the effective installed WordPress version.
	 *
	 * Returns the higher of the running version and the version recorded by the
	 * last update check (the transient's version_checked), so a just-installed
	 * update is recognized as soon as the update check has run.
	 *
	 * @return string
	 */
	public static function get_effective_installed_version() {
		$installed = self::get_installed_version();
		$transient = \get_site_transient( 'update_core' );

		if ( \is_object( $transient )
			&& isset( $transient->version_checked )
			&& \is_string( $transient->version_checked )
			&& \version_compare( $transient->version_checked, $installed, '>' )
		) {
			return $transient->version_checked;
		}

		return $installed;
	}

	/**
	 * Get the installed WordPress version.
	 *
	 * @return string
	 */
	private static function get_installed_version() {
		// wp_get_wp_version() exists since WP 6.7; the plugin supports 6.6.
		if ( \function_exists( 'wp_get_wp_version' ) ) {
			return \wp_get_wp_version();
		}

		return isset( $GLOBALS['wp_version'] ) && \is_string( $GLOBALS['wp_version'] ) ? $GLOBALS['wp_version'] : '';
	}

	/**
	 * Split a version string into major, minor and patch integers.
	 *
	 * @param string $version The version string.
	 *
	 * @return array{int, int, int}|null Null when the version is not parsable.
	 */
	private static function get_version_parts( $version ) {
		if ( ! \preg_match( '/^(\d+)\.(\d+)(?:\.(\d+))?$/', $version, $matches ) ) {
			return null;
		}

		return [ (int) $matches[1], (int) $matches[2], isset( $matches[3] ) ? (int) $matches[3] : 0 ];
	}
}
