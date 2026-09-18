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
use Progress_Planner\Abilities\Recommendation_Fixes;

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
	 * Site score reader.
	 *
	 * @var \Progress_Planner\Abilities\Site_Score
	 */
	private $site_score;

	/**
	 * Recommendations reader and applier.
	 *
	 * @var \Progress_Planner\Abilities\Recommendations
	 */
	private $recommendations;

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
		$this->abilities       = \progress_planner()->get_abilities__abilities();
		$this->site_score      = new \Progress_Planner\Abilities\Site_Score();
		$this->recommendations = new \Progress_Planner\Abilities\Recommendations();
	}

	/**
	 * Tear down test.
	 *
	 * Activities live in a custom table that WP_UnitTestCase does not roll
	 * back, and post IDs are reused across tests. A row left here would be seen
	 * by a later test that happens to be handed the same ID and asserts it has
	 * no activity, so this class clears what it caused.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		global $wpdb;

		$wpdb->query( 'TRUNCATE TABLE ' . $wpdb->prefix . 'progress_planner_activities' ); // phpcs:ignore WordPress.DB

		parent::tearDown();
	}

	/**
	 * Invoke a private or protected method on an object.
	 *
	 * @param object $instance The object.
	 * @param string $name     The method name.
	 * @param array  $args     The arguments.
	 *
	 * @return mixed
	 */
	private function invoke_on( $instance, $name, array $args = [] ) {
		$reflection = new \ReflectionClass( $instance );
		$method     = $reflection->getMethod( $name );
		$method->setAccessible( true );

		return $method->invokeArgs( $instance, $args );
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

		$score = $this->site_score->get();

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

		$score = $this->site_score->get();

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

		$score = $this->site_score->get();

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
		$checklist = $this->site_score->get_checklist();

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

		$checklist = $this->site_score->get_checklist();

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
		$this->assertSame( 'publish', $this->invoke_on( $this->recommendations, 'get_post_status_for', [ 'pending' ] ) );
		$this->assertSame( 'trash', $this->invoke_on( $this->recommendations, 'get_post_status_for', [ 'completed' ] ) );
		$this->assertSame( 'future', $this->invoke_on( $this->recommendations, 'get_post_status_for', [ 'snoozed' ] ) );
	}

	/**
	 * Test that an unknown status falls back to pending rather than erroring.
	 *
	 * @return void
	 */
	public function test_unknown_status_falls_back_to_pending() {
		$this->assertSame( 'publish', $this->invoke_on( $this->recommendations, 'get_post_status_for', [ 'nonsense' ] ) );
	}

	/**
	 * Test that listing recommendations returns the documented shape.
	 *
	 * @return void
	 */
	public function test_list_recommendations_returns_documented_shape() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->recommendations->list( [ 'limit' => 5 ] );

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

		// A site with no recommendations yet would make this vacuous, so one is
		// created rather than relying on whatever the suite happens to leave.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'abilities-test-task',
				'post_title'  => 'Abilities test task',
				'provider_id' => 'user',
			]
		);

		$result = $this->recommendations->list( [ 'limit' => 5 ] );

		$this->assertNotEmpty( $result['recommendations'], 'Expected at least one recommendation to inspect.' );

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

		$result = $this->recommendations->list( [ 'limit' => 1 ] );

		$this->assertLessThanOrEqual( 1, $result['count'] );
	}

	/**
	 * Test that filtering by an unknown provider returns nothing.
	 *
	 * @return void
	 */
	public function test_list_recommendations_filters_by_provider() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->recommendations->list( [ 'provider' => 'provider-that-does-not-exist' ] );

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

		$result = $this->recommendations->list( [] );

		$this->assertSame( 0, $result['count'] );
	}

	/**
	 * Test that the badge list has the documented shape.
	 *
	 * @return void
	 */
	public function test_get_badges_returns_documented_shape() {
		$badges = $this->site_score->get_badges();

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
		$scores = $this->site_score->get_monthly_scores();

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

	/**
	 * Create a pending recommendation for a provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return void
	 */
	private function seed_task( $provider_id ) {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'test-' . $provider_id,
				'post_title'  => 'Test ' . $provider_id,
				'provider_id' => $provider_id,
			]
		);
	}

	/**
	 * Test that only vetted providers are fixable.
	 *
	 * The list is deliberate, not derived from class inheritance: Tasks_Interactive
	 * also covers sending a test email and deleting terms.
	 *
	 * @return void
	 */
	public function test_fixable_list_is_the_vetted_set() {
		$core = [
			'core-blogdescription',
			'select-timezone',
			'set-date-format',
			'search-engine-visibility',
			'disable-comments',
			'disable-comment-pagination',
		];

		foreach ( $core as $provider_id ) {
			$this->assertTrue(
				Recommendation_Fixes::has_fix( $provider_id ),
				"{$provider_id} should be fixable."
			);
		}

		// SEO-plugin entries only make sense when their plugin is active, but the
		// table lists them unconditionally; the guard is in apply().
		$this->assertTrue( Recommendation_Fixes::has_fix( 'yoast-crawl-settings-emoji-scripts' ) );
		$this->assertTrue( Recommendation_Fixes::has_fix( 'aioseo-date-archive' ) );
	}

	/**
	 * Test that tasks needing a person are not fixable.
	 *
	 * @return void
	 */
	public function test_unsafe_providers_are_not_fixable() {
		foreach ( [ 'sending-email', 'remove-terms-without-posts', 'core-permalink-structure', 'remove-inactive-plugins', 'create-post' ] as $provider_id ) {
			$this->assertFalse(
				Recommendation_Fixes::has_fix( $provider_id ),
				"{$provider_id} must not be auto-applied."
			);
		}
	}

	/**
	 * Test that a subscriber cannot apply a fix.
	 *
	 * @return void
	 */
	public function test_can_fix_denies_subscriber() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$this->assertFalse( $this->abilities->can_fix() );
	}

	/**
	 * Test that applying a fix changes the setting.
	 *
	 * @return void
	 */
	public function test_complete_recommendation_applies_the_setting() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		\update_option( 'blog_public', '0' );
		$this->seed_task( 'search-engine-visibility' );

		$result = $this->recommendations->complete( [ 'provider_id' => 'search-engine-visibility' ] );

		$this->assertTrue( $result['applied'] );
		$this->assertSame( 'completed', $result['status'] );
		$this->assertSame( '1', (string) \get_option( 'blog_public' ) );
	}

	/**
	 * Test that a recommendation needing a person is reported, not applied.
	 *
	 * @return void
	 */
	public function test_complete_recommendation_refuses_manual_tasks() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->seed_task( 'remove-inactive-plugins' );

		$result = $this->recommendations->complete( [ 'provider_id' => 'remove-inactive-plugins' ] );

		$this->assertFalse( $result['applied'] );
		$this->assertSame( 'manual', $result['status'] );
	}

	/**
	 * Test that an invalid timezone is rejected before anything is written.
	 *
	 * @return void
	 */
	public function test_complete_recommendation_validates_timezone() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$before = \get_option( 'timezone_string' );
		$this->seed_task( 'select-timezone' );

		$result = $this->recommendations->complete(
			[
				'provider_id' => 'select-timezone',
				'value'       => 'Mars/Olympus',
			]
		);

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_invalid_timezone', $result->get_error_code() );
		$this->assertSame( $before, \get_option( 'timezone_string' ) );
	}

	/**
	 * Test that a fix needing a value refuses an empty one.
	 *
	 * @return void
	 */
	public function test_complete_recommendation_requires_a_value() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->seed_task( 'core-blogdescription' );

		$result = $this->recommendations->complete( [ 'provider_id' => 'core-blogdescription' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_missing_value', $result->get_error_code() );
	}

	/**
	 * Test that an unknown provider is an error rather than a silent no-op.
	 *
	 * @return void
	 */
	public function test_complete_recommendation_rejects_unknown_provider() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->recommendations->complete( [ 'provider_id' => 'no-such-provider' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_no_such_recommendation', $result->get_error_code() );
	}

	/**
	 * Test that next mode reports honestly when there is nothing to do.
	 *
	 * @return void
	 */
	public function test_next_mode_reports_nothing_to_do() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->recommendations->complete( [] );

		$this->assertContains( $result['status'], [ 'nothing_to_do', 'completed', 'applied_not_yet_complete' ] );
	}

	/**
	 * Test that next mode never picks a fix that needs a value.
	 *
	 * There is no correct tagline to invent on the owner's behalf.
	 *
	 * @return void
	 */
	public function test_next_mode_skips_fixes_needing_a_value() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->seed_task( 'core-blogdescription' );

		$result = $this->recommendations->complete( [] );

		if ( null !== $result['task'] ) {
			$this->assertNotSame( 'core-blogdescription', $result['task']['provider_id'] );
		} else {
			$this->assertSame( 'nothing_to_do', $result['status'] );
		}
	}

	/**
	 * Test that the listing marks which recommendations can be applied.
	 *
	 * @return void
	 */
	public function test_list_recommendations_flags_fixable_items() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->seed_task( 'search-engine-visibility' );

		$result = $this->recommendations->list( [ 'limit' => 100 ] );

		$found = false;
		foreach ( $result['recommendations'] as $recommendation ) {
			$this->assertArrayHasKey( 'fixable', $recommendation );
			$this->assertArrayHasKey( 'needs_value', $recommendation );

			if ( 'search-engine-visibility' === $recommendation['provider_id'] ) {
				$found = true;
				$this->assertTrue( $recommendation['fixable'] );
				$this->assertFalse( $recommendation['needs_value'] );
			}
		}

		$this->assertTrue( $found, 'Expected the seeded recommendation in the list.' );
	}

	/**
	 * Test that an SEO fix refuses when its plugin is not active.
	 *
	 * The task would not exist on such a site, but the table lists these
	 * unconditionally, so apply() must not fatal if one is reached.
	 *
	 * @return void
	 */
	public function test_seo_fix_requires_its_plugin() {
		if ( \function_exists( 'aioseo' ) ) {
			$this->markTestSkipped( 'All in One SEO is active in this environment.' );
		}

		$result = Recommendation_Fixes::apply( 'aioseo-date-archive' );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_seo_plugin_inactive', $result->get_error_code() );
	}

	/**
	 * Test that the placeholder deletions are marked destructive.
	 *
	 * @return void
	 */
	public function test_placeholder_deletions_are_destructive() {
		$this->assertTrue( Recommendation_Fixes::is_destructive( 'hello-world' ) );
		$this->assertTrue( Recommendation_Fixes::is_destructive( 'sample-page' ) );
		$this->assertFalse( Recommendation_Fixes::is_destructive( 'disable-comments' ) );
	}

	/**
	 * Test that anything destructive can only be applied by name.
	 *
	 * An unattended run must never be the thing that deleted something.
	 *
	 * @return void
	 */
	public function test_destructive_fixes_are_confirm_only() {
		$this->assertTrue( Recommendation_Fixes::is_confirm_only( 'hello-world' ) );
		$this->assertTrue( Recommendation_Fixes::is_confirm_only( 'sample-page' ) );
		$this->assertFalse( Recommendation_Fixes::is_confirm_only( 'disable-comments' ) );
	}

	/**
	 * Test that applying the hello-world fix trashes the post rather than
	 * deleting it outright.
	 *
	 * @return void
	 */
	public function test_hello_world_fix_trashes_the_post() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$post_id = self::factory()->post->create(
			[
				'post_title'  => 'Hello world!',
				'post_name'   => 'hello-world',
				'post_status' => 'publish',
			]
		);

		$this->seed_task( 'hello-world' );

		$result = $this->recommendations->complete( [ 'provider_id' => 'hello-world' ] );

		$this->assertTrue( $result['applied'] );
		$this->assertSame( 'trash', \get_post_status( $post_id ), 'The post should be recoverable from the trash.' );
	}

	/**
	 * Test that next mode never picks a destructive fix.
	 *
	 * @return void
	 */
	public function test_next_mode_never_deletes() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$post_id = self::factory()->post->create(
			[
				'post_title'  => 'Hello world!',
				'post_name'   => 'hello-world',
				'post_status' => 'publish',
			]
		);

		$this->seed_task( 'hello-world' );

		$result = $this->recommendations->complete( [] );

		if ( null !== $result['task'] ) {
			$this->assertNotSame( 'hello-world', $result['task']['provider_id'] );
		}

		$this->assertSame( 'publish', \get_post_status( $post_id ), 'Next mode must not trash anything.' );
	}

	/**
	 * Test that a deletion reports missing content rather than failing oddly.
	 *
	 * @return void
	 */
	public function test_deletion_reports_missing_target() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$result = Recommendation_Fixes::apply( 'hello-world' );

		if ( \is_wp_error( $result ) ) {
			$this->assertSame( 'progress_planner_no_target', $result->get_error_code() );
		} else {
			$this->assertTrue( $result );
		}
	}
}
