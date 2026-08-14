<?php
/**
 * Class Security_Update_Monitor_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Utils\Security_Update_Monitor;

/**
 * Security update detection test case.
 */
class Security_Update_Monitor_Test extends \WP_UnitTestCase {

	/**
	 * Data provider for is_security_release.
	 *
	 * @return array<string, array{string, string, bool}>
	 */
	public function data_is_security_release() {
		return [
			'patch release'                  => [ '6.8.1', '6.8.2', true ],
			'first patch on a new branch'    => [ '6.8', '6.8.1', true ],
			'patch jump of several versions' => [ '6.8.1', '6.8.4', true ],
			'new major.minor'                => [ '6.7.2', '6.8.0', false ],
			'cross-branch jump'              => [ '6.7.2', '6.8.2', false ],
			'same version'                   => [ '6.8.2', '6.8.2', false ],
			'downgrade'                      => [ '6.8.2', '6.8.1', false ],
			'installed alpha build'          => [ '6.9-alpha-59000', '6.9.1', false ],
			'offered release candidate'      => [ '6.8.1', '6.9-RC1', false ],
			'malformed offered version'      => [ '6.8.1', 'not-a-version', false ],
			'empty installed version'        => [ '', '6.8.2', false ],
		];
	}

	/**
	 * Test the is_security_release version heuristic.
	 *
	 * @dataProvider data_is_security_release
	 *
	 * @param string $installed The installed version.
	 * @param string $offered   The offered version.
	 * @param bool   $expected  The expected result.
	 */
	public function test_is_security_release( $installed, $offered, $expected ) {
		$this->assertSame( $expected, Security_Update_Monitor::is_security_release( $installed, $offered ) );
	}

	/**
	 * Test that get_pending_security_update picks the same-branch patch from a multi-offer transient.
	 */
	public function test_get_pending_security_update_picks_same_branch_patch() {
		$result = Security_Update_Monitor::get_pending_security_update(
			$this->get_mock_transient( [ '6.9.0', '6.8.2' ] ),
			'6.8.1'
		);

		$this->assertSame(
			[
				'installed' => '6.8.1',
				'offered'   => '6.8.2',
			],
			$result
		);
	}

	/**
	 * Test that get_pending_security_update returns the highest matching patch.
	 */
	public function test_get_pending_security_update_returns_highest_patch() {
		$result = Security_Update_Monitor::get_pending_security_update(
			$this->get_mock_transient( [ '6.8.2', '6.8.3' ] ),
			'6.8.1'
		);

		$this->assertNotNull( $result );
		$this->assertSame( '6.8.3', $result['offered'] );
	}

	/**
	 * Test that a feature release does not register as a security update.
	 */
	public function test_get_pending_security_update_ignores_feature_release() {
		$this->assertNull(
			Security_Update_Monitor::get_pending_security_update(
				$this->get_mock_transient( [ '6.9.0' ] ),
				'6.8.2'
			)
		);
	}

	/**
	 * Test the real API shape for a branch-behind site: the same-branch patch is
	 * only offered with response "autoupdate" once a newer major exists.
	 *
	 * A 6.9.1 site gets: upgrade 7.0.4, autoupdate 7.0.4, autoupdate 6.9.7.
	 */
	public function test_get_pending_security_update_detects_autoupdate_offer_on_older_branch() {
		$transient = (object) [
			'updates' => [
				(object) [
					'response' => 'upgrade',
					'current'  => '7.0.4',
				],
				(object) [
					'response' => 'autoupdate',
					'current'  => '7.0.4',
				],
				(object) [
					'response' => 'autoupdate',
					'current'  => '6.9.7',
				],
			],
		];

		$this->assertSame(
			[
				'installed' => '6.9.1',
				'offered'   => '6.9.7',
			],
			Security_Update_Monitor::get_pending_security_update( $transient, '6.9.1' )
		);
	}

	/**
	 * Test that non-upgrade offers are ignored.
	 */
	public function test_get_pending_security_update_ignores_non_upgrade_offers() {
		$transient = $this->get_mock_transient( [ '6.8.2' ] );

		$transient->updates[0]->response = 'latest';

		$this->assertNull( Security_Update_Monitor::get_pending_security_update( $transient, '6.8.1' ) );
	}

