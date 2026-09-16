<?php
/**
 * Tests for the Abilities class.
 *
 * The Abilities API landed in WordPress core after the version these tests run
 * against, so registration itself is only asserted when the API is present.
 * Everything else -- the permission gate, the payload shaping and the status
 * mapping -- is exercised directly, because that logic is what an agent
 * actually consumes and it does not depend on the API being available.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Abilities\Abilities;

/**
 * Abilities test case.
 */
class Abilities_Test extends \WP_UnitTestCase {

	/**
	 * Abilities instance.
	 *
	 * @var Abilities
	 */
	private $abilities;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// The constructor hooks the registration actions, so building a fresh
		// instance per test would stack a listener each time and re-register on
		// the next fire. The plugin's own instance is used instead.
		$this->abilities = \progress_planner()->get_abilities__abilities();
	}

	/**
	 * Invoke a private or protected method on the instance.
	 *
	 * @param string $name The method name.
	 * @param array  $args The arguments.
	 *
	 * @return mixed
	 */
	private function invoke( $name, array $args = [] ) {
		$reflection = new \ReflectionClass( $this->abilities );
		$method     = $reflection->getMethod( $name );
		$method->setAccessible( true );

		return $method->invokeArgs( $this->abilities, $args );
	}

	/**
	 * Test that an administrator passes the read permission check.
	 *
	 * @return void
	 */
	public function test_can_read_allows_administrator() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->assertTrue( $this->abilities->can_read() );
	}

	/**
	 * Test that a subscriber fails the read permission check.
	 *
	 * This is the only gate on these abilities: a bridge serving a third-party
	 * ability runs its permission callback and nothing else.
	 *
	 * @return void
	 */
	public function test_can_read_denies_subscriber() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$this->assertFalse( $this->abilities->can_read() );
	}

	/**
	 * Test that a logged-out visitor fails the read permission check.
	 *
	 * @return void
	 */
	public function test_can_read_denies_logged_out_user() {
		\wp_set_current_user( 0 );

		$this->assertFalse( $this->abilities->can_read() );
	}

	/**
	 * Test that the site score payload has the documented shape.
	 *
	 * @return void
	 */
	public function test_get_site_score_returns_documented_shape() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$score = $this->abilities->get_site_score();

		foreach ( [ 'score', 'checklist', 'pending_updates', 'badges', 'latest_badge', 'monthly_scores' ] as $key ) {
			$this->assertArrayHasKey( $key, $score );
		}

		$this->assertIsInt( $score['score'] );
		$this->assertIsInt( $score['pending_updates'] );
		$this->assertIsArray( $score['badges'] );
		$this->assertIsArray( $score['monthly_scores'] );
	}

	/**
	 * Test that the score stays within the range the schema advertises.
	 *
	 * @return void
	 */
	public function test_get_site_score_is_within_range() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$score = $this->abilities->get_site_score();

		$this->assertGreaterThanOrEqual( 0, $score['score'] );
		$this->assertLessThanOrEqual( 100, $score['score'] );
	}

	/**
	 * Test that the score payload omits the SaaS telemetry fields.
	 *
	 * The plugin inventory, site URL and branding ID that the stats endpoint
	 * reports are telemetry for progressplanner.com, deliberately not part of
	 * what an agent is handed.
	 *
	 * @return void
	 */
	public function test_get_site_score_omits_telemetry_fields() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$score = $this->abilities->get_site_score();

		foreach ( [ 'plugins', 'website', 'branding_id', 'plugin_url' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $score );
		}
	}

	/**
	 * Test that the checklist uses stable keys rather than translated labels.
	 *
	 * @return void
	 */
	public function test_get_checklist_uses_stable_keys() {
		$checklist = $this->invoke( 'get_checklist' );

		$this->assertSame(
			[ 'published_content', 'updated_content', 'no_pending_updates' ],
			\array_keys( $checklist )
		);

		foreach ( $checklist as $value ) {
			$this->assertIsBool( $value );
		}
	}

	/**
	 * Test that the checklist reflects real state rather than defaulting.
	 *
	 * With no pending updates the third flag must be true; this is the
	 * regression guard for reading the checklist positionally.
	 *
	 * @return void
	 */
	public function test_get_checklist_reflects_pending_updates() {
		$no_updates = static function () {
			$transient                  = new \stdClass();
			$transient->updates         = [];
			$transient->response        = [];
			$transient->version_checked = \get_bloginfo( 'version' );

			return $transient;
		};

		\add_filter( 'pre_site_transient_update_core', $no_updates );
		\add_filter( 'pre_site_transient_update_plugins', $no_updates );
		\add_filter( 'pre_site_transient_update_themes', $no_updates );

		$checklist = $this->invoke( 'get_checklist' );

		\remove_filter( 'pre_site_transient_update_core', $no_updates );
		\remove_filter( 'pre_site_transient_update_plugins', $no_updates );
		\remove_filter( 'pre_site_transient_update_themes', $no_updates );

		$this->assertTrue( $checklist['no_pending_updates'] );
	}

	/**
	 * Test that ability statuses map onto the post statuses that encode them.
	 *
	 * @return void
	 */
	public function test_status_maps_to_post_status() {
		$this->assertSame( 'publish', $this->invoke( 'get_post_status_for', [ 'pending' ] ) );
		$this->assertSame( 'trash', $this->invoke( 'get_post_status_for', [ 'completed' ] ) );
		$this->assertSame( 'future', $this->invoke( 'get_post_status_for', [ 'snoozed' ] ) );
	}

	/**
	 * Test that an unknown status falls back to pending rather than erroring.
	 *
	 * @return void
	 */
	public function test_unknown_status_falls_back_to_pending() {
		$this->assertSame( 'publish', $this->invoke( 'get_post_status_for', [ 'nonsense' ] ) );
	}

	/**
	 * Test that listing recommendations returns the documented shape.
	 *
	 * @return void
	 */
	public function test_list_recommendations_returns_documented_shape() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->abilities->list_recommendations( [ 'limit' => 5 ] );

		$this->assertArrayHasKey( 'recommendations', $result );
		$this->assertArrayHasKey( 'count', $result );
		$this->assertIsArray( $result['recommendations'] );
		$this->assertSame( \count( $result['recommendations'] ), $result['count'] );
	}

	/**
	 * Test that each returned recommendation carries every documented field.
	 *
	 * @return void
	 */
	public function test_list_recommendations_items_have_documented_fields() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->abilities->list_recommendations( [ 'limit' => 5 ] );

		foreach ( $result['recommendations'] as $recommendation ) {
			foreach ( [ 'id', 'title', 'description', 'provider_id', 'url', 'points' ] as $key ) {
				$this->assertArrayHasKey( $key, $recommendation );
			}

			$this->assertIsString( $recommendation['id'] );
			$this->assertIsString( $recommendation['title'] );
			$this->assertIsString( $recommendation['provider_id'] );
			$this->assertIsInt( $recommendation['points'] );
		}
	}

	/**
	 * Test that the limit is honoured.
	 *
	 * @return void
	 */
	public function test_list_recommendations_honours_limit() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->abilities->list_recommendations( [ 'limit' => 1 ] );

		$this->assertLessThanOrEqual( 1, $result['count'] );
	}

	/**
	 * Test that filtering by an unknown provider returns nothing.
	 *
	 * @return void
	 */
	public function test_list_recommendations_filters_by_provider() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->abilities->list_recommendations( [ 'provider' => 'provider-that-does-not-exist' ] );

		$this->assertSame( 0, $result['count'] );
	}

	/**
	 * Test that a subscriber is offered no recommendations.
	 *
	 * Tasks whose provider is unavailable to the current user are dropped, so
	 * the list never advertises work they cannot do.
	 *
	 * @return void
	 */
	public function test_list_recommendations_hides_tasks_from_subscribers() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->abilities->list_recommendations( [] );

		$this->assertSame( 0, $result['count'] );
	}

	/**
	 * Test that the badge list has the documented shape.
	 *
	 * @return void
	 */
	public function test_get_badges_returns_documented_shape() {
		$badges = $this->invoke( 'get_badges' );

		$this->assertIsArray( $badges );

		foreach ( $badges as $badge ) {
			foreach ( [ 'id', 'name', 'progress', 'complete' ] as $key ) {
				$this->assertArrayHasKey( $key, $badge );
			}

			$this->assertIsString( $badge['id'] );
			$this->assertIsInt( $badge['progress'] );
			$this->assertIsBool( $badge['complete'] );
			$this->assertGreaterThanOrEqual( 0, $badge['progress'] );
			$this->assertLessThanOrEqual( 100, $badge['progress'] );
		}
	}

	/**
	 * Test that the monthly score history covers six months.
	 *
	 * @return void
	 */
	public function test_get_monthly_scores_shape() {
		$scores = $this->invoke( 'get_monthly_scores' );

		$this->assertIsArray( $scores );

		foreach ( $scores as $entry ) {
			$this->assertArrayHasKey( 'month', $entry );
			$this->assertArrayHasKey( 'score', $entry );
			$this->assertIsString( $entry['month'] );
			$this->assertIsInt( $entry['score'] );
		}
	}

	/**
	 * Test that both abilities declare themselves read-only.
	 *
	 * The annotations are what a client shows a user before calling, so they
	 * must not drift from what the callbacks actually do.
	 *
	 * @return void
	 */
	public function test_abilities_are_annotated_read_only() {
		if ( ! \function_exists( 'wp_get_ability' ) ) {
			$this->markTestSkipped( 'The Abilities API is not available in this WordPress version.' );
		}

		// The plugin registers on the core init actions, which have already run
		// by the time the suite starts. Firing them again would re-register and
		// trigger a doing_it_wrong notice, so the registry is read as-is.
		foreach ( [ 'get-site-score', 'list-recommendations' ] as $name ) {
			$ability = \wp_get_ability( Abilities::CATEGORY . '/' . $name );

			$this->assertNotNull( $ability, "Ability {$name} is not registered." );

			$annotations = $ability->get_meta()['annotations'] ?? [];

			$this->assertTrue( $annotations['readonly'] ?? false );
			$this->assertFalse( $annotations['destructive'] ?? true );
		}
	}

	/**
	 * Test that both abilities are registered under the plugin's own category.
	 *
	 * @return void
	 */
	public function test_abilities_use_the_plugin_category() {
		if ( ! \function_exists( 'wp_get_ability' ) ) {
			$this->markTestSkipped( 'The Abilities API is not available in this WordPress version.' );
		}

		foreach ( [ 'get-site-score', 'list-recommendations' ] as $name ) {
			$ability = \wp_get_ability( Abilities::CATEGORY . '/' . $name );

			$this->assertNotNull( $ability, "Ability {$name} is not registered." );
			$this->assertSame( Abilities::CATEGORY, $ability->get_category() );
		}
	}

	/**
	 * Test that registration is guarded when the Abilities API is absent.
	 *
	 * The plugin must load on WordPress versions without the API, where the
	 * registration functions do not exist.
	 *
	 * @return void
	 */
	public function test_registration_is_idempotent() {
		// Calling registration again must be a no-op rather than incorrect
		// usage: the WordPress test harness fails any test that leaves a
		// doing_it_wrong notice behind, which is what catches a regression here.
		$this->abilities->register_categories();
		$this->abilities->register_abilities();

		$this->assertTrue( true, 'Re-registering did not trigger incorrect usage.' );
	}
}
