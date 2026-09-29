<?php
/**
 * Class Server_Recommendations_Test
 *
 * Covers completing a recommendation that states a goal. The interesting cases
 * are the refusals: this ability takes the caller's word that the goal was met,
 * so the checks around that word are the whole of its safety.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Server_Recommendations test case.
 */
class Server_Recommendations_Test extends \WP_UnitTestCase {

	/**
	 * The completer under test.
	 *
	 * @var \Progress_Planner\Abilities\Server_Recommendations
	 */
	private $completer;

	/**
	 * The provider registered for the current test, if any.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule|null
	 */
	private $registered;

	/**
	 * Whether the provider filter was added.
	 *
	 * @var bool
	 */
	private $filter_added = false;

	/**
	 * The rules directory a test points the loader at.
	 *
	 * @var string
	 */
	private $rules_dir = '';

	/**
	 * Add the test's provider to the manager's list.
	 *
	 * @param array<int, mixed> $providers The existing providers.
	 *
	 * @return array<int, mixed>
	 */
	public function add_test_provider( $providers ) {
		if ( $this->registered ) {
			$providers[] = $this->registered;
		}

		return $providers;
	}

	/**
	 * The rule used to build a provider.
	 *
	 * @var array<string, mixed>
	 */
	private const RULE = [
		'id'           => 'test-goal',
		'title'        => 'A goal-shaped recommendation',
		'points'       => 2,
		'capability'   => 'manage_options',
		'verified_by'  => 'site_state',
		'instructions' => "## Why it matters\n\nBecause.\n",
	];

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->completer = new \Progress_Planner\Abilities\Server_Recommendations();

		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
	}

	/**
	 * Clean up.
	 *
	 * The activities table is custom, so WP_UnitTestCase's transaction does not
	 * roll it back and a completion would leak into the next test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		global $wpdb;

		$wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}progress_planner_activities" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		\remove_filter( 'progress_planner_markdown_recommendations', '__return_true' );
		\remove_filter( 'progress_planner_markdown_recommendations_dir', [ $this, 'get_rules_dir' ] );

		// The manager holds whatever the filter last returned, so the provider
		// has to be withdrawn and the list rebuilt or it survives into the next
		// test as a provider whose task no longer exists.
		if ( $this->filter_added ) {
			\remove_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_test_provider' ] );

			$this->registered   = null;
			$this->filter_added = false;

			\progress_planner()->get_suggested_tasks()->get_tasks_manager()->init();
		}

		parent::tearDown();
	}

	/**
	 * Return the test's rules directory.
	 *
	 * @return string
	 */
	public function get_rules_dir() {
		return $this->rules_dir;
	}

	/**
	 * Point the loader at a directory holding one rule with no `replaces:`.
	 *
	 * @return void
	 */
	private function given_a_standalone_rule() {
		$this->rules_dir = \get_temp_dir() . 'prpl-rules-' . \uniqid();
		\wp_mkdir_p( $this->rules_dir );

		\file_put_contents( // phpcs:ignore WordPress.WP.AlternativeFunctions
			$this->rules_dir . '/standalone-goal.md',
			"---\nid: standalone-goal\ntitle: A goal no PHP provider covers\nverified_by: site_state\n---\n\n## Why it matters\n\nBecause.\n"
		);

		\add_filter( 'progress_planner_markdown_recommendations_dir', [ $this, 'get_rules_dir' ] );
	}

	/**
	 * Create a task for an existing PHP provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return string The task ID.
	 */
	private function given_a_task_for( $provider_id ) {
		static $counter = 0;
		++$counter;

		$task_id = $provider_id . '-test-' . $counter;

		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => $task_id,
				'task_id'     => $task_id,
				'provider_id' => $provider_id,
				'category'    => 'configuration',
			]
		);

		return $task_id;
	}

	/**
	 * Register a markdown provider and create its task.
	 *
	 * @param array<string, mixed> $overrides Rule fields to override.
	 *
	 * @return string The task ID.
	 */
	private function given_a_goal( array $overrides = [] ) {
		// Post slugs are not rolled back between tests in a run, so a fixed rule
		// ID would have the second test reuse the first test's completed task.
		static $counter = 0;
		++$counter;

		$rule     = \array_merge( self::RULE, [ 'id' => 'test-goal-' . $counter ], $overrides );
		$provider = new \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule( $rule );

		// Providers reach the manager through this filter and no other way, so
		// the test registers the way the loader does rather than reaching into
		// the manager's private list.
		$this->registered   = $provider;
		$this->filter_added = true;

		\add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_test_provider' ] );
		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->init();

		$task_id = $provider->get_provider_id();

		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => $task_id,
				'task_id'     => $task_id,
				'provider_id' => $task_id,
				'category'    => 'configuration',
			]
		);

		return $task_id;
	}

	/**
	 * Test that completing a goal records one activity.
	 *
	 * @return void
	 */
	public function test_complete_records_an_activity() {
		$task_id = $this->given_a_goal();

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertIsArray( $result );
		$this->assertTrue( $result['completed'] );
		$this->assertSame( 'completed', $result['status'] );
		$this->assertSame( 2, $result['points'] );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 1, $activities, 'Completing a goal records exactly one activity.' );
		$this->assertSame( 'suggested_task', $activities[0]->category );
	}

	/**
	 * Test that completing twice does not score twice.
	 *
	 * @return void
	 */
	public function test_completing_twice_scores_once() {
		$task_id = $this->given_a_goal();

		$this->completer->complete( [ 'id' => $task_id ] );

		// The task object is cached from the first call, so the second has to
		// read the stored status rather than the instance it already saw.
		\wp_cache_flush();

		$second = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertIsArray( $second );
		$this->assertFalse( $second['completed'] );
		$this->assertSame( 'already_completed', $second['status'] );
		$this->assertSame( 0, $second['points'] );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 1, $activities, 'A second call must not add a second activity.' );
	}

	/**
	 * Test that a goal only the owner can confirm is refused without confirmation.
	 *
	 * @return void
	 */
	public function test_owner_confirmation_is_required_when_the_rule_says_so() {
		$task_id = $this->given_a_goal( [ 'verified_by' => 'owner_confirmation' ] );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_needs_owner_confirmation', $result->get_error_code() );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 0, $activities, 'A refused completion records nothing.' );
	}

	/**
	 * Test that owner confirmation lets the same goal through.
	 *
	 * @return void
	 */
	public function test_owner_confirmation_allows_completion() {
		$task_id = $this->given_a_goal( [ 'verified_by' => 'owner_confirmation' ] );

		$result = $this->completer->complete(
			[
				'id'              => $task_id,
				'owner_confirmed' => true,
			]
		);

		$this->assertIsArray( $result );
		$this->assertTrue( $result['completed'] );
	}

	/**
	 * Test that a recommendation the plugin can apply itself is refused.
	 *
	 * Those have their own ability, which changes the setting. Completing one
	 * here would mark it done without doing it.
	 *
	 * @return void
	 */
	public function test_a_plugin_backed_recommendation_is_refused() {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'core-siteicon-test',
				'task_id'     => 'core-siteicon-test',
				'provider_id' => 'core-siteicon',
				'category'    => 'configuration',
			]
		);

		$result = $this->completer->complete( [ 'id' => 'core-siteicon-test' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_not_a_goal', $result->get_error_code() );
	}

	/**
	 * Test that the fix-table ability sends a goal to the right place.
	 *
	 * A goal has no entry in the fix table, so it used to fall through to
	 * "manual" -- which told the caller to open a link that a goal does not
	 * have, and which no amount of satisfying the goal would change. An agent
	 * that follows that advice never completes the recommendation.
	 *
	 * @return void
	 */
	public function test_the_fix_ability_redirects_a_goal() {
		$task_id   = $this->given_a_goal();
		$abilities = new \Progress_Planner\Abilities\Recommendations();

		$result = $abilities->complete( [ 'provider_id' => $task_id ] );

		$this->assertIsArray( $result );
		$this->assertFalse( $result['applied'] );
		$this->assertSame( 'is_a_goal', $result['status'] );
		$this->assertStringContainsString( 'complete-server-recommendation', $result['message'] );
	}

	/**
	 * Test that an unknown ID is reported rather than silently ignored.
	 *
	 * @return void
	 */
	public function test_unknown_id_is_an_error() {
		$result = $this->completer->complete( [ 'id' => 'no-such-recommendation' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_not_found', $result->get_error_code() );
	}

	/**
	 * Test that a missing ID is reported.
	 *
	 * @return void
	 */
	public function test_missing_id_is_an_error() {
		$result = $this->completer->complete( [] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_missing_id', $result->get_error_code() );
	}

	/**
	 * Test that a user without the rule's capability cannot complete it.
	 *
	 * @return void
	 */
	public function test_insufficient_capability_is_refused() {
		$task_id = $this->given_a_goal();

		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_forbidden', $result->get_error_code() );
	}

	/**
	 * Test that a PHP provider a rule replaces can be completed as a goal.
	 *
	 * The site icon has no entry in the fix table, and the bundled rule
	 * core-siteicon.md names its provider, so the goal is the only way an agent
	 * can act on it.
	 *
	 * @return void
	 */
	public function test_a_replaced_provider_is_completed_as_a_goal() {
		\add_filter( 'progress_planner_markdown_recommendations', '__return_true' );

		$task_id = $this->given_a_task_for( 'core-siteicon' );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertIsArray( $result );
		$this->assertTrue( $result['completed'] );
	}

	/**
	 * Test that a replaced provider the plugin can apply keeps its own ability.
	 *
	 * @return void
	 */
	public function test_a_fixable_replaced_provider_is_refused() {
		\add_filter( 'progress_planner_markdown_recommendations', '__return_true' );

		$task_id = $this->given_a_task_for( 'core-blogdescription' );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_not_a_goal', $result->get_error_code() );
	}

	/**
	 * Test that the listing carries a replaced provider's goal.
	 *
	 * Only when the plugin cannot apply the recommendation itself.
	 *
	 * @return void
	 */
	public function test_the_list_carries_the_goal_of_a_replaced_provider() {
		\add_filter( 'progress_planner_markdown_recommendations', '__return_true' );

		$this->given_a_task_for( 'core-siteicon' );
		$this->given_a_task_for( 'core-blogdescription' );

		$abilities = new \Progress_Planner\Abilities\Recommendations();

		$site_icon = $abilities->list( [ 'provider' => 'core-siteicon' ] )['recommendations'];
		$tagline   = $abilities->list( [ 'provider' => 'core-blogdescription' ] )['recommendations'];

		$this->assertNotEmpty( $site_icon );
		$this->assertArrayHasKey( 'goal', $site_icon[0] );
		$this->assertNotSame( '', $site_icon[0]['goal']['instructions'] );

		$this->assertNotEmpty( $tagline );
		$this->assertTrue( $tagline[0]['fixable'] );
		$this->assertArrayNotHasKey( 'goal', $tagline[0], 'A recommendation the plugin can apply gets no goal.' );
	}

	/**
	 * Test that no goal is attached while the prototype is off.
	 *
	 * @return void
	 */
	public function test_no_goal_while_disabled() {
		$this->given_a_task_for( 'core-siteicon' );

		$site_icon = ( new \Progress_Planner\Abilities\Recommendations() )->list( [ 'provider' => 'core-siteicon' ] )['recommendations'];

		$this->assertNotEmpty( $site_icon );
		$this->assertArrayNotHasKey( 'goal', $site_icon[0] );
	}

	/**
	 * Test that a rule naming PHP providers does not become a provider itself.
	 *
	 * Every bundled rule does, so the bundled set adds no providers. Registering
	 * them as well would show the same work twice.
	 *
	 * @return void
	 */
	public function test_replacing_rules_do_not_become_providers() {
		\add_filter( 'progress_planner_markdown_recommendations', '__return_true' );

		$this->assertSame( [], ( new \Progress_Planner\Suggested_Tasks\Markdown_Recommendations() )->get_providers() );
	}

	/**
	 * Test that a rule without `replaces:` still becomes a provider.
	 *
	 * @return void
	 */
	public function test_a_standalone_rule_becomes_a_provider() {
		\add_filter( 'progress_planner_markdown_recommendations', '__return_true' );
		$this->given_a_standalone_rule();

		$providers = ( new \Progress_Planner\Suggested_Tasks\Markdown_Recommendations() )->get_providers();

		$this->assertCount( 1, $providers );
		$this->assertSame( 'md-standalone-goal', $providers[0]->get_provider_id() );
	}
}