	/**
	 * Test that malformed transients are handled gracefully.
	 */
	public function test_get_pending_security_update_handles_malformed_transient() {
		$this->assertNull( Security_Update_Monitor::get_pending_security_update( null, '6.8.1' ) );
		$this->assertNull( Security_Update_Monitor::get_pending_security_update( new \stdClass(), '6.8.1' ) );
		$this->assertNull( Security_Update_Monitor::get_pending_security_update( (object) [ 'updates' => 'nope' ], '6.8.1' ) );
	}

	/**
	 * Test that maybe_alert emails all update_core users exactly once per offered version.
	 */
	public function test_maybe_alert_sends_email_to_admins_once_per_version() {
		$admin_id  = self::factory()->user->create( [ 'role' => 'administrator' ] );
		$editor_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		$mails     = $this->capture_mails();

		$monitor = new Security_Update_Monitor();
		$monitor->maybe_alert( $this->get_security_transient() );

		// On multisite only super admins can update core; on single site, all update_core users.
		$expected_recipients = [];
		if ( \is_multisite() ) {
			foreach ( \get_super_admins() as $login ) {
				$user = \get_user_by( 'login', $login );
				if ( $user ) {
					$expected_recipients[] = $user->user_email;
				}
			}
		} else {
			foreach ( \get_users( [ 'capability' => 'update_core' ] ) as $user ) {
				$expected_recipients[] = $user->user_email;
			}
		}
		\sort( $expected_recipients );

		$actual_recipients = \array_column( $mails->calls, 'to' );
		\sort( $actual_recipients );

		$this->assertNotEmpty( $expected_recipients );
		$this->assertSame( $expected_recipients, $actual_recipients );
		$this->assertNotContains( \get_user_by( 'id', $editor_id )->user_email, $actual_recipients );
		if ( ! \is_multisite() ) {
			$this->assertContains( \get_user_by( 'id', $admin_id )->user_email, $actual_recipients );
		}

		// Second call with the same offered version must not send again.
		$mails->calls = [];
		$monitor->maybe_alert( $this->get_security_transient() );
		$this->assertSame( [], $mails->calls );

		// A newer offered version must alert again.
		$monitor->maybe_alert( $this->get_security_transient( 2 ) );
		$this->assertNotEmpty( $mails->calls );
	}

	/**
	 * Test that the alert email names the offered version and links to the updates page.
	 */
	public function test_alert_email_contains_version_and_update_link() {
		$mails = $this->capture_mails();

		( new Security_Update_Monitor() )->maybe_alert( $this->get_security_transient() );

		$this->assertNotEmpty( $mails->calls );
		$mail = $mails->calls[0];
		$this->assertStringContainsString( $this->get_offered_version(), $mail['subject'] . $mail['message'] );
		$this->assertStringContainsString( \admin_url( 'update-core.php' ), $mail['message'] );
		// The backup advice must be present, but phrased not to delay the update.
		$this->assertStringContainsString( 'backup', $mail['message'] );
		$this->assertStringContainsString( 'https://wordpress.org/documentation/article/wordpress-backups/', $mail['message'] );
	}

	/**
	 * Test that onboarded sites are sent to the Progress Planner dashboard,
	 * where the one-click branch-pinned update button lives.
	 */
	public function test_alert_email_links_to_dashboard_when_onboarded() {
		\update_option( 'progress_planner_license_key', 'test-license-key' );
		$mails = $this->capture_mails();

		( new Security_Update_Monitor() )->maybe_alert( $this->get_security_transient() );

		$this->assertNotEmpty( $mails->calls );
		$message = $mails->calls[0]['message'];
		$this->assertStringContainsString( \admin_url( 'admin.php?page=progress-planner' ), $message );
		$this->assertStringContainsString( 'one-click', $message );
		$this->assertStringNotContainsString( \admin_url( 'update-core.php' ), $message );
	}

	/**
	 * Test that maybe_alert makes no HTTP requests (subscriber email is feed-driven, SaaS-side).
	 */
	public function test_maybe_alert_makes_no_http_requests() {
		\update_option( 'progress_planner_license_key', 'test-license-key' );
		$this->capture_mails();
		$requests = $this->capture_http_requests();

		( new Security_Update_Monitor() )->maybe_alert( $this->get_security_transient() );

		$this->assertSame( [], $requests->calls );
	}

	/**
	 * Test that maybe_alert ignores feature releases.
	 */
	public function test_maybe_alert_ignores_feature_releases() {
		$mails = $this->capture_mails();

		$parts     = \explode( '.', \wp_get_wp_version() );
		$transient = $this->get_mock_transient( [ $parts[0] . '.' . ( (int) $parts[1] + 1 ) . '.0' ] );

		( new Security_Update_Monitor() )->maybe_alert( $transient );

		$this->assertSame( [], $mails->calls );
		$this->assertFalse( \get_site_option( 'progress_planner_security_update_alerted_version' ) );
	}

	/**
	 * Test that the plugin bootstrap registers the monitor's detection hooks.
	 */
	public function test_monitor_hooks_are_registered_on_boot() {
		$monitor = \progress_planner()->get_utils__security_update_monitor();

		$this->assertInstanceOf( Security_Update_Monitor::class, $monitor );
		$this->assertNotFalse( \has_action( 'set_site_transient_update_core', [ $monitor, 'maybe_alert' ] ) );
		$this->assertNotFalse( \has_action( 'admin_init', [ $monitor, 'maybe_alert_from_stored_transient' ] ) );
	}

	/**
	 * Test that the system status exposes the pending security update to the SaaS.
	 */
	public function test_system_status_exposes_security_updates() {
		\set_site_transient( 'update_core', $this->get_security_transient() );
		\update_site_option( 'progress_planner_security_update_alerted_version', $this->get_offered_version() );

		$status = ( new \Progress_Planner\Utils\System_Status() )->get_system_status();

		$this->assertArrayHasKey( 'security_updates', $status );
		$this->assertTrue( $status['security_updates']['pending'] );
		$this->assertSame( $this->get_offered_version(), $status['security_updates']['offered_version'] );
		$this->assertSame( $this->get_offered_version(), $status['security_updates']['last_alerted_version'] );
		$this->assertNotSame( '', $status['security_updates']['installed_version'] );
	}

	/**
	 * Test the system status without a pending security update.
	 */
	public function test_system_status_without_security_update() {
		\delete_site_transient( 'update_core' );

		$status = ( new \Progress_Planner\Utils\System_Status() )->get_system_status();

		$this->assertFalse( $status['security_updates']['pending'] );
		$this->assertNull( $status['security_updates']['offered_version'] );
	}

	/**
	 * Capture outgoing mails via the pre_wp_mail short-circuit.
	 *
	 * @return object The recorder; captured calls in ->calls.
	 */
	private function capture_mails() {
		$recorder        = new \stdClass();
		$recorder->calls = [];
		\add_filter(
			'pre_wp_mail',
			static function ( $pre, $atts ) use ( $recorder ) {
				$recorder->calls[] = $atts;
				return true;
			},
			10,
			2
		);

		return $recorder;
	}

	/**
	 * Capture outgoing HTTP requests via the pre_http_request short-circuit.
	 *
	 * @return object The recorder; captured calls in ->calls.
	 */
	private function capture_http_requests() {
		$recorder        = new \stdClass();
		$recorder->calls = [];
		\add_filter(
			'pre_http_request',
			static function ( $pre, $args, $url ) use ( $recorder ) {
				$recorder->calls[] = [
					'url'  => $url,
					'body' => isset( $args['body'] ) ? $args['body'] : [],
				];

				return [
					'headers'  => [],
					'response' => [
						'code'    => 200,
						'message' => 'OK',
					],
					'body'     => (string) \wp_json_encode( [ 'status' => 'ok' ] ),
					'cookies'  => [],
				];
			},
			10,
			3
		);

		return $recorder;
	}

	/**
	 * Get an offered patch version relative to the running WordPress version.
	 *
	 * @param int $bump How many patch versions to bump.
	 *
	 * @return string
	 */
	private function get_offered_version( $bump = 1 ) {
		$parts = \explode( '.', \wp_get_wp_version() );

		return $parts[0] . '.' . $parts[1] . '.' . ( isset( $parts[2] ) ? (int) $parts[2] + $bump : $bump );
	}

	/**
	 * Build a transient offering a security release for the running WordPress version.
	 *
	 * @param int $bump How many patch versions to bump.
	 *
	 * @return \stdClass
	 */
	private function get_security_transient( $bump = 1 ) {
		return $this->get_mock_transient( [ $this->get_offered_version( $bump ) ] );
	}

	/**
	 * Build a mock update_core transient object.
	 *
	 * @param string[] $offered_versions The offered versions.
	 *
	 * @return \stdClass
	 */
	private function get_mock_transient( $offered_versions ) {
		$updates = [];
		foreach ( $offered_versions as $version ) {
			$updates[] = (object) [
				'response' => 'upgrade',
				'current'  => $version,
			];
		}

		return (object) [ 'updates' => $updates ];
	}
}
